'use strict';

var http = require('http');
var amqp = require('amqplib');
var fs = require('fs');
var default_config = require('./default_config');
var config = Object.assign(default_config, require('./config'));

amqp.connect(config.host_uri).then(function(conn) {

  conn.createChannel()
    .then(configureChannel)
    .then(startServer)
    .then(function() {
      process.on('SIGINT', function() {
        console.info("Server exiting...");
        conn.close();
        process.exit(0);
      });
    }).catch(function(err) {
      console.error(err);
      conn.close();
      process.exit(1);
    });

}).catch(function(err) {
  console.error(err);
  process.exit(1);
});

function configureChannel(channel) {
  var promises = []
  if (config.exchange_name) {
    promises.push(channel.assertExchange(config.exchange_name, 'topic'));
  }
  for (var qname in config.queues) {
    promises.push(channel.assertQueue(qname, {durable: true}));
    config.queues[qname].forEach(function(evtType) {
      promises.push(channel.bindQueue(qname, config.exchange_name, routing_key(evtType)));
    });
  }
  return Promise.all(promises).then(function(values) { return channel; });
}

function startServer(channel) {
  http.createServer(function(req, res) {

    if (req.method === 'POST') {
      var data = '';
      req.on('data', function(chunk) {
        data += chunk.toString();
      });

      req.on('end', function() {
        try {
          var events = JSON.parse(data);
          if (Array.isArray(events)) { //APIv2, multiple events per call
            events.forEach(function(evt) {
              pushEvent(evt, channel);
            });
          } else { //API v1, one event per call
            pushEvent(events, channel);
          }
        } catch (e) {
          console.error("Error while processing input " + data.toString());
          console.error(e);
          res.statusCode = 400; //Bad request
        }
        res.end();
      });
    } else {
      res.statusCode = 405; //Method not allowed
      res.end();
    }
  
  }).listen(config.port);
  console.info("Server started on port " + config.port);
}

function routing_key(eventType) {
  return 'mailjet.' + eventType;
}

function pushEvent(evt, channel) {
  var eventType = evt.event;
  if (!eventType) {
    throw "Missing event type";
  }
  var msg = new Buffer(JSON.stringify(evt));
  channel.publish(config.exchange_name, routing_key(eventType), msg, config.publishOptions);
}