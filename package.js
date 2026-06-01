Package.describe({
  name: 'ostrio:loggerconsole',
  version: '2.2.1',
  summary: 'Logging: Print Client\'s logs to Server\'s console, messages colorized for better readability',
  git: 'https://github.com/veliovgroup/Meteor-logger-console',
  documentation: 'README.md'
});

Package.onUse((api) => {
  api.versionsFrom(['2.14', '2.15', '2.16', '3.2', '3.3.1', '3.4']);
  api.use(['ecmascript', 'check', 'ostrio:logger@2.2.0'], ['client', 'server']);
  api.mainModule('loggerconsole.js', ['client', 'server']);
});

Package.onTest((api) => {
  api.use('tinytest');
  api.use(['ecmascript', 'ostrio:logger', 'ostrio:loggerconsole']);
  api.addFiles('loggerconsole-tests.js');
});
