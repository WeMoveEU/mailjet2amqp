module.exports = {
  port: 8080,
  host_uri: 'amqp://guest:guest@localhost',
  exchange_name: "", //Will be asserted as a topic exchange if non-empty
  queues: { //Queues that should be asserted and the events they should receive
    //"name": ["event1", "event2"] 
  },
  publishOptions: {
    persistent: true
  }
};
