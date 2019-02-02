# Logging: To Console

*Console* adapter for [logger driver](https://github.com/VeliovGroup/Meteor-logger). Print Client's log messages to Server's console package. All messages is enhanced with colors and extra styles for better readability.

This package is not limited to transferring *Client* log messages to Server. It can be used on *Client* or *Server* only, or for printing colorized messages.

Features:

- 💪 Flexible log level filters;
- 👨‍💻 `userId` is automatically passed and logged, data is associated with logged-in user;
- 📟 Pass logs from *Client* right to *Server*'s console;
- 🕷 Catch all browser's errors and exceptions.

## Screen shots:

Server:
![server example](https://raw.githubusercontent.com/VeliovGroup/Meteor-logger-console/master/server.png)

Client:
![client example](https://raw.githubusercontent.com/VeliovGroup/Meteor-logger-console/master/client.png)

## Installation:

```shell
meteor add ostrio:logger # If not yet installed
meteor add ostrio:loggerconsole
```

## ES6 Import:

```js
import { Logger }        from 'meteor/ostrio:logger';
import { LoggerConsole } from 'meteor/ostrio:loggerconsole';
```

## Usage

### Initialization [*Isomorphic*]

`new LoggerConsole(LoggerInstance, settings)`

- `LoggerInstance` {*Logger*} - from `new Logger()`
- `settings` {*Object*}
- `settings.format` {*Function*} - This function must return *String*. Arguments:
  - `opts` {*Object*}
  - `opts.userId` {*String*}
  - `opts.time` {*Date*} - Report date
  - `opts.level` {*String*} - Message level, one of: `ERROR`, `FATAL`, `WARN`, `DEBUG`, `INFO`, `TRACE`, `LOG`, `*`
  - `opts.message` {*String*} - Report message
  - `opts.data` {*Object*} - Additional info passed as object

#### Example: [*Isomorphic*]

```js
import { Logger }        from 'meteor/ostrio:logger';
import { LoggerConsole } from 'meteor/ostrio:loggerconsole';

// Initialize Logger:
const log = new Logger();
// Initialize and enable LoggerConsole with default settings:
(new LoggerConsole(log)).enable();

// Initialize and enable LoggerConsole with custom formatting:
(new LoggerConsole(log, {
  format(opts) {
    return ((Meteor.isServer) ? '[SERVER]' : '[CLIENT]') + ' [' + opts.level + '] - ' + opts.message;
  }
})).enable();
```

### Activate with custom adapter settings: [*Isomorphic*]

```js
import { Logger }        from 'meteor/ostrio:logger';
import { LoggerConsole } from 'meteor/ostrio:loggerconsole';

const log = new Logger();
(new LoggerConsole(log)).enable({
  enable: true,
  filter: ['ERROR', 'FATAL', 'WARN'], /* Filters: 'ERROR', 'FATAL', 'WARN', 'DEBUG', 'INFO', 'TRACE', '*' */
  client: true, // Set to `false` to avoid log transfer from Client to Server
  server: true  // Set to `false` to disallow execution on Server
});
```

#### Log message: [*Isomorphic*]

```js
import { Logger }        from 'meteor/ostrio:logger';
import { LoggerConsole } from 'meteor/ostrio:loggerconsole';

const log = new Logger();
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
log._(message, data, userId); // Shortcut

// Use with throw
throw log.error(message, data, usmerId);
```

### Catch-all Client's errors example: [*Client*]

```js
/* Store original window.onerror */
const _GlobalErrorHandler = window.onerror;

window.onerror = function (msg, url, line) {
  log.error(msg, {file: url, onLine: line});
  if (_GlobalErrorHandler) {
    _GlobalErrorHandler.apply(this, arguments);
  }
};
```

### Catch-all Server's errors example: [*Server*]

```js
const bound = Meteor.bindEnvironment((callback) => {callback();});
process.on('uncaughtException', function (err) {
  bound(() => {
    log.error('Server Crashed!', err);
    console.error(err.stack);
    process.exit(7);
  });
});
```

### Catch-all Meteor's errors example: [*Server*]

```js
// store original Meteor error
const originalMeteorDebug = Meteor._debug;
Meteor._debug = function (message, stack) {
  const error = new Error(message);
  error.stack = stack;
  log.error('Meteor Error!', error);
  return originalMeteorDebug.apply(this, arguments);
};
```

### Use multiple logger(s) with different settings: [*Isomorphic*]

```js
const log1 = new Logger();
const log2 = new Logger();

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

## Running Tests

1. Clone this package
2. In Terminal (*Console*) go to directory where package is cloned
3. Then run:

### Meteor/Tinytest

```shell
meteor test-packages ./
```

## Support this awesome package:

- Star on [GitHub](https://github.com/VeliovGroup/Meteor-logger-console)
- Star on [Atmosphere](https://atmospherejs.com/ostrio/loggerconsole)
- [Tweet](https://twitter.com/share?url=https://github.com/VeliovGroup/Meteor-logger-console&text=Print%20colorful%20log%20messages%20and%20send%20Client's%20logs%20to%20Server's%20console%20%23meteorjs%20%23javascript%20via%20%40VeliovGroup)
- Share on [Facebook](https://www.facebook.com/sharer.php?u=https://github.com/VeliovGroup/Meteor-logger-console)

## Support our open source contribution:

This project wouldn't be possible without [ostr.io](https://ostr.io).

Using [ostr.io](https://ostr.io) you are not only [protecting domain names](https://ostr.io/info/domain-names-protection), [monitoring websites and servers](https://ostr.io/info/monitoring), using [Prerendering for better SEO](https://ostr.io/info/prerendering) of your JavaScript website, but support our Open Source activity, and great packages like this one are available for free.
