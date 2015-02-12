if Meteor.isServer
  ###
  @url https://bitbucket.org/michaeldegroot/console-debug
  ###
  Debug = Npm.require 'console-debug'

  cons = new Debug
    uncaughtExceptionCatch: false
    consoleFilter: []
    logToFile: false
    logFilter: []
    colors: true
else
  cons = console

Meteor.log.add "Console", (level, message, data = null, userId) =>
  data = null if data is undefined or data is "undefined" or !data
  data = JSON.stringify(Meteor.log.antiCircular(data)) if data
    
  time = new Date()

  obj = 
    time: time
    level: level
    message: message
    userId: userId
    additional: data

  switch level
    when "FATAL" or "ERROR"
      cons.error obj

    when "INFO"
      cons.info obj

    when "WARN"
      cons.warn obj

    when "DEBUG"
      cons.debug obj

    else
      cons.log obj