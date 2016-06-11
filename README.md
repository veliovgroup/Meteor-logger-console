Logging: To Console
========
Print Client's log messages to Server's console package. All messages is enhanced with colors and extra styles for better readability.

This package is not limited to transferring Client's log messages to Server. It can be used on client only, or for printing colorized messages on both Client and Server.

##### Server example:
![server example](https://raw.githubusercontent.com/VeliovGroup/Meteor-logger-console/master/server.png)

##### Client example:
![client example](https://raw.githubusercontent.com/VeliovGroup/Meteor-logger-console/master/client.png)

Installation:
========
```shell
meteor add ostrio:logger # If not yet installed
meteor add ostrio:loggerconsole
```

Support this awesome package:
========
 - Star on [GitHub](https://github.com/VeliovGroup/Meteor-logger-console)
 - Star on [Atmosphere](https://atmospherejs.com/ostrio/loggerconsole)
 - [Tweet](https://twitter.com/share?url=https://github.com/VeliovGroup/Meteor-logger-console&text=Print%20colorful%20log%20messages%20and%20send%20Client's%20logs%20to%20Server's%20console%20%23meteorjs%20%23javascript%20via%20%40VeliovGroup)
 - Share on [Facebook](https://www.facebook.com/sharer.php?u=https://github.com/VeliovGroup/Meteor-logger-console)

Usage
========
##### Initialization [*Isomorphic*]
`new LoggerConsole(LoggerInstance, settings)`
 - `LoggerInstance` {*Logger*} - from `new Logger()`
 - `settings` {*Object*}
 - `settings.format` {*Function*} - This function must return *String*. Arguments:
  * `opts` {*Object*}
  * `opts.userId` {*String*}
  * `opts.time` {*Date*} - Report date
  * `opts.level` {*String*} - Message level, one of: `ERROR`, `FATAL`, `WARN`, `DEBUG`, `INFO`, `TRACE`, `LOG`, `*`
  * `opts.message` {*String*} - Report message
  * `opts.data` {*Object*} - Additional info passed as object

Example: [*Isomorphic*]
```javascript
// Initialize Logger:
this.log = new Logger();

// Initialize LoggerConsole and enable with default settings:
(new LoggerConsole(log)).enable();

// Initialize LoggerConsole and enable with custom formatting:
(new LoggerConsole(log, {
  format: function (opts) {
    return ((Meteor.isServer) ? '[SERVER]' : "[CLIENT]") + ' [' + opts.level + '] - ' + opts.message;
  }
})).enable();
```

##### Activate with custom adapter settings: [*Isomorphic*]
```javascript
this.log = new Logger();
(new LoggerConsole(log)).enable({
  enable: true,
  filter: ['ERROR', 'FATAL', 'WARN'], /* Filters: 'ERROR', 'FATAL', 'WARN', 'DEBUG', 'INFO', 'TRACE', '*' */
  client: true, /* Output logs on both Server's and Client's console */
  server: true  /* Calls from Client and Server will be executed on Server */
});
```

##### Log message: [*Isomorphic*]
```javascript
this.log = new Logger();
(new LoggerConsole(log)).enable();

/*
  message {String} - Any text message
  data    {Object} - [optional] Any additional info as object
  userId  {String} - [optional] Current user id
 */
log.info(message, data, userId);
log.debug(message, data, userId);
log.error(message, data, userId);
log.fatal(message, data, userId);
log.warn(message, data, userId);
log.trace(message, data, userId);
log._(message, data, userId); //--> Plain log without level

/* Use with throw */
throw log.error(message, data, usmerId);
```

##### Catch-all Client's errors example: [*Client*]
```javascript
/* Store original window.onerror */
var _WoE = window.onerror;

window.onerror = function(msg, url, line) {
  log.error(msg, {file: url, onLine: line});
  if (_WoE) {
    _WoE.apply(this, arguments);
  }
};
```

##### Use multiple logger(s) with different settings: [*Isomorphic*]
```javascript
this.log1 = new Logger();
this.log2 = new Logger();

(new LoggerConsole(log1)).enable({
  filter: ['*'],
  client: true,
  server: true
});

(new LoggerConsole(log2)).enable({
  filter: ['ERROR', 'FATAL'],
  client: true,
  server: true
});
```