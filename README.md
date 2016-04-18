Logging: To Console
========
Print Client's log messages into Server's console within [ostrio:logger](https://atmospherejs.com/ostrio/logger) package. All messages is enhanced with colors and extra styles for better readability.

Server example:
![server example](https://raw.githubusercontent.com/VeliovGroup/Meteor-logger-console/master/server.png)

Client example:
![client example](https://raw.githubusercontent.com/VeliovGroup/Meteor-logger-console/master/client.png)

Installation:
========
```shell
meteor add ostrio:logger # If not yet installed
meteor add ostrio:loggerconsole
```

Usage
========
##### Initialization [*Isomorphic*]
`new LoggerConsole(LoggerInstance, options)`
 - `LoggerInstance` {*Logger*} - from `new Logger()`

Example:
```javascript
this.Log = new Logger();
var LogConsole = new LoggerConsole(Log);
```

##### Activate and set adapter settings [*Isomorphic*]
```javascript
this.Log = new Logger();
new LoggerConsole(Log).enable({
  enable: true,
  filter: ['ERROR', 'FATAL', 'WARN'], /* Filters: 'ERROR', 'FATAL', 'WARN', 'DEBUG', 'INFO', 'TRACE', '*' */
  client: true, /* Output logs on both Server's and Client's console */
  server: true  /* Calls from Client and Server will be executed on Server */
});

##### Log [*Isomorphic*]
```javascript
this.Log = new Logger();
new LoggerConsole(Log).enable();

/*
  message {String} - Any text message
  data    {Object} - [optional] Any additional info as object
  userId  {String} - [optional] Current user id
 */
Log.info(message, data, userId);
Log.debug(message, data, userId);
Log.error(message, data, userId);
Log.fatal(message, data, userId);
Log.warn(message, data, userId);
Log.trace(message, data, userId);
Log._(message, data, userId); //--> Shortcut for logging without message, e.g.: simple plain log

/* Use with throw */
throw Log.error(message, data, userId);
```

##### Use multiple logger(s) with different settings:
```javascript
this.Log1 = new Logger();
this.Log2 = new Logger();

new LoggerConsole(Log1).enable({
  filter: ['*'],
  client: true,
  server: true
});

new LoggerConsole(Log2).enable({
  filter: ['ERROR', 'FATAL'],
  client: true,
  server: true
});
```