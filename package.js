Package.describe({
  name: 'ostrio:loggerconsole',
  version: '2.1.0',
  summary: 'Logging: Print Client\'s logs to Server\'s console, messages colorized for better readability',
  git: 'https://github.com/veliovgroup/Meteor-logger-console',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom('1.4');
  api.use(['ecmascript', 'check', 'ostrio:logger@2.1.1'], ['client', 'server']);
  api.mainModule('loggerconsole.js', ['client', 'server']);
});

Package.onTest((api) => {
  api.use('tinytest');
  api.use(['ecmascript', 'underscore', 'ostrio:logger', 'ostrio:loggerconsole']);
  api.addFiles('loggerconsole-tests.js');
});
