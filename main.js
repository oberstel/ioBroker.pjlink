// PJLink adapter main script
// V.0.1.1

"use strict";

var utils = require('@iobroker/adapter-core'); // Get common adapter utils
//var adapter = utils.Adapter('pjlink');
var host, port, password, polltime, pjlink;
var power, inputSource, av_mute;

let adapter;
function startAdapter(options) {
    options = options || {};
    Object.assign(options, {
         name: 'pjlink',
         stateChange: function (id, state) {
            // Warning, state can be null if it was deleted
            adapter.log.debug('stateChange ' + id + ' ' + JSON.stringify(state));

              if (state && !state.ack) {
                var ids = id.split(".");
                var dataobject = ids[ids.length - 1].toString();
                switch (dataobject) {
                 case 'power':
                    pjlink(host,port,password, "%1POWR "+state.val, function(message){
                      adapter.log.debug('device response:' + message);
                      adapter.setState('power', {val: state.val, ack:true});
                      power = state.val;
                     });
                    break;

                 case 'inputSource':
                     if (inputSource != 0) {
                     pjlink(host,port,password, "%1INPT "+state.val, function(message){
                       adapter.log.debug('device response:' + message);
                       adapter.setState('inputSource', {val: state.val, ack:true});
                       inputSource = state.val;
                       });
                      }
                      break;

                case 'audio_mute':
                    if (state.val == false) {
                         pjlink(host,port,password, "%1AVMT 20", function(message){
                          adapter.log.debug('device response:' + message);
                          adapter.setState('audio_mute', {val: false, ack:true});
                        });
                        }

                    if (state.val == true) {
                       pjlink(host,port,password, "%1AVMT 21", function(message){
                        adapter.log.debug('device response:' + message);
                        adapter.setState('audio_mute', {val: true, ack:true});
                      });
                     }
                   break;

                   case 'av_mute':
                       adapter.log.debug('changed ' + dataobject + ' to ' + state.val);
                       if (state.val == false) {
                            pjlink(host,port,password, "%1AVMT 30", function(message){
                              adapter.log.debug('device response:' + message);
                              adapter.setState('av_mute', {val: false, ack:true});
                            });
                          }

                        if (state.val == true) {
                          pjlink(host,port,password, "%1AVMT 31", function(message){
                            adapter.log.debug('device response:' + message);
                            adapter.setState('av_mute', {val: true, ack:true});
                           });
                         }
                }
                adapter.log.info('changed ' + dataobject + ' to ' + state.val);
            } // end if
         },
         unload: function(callback){
            try {
                adapter.log.info('cleaned everything up...');
                callback();
            } catch (e) {
                callback();
            }
         },
         objectChange: function(callback){
            // Warning, obj can be null if it was deleted
            adapter.log.debug('objectChange ' + id + ' ' + JSON.stringify(obj));
         },
         ready: function(){
          main();
         },


    });
    adapter = new utils.Adapter(options);

    return adapter;
};



function main() {
    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:

    adapter.log.info('PJlink Class#1');
    adapter.log.info('config host: ' + adapter.config.host);
    adapter.log.info('config port: ' + adapter.config.port);
    adapter.log.info('config polltime: ' + adapter.config.polltime);
    host = adapter.config.host;
    port = adapter.config.port;
    password = adapter.config.password;
    polltime = adapter.config.polltime;
    pjlink = require(__dirname + '/lib/pjlink');

 // Check communication
  pjlink(host,port,password,"%1POWR ?", function (result) {
   if (result.substring(0,5).toUpperCase() === 'ERROR') {
      adapter.log.error (result);
      adapter.terminate ? adapter.terminate() : process.exit();
     }
  });

  // defining dataobjects
  adapter.setObjectNotExists('power', {
      type: 'state',
      common: {name: 'Power state', type: 'number', role: 'value', read: true, write: true},
      native: {}
    });

  adapter.setObjectNotExists('inputSource', {
      type: 'state',
      common: {name: 'Input Source', type: 'string', role: 'value', read: true, write: true},
      native: {}
    });

  adapter.setObjectNotExists('audio_mute', {
      type: 'state',
      common: {name: 'Audio mute', type: 'boolean', role: 'value', read: true, write: true},
      native: {}
    });
   adapter.setState('audio_mute', {val: '0', ack: true});

  adapter.setObjectNotExists('av_mute', {
        type: 'state',
        common: {name: 'Audio/Video mute', type: 'boolean', role: 'value', read: true, write: true},
        native: {}
      });
   adapter.setState('av_mute', {val: '0', ack: true});

  adapter.setObjectNotExists('info.error', {
      type: 'state',
      common: {name: 'Error state', type: 'number', role: 'value', read: true, write: false},
      native: {}
    });
    adapter.setState('info.error', {val: '0', ack: true});

  adapter.setObjectNotExists('info.lamp1', {
      type: 'state',
      common: {name: 'Lighting hours 1. lamp', type: 'string', role: 'value', unit: 'h', read: true, write: false},
      native: {}
    });
    adapter.setState('info.lamp1', {val: '0', ack: true});

  adapter.setObjectNotExists('info.name', {
       type: 'state',
       common: {name: 'Device name', type: 'string', role: 'value', read: true, write: false},
       native: {}
     });

  adapter.setObjectNotExists('info.info1', {
       type: 'state',
       common: {name: 'Manufacture', type: 'string', role: 'value', read: true, write: false},
       native: {}
     });

  adapter.setObjectNotExists('info.info2', {
       type: 'state',
       common: {name: 'Product / Model', type: 'string', role: 'value', read: true, write: false},
       native: {}
     });

  adapter.setObjectNotExists('info.info', {
       type: 'state',
       common: {name: 'Other info', type: 'string', role: 'value', read: true, write: false},
       native: {}
     });

  adapter.setObjectNotExists('info.class', {
       type: 'state',
       common: {name: 'PJLink protcol class', type: 'number', role: 'value', read: true, write: false},
       native: {}
     });

  adapter.setObjectNotExists('info.inputSources', {
       type: 'state',
       common: {name: 'List of possible input sources', type: 'number', role: 'value', read: true, write: false},
       native: {}
     });

// Query some data...

  // Device Name
  pjlink(host,port,password, "%1NAME ?", function(result){
    adapter.setState('info.name', {val: result, ack: true});
    adapter.log.debug('name: ' + result);

  // Info 1 (Manufacture)
    pjlink(host,port,password, "%1INF1 ?", function(result){
      adapter.setState('info.info1', {val: result, ack: true});
      adapter.log.debug('info1: ' + result);

  // Info 2 (product / model)
      pjlink(host,port,password, "%1INF2 ?", function(result){
        adapter.setState('info.info2', {val: result, ack: true});
        adapter.log.debug('info2: ' + result);

  // Other Info
        pjlink(host,port,password, "%1INFO ?", function(result){
          adapter.setState('info.info', {val: result, ack: true});
          adapter.log.debug('info: ' + result);

  // PJLink Protocol Class
          pjlink(host,port,password, "%1CLSS ?", function(result){
            adapter.setState('info.class', {val: result, ack: true});
            adapter.log.debug('class: ' + result);

  // Device Input Sources
            pjlink(host,port,password, "%1INST ?", function(result){
              adapter.setState('info.inputSources', {val: result.split(" "), ack: true});
              adapter.log.debug('inputSources: ' + result);

  // Device Power State
              pjlink(host,port,password, "%1POWR ?", function(result){
                adapter.setState('power', {val: result, ack: true});
                power = result;
                adapter.log.debug('initial power state: ' + result);

  // Device Input Source
                pjlink(host,port,password, "%1INPT ?", function(result){
                  if (result.toUpperCase() === 'ERR2') {
                    inputSource = 0;
                    adapter.log.warn('warning: no signal for input source');
                    adapter.setState('inputSource', {val: 'none', ack: true});
                    }
                  else {
                    inputSource = result;
                    adapter.setState('inputSource', {val: result, ack: true});
                    }
                  adapter.log.debug('initial input source: ' + result);

   // Device AV Mute State
                  pjlink(host,port,password, "%1AVMT ?", function(result){
                    adapter.setState('av_mute', {val: result, ack: true});
                      av_mute = result;
                      switch (result) {
                        case '30':
                         adapter.setState('av_mute', {val: false, ack: true});
                         adapter.setState('audio_mute', {val: false, ack: true});
                        break;

                        case '31':
                         adapter.setState('av_mute', {val: true, ack: true});
                         adapter.setState('audio_mute', {val: true, ack: true});
                        break;

                        case '20':
                         adapter.setState('av_mute', {val: false, ack: true});
                         adapter.setState('audio_mute', {val: false, ack: true});
                        break;

                        case '21':
                         adapter.setState('av_mute', {val: false, ack: true});
                         adapter.setState('audio_mute', {val: true, ack: true});
                        }

                  });
                });
              });
            });
          });
        });
      });
    });
  });


// Polling dynamic infomration
var pollinfo = setInterval(function () {
  // Power State
  // 0 = off (standby), 1 = on, 2 = cooling, 3 = warm-up
  pjlink(host,port,password, "%1POWR ?", function(result){
     adapter.log.debug('current device power state: ' + result);
     adapter.getState ('power', function (err, adapter_state) {
        if (result != adapter_state.val) {
          adapter.setState('power', {val: result, ack: false});
          power = result;
          }
    });


 if (power == 1) {

  // Error Status
  // 0 = No error, 1 = Warning, 2 = Error
  // 1: Fan, 2: Lamp, 3: Temperature, 4: Cover open, 5: Filter, 6: Other
      pjlink(host,port,password, "%1ERST ?", function(result){
        adapter.log.debug('current device errors: ' + result);
        adapter.getState (adapter.namespace + '.info.error', function (err, adapter_state) {
            if (adapter_state.val != result) {
                adapter.setState('info.error', {val: result, ack: true});
                }
          });

  // Lighting Hours
  // 1: lighning time, 2: Lamp turned on (1) / off (2)
  // 3: lighning time second lamp, 4: Lamp turned on (1) / off (2)
          pjlink(host,port,password, "%1LAMP ?", function(result){
            var lamp_hours = result.substr(0,result.indexOf(" "));
            adapter.log.debug('current device lamp1 hours: ' + lamp_hours);
            adapter.getState ('info.lamp1', function (err, adapter_state) {
                if (lamp_hours != adapter_state.val) {
                    adapter.setState('info.lamp1', {val: lamp_hours, ack: true});
                    }
            });

  // Input Source
  // 31 HDMI1, 32, HDMI2...
            pjlink(host,port,password, "%1INPT ?", function(result){
            adapter.log.debug('current device inputSource: ' + result);
            adapter.getState ('inputSource', function (err, adapter_state) {
              if (result.toUpperCase() === 'ERR2' && adapter_state.val !== 'none') {
                 inputSource = 0
                 adapter.setState('inputSource', {val: 'none', ack: false});
                }
              if (result.toUpperCase() !== 'ERR2' && adapter_state.val !== result) {
                 inputSource = result
                 adapter.setState('inputSource', {val: result, ack: false});
                }
              });

  // Audio / Video mute switch (only if power on)
  // 10 = Video mute off, 11 = Video mute on                (** this gives an error with my device **),
  // 20 = Audio mute off, 21 = Audio mute on,
  // 30 = Audio and Video mute off, 31 = Audio and Video mute on
                pjlink(host,port,password, "%1AVMT ?", function(result){
                  adapter.log.debug ('current device av_mute state:' + result);
                  if (result != av_mute) {
                    av_mute = result;
                    switch (result) {
                      case '30':
                       adapter.setState('av_mute', {val: false, ack: false});
                       adapter.setState('audio_mute', {val: false, ack: false});
                      break;

                      case '31':
                       adapter.setState('av_mute', {val: true, ack: false});
                       adapter.setState('audio_mute', {val: true, ack: false});
                      break;

                      case '20':
                       adapter.setState('av_mute', {val: false, ack: false});
                       adapter.setState('audio_mute', {val: false, ack: false});
                      break;

                      case '21':
                       adapter.setState('av_mute', {val: false, ack: false});
                       adapter.setState('audio_mute', {val: true, ack: false});
                      }
                    }
                  }); // End av_mute

             }); // End inputSource

          }); // End lamp1

        }); // End error

    } // End of if power

     else {
        if (inputSource != 0) {    // if device is off, set input source to 'none'
           adapter.setState('inputSource', {val: 'none', ack: false});
           inputSource = 0;
          }
        adapter.log.debug('idle');
       }

  }); // End first callback (power)

 }, polltime);


  // all states changes inside the adapters namespace are subscribed
  adapter.subscribeStates('*');


  // checkPassword/checkGroup functions
  adapter.checkPassword('admin', 'iobroker', function (res) {
      console.log('check user admin pw ioboker: ' + res);
  });

  adapter.checkGroup('admin', 'admin', function (res) {
      console.log('check group user admin group admin: ' + res);
  });
}

// If started as allInOne/compact mode => return function to create instance
if (module && module.parent) {
    module.exports = startAdapter;
} else {
    // or start the instance directly
    startAdapter();
}
