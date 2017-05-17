import { _ }                     from 'meteor/underscore';
import { Meteor }                from 'meteor/meteor';
import { LoggerConsole }         from 'meteor/ostrio:loggerconsole';
import { Logger, LoggerMessage } from 'meteor/ostrio:logger';

const log1 = new Logger();
(new LoggerConsole(log1, {
  format: function (opts) {
    return ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + ' [' + opts.level + '] - ' + opts.message;
  }
})).enable();

log1.info('From: ' + ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + 'Some info string ', {test: 'Info Data'});
log1.info('From: ' + ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + '(no data object) Some info string ');
log1.debug('From: ' + ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + 'Some debug string ', {test: 'Debug Data'});
log1.debug('From: ' + ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + '(no data object) Some debug string ');
log1.error('From: ' + ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + 'Some error string ', {test: 'Error Data'});
log1.error('From: ' + ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + '(no data object) Some error string ');
log1.fatal('From: ' + ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + 'Some fatal string ', {test: 'Fatal Data'});
log1.fatal('From: ' + ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + '(no data object) Some fatal string');
log1.warn('From: ' + ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + 'Some warn string ', {test: 'Warn Data'});
log1.warn('From: ' + ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + '(no data object) Some warn string ');
log1.trace('From: ' + ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + 'Some trace string ', {test: 'Trace Data'});
log1.trace('From: ' + ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + '(no data object) Some trace string ');
log1._('From: ' + ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + '_ ', {test: '_'});
log1._('From: ' + ((Meteor.isServer) ? '[SERVER]' : '[CLIENT] ') + '(no data object) _ ');

const log = new Logger();
(new LoggerConsole(log)).enable();

Tinytest.addAsync('LoggerMessage Instance', (test, done) => {
  test.instanceOf(log.info('This is message "info"', {data: 'Sample data "info"'}, 'userId "info"'), LoggerMessage);
  test.instanceOf(log.debug('This is message "debug"', {data: 'Sample data "debug"'}, 'userId "debug"'), LoggerMessage);
  test.instanceOf(log.error('This is message "error"', {data: 'Sample data "error"'}, 'userId "error"'), LoggerMessage);
  test.instanceOf(log.fatal('This is message "fatal"', {data: 'Sample data "fatal"'}, 'userId "fatal"'), LoggerMessage);
  test.instanceOf(log.warn('This is message "warn"', {data: 'Sample data "warn"'}, 'userId "warn"'), LoggerMessage);
  test.instanceOf(log.trace('This is message "trace"', {data: 'Sample data "trace"'}, 'userId "trace"'), LoggerMessage);
  test.instanceOf(log._('This is message "_"', {data: 'Sample data "_"'}, 'userId "_"'), LoggerMessage);

  done();
});

Tinytest.addAsync('LoggerMessage#toString', (test, done) => {
  test.equal(log.info('This is message "info"', {data: 'Sample data "info"'}, 'userId "info"').toString(), '[This is message "info"] \r\nLevel: INFO; \r\nDetails: {"data":"Sample data \\"info\\""}; \r\nUserId: userId "info";');
  test.equal(log.debug('This is message "debug"', {data: 'Sample data "debug"'}, 'userId "debug"').toString(), '[This is message "debug"] \r\nLevel: DEBUG; \r\nDetails: {"data":"Sample data \\"debug\\""}; \r\nUserId: userId "debug";');
  test.equal(log.error('This is message "error"', {data: 'Sample data "error"'}, 'userId "error"').toString(), '[This is message "error"] \r\nLevel: ERROR; \r\nDetails: {"data":"Sample data \\"error\\""}; \r\nUserId: userId "error";');
  test.equal(log.fatal('This is message "fatal"', {data: 'Sample data "fatal"'}, 'userId "fatal"').toString(), '[This is message "fatal"] \r\nLevel: FATAL; \r\nDetails: {"data":"Sample data \\"fatal\\""}; \r\nUserId: userId "fatal";');
  test.equal(log.warn('This is message "warn"', {data: 'Sample data "warn"'}, 'userId "warn"').toString(), '[This is message "warn"] \r\nLevel: WARN; \r\nDetails: {"data":"Sample data \\"warn\\""}; \r\nUserId: userId "warn";');
  test.equal(log._('This is message "_"', {data: 'Sample data "_"'}, 'userId "_"').toString(), '[This is message "_"] \r\nLevel: LOG; \r\nDetails: {"data":"Sample data \\"_\\""}; \r\nUserId: userId "_";');

  done();
});

Tinytest.addAsync('Throw', (test, done) => {
  try {
    throw log.fatal('This is message "fatal"', {data: 'Sample data "fatal"'}, 'userId "fatal"');
  } catch (e) {
    test.instanceOf(e, LoggerMessage);
    test.equal(e.level, 'FATAL');
    test.equal(e.toString(), '[This is message "fatal"] \r\nLevel: FATAL; \r\nDetails: {"data":"Sample data \\"fatal\\""}; \r\nUserId: userId "fatal";');
  }

  done();
});

Tinytest.addAsync('Log a Number', (test, done) => {
  test.instanceOf(log.info(10, {data: 10}, 10), LoggerMessage);
  test.instanceOf(log.debug(20, {data: 20}, 20), LoggerMessage);
  test.instanceOf(log.error(30, {data: 30}, 30), LoggerMessage);
  test.instanceOf(log.fatal(40, {data: 40}, 40), LoggerMessage);
  test.instanceOf(log.warn(50, {data: 50}, 50), LoggerMessage);
  test.instanceOf(log.trace(60, {data: 60}, 60), LoggerMessage);
  test.instanceOf(log._(70, {data: 70}, 70), LoggerMessage);

  done();
});

Tinytest.addAsync('Trace', (test, done) => {
  if (Meteor.isServer) {
    test.isTrue(_.has(log.trace(602, {data: 602}, 602).details, 'stackTrace'));
    test.isTrue(_.has(log.trace(602, {data: 602}, 602).data, 'stackTrace'));
  } else {
    test.isTrue(true);
  }

  done();
});
