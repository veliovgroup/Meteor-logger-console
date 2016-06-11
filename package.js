Package.describe({
  name: 'ostrio:loggerconsole',
  version: '1.2.0',
  summary: 'Logging: Print Client\'s logs to Server\'s console, messages colorized for better readability',
  git: 'https://github.com/VeliovGroup/Meteor-logger-console',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['ostrio:logger@1.1.2', 'coffeescript', 'check', 'underscore'], ['client', 'server']);
  api.addFiles('loggerconsole.coffee', ['client', 'server']);
  api.export('LoggerConsole');
});