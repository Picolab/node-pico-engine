var _ = require("lodash");
var λ = require("contra");
var fs = require("fs");
var path = require("path");
var leveldown = require("leveldown");
var PicoEngine = require("pico-engine-core");
var krl_stdlib = require("krl-stdlib");//pico-engine-core requires this for us
var RulesetLoader = require("./RulesetLoader");

var setupOwnerPico = function(pe, callback){
    pe.getOwnerECI(function(err, eci){
        if(err) return callback(err);
        if(eci){//already setup
            return callback();
        }
        λ.waterfall([
            λ.curry(pe.newPico, {}),
            function(pico, callback){
                pe.newChannel({
                    pico_id: pico.id,
                    name: "main",
                    type: "secret"
                }, function(err, channel){
                    if(err) return callback(err);
                    callback(null, {
                        pico_id: pico.id,
                        eci: channel.id
                    });
                });
            },
            function(info, callback){
                pe.installRuleset(info.pico_id, "io.picolabs.pico", function(err){
                    callback(err, info);
                });
            },
            function(info, callback){
                pe.installRuleset(info.pico_id, "io.picolabs.visual_params", function(err){
                    callback(err, info);
                });
            },
            function(info, callback){
                pe.signalEvent({
                    eci: info.eci,
                    eid: "19",
                    domain: "pico",
                    type: "root_created",
                    attrs: {
                        id: info.pico_id,
                        eci: info.eci
                    }
                }, function(err){
                    callback(err, info);
                });
            },
            function(info, callback){
                pe.signalEvent({
                    eci: info.eci,
                    eid: "31",
                    domain: "visual",
                    type: "update",
                    attrs: {
                        dname: "Owner Pico",
                        color: "#87cefa"
                    }
                }, function(err){
                    callback(err, info);
                });
            }
        ], function(err){
            callback(err, pe);
        });
    });
};

var github_prefix = "https://raw.githubusercontent.com/Picolab/node-pico-engine/master/krl/";

var registerBuiltInRulesets = function(pe, callback){
    var krl_dir = path.resolve(__dirname, "../krl");
    fs.readdir(krl_dir, function(err, files){
        if(err) return callback(err);
        //.series b/c dependent modules must be registered in order
        λ.each.series(files, function(filename, next){
            var file = path.resolve(krl_dir, filename);
            if(!/\.krl$/.test(file)){
                //only auto-load krl files in the top level
                return next();
            }
            fs.readFile(file, "utf8", function(err, src){
                if(err) return next(err);
                pe.registerRuleset(src, {
                    url: github_prefix + filename
                }, function(err){
                    if(err) return next(err);
                    next();
                });
            });
        }, callback);
    });
};

var setupLogging = function(pe){

    var toKRLjson = function(val, indent){
        return krl_stdlib.encode({}, val, indent);
    };

    var logs = {};
    var logRID = "io.picolabs.logging";
    var logEntry = function(level, context, message){
        var episode_id = context.txn_id;
        var timestamp = (new Date()).toISOString();

        if(!_.isString(message)){
            message = toKRLjson(message);
        }
        var shell_log = "[" + level.toUpperCase() + "] ";
        if(context.event){
            shell_log += "event"
                + "/" + context.event.eci
                + "/" + context.event.eid
                + "/" + context.event.domain
                + "/" + context.event.type
                ;
        }else if(context.query){
            shell_log += "query"
                + "/" + context.query.eci
                + "/" + context.query.rid
                + "/" + context.query.name
                ;
        }else{
            shell_log += toKRLjson(context);
        }
        shell_log += " | " + message;
        if(shell_log.length > 300){
            shell_log = shell_log.substring(0, 300) + "...";
        }
        if(/error/i.test(level)){
            console.log(shell_log);//use stderr
        }else{
            console.log(shell_log);
        }

        var episode = logs[episode_id];
        if (episode) {
            episode.logs.push(timestamp + " [" + level.toUpperCase() + "] " + message);
        } else {
            console.error("[ERROR]", "no episode found for", episode_id);
        }
    };
    pe.emitter.on("episode_start", function(context){
        var episode_id = context.txn_id;
        console.log("[EPISODE_START]",episode_id);
        var timestamp = (new Date()).toISOString();
        var episode = logs[episode_id];
        if (episode) {
            console.error("[ERROR]","episode already exists for",episode_id);
        } else {
            episode = {};
            episode.key = (
                    timestamp + " - " + episode_id
                    + " - " + context.eci
                    + " - " + ((context.event) ? context.event.eid : "query")
                    ).replace(/[.]/g, "-");
            episode.logs = [];
            logs[episode_id] = episode;
        }
    });
    pe.emitter.on("klog", function(context, expression, message){
        logEntry("klog", context, message + " " + toKRLjson(expression));
    });
    pe.emitter.on("log-error", function(context, expression){
        logEntry("log-error", context, expression);
    });
    pe.emitter.on("log-warn", function(context, expression){
        logEntry("log-warn", context, expression);
    });
    pe.emitter.on("log-info", function(context, expression){
        logEntry("log-info", context, expression);
    });
    pe.emitter.on("log-debug", function(context, expression){
        logEntry("log-debug", context, expression);
    });
    pe.emitter.on("debug", function(context, expression){
        logEntry("debug", context, expression);
    });
    pe.emitter.on("error", function(err, context){
        logEntry("error", context, err);
    });
    pe.emitter.on("episode_stop", function(context){
        var pico_id = context.pico_id;
        var episode_id = context.txn_id;

        console.log("[EPISODE_STOP]", episode_id);

        var episode = logs[episode_id];
        if (!episode) {
            console.error("[ERROR]","no episode found for", episode_id);
            return;
        }

        var onRemoved = function(err){
            delete logs[episode_id];
            if(err){
                console.error("[EPISODE_REMOVED]", episode_id, err + "");
            }else{
                console.log("[EPISODE_REMOVED]", episode_id);
            }
        };

        pe.getEntVar(pico_id, logRID, "status", function(err, is_logs_on){
            if(err) return onRemoved(err);
            if(!is_logs_on){
                onRemoved();
                return;
            }
            pe.getEntVar(pico_id, logRID, "logs", function(err, data){
                if(err) return onRemoved(err);

                data[episode.key] = episode.logs;

                pe.putEntVar(pico_id, logRID, "logs", data, onRemoved);
            });
        });
    });
};

module.exports = function(opts, callback){
    opts = opts || {};
    var pe = PicoEngine({
        host: opts.host,
        compileAndLoadRuleset: RulesetLoader({
            rulesets_dir: path.resolve(opts.home, "rulesets")
        }),
        db: {
            db: leveldown,
            location: path.join(opts.home, "db")
        }
    });

    setupLogging(pe);

    pe.start(function(err){
        if(err) return callback(err);

        registerBuiltInRulesets(pe, function(err){
            if(err) return callback(err);
            setupOwnerPico(pe, function(err){
                if(err) return callback(err);
                callback(null, pe);
            });
        });
    });
};
