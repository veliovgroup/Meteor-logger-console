Meteor Console adapter for ostrio:logger
========
Simply output Client application logs into Server's console within [ostrio:logger](https://atmospherejs.com/ostrio/logger) package. On Server logs will be colored within [console-debug](https://bitbucket.org/michaeldegroot/console-debug) NPM package.

Installation:
========
```shell
meteor add ostrio:loggerconsole
```

Usage
========
##### Log [`Server` & `Client`]
```javascript
/*
  message {String} - Any text message
  data    {Object} - [optional] Any additional info as object
  userId  {String} - [optional] Current user id
 */
Meteor.log.info(message, data, userId);
Meteor.log.debug(message, data, userId);
Meteor.log.error(message, data, userId);
Meteor.log.fatal(message, data, userId);
Meteor.log.warn(message, data, userId);
Meteor.log.trace(message, data, userId);
Meteor.log._(message, data, userId); //--> Shortcut for logging without message, e.g.: simple plain log
```

##### Activate and set adapter settings [`Server` & `Client`]
```javascript
Meteor.log.rule('Console', 
{
  enable: true,
  filter: ['ERROR', 'FATAL', 'WARN'], /* Filters: 'ERROR', 'FATAL', 'WARN', 'DEBUG', 'INFO', '*' */
  client: true,  /* Output logs on both Server's and Client's console */
  server: true   /* Calls from Client and Server will be executed on Server */
});
```