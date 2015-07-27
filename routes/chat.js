var express = require('express');
var router = express.Router();
var events = require('events');
var winston = require('winston');

/*
router.get('/start', function(req, res, next) {
  var workflow = new events.EventEmitter();  

  workflow.outcome = {
      success: false,
      errfor: {}
  };

  workflow.on('validation', function() {
    console.log('va');

    workflow.emit('start');
  });

  workflow.on('start', function() {
    console.log('start');

    this.render('chat', function(err, html){
      if(err) workflow.outcome.errfor = err;

      console.log('render');
    });

    workflow.outcome.success = true;
    workflow.emit('response');
  });

  workflow.on('response', function() {
    console.log('response');

    res.send(workflow.outcome);
  });
  
  workflow.emit('validation');
});
*/


router.post('/send/:message', function(req, res, next) {
  var workflow = new events.EventEmitter();
  var clients = req.app.clients;
  var msg = req.params.message;
  console.log(msg);

  workflow.outcome = {
      success: false,
      errfor: {},
      data: []
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
    workflow.outcome.data.push(msg);

    clients.forEach(function(client) {
       client.sendUTF(JSON.stringify(workflow.outcome.data));
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
