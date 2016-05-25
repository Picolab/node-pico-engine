//shorthand for this test-ruleset
var mkExpTypeVal = function(type, val){
  return function(ctx){
    return ctx.event.domain === 'event_ops'
      && ctx.event.type === type
      && ctx.event.attrs['val'] === val;
  };
};

module.exports = {
  rules: {
    bind: {
      select: {
        eventexprs: {
          a: function(ctx){
            ctx.vars.bound_name = ctx.event.attrs['name'];
            return ctx.event.domain === 'event_ops' && ctx.event.type === 'bind';
          }
        },
        state_machine: {
          start: [
            ['a', 'end'],
            [['not', 'a'], 'start']
          ]
        }
      },
      action: function(ctx, callback){
        callback(undefined, {
          type: 'directive',
          name: 'bound',
          options: {
            name: ctx.vars.bound_name
          }
        });
      }
    },
    or: {
      select: {
        eventexprs: {
          or_a: mkExpTypeVal('or', 'a'),
          or_b: mkExpTypeVal('or', 'b')
        },
        state_machine: {
          start: [
            ['or_a', 'end'],
            ['or_b', 'end'],
            [['not', ['or', 'or_a', 'or_b']], 'start']
          ]
        }
      },
      action: function(ctx, callback){
        callback(undefined, {
          type: 'directive',
          name: 'or',
          options: {}
        });
      }
    },
    and: {
      select: {
        eventexprs: {
          a: mkExpTypeVal('and', 'a'),
          b: mkExpTypeVal('and', 'b')
        },
        state_machine: {
          start: [
            ['a', 's1'],
            ['b', 's2'],
            [['not', ['or', 'a', 'b']], 'start']
          ],
          s1: [
            ['b', 'end'],
            [['not', 'b'], 's1']
          ],
          s2: [
            ['a', 'end'],
            [['not', 'b'], 's2']
          ]
        }
      },
      action: function(ctx, callback){
        callback(undefined, {
          type: 'directive',
          name: 'and',
          options: {}
        });
      }
    }
  }
};
