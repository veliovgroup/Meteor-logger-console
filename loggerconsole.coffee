###
@class LoggerConsole
@summary Colorful console adapter for ostrio:logger (Logger)
###
class LoggerConsole
  constructor: (@logger, @settings = {}) ->
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
        error: (obj, message) ->
          if obj.level is 'FATAL'
            process.stdout.write colorize('red', colorize('bold', message)) + '\r\n'
            if obj.data and not _.isEmpty obj.data
              process.stdout.write JSON.stringify(obj.data, false, 2) + '\r\n'
          else
            process.stdout.write colorize('red', message) + '\r\n'
            if obj.data and not _.isEmpty obj.data
              process.stdout.write JSON.stringify(obj.data, false, 2) + '\r\n'
          return
        info: (obj, message) ->
          process.stdout.write colorize('cyan', message) + '\r\n'
          if obj.data and not _.isEmpty obj.data
            process.stdout.write JSON.stringify(obj.data, false, 2) + '\r\n'
          return
        warn: (obj, message) -> 
          process.stdout.write colorize('magenta', message) + '\r\n'
          if obj.data and not _.isEmpty obj.data
            process.stdout.write JSON.stringify(obj.data, false, 2) + '\r\n'
          return
        debug: (obj, message) ->
          process.stdout.write colorize('white', colorize('bold', message)) + '\r\n'
          if obj.data and not _.isEmpty obj.data
            process.stdout.write JSON.stringify(obj.data, false, 2) + '\r\n'
          return
        trace: (obj, message) ->
          process.stdout.write colorize('blue', message) + '\r\n'
          if obj.data and not _.isEmpty obj.data
            process.stdout.write JSON.stringify(obj.data, false, 2) + '\r\n'
          return
        log: (obj, message) ->
          process.stdout.write colorize('bold', message) + '\r\n'
          if obj.data and not _.isEmpty obj.data
            process.stdout.write JSON.stringify(obj.data, false, 2) + '\r\n'
          return
    else
      self.cons =
        error: (obj, message) ->
          if obj.level is 'FATAL'
            style = 'color:#fb3120;font-weight:bold'
          else
            style = 'color:#fb3120'
          if _.isFunction console.error
            console.error message, style, obj.data
          else
            console.log message, style, obj.data
          return
        info: (obj, message) ->
          if _.isFunction console.info
            console.info message, 'color:#34b1bf', obj.data
          else
            console.log message, 'color:#34b1bf', obj.data
          return
        warn: (obj, message) ->
          if _.isFunction console.warn
            console.warn message, 'color:#d025d1', obj.data
          else
            console.log message, 'color:#d025d1', obj.data
          return
        debug: (obj, message) ->
          if _.isFunction console.debug
            console.debug message, 'color:white;font-weight:bold;background-color:#000', obj.data
          else
            console.log message, 'color:white;font-weight:bold;background-color:#000', obj.data
          return
        trace: (obj, message) ->
          if _.isFunction console.trace
            console.trace message, 'color:#501de9', obj.data
          else
            console.log message, 'color:#501de9', obj.data
          return
        log: (obj, message) ->
          console.log message, 'font-weight:bold', obj.data
          return

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

      obj.data   = data   if data
      obj.userId = userId if userId

      if self.settings.format
        _message = self.settings.format obj
        check _message, String

        if Meteor.isServer
          message = _message
        else
          message = '%c' + _message + ''
      else
        if Meteor.isServer
          message = '[' + obj.level + ': ' + obj.message + ' @ ' + obj.time + '] '
        else
          message = '%c[' + obj.level + ': ' + obj.message + ']'

      switch level
        when 'FATAL' then self.cons.error obj, message
        when 'ERROR' then self.cons.error obj, message
        when 'INFO'  then self.cons.info  obj, message
        when 'WARN'  then self.cons.warn  obj, message
        when 'DEBUG' then self.cons.debug obj, message
        when 'TRACE' then self.cons.trace obj, message
        else self.cons.log obj, message
      return

  enable: (rule = {}) ->
    check rule, {
      enable: Match.Optional Boolean
      client: Match.Optional Boolean
      server: Match.Optional Boolean
      filter: Match.Optional [String]
    }

    rule.enable ?= true
    rule.client ?= true
    rule.server ?= true

    @logger.rule 'Console', rule
    return @