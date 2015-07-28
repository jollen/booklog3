var express = require('express');
var router = express.Router();
var events = require('events');
var winston = require('winston');

var history = [];

router.get('/start', function(req, res, next) {
  var workflow = new events.EventEmitter();  

  workflow.outcome = {
      success: false,
      errfor: {},
      message: {}
  };

  workflow.on('start', function() {
    console.log('start');

    workflow.outcome.success = true;
    workflow.outcome.message.data = history;
    workflow.emit('response');
  });

  workflow.on('response', function() {
    console.log('response');

    res.send(workflow.outcome.message);
  });
  
  workflow.emit('start');
});


router.post('/send/:message', function(req, res, next) {
  var workflow = new events.EventEmitter();
  var clients = req.app.clients;
  var msg = req.params.message;
  var obj = {};
  var milliseconds = new Date().getTime();

  workflow.outcome = {
      success: false,
      errfor: {},
      message: {}
  };

  workflow.on('validation', function() {
    if(typeof msg === 'string') {
      console.log('message is a string');
      return workflow.emit('boardcast');
    }

    workflow.outcome.errfor = 'message is not a string';
    workflow.emit('response');
  });

  workflow.on('boardcast', function() {
    console.log('ready to boardcast "' + msg + ' "');

    workflow.outcome.success = true;
    obj.message = msg;
    obj.timestamp = milliseconds;
    history.push(obj);
    workflow.outcome.message.type = 'message';
    workflow.outcome.message.data = history;

    clients.forEach(function(client) {
       client.sendUTF(JSON.stringify(workflow.outcome.message));
    });

    workflow.emit('response');
  });

  workflow.on('response', function() {
    console.log(workflow.outcome);
    res.send(workflow.outcome);
  });
  
  workflow.emit('validation');
});


module.exports = router;
