//PJLink Script

var net = require('net');
var crypto = require('crypto');

module.exports = function (host, port, password,command, cb) {
   var socket = new net.Socket();

   socket.connect(port, host, function() {
       socket.write('');
   });

   socket.setTimeout(2000, function () {
       socket.end();
       socket.destroy();
   });

   socket.on('data', function(message)
       {
       message = message.toString('utf8').trim();
       switch (message.substring(0, 8))
       {
           case 'PJLINK 1': //Auth
               var pwtoken = message.substring(9, 17);
               var digest = crypto.createHash("md5")
                   .update(pwtoken + password)
                   .digest("hex");
               socket.write(digest);
               break;

           case 'PJLINK 0':
               socket.write(command);
               socket.write("\r");
               return;
       }
       // Debug
       // console.log("Device response: " + message);

       var resultCode = message.substring(message.indexOf('=') + 1)
                           .substring(message.indexOf(' ') + 1);

       var resultMessages = {
           OK:   'Successful execution',
           ERR1: 'Undefined command',
           ERR2: 'Out of parameter',
           ERR3: 'Unavailable time',
           ERR4: 'Projector/Display failure',
           ERRA: 'Authentification error'
       };

       if (resultCode.substring(0, 3) == 'ERR') {
        }

       cb(message.substr(7,message.length -1));

       socket.destroy();
       });

       socket.on('close', function() {
    });
};
