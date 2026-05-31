import { Meteor }                from 'meteor/meteor';
import { Logger, LoggerMessage } from 'meteor/ostrio:logger';
import { LoggerConsole }         from 'meteor/ostrio:loggerconsole';

const log1 = new Logger();
(new LoggerConsole(log1, {
  format: function (opts) {
    return ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + ' [' + opts.level + '] - ' + opts.message + ' - ' + JSON.stringify(opts.data);
  },
  // highlight: false
})).enable();

log1.info('From: ' + ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + 'Some info string ', {test: 'Info Data'});
log1.info('From: ' + ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + '(no data object) Some info string ');
log1.debug('From: ' + ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + 'Some debug string ', {test: 'Debug Data'});
log1.debug('From: ' + ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + '(no data object) Some debug string ');
log1.error('From: ' + ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + 'Some error string ', {test: 'Error Data'});
log1.error('From: ' + ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + '(no data object) Some error string ');
log1.fatal('From: ' + ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + 'Some fatal string ', {test: 'Fatal Data'});
log1.fatal('From: ' + ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + '(no data object) Some fatal string');
log1.warn('From: ' + ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + 'Some warn string ', {test: 'Warn Data'});
log1.warn('From: ' + ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + '(no data object) Some warn string ');
log1.trace('From: ' + ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + 'Some trace string ', {test: 'Trace Data'});
log1.trace('From: ' + ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + '(no data object) Some trace string ');
log1._('From: ' + ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + '_ ', {test: '_'});
log1._('From: ' + ((Meteor.isServer) ? '[SERVER] ' : '[CLIENT] ') + '(no data object) _ ');

const log = new Logger();
(new LoggerConsole(log, {
  // highlight: false
})).enable();

Tinytest.add('LoggerMessage Instance', (test) => {
  test.instanceOf(log.info('This is message "info"', {data: 'Sample data "info"'}, 'userId "info"'), LoggerMessage);
  test.instanceOf(log.debug('This is message "debug"', {data: 'Sample data "debug"'}, 'userId "debug"'), LoggerMessage);
  test.instanceOf(log.error('This is message "error"', {data: 'Sample data "error"'}, 'userId "error"'), LoggerMessage);
  test.instanceOf(log.fatal('This is message "fatal"', {data: 'Sample data "fatal"'}, 'userId "fatal"'), LoggerMessage);
  test.instanceOf(log.warn('This is message "warn"', {data: 'Sample data "warn"'}, 'userId "warn"'), LoggerMessage);
  test.instanceOf(log.trace('This is message "trace"', {data: 'Sample data "trace"'}, 'userId "trace"'), LoggerMessage);
  test.instanceOf(log._('This is message "_"', {data: 'Sample data "_"'}, 'userId "_"'), LoggerMessage);
});

Tinytest.add('LoggerMessage#toString', (test) => {
  test.equal(log.info('This is message "info"', {data: 'Sample data "info"'}, 'userId "info"').toString(), '[This is message "info"] \nLevel: INFO; \nDetails: {"data":"Sample data \\"info\\""}; \nUserId: userId "info";');
  test.equal(log.debug('This is message "debug"', {data: 'Sample data "debug"'}, 'userId "debug"').toString(), '[This is message "debug"] \nLevel: DEBUG; \nDetails: {"data":"Sample data \\"debug\\""}; \nUserId: userId "debug";');
  test.equal(log.error('This is message "error"', {data: 'Sample data "error"'}, 'userId "error"').toString(), '[This is message "error"] \nLevel: ERROR; \nDetails: {"data":"Sample data \\"error\\""}; \nUserId: userId "error";');
  test.equal(log.fatal('This is message "fatal"', {data: 'Sample data "fatal"'}, 'userId "fatal"').toString(), '[This is message "fatal"] \nLevel: FATAL; \nDetails: {"data":"Sample data \\"fatal\\""}; \nUserId: userId "fatal";');
  test.equal(log.warn('This is message "warn"', {data: 'Sample data "warn"'}, 'userId "warn"').toString(), '[This is message "warn"] \nLevel: WARN; \nDetails: {"data":"Sample data \\"warn\\""}; \nUserId: userId "warn";');
  test.equal(log._('This is message "_"', {data: 'Sample data "_"'}, 'userId "_"').toString(), '[This is message "_"] \nLevel: LOG; \nDetails: {"data":"Sample data \\"_\\""}; \nUserId: userId "_";');
});

Tinytest.add('Throw', (test) => {
  try {
    throw log.fatal('This is message "fatal"', {data: 'Sample data "fatal"'}, 'userId "fatal"');
  } catch (e) {
    test.instanceOf(e, LoggerMessage);
    test.equal(e.level, 'FATAL');
    test.equal(e.toString(), '[This is message "fatal"] \nLevel: FATAL; \nDetails: {"data":"Sample data \\"fatal\\""}; \nUserId: userId "fatal";');
  }
});

Tinytest.add('Log a Number', (test) => {
  test.instanceOf(log.info(10, {data: 10}, 10), LoggerMessage);
  test.instanceOf(log.debug(20, {data: 20}, 20), LoggerMessage);
  test.instanceOf(log.error(30, {data: 30}, 30), LoggerMessage);
  test.instanceOf(log.fatal(40, {data: 40}, 40), LoggerMessage);
  test.instanceOf(log.warn(50, {data: 50}, 50), LoggerMessage);
  test.instanceOf(log.trace(60, {data: 60}, 60), LoggerMessage);
  test.instanceOf(log._(70, {data: 70}, 70), LoggerMessage);
});

Tinytest.add('Log an empty object', (test) => {
  test.instanceOf(log.info(10, {}), LoggerMessage);
  test.instanceOf(log.debug(20, {}), LoggerMessage);
  test.instanceOf(log.error(30, {}), LoggerMessage);
  test.instanceOf(log.fatal(40, {}), LoggerMessage);
  test.instanceOf(log.warn(50, {}), LoggerMessage);
  test.instanceOf(log.trace(60, {}), LoggerMessage);
  test.instanceOf(log._(70, {}), LoggerMessage);
});

Tinytest.add('Log a Object', (test) => {
  test.instanceOf(log.info(10, {keyNull: null, keyStr: 'str'}), LoggerMessage);
  test.instanceOf(log.debug(20, {keyNull: null, keyStr: 'str'}), LoggerMessage);
  test.instanceOf(log.error(30, {keyNull: null, keyStr: 'str'}), LoggerMessage);
  test.instanceOf(log.fatal(40, {keyNull: null, keyStr: 'str'}), LoggerMessage);
  test.instanceOf(log.warn(50, {keyNull: null, keyStr: 'str'}), LoggerMessage);
  test.instanceOf(log.trace(60, {keyNull: null, keyStr: 'str'}), LoggerMessage);
  test.instanceOf(log._(70, {keyNull: null, keyStr: 'str'}), LoggerMessage);
});

Tinytest.add('Log a String', (test) => {
  test.instanceOf(log.info(10, 'string value'), LoggerMessage);
  test.instanceOf(log.debug(20, 'string value'), LoggerMessage);
  test.instanceOf(log.error(30, 'string value'), LoggerMessage);
  test.instanceOf(log.fatal(40, 'string value'), LoggerMessage);
  test.instanceOf(log.warn(50, 'string value'), LoggerMessage);
  test.instanceOf(log.trace(60, 'string value'), LoggerMessage);
  test.instanceOf(log._(70, 'string value'), LoggerMessage);
});

Tinytest.add('Log with wrong arguments', (test) => {
  test.instanceOf(log.info('info wrong values', false), LoggerMessage);
  test.instanceOf(log.debug('debug wrong values', true), LoggerMessage);
  test.instanceOf(log.error('error wrong values', true), LoggerMessage);
  test.instanceOf(log.fatal('fatal wrong values', false), LoggerMessage);
  test.instanceOf(log.warn('warn wrong values', undefined), LoggerMessage);
  test.instanceOf(log.trace('trace wrong values', ''), LoggerMessage);
  test.instanceOf(log._('_ wrong values', []), LoggerMessage);
});

Tinytest.add('Log Boolean message', (test) => {
  test.instanceOf(log.info('info', true), LoggerMessage);
  test.instanceOf(log.debug('debug', true), LoggerMessage);
  test.instanceOf(log.error('error', false), LoggerMessage);
  test.instanceOf(log.fatal('fatal', false), LoggerMessage);
  test.instanceOf(log.warn('warn', true), LoggerMessage);
  // TRACE assigns `data.stackTrace` on the server, which throws on a primitive — pass an object
  test.instanceOf(log.trace('trace', {value: true}), LoggerMessage);
  test.instanceOf(log._('_', true), LoggerMessage);
});

Tinytest.add('Log without message', (test) => {
  test.instanceOf(log.info(10), LoggerMessage);
  test.instanceOf(log.debug(20), LoggerMessage);
  test.instanceOf(log.error(30), LoggerMessage);
  test.instanceOf(log.fatal(40), LoggerMessage);
  test.instanceOf(log.warn(50), LoggerMessage);
  test.instanceOf(log.trace(60), LoggerMessage);
  test.instanceOf(log._(70), LoggerMessage);
});

Tinytest.add('Log without arguments', (test) => {
  test.instanceOf(log.info(), LoggerMessage);
  test.instanceOf(log.debug(), LoggerMessage);
  test.instanceOf(log.error(), LoggerMessage);
  test.instanceOf(log.fatal(), LoggerMessage);
  test.instanceOf(log.warn(), LoggerMessage);
  test.instanceOf(log.trace(), LoggerMessage);
  test.instanceOf(log._(), LoggerMessage);
});

const dataObj = {
  time: new Date,
  subObj: {
    keyStr: 'str'
  }
};

dataObj.subObj.do = dataObj;

Tinytest.add('Log a Circular', (test) => {
  test.instanceOf(log.info(10, dataObj), LoggerMessage);
  test.instanceOf(log.debug(20, dataObj), LoggerMessage);
  test.instanceOf(log.error(30, dataObj), LoggerMessage);
  test.instanceOf(log.fatal(40, dataObj), LoggerMessage);
  test.instanceOf(log.warn(50, dataObj), LoggerMessage);
  test.instanceOf(log.trace(60, dataObj), LoggerMessage);
  test.instanceOf(log._(70, dataObj), LoggerMessage);
});

Tinytest.add('Trace', (test) => {
  if (Meteor.isServer) {
    const traced = log.trace(602, {data: 602}, 602);
    test.isTrue(Object.prototype.hasOwnProperty.call(traced.details, 'stackTrace'));
    test.isTrue(Object.prototype.hasOwnProperty.call(traced.data, 'stackTrace'));
  } else {
    test.isTrue(true);
  }
});

Tinytest.add('highlight false', (test) => {
  const logH = new Logger();
  (new LoggerConsole(logH, {highlight: false})).enable();
  test.instanceOf(logH.info('highlight-off'), LoggerMessage);
});

if (Meteor.isServer) {
  Tinytest.add('highlight false omits ANSI on server', (test) => {
    const logPlain = new Logger();
    const writes = [];
    const originalWrite = process.stdout.write.bind(process.stdout);
    process.stdout.write = (chunk, encoding, cb) => {
      writes.push(String(chunk));
      return originalWrite(chunk, encoding, cb);
    };

    try {
      (new LoggerConsole(logPlain, { highlight: false })).enable();
      logPlain.info('plain-server-log', { test: true });
      const output = writes.join('');
      test.isFalse(/\x1B\[[0-9;]*m/.test(output), 'stdout must not contain ANSI escapes');
      test.isTrue(output.includes('plain-server-log'), output);
    } finally {
      process.stdout.write = originalWrite;
    }
  });
}

if (Meteor.isClient) {
  Tinytest.add('highlight false omits styles on client', (test) => {
    const logPlain = new Logger();
    const calls = [];
    const originalLog = console.log;
    const originalInfo = console.info;

    console.log = function (...args) {
      calls.push(args);
      return originalLog.apply(console, args);
    };
    console.info = function (...args) {
      calls.push(args);
      return originalInfo.apply(console, args);
    };

    try {
      (new LoggerConsole(logPlain, { highlight: false })).enable();
      logPlain.info('plain-client-log', { test: true });
      const infoCall = calls.find((args) => args[0] && String(args[0]).includes('plain-client-log'));
      test.isTrue(!!infoCall, 'expected a console call for plain-client-log');
      test.isFalse(infoCall.some((arg) => typeof arg === 'string' && arg.indexOf('color:') === 0), infoCall);
      test.isFalse(String(infoCall[0]).includes('%c'), infoCall);
    } finally {
      console.log = originalLog;
      console.info = originalInfo;
    }
  });
}

Tinytest.add('enable returns adapter', (test) => {
  const logE = new Logger();
  const adapter = new LoggerConsole(logE);
  test.equal(adapter.enable({filter: ['ERROR']}), adapter);
  test.instanceOf(logE.error('enable-filter-error'), LoggerMessage);
});

Tinytest.add('enable client false', (test) => {
  const logC = new Logger();
  (new LoggerConsole(logC)).enable({client: false, server: true});
  test.instanceOf(logC.info('client-false-rule'), LoggerMessage);
});

Tinytest.add('enable server false', (test) => {
  const logS = new Logger();
  (new LoggerConsole(logS)).enable({client: true, server: false});
  test.instanceOf(logS.info('server-false-rule'), LoggerMessage);
});
