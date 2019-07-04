module.exports = {
  port: 8080,
  host_uri: 'amqp://guest:guest@localhost',
  connectOptions: undefined,
  /* SSL Example
  connectOptions: {
    key: fs.readFileSync('/path/to/key.pem'),
    cert: fs.readFileSync('/path/to/cert.pem'),
    ca: [fs.readFileSync('/etc/ssl/certs/ca-certificates.crt')]
  }, */
  exchange_name: "", //Will be asserted as a topic exchange if non-empty
  queues: { //Queues that should be asserted and the events they should receive
    //"name": ["event1", "event2"] 
  },
  publishOptions: {
    persistent: true
  }
};
