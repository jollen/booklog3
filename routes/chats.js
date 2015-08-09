var express = require('express');
var router = express.Router();
var events = require('events');
var winston = require('winston');
var history = [];
var cors = require('cors');
winston.add(winston.transports.File, { 
  name: 'booklog-chat',
  filename: 'booklog-chat-info.log',
  level: 'info'
});

/*
 * GET chat messages
 */

router.get('/start', function(req, res, next) {
    var workflow = new events.EventEmitter();  

    workflow.outcome = {
        success: false,
        errfor: {},
        data:{}
    };

    workflow.on('start', function() {
        workflow.outcome.data = history;
        workflow.emit('response');
    });

    workflow.on('response', function() {
        workflow.outcome.data = history;
        workflow.outcome.success = true;
        res.send(workflow.outcome);
    });

    workflow.emit('start');
});


/*
 * POST chat message
 */

router.post('/send/:message', function(req, res, next) {
  var workflow = new events.EventEmitter();  
  var clients = req.app.clients;
  workflow.outcome = {
      success: false,
      errfor: {}
  };

  workflow.on('validation', function() {
    history.push({
      message: req.params.message,
      timestamp: new Date().getTime()
    });
    workflow.emit('broadcast');
  });

  workflow.on('broadcast', function() {
    for (i = 0; i < clients.length; i++) {
      var client = clients[i];
      var data = {
        type: 'message',
        data: history
      };

      client.sendUTF(JSON.stringify(data));
    };

    workflow.outcome.success = true;
    workflow.emit('response');
  });

  workflow.on('response', function() {
      res.send(workflow.outcome);
  });
  
  workflow.emit('validation');
});


module.exports = router;