Package.describe({
  name: 'ostrio:loggerconsole',
  version: '2.0.3',
  summary: 'Logging: Print Client\'s logs to Server\'s console, messages colorized for better readability',
  git: 'https://github.com/VeliovGroup/Meteor-logger-console',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.4');
  api.use(['ecmascript', 'check', 'underscore', 'ostrio:logger@2.0.5'], ['client', 'server']);
  api.mainModule('loggerconsole.js', ['client', 'server']);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use(['ecmascript', 'underscore', 'ostrio:logger@2.0.5', 'ostrio:loggerconsole@2.0.3']);
  api.addFiles('loggerconsole-tests.js');
});
