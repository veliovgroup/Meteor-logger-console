class LoggerConsole
  constructor: (@logger) ->
    check @logger, Match.OneOf Logger, Object

    self = @
    if Meteor.isServer
      ###
      @url https://github.com/euforic/coloring/blob/master/lib/index.js
      ###
      styles =
        'bold': [
          '1'
          '22'
        ]
        'white': [
          '37'
          '39'
        ]
        'blue': [
          '34'
          '39'
        ]
        'cyan': [
          '36'
          '39'
        ]
        'magenta': [
          '35'
          '39'
        ]
        'red': [
          '31'
          '39'
        ]
        'yellow': [
          '33'
          '39'
        ]

      colorize = (style, text) ->
        open  = '\x1B[' + styles[style][0] + 'm '
        close = '\x1B[' + styles[style][1] + 'm '
        return open + text + close

      self.cons = 
        error: (obj) ->
          if obj.level is 'FATAL'
            process.stdout.write colorize('red', colorize('bold', '[' + obj.level + ': ' + obj.message + ' @ ' + obj.time + '] ')) + '\r\n' + JSON.stringify(obj.data, false, 2) + '\r\n'
          else
            process.stdout.write colorize('red', '[' + obj.level + ': ' + obj.message + ' @ ' + obj.time + '] ') + '\r\n' + JSON.stringify(obj.data, false, 2) + '\r\n'
        info: (obj) -> process.stdout.write colorize('cyan', '[' + obj.level + ': ' + obj.message + ' @ ' + obj.time + '] ') + '\r\n' + JSON.stringify(obj.data, false, 2) + '\r\n'
        warn: (obj) -> process.stdout.write colorize('magenta', '[' + obj.level + ': ' + obj.message + ' @ ' + obj.time + '] ') + '\r\n' + JSON.stringify(obj.data, false, 2) + '\r\n'
        debug: (obj) -> process.stdout.write colorize('white', colorize('bold', '[' + obj.level + ': ' + obj.message + ' @ ' + obj.time + '] ')) + '\r\n' + JSON.stringify(obj.data, false, 2) + '\r\n'
        trace: (obj) -> process.stdout.write colorize('blue', '[' + obj.level + ': ' + obj.message + ' @ ' + obj.time + '] ') + '\r\n' + JSON.stringify(obj.data, false, 2) + '\r\n'
        log: (obj) -> process.stdout.write colorize('bold', '[' + obj.level + ': ' + obj.message + ' @ ' + obj.time + '] ') + '\r\n' + JSON.stringify(obj.data, false, 2) + '\r\n'
    else
      self.cons = 
        error: (obj) ->
          if obj.level is 'FATAL'
            style = 'color:#fb3120;font-weight:bold'
          else
            style = 'color:#fb3120'
          if _.isFunction console.error
            console.error '%c[' + obj.level + ': ' + obj.message + ']', style, obj.data
          else
            console.log '%c[' + obj.level + ': ' + obj.message + ']', style, obj.data
        info: (obj) -> 
          if _.isFunction console.info
            console.info '%c[' + obj.level + ': ' + obj.message + ']', 'color:#34b1bf', obj.data
          else
            console.log '%c[' + obj.level + ': ' + obj.message + ']', 'color:#34b1bf', obj.data
        warn: (obj) -> 
          if _.isFunction console.warn
            console.warn '%c[' + obj.level + ': ' + obj.message + ']', 'color:#d025d1', obj.data
          else
            console.log '%c[' + obj.level + ': ' + obj.message + ']', 'color:#d025d1', obj.data
        debug: (obj) -> 
          if _.isFunction console.debug
            console.debug '%c[' + obj.level + ': ' + obj.message + ']', 'color:white;font-weight:bold;background-color:#000', obj.data
          else
            console.log '%c[' + obj.level + ': ' + obj.message + ']', 'color:white;font-weight:bold;background-color:#000', obj.data
        trace: (obj) ->
          if _.isFunction console.trace
            console.trace '%c[' + obj.level + ': ' + obj.message + ']', 'color:#501de9', obj.data
          else
            console.log '%c[' + obj.level + ': ' + obj.message + ']', 'color:#501de9', obj.data
        log: (obj) -> console.log '%c[' + obj.level + ': ' + obj.message + ']', 'font-weight:bold', obj.data

    self.logger.add 'Console', (level, message, data = {}, userId) ->
      time = new Date()

      obj = 
        time: time
        level: level
        message: message

      if data and Meteor.isServer
        data = self.logger.antiCircular data
      if _.isString data.stackTrace
        data.stackTrace = data.stackTrace.split /\n|\\n|\r|\r\n/g

      obj.data =
        data: data
        userId: userId

      switch level
        when 'FATAL' then self.cons.error obj
        when 'ERROR' then self.cons.error obj
        when 'INFO'  then self.cons.info  obj
        when 'WARN'  then self.cons.warn  obj
        when 'DEBUG' then self.cons.debug obj
        when 'TRACE' then self.cons.trace obj
        else self.cons.log obj

  enable: (rule = {}) ->
    check rule, Object
    rule.enable ?= true
    rule.client ?= true
    rule.server ?= true
    @logger.rule 'Console', rule
    return @