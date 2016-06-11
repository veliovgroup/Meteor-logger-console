this.log = new Logger();
(new LoggerConsole(log, {
  format: function (opts) {
    return ((Meteor.isServer) ? '[SERVER]' : "[CLIENT]") + ' [' + opts.level + '] - ' + opts.message;
  }
})).enable();

Meteor.startup(function () {
  log.info('Some info string ', {test: 'Info Data'});
  log.info('(no data object) Some info string ');
  log.debug('Some debug string ', {test: 'Debug Data'});
  log.debug('(no data object) Some debug string ');
  log.error('Some error string ', {test: 'Error Data'});
  log.error('(no data object) Some error string ');
  log.fatal('Some fatal string ', {test: 'Fatal Data'});
  log.fatal('(no data object) Some fatal string');
  log.warn('Some warn string ', {test: 'Warn Data'});
  log.warn('(no data object) Some warn string ');
  log.trace('Some trace string ', {test: 'Trace Data'});
  log.trace('(no data object) Some trace string ');
  log._('_ ', {test: '_'});
  log._('(no data object) _ ');
});