// PJLink adapter main script

"use strict";

var utils = require(__dirname + '/lib/utils'); // Get common adapter utils
var adapter = utils.adapter('pjlink');
var host, port, password, polltime, pjlink;

// is called when adapter shuts down - callback has to be called under any circumstances!
adapter.on('unload', function (callback) {
    try {
        adapter.log.info('cleaned everything up...');
        callback();
    } catch (e) {
        callback();
    }
});


// is called if a subscribed object changes
adapter.on('objectChange', function (id, obj) {
    // Warning, obj can be null if it was deleted
    adapter.log.info('objectChange ' + id + ' ' + JSON.stringify(obj));
});

// is called if a subscribed state changes
/* adapter.on('stateChange', function (id, state) {
    // Warning, state can be null if it was deleted
    adapter.log.info('stateChange ' + id + ' ' + JSON.stringify(state));
    // you can use the ack flag to detect if it is status (true) or command (false)

    if (state && !state.ack) {
      var ids = id.split(".");
      var dataobject = ids[ids.length - 1].toString();
  switch(dataobject){
       case 'power':
          pjlink(host,port,password, "%1POWR "+state.val, function(message){
              //adapter.log.info('Response is ' + message);
              adapter.setState('power', {val: state.val, ack:true});
            });
         }
       };
      case 'inputSource':
          pjlink(host,port,password, "%1INPT "+state.val, function(input_message){
            adapter.log.info('Response is ' + input_message);
            adapter.setState('inputSource', {val: state.val, ack:true});
          });

        case 'av_mute':
          pjlink(host,port,password, "%1AVMT "+state.val, function(message){
            adapter.log.info('Response is ' + message);
            adapter.setState('av_mute', {val: state.val, ack:true});
          });

});
*/

// is called when databases are connected and adapter received configuration.
adapter.on('ready', function () {
    main();
});

function main() {
    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:
    var power, inputSource, av_mute;

    adapter.log.info('config host: ' + adapter.config.host);
    adapter.log.info('config port: ' + adapter.config.port);
    adapter.log.info('config password: ' + adapter.config.password);
    adapter.log.info('config polltime: ' + adapter.config.polltime);
    host = adapter.config.host;
    port = adapter.config.port;
    password = adapter.config.password;
    polltime = adapter.config.polltime;
    pjlink = require(__dirname + '/lib/pjlink');

  // defining dataobject name / type and polling information

    // Power State
    // 0 = off (standby), 1 = on, 2 = cooling, 3 = warm-up
    adapter.setObjectNotExists('power', {
       type: 'state',
       common: {name: 'Power State', type: 'string', role: 'value'},
       native: {}
     });
    var pollinfo = setTimeout(function () {
    pjlink(host,port,password, "%1POWR ?", function(result){
      adapter.setState('power', {val: result, ack: true});
      power = result;
      adapter.log.info('power: ' + power);
     });
   }, 500);

    // Error Status
    // 0 = No error, 1 = Warning, 2 = Error
    // 1: Fan, 2: Lamp, 3: Temperature, 4: Cover open, 5: Filter, 6: Other
    adapter.setObjectNotExists('info.error', {
        type: 'state',
        common: {name: 'Error state', type: 'string', role: 'value'},
        native: {}
      });
    var pollinfo = setTimeout(function () {
    pjlink(host,port,password, "%1ERST ?", function(result){
        adapter.setState('info.error', {val: result, ack: true});
        adapter.log.info('error: ' + result);
      });
    }, 1000);

    // Lighting Hours
    // 1: lighning time, 2: Lamp turned on (1) / off (2)
    // 3: lighning time second lamp, 4: Lamp turned on (1) / off (2)
    adapter.setObjectNotExists('info.lamp_amount', {
        type: 'state',
        common: {name: 'Number of lamps', type: 'string', role: 'value'},
        native: {}
      });
    adapter.setObjectNotExists('info.lamp_hours', {
        type: 'state',
        common: {name: 'Lighting hours', type: 'string', role: 'value'},
        native: {}
      });
    var pollinfo = setTimeout(function () {
      pjlink(host,port,password, "%1LAMP ?", function(result){
          var res1 = result.substr(result.indexOf(" ")+1, 1);
          var res2 = result.substr(0,result.indexOf(" "));
          adapter.setState('info.lamp_amount', {val: 0, ack: true});
          adapter.log.info('result: ' + result);
          adapter.log.info('lamp_amount: ' + res1);
          adapter.log.info('lamp_hours: ' + res2);
        });
      }, 1500);

    /*adapter.setObjectNotExists('info.name', {
             type: 'state',
             common: {name: 'Name', type: 'string', role: 'value'},
             native: {}
       });

    adapter.setObjectNotExists('info.info1', {
         type: 'state',
         common: {name: 'Manufacture', type: 'string', role: 'value', read: true, write: false},
         native: {}
       });

     adapter.setObjectNotExists('info.info2', {
          type: 'state',
          common: {name: 'Product', type: 'string', role: 'value'},
          native: {}
      });

      adapter.setObjectNotExists('info.info', {
           type: 'state',
           common: {name: 'Other Info', type: 'string', role: 'value'},
           native: {}
       });

      adapter.setObjectNotExists('info.class', {
           type: 'state',
           common: {name: 'PJLink Class', type: 'string', role: 'value'},
           native: {}
       });

       adapter.setObjectNotExists('inputSource', {
          type: 'state',
          common: {name: 'Input Source', type: 'string', role: 'value'},
          // 31 HDMI1, 32, HDMI2...
          native: {}
         });

       adapter.setObjectNotExists('av_mute', {
           type: 'state',
           common: {name: 'Audio/Video Mute', type: 'string', role: 'value'},
           // 10 = Video mute off, 11 = Video mute on,
           // 20 = Audio mute off, 21 = Audio mute on,
           // 30 = Audio and Video mute off, 31 = Audio and Video mute on
           native: {}
         });

*/
// all states changes inside the adapters namespace are subscribed
    adapter.subscribeStates('*');

// polling some projector infotmation once
/*    pjlink(host,port,password, "%1INF1 ?", function(getInfo1){
       adapter.setState('info.info1', {val: getInfo1, ack: true});
    });

    pjlink(host,port,password, "%1INF2 ?", function(getInfo2){
       adapter.setState('info.info2', {val: getInfo2, ack: true});
    });

    pjlink(host,port,password, "%1INFO ?", function(getInfo){
       adapter.setState('info.info', {val: getInfo, ack: true});
    });

    pjlink(host,port,password, "%1CLSS ?", function(getClass){
       adapter.setState('info.class', {val: getClass, ack: true});
    });
*/
// pollng current states frequently
/* var check_PowerState = setInterval(function() {
  pjlink(host,port,password, "%1POWR ?", function(pjlink_state){
    adapter.getState ('power', function (err, adapter_state) {
      if (adapter_state.val !== pjlink_state) {
        adapter.setState('power', {val: pjlink_state, ack: false});
      }
      else if (!adapter_state.ack) {
        adapter.setState('power', {val: pjlink_state, ack: true});
      }
    });
  });
}, polltime);


    var check_InputSource = setInterval(function() {
      pjlink(host,port,password, "%1INPT ?", function(pjlink_state){
        adapter.getState ('inputSource', function (err, adapter_state) {
          if (adapter_state.val !== pjlink_state) {
            adapter.setState('inputSource', {val: pjlink_state, ack: false});
          }
           else if (!adapter_state.ack) {
             adapter.setState('inputSource', {val: pjlink_state, ack: true});
           }
        })
      });
    }, polltime);
*/

  /*  var check_MuteState = setInterval(function() {
      pjlink(host,port,password, "%1AVMT ?", function(pjlink_state){
        adapter.getState ('av_mute', function (err, adapter_state) {
          if (adapter_state.val !== pjlink_state) {
            adapter.setState('av_mute', {val: pjlink_state, ack: false});
          }
          else if (!adapter_state.ack) {
            adapter.setState('av_mute', {val: pjlink_state, ack: true});
          }
        });
      });
    }, polltime);

*/
    /*var getLampHours = setInterval(function() {
            pjlink(host,port,password, "%1INPT ?", function(source){
              adapter.setState('info.lamp', {val: getLampHours, ack: true});
              });
        }, 10000;*/

    // examples for the checkPassword/checkGroup functions
    adapter.checkPassword('admin', 'iobroker', function (res) {
        console.log('check user admin pw ioboker: ' + res);
    });

    adapter.checkGroup('admin', 'admin', function (res) {
        console.log('check group user admin group admin: ' + res);
    });
}
