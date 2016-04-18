Package.describe({
  name: 'ostrio:loggerconsole',
  version: '1.1.0',
  summary: 'Logging: Output client\'s console logs to server\'s console',
  git: 'https://github.com/VeliovGroup/Meteor-logger-console',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['ostrio:logger@1.1.0', 'coffeescript'], ['client', 'server']);
  api.addFiles('loggerconsole.coffee', ['client', 'server']);
  api.export('LoggerConsole');
});