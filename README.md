# mailjet2amqp
A simple NodeJS http server forwarding mailjet events to an AMQP exchange

## Install

`npm install` to install Javascript dependencies.

## Configure

Create a file _config.js_ at the root to override the default config properties:

 - Notably, you probably want to change the URI of the AMQP host.
 - By default, messages are published to the unnamed exchange with the routing key `mailjet.xxx` where xxx is the mailjet event type.
 You can give a name to the exchange in the config, in which case it will be asserted (as a topic exchange) before the server starts listening.
 - If you want to make sure that some/all events go somewhere, you can specify in the config a list of queues and which events they should receive. 
 These queues will be asserted and bound before the server starts listening.
 - By default, everything is made durable/persistent.
 
## Run

`nodejs endpoint.js`

Logs are sent to the standard output.
