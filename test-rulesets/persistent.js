module.exports = {
  'name': 'io.picolabs.persistent',
  'meta': {
    'shares': [
      'getName',
      'getAppVar'
    ]
  },
  'global': function (ctx) {
    ctx.scope.set('getName', ctx.krl.Closure(ctx, function (ctx) {
      return ctx.krl.fromJS(ctx.db.getEntVarFuture(ctx.pico.id, 'name').wait());
    }));
    ctx.scope.set('getAppVar', ctx.krl.Closure(ctx, function (ctx) {
      return ctx.krl.fromJS(ctx.db.getAppVarFuture(ctx.rid, 'appvar').wait());
    }));
  },
  'rules': {
    'store_my_name': {
      'name': 'store_my_name',
      'select': {
        'graph': { 'store': { 'name': { 'expr_0': true } } },
        'eventexprs': {
          'expr_0': function (ctx) {
            var matches = [];
            var m;
            m = new RegExp('^(.*)$', '').exec(ctx.event.attrs['name'] || '');
            if (!m)
              return false;
            if (m.length > 1)
              matches.push(m[1]);
            ctx.scope.set('my_name', new ctx.krl.String(matches[0]));
            return true;
          }
        },
        'state_machine': {
          'start': [
            [
              'expr_0',
              'end'
            ],
            [
              [
                'not',
                'expr_0'
              ],
              'start'
            ]
          ]
        }
      },
      'action_block': {
        'actions': [function (ctx) {
            return {
              'type': 'directive',
              'name': 'store_name',
              'options': { 'name': ctx.scope.get('my_name') }
            };
          }]
      },
      'postlude': {
        'fired': undefined,
        'notfired': undefined,
        'always': function (ctx) {
          ctx.db.putEntVarFuture(ctx.pico.id, 'name', ctx.krl.toJS(ctx.scope.get('my_name'))).wait();
        }
      }
    },
    'store_appvar': {
      'name': 'store_appvar',
      'select': {
        'graph': { 'store': { 'appvar': { 'expr_0': true } } },
        'eventexprs': {
          'expr_0': function (ctx) {
            var matches = [];
            var m;
            m = new RegExp('^(.*)$', '').exec(ctx.event.attrs['appvar'] || '');
            if (!m)
              return false;
            if (m.length > 1)
              matches.push(m[1]);
            ctx.scope.set('my_appvar', matches[0]);
            return true;
          }
        },
        'state_machine': {
          'start': [
            [
              'expr_0',
              'end'
            ],
            [
              [
                'not',
                'expr_0'
              ],
              'start'
            ]
          ]
        }
      },
      'action_block': {
        'actions': [function (ctx) {
            return {
              'type': 'directive',
              'name': 'store_appvar',
              'options': { 'appvar': ctx.scope.get('my_appvar') }
            };
          }]
      },
      'postlude': {
        'fired': undefined,
        'notfired': undefined,
        'always': function (ctx) {
          ctx.db.putAppVarFuture(ctx.rid, 'appvar', ctx.krl.toJS(ctx.scope.get('my_appvar'))).wait();
        }
      }
    }
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzZXQgaW8ucGljb2xhYnMucGVyc2lzdGVudCB7XG4gIG1ldGEge1xuICAgIHNoYXJlcyBnZXROYW1lLCBnZXRBcHBWYXJcbiAgfVxuICBnbG9iYWwge1xuICAgIGdldE5hbWUgPSBmdW5jdGlvbigpe1xuICAgICAgZW50Om5hbWVcbiAgICB9XG4gICAgZ2V0QXBwVmFyID0gZnVuY3Rpb24oKXtcbiAgICAgIGFwcDphcHB2YXJcbiAgICB9XG4gIH1cbiAgcnVsZSBzdG9yZV9teV9uYW1lIHtcbiAgICBzZWxlY3Qgd2hlbiBzdG9yZSBuYW1lIG5hbWUgcmUjXiguKikkIyBzZXR0aW5nKG15X25hbWUpO1xuXG4gICAgc2VuZF9kaXJlY3RpdmUoXCJzdG9yZV9uYW1lXCIpIHdpdGhcbiAgICAgIG5hbWUgPSBteV9uYW1lXG5cbiAgICBhbHdheXMge1xuICAgICAgZW50Om5hbWUgPSBteV9uYW1lXG4gICAgfVxuICB9XG4gIHJ1bGUgc3RvcmVfYXBwdmFyIHtcbiAgICBzZWxlY3Qgd2hlbiBzdG9yZSBhcHB2YXIgYXBwdmFyIHJlI14oLiopJCMgc2V0dGluZyhteV9hcHB2YXIpO1xuXG4gICAgc2VuZF9kaXJlY3RpdmUoXCJzdG9yZV9hcHB2YXJcIikgd2l0aFxuICAgICAgYXBwdmFyID0gbXlfYXBwdmFyXG5cbiAgICBhbHdheXMge1xuICAgICAgYXBwOmFwcHZhciA9IG15X2FwcHZhclxuICAgIH1cbiAgfVxufSIsImlvLnBpY29sYWJzLnBlcnNpc3RlbnQiLCJzaGFyZXMiLCJzaGFyZXMgZ2V0TmFtZSwgZ2V0QXBwVmFyIiwiZ2V0TmFtZSIsImdldEFwcFZhciIsImdldE5hbWUgPSBmdW5jdGlvbigpe1xuICAgICAgZW50Om5hbWVcbiAgICB9IiwiZnVuY3Rpb24oKXtcbiAgICAgIGVudDpuYW1lXG4gICAgfSIsImVudDpuYW1lIiwiZ2V0QXBwVmFyID0gZnVuY3Rpb24oKXtcbiAgICAgIGFwcDphcHB2YXJcbiAgICB9IiwiZnVuY3Rpb24oKXtcbiAgICAgIGFwcDphcHB2YXJcbiAgICB9IiwiYXBwOmFwcHZhciIsInJ1bGUgc3RvcmVfbXlfbmFtZSB7XG4gICAgc2VsZWN0IHdoZW4gc3RvcmUgbmFtZSBuYW1lIHJlI14oLiopJCMgc2V0dGluZyhteV9uYW1lKTtcblxuICAgIHNlbmRfZGlyZWN0aXZlKFwic3RvcmVfbmFtZVwiKSB3aXRoXG4gICAgICBuYW1lID0gbXlfbmFtZVxuXG4gICAgYWx3YXlzIHtcbiAgICAgIGVudDpuYW1lID0gbXlfbmFtZVxuICAgIH1cbiAgfSIsInN0b3JlX215X25hbWUiLCJzZWxlY3Qgd2hlbiBzdG9yZSBuYW1lIG5hbWUgcmUjXiguKikkIyBzZXR0aW5nKG15X25hbWUpIiwic3RvcmUgbmFtZSBuYW1lIHJlI14oLiopJCMgc2V0dGluZyhteV9uYW1lKSIsIm5hbWUgcmUjXiguKikkIyIsInJlI14oLiopJCMiLCJuYW1lIiwibXlfbmFtZSIsInNlbmRfZGlyZWN0aXZlKFwic3RvcmVfbmFtZVwiKSB3aXRoXG4gICAgICBuYW1lID0gbXlfbmFtZSIsImFsd2F5cyB7XG4gICAgICBlbnQ6bmFtZSA9IG15X25hbWVcbiAgICB9IiwiZW50Om5hbWUgPSBteV9uYW1lIiwicnVsZSBzdG9yZV9hcHB2YXIge1xuICAgIHNlbGVjdCB3aGVuIHN0b3JlIGFwcHZhciBhcHB2YXIgcmUjXiguKikkIyBzZXR0aW5nKG15X2FwcHZhcik7XG5cbiAgICBzZW5kX2RpcmVjdGl2ZShcInN0b3JlX2FwcHZhclwiKSB3aXRoXG4gICAgICBhcHB2YXIgPSBteV9hcHB2YXJcblxuICAgIGFsd2F5cyB7XG4gICAgICBhcHA6YXBwdmFyID0gbXlfYXBwdmFyXG4gICAgfVxuICB9Iiwic3RvcmVfYXBwdmFyIiwic2VsZWN0IHdoZW4gc3RvcmUgYXBwdmFyIGFwcHZhciByZSNeKC4qKSQjIHNldHRpbmcobXlfYXBwdmFyKSIsInN0b3JlIGFwcHZhciBhcHB2YXIgcmUjXiguKikkIyBzZXR0aW5nKG15X2FwcHZhcikiLCJhcHB2YXIgcmUjXiguKikkIyIsImFwcHZhciIsIm15X2FwcHZhciIsInNlbmRfZGlyZWN0aXZlKFwic3RvcmVfYXBwdmFyXCIpIHdpdGhcbiAgICAgIGFwcHZhciA9IG15X2FwcHZhciIsImFsd2F5cyB7XG4gICAgICBhcHA6YXBwdmFyID0gbXlfYXBwdmFyXG4gICAgfSIsImFwcDphcHB2YXIgPSBteV9hcHB2YXIiXSwibmFtZXMiOlsibW9kdWxlIiwiZXhwb3J0cyIsImN0eCIsInNjb3BlIiwic2V0Iiwia3JsIiwiQ2xvc3VyZSIsImRiIiwiZ2V0RW50VmFyRnV0dXJlIiwicGljbyIsImlkIiwid2FpdCIsImdldEFwcFZhckZ1dHVyZSIsInJpZCIsIm1hdGNoZXMiLCJtIiwiUmVnRXhwIiwiZXhlYyIsImV2ZW50IiwiYXR0cnMiLCJsZW5ndGgiLCJwdXNoIiwiZ2V0IiwidW5kZWZpbmVkIiwicHV0RW50VmFyRnV0dXJlIiwicHV0QXBwVmFyRnV0dXJlIl0sIm1hcHBpbmdzIjoiQUFBQUEsTUFBQSxDQUFBQyxPQUFBO0FBQUEsRSxRQ0FRLHdCREFSO0FBQUEsRSxRQUFBO0FBQUEsSUVFSSxRQ0FBO0FBQUEsTUNBTyxTREFQO0FBQUEsTUVBZ0IsV0ZBaEI7QUFBQSxLSEZKO0FBQUE7QUFBQSxFLFVBQUEsVUFBQUMsR0FBQTtBQUFBLElNS0lBLEdBQUEsQ0FBQUMsS0FBQSxDQUFBQyxHQUFBLENGQUEsU0VBQSxFQ0FVRixHQUFBLENBQUFHLEdBQUEsQ0FBQUMsT0FBQSxDQUFBSixHQUFBLFlBQUFBLEdBQUE7QUFBQSxhQ0NSQSxHQUFBLENBQUFLLEVBQUEsQ0FBQUMsZUFBQSxDQUFBTixHQUFBLENBQUFPLElBQUEsQ0FBQUMsRUFBQSxVQUFBQyxJQUFBLEVERFE7QUFBQSxNREFWLEVOTEo7QUFBQSxJU1FJVCxHQUFBLENBQUFDLEtBQUEsQ0FBQUMsR0FBQSxDSkFBLFdJQUEsRUNBWUYsR0FBQSxDQUFBRyxHQUFBLENBQUFDLE9BQUEsQ0FBQUosR0FBQSxZQUFBQSxHQUFBO0FBQUEsYUNDVkEsR0FBQSxDQUFBSyxFQUFBLENBQUFLLGVBQUEsQ0FBQVYsR0FBQSxDQUFBVyxHQUFBLFlBQUFGLElBQUEsRUREVTtBQUFBLE1EQVosRVRSSjtBQUFBO0FBQUEsRSxTQUFBO0FBQUEsSSxpQllZRTtBQUFBLE0sUUNBSyxlREFMO0FBQUEsTSxVRUNFO0FBQUEsUSxTQUFBLEUsU0FBQSxFLFFBQUEsRSxVQUFBO0FBQUEsUSxjQUFBO0FBQUEsVSxVQ0FZLFVBQUFULEdBQUE7QUFBQSxnQkFBQVksT0FBQTtBQUFBLGdCQUFBQyxDQUFBO0FBQUEsWUNBV0EsQ0FBQSxHQ0FLLElBQUFDLE1BQUEsZUFBQUMsSUZBaEIsQ0dBV2YsR0FBQSxDQUFBZ0IsS0FBQSxDQUFBQyxLQUFBLGNIQVgsQ0NBVyxDREFYO0FBQUEsWUNBVyxLQUFBSixDQUFBO0FBQUEsMkJEQVg7QUFBQSxZQ0FXLElBQUFBLENBQUEsQ0FBQUssTUFBQTtBQUFBLGNBQUFOLE9BQUEsQ0FBQU8sSUFBQSxDQUFBTixDQUFBLEtEQVg7QUFBQSxZSUFtQ2IsR0FBQSxDQUFBQyxLQUFBLENBQUFDLEdBQUEsWUFBQVUsT0FBQSxLSkFuQztBQUFBO0FBQUEsV0RBWjtBQUFBO0FBQUEsUSxpQkFBQTtBQUFBLFU7O2NBQUEsUTtjQUFBLEs7Ozs7Z0JBQUEsSztnQkFBQSxROztjQUFBLE87O1dBQUE7QUFBQTtBQUFBLE9GREY7QUFBQSxNLGdCUUdFO0FBQUEsUSxXQUFBLFdBQUFaLEdBQUE7QUFBQTtBQUFBLGMsUUFBQTtBQUFBLGMsUUFBQTtBQUFBLGMsV0FBQSxFLFFEQ1NBLEdBQUEsQ0FBQUMsS0FBQSxDQUFBbUIsR0FBQSxXQ0RUO0FBQUE7QUFBQTtBQUFBLE9SSEY7QUFBQSxNLFlTTUU7QUFBQSxRLFNBQUFDLFNBQUE7QUFBQSxRLFlBQUFBLFNBQUE7QUFBQSxRLFVBQUEsVUFBQXJCLEdBQUE7QUFBQSxVQ0NFQSxHQUFBLENBQUFLLEVBQUEsQ0FBQWlCLGVBQUEsQ0FBQXRCLEdBQUEsQ0FBQU8sSUFBQSxDQUFBQyxFQUFBLEVkQUEsTWNBQSxFSEFXUixHQUFBLENBQUFDLEtBQUEsQ0FBQW1CLEdBQUEsV0dBWCxFQUFBWCxJQUFBLEdEREY7QUFBQTtBQUFBLE9UTkY7QUFBQSxLWlpGO0FBQUEsSSxnQnVCc0JFO0FBQUEsTSxRQ0FLLGNEQUw7QUFBQSxNLFVFQ0U7QUFBQSxRLFNBQUEsRSxTQUFBLEUsVUFBQSxFLFVBQUE7QUFBQSxRLGNBQUE7QUFBQSxVLFVDQVksVUFBQVQsR0FBQTtBQUFBLGdCQUFBWSxPQUFBO0FBQUEsZ0JBQUFDLENBQUE7QUFBQSxZQ0FhQSxDQUFBLEdWQU8sSUFBQUMsTUFBQSxlQUFBQyxJU0FwQixDRUFhZixHQUFBLENBQUFnQixLQUFBLENBQUFDLEtBQUEsZ0JGQWIsQ0NBYSxDREFiO0FBQUEsWUNBYSxLQUFBSixDQUFBO0FBQUEsMkJEQWI7QUFBQSxZQ0FhLElBQUFBLENBQUEsQ0FBQUssTUFBQTtBQUFBLGNBQUFOLE9BQUEsQ0FBQU8sSUFBQSxDQUFBTixDQUFBLEtEQWI7QUFBQSxZR0F1Q2IsR0FBQSxDQUFBQyxLQUFBLENBQUFDLEdBQUEsY0FBQVUsT0FBQSxLSEF2QztBQUFBO0FBQUEsV0RBWjtBQUFBO0FBQUEsUSxpQkFBQTtBQUFBLFU7O2NBQUEsUTtjQUFBLEs7Ozs7Z0JBQUEsSztnQkFBQSxROztjQUFBLE87O1dBQUE7QUFBQTtBQUFBLE9GREY7QUFBQSxNLGdCT0dFO0FBQUEsUSxXQUFBLFdBQUFaLEdBQUE7QUFBQTtBQUFBLGMsUUFBQTtBQUFBLGMsUUFBQTtBQUFBLGMsV0FBQSxFLFVEQ1dBLEdBQUEsQ0FBQUMsS0FBQSxDQUFBbUIsR0FBQSxhQ0RYO0FBQUE7QUFBQTtBQUFBLE9QSEY7QUFBQSxNLFlRTUU7QUFBQSxRLFNBQUFDLFNBQUE7QUFBQSxRLFlBQUFBLFNBQUE7QUFBQSxRLFVBQUEsVUFBQXJCLEdBQUE7QUFBQSxVQ0NFQSxHQUFBLENBQUFLLEVBQUEsQ0FBQWtCLGVBQUEsQ0FBQXZCLEdBQUEsQ0FBQVcsR0FBQSxFckJBQSxRcUJBQSxFSEFhWCxHQUFBLENBQUFDLEtBQUEsQ0FBQW1CLEdBQUEsYUdBYixFQUFBWCxJQUFBLEdEREY7QUFBQTtBQUFBLE9STkY7QUFBQSxLdkJ0QkY7QUFBQTtBQUFBIiwic291cmNlc0NvbnRlbnQiOltudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbF19
