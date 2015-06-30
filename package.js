Package.describe({
  name: 'ostrio:loggerconsole',
  version: '1.0.0',
  summary: 'Simply output Client application logs into Server\'s console within ostrio:logger package',
  git: 'https://github.com/VeliovGroup/Meteor-logger-console',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.use(['ostrio:logger@1.0.0', 'coffeescript'], ['client', 'server']);
  api.addFiles('loggerconsole.coffee', ['client', 'server']);
});

Npm.depends({
  'console-debug': '0.1.7'
});