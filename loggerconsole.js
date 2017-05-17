import { _ }            from 'meteor/underscore';
import { Meteor }       from 'meteor/meteor';
import { Logger }       from 'meteor/ostrio:logger';
import { check, Match } from 'meteor/check';

/*
 * @class LoggerConsole
 * @summary Colorful console adapter for ostrio:logger (Logger)
 */
class LoggerConsole {
  constructor(logger, settings = {}) {
    check(logger, Match.OneOf(Logger, Object));
    check(settings, Match.Optional(Object));

    this.logger   = logger;
    this.settings = settings;

    if (Meteor.isServer) {
      /* @url https://github.com/euforic/coloring/blob/master/lib/index.js */
      const styles = {
        'bold': ['1', '22'],
        'white': ['37', '39'],
        'blue': ['34', '39'],
        'cyan': ['36', '39'],
        'magenta': ['35', '39'],
        'red': ['31', '39'],
        'yellow': ['33', '39']
      };

      const colorize = (style, text) => {
        const textArr = text.split(/\r|\n/g);
        let message = '';
        for (let i = 0; i < textArr.length; i++) {
          if (textArr[i] && textArr[i].length) {
            message += '\x1B[' + styles[style][0] + 'm' + textArr[i] + '\x1B[' + styles[style][1] + 'm \r\n';
          }
        }
        return message;
      };

      this.cons = {
        error(obj, message) {
          if (obj.level === 'FATAL') {
            process.stdout.write(colorize('red', colorize('bold', message)) + '\r\n');
          } else {
            process.stdout.write(colorize('red', message) + '\r\n');
          }
        },
        info(obj, message) {
          process.stdout.write(colorize('cyan', message) + '\r\n');
        },
        warn(obj, message) {
          process.stdout.write(colorize('magenta', message) + '\r\n');
        },
        debug(obj, message) {
          process.stdout.write(colorize('white', colorize('bold', message)) + '\r\n');
        },
        trace(obj, message) {
          process.stdout.write(colorize('blue', message) + '\r\n');
        },
        log(obj, message) {
          process.stdout.write(colorize('bold', message) + '\r\n');
        }
      };
    } else {
      this.cons = {
        error(obj, message) {
          let style = '';
          if (obj.level === 'FATAL') {
            style = 'color:#fb3120;font-weight:bold';
          } else {
            style = 'color:#fb3120';
          }

          if (_.isFunction(console.error)) {
            console.error(message, style, obj.data);
          } else {
            console.log(message, style, obj.data);
          }
        },
        info(obj, message) {
          if (_.isFunction(console.info)) {
            console.info(message, 'color:#34b1bf', obj.data);
          } else {
            console.log(message, 'color:#34b1bf', obj.data);
          }
        },
        warn(obj, message) {
          if (_.isFunction(console.warn)) {
            console.warn(message, 'color:#d025d1', obj.data);
          } else {
            console.log(message, 'color:#d025d1', obj.data);
          }
        },
        debug(obj, message) {
          if (_.isFunction(console.debug)) {
            console.debug(message, 'color:white;font-weight:bold;background-color:#000', obj.data);
          } else {
            console.log(message, 'color:white;font-weight:bold;background-color:#000', obj.data);
          }
        },
        trace(obj, message) {
          if (_.isFunction(console.trace)) {
            console.trace(message, 'color:#501de9', obj.data);
          } else {
            console.log(message, 'color:#501de9', obj.data);
          }
        },
        log(obj, message) {
          console.log(message, 'font-weight:bold', obj.data);
        }
      };
    }

    this.logger.add('Console', (level, message, data = {}, userId) => {
      const time = new Date();

      const obj = {
        time: time,
        level: level,
        message: message
      };

      if (data && Meteor.isServer) {
        data = this.logger.antiCircular(data);
      }

      if (_.isString(data.stackTrace)) {
        data.stackTrace = data.stackTrace.split(/\n|\\n|\r|\r\n/g);
      }

      if (data) {
        obj.data = data;
      }

      if (userId) {
        obj.userId = userId;
      }

      let _message = '';
      if (this.settings.format) {
        _message = this.settings.format(obj);
        check(_message, String);

        if (!Meteor.isServer) {
          _message = '%c' + _message + '';
        }
      } else {
        if (Meteor.isServer) {
          _message = '[' + obj.level + ': ' + obj.message + ' @ ' + obj.time + '] ' + '\r\n';
          if (obj.data && !_.isEmpty(obj.data)) {
            _message += JSON.stringify(obj.data, false, 2) + '\r\n';
          }
        } else {
          _message = '%c[' + obj.level + ': ' + obj.message + ']';
        }
      }

      switch (level) {
      case 'FATAL':
        this.cons.error(obj, _message);
        break;
      case 'ERROR':
        this.cons.error(obj, _message);
        break;
      case 'INFO':
        this.cons.info(obj, _message);
        break;
      case 'WARN':
        this.cons.warn(obj, _message);
        break;
      case 'DEBUG':
        this.cons.debug(obj, _message);
        break;
      case 'TRACE':
        this.cons.trace(obj, _message);
        break;
      default:
        this.cons.log(obj, _message);
      }
    }, false, false);
  }

  enable(rule = {}) {
    check(rule, {
      enable: Match.Optional(Boolean),
      client: Match.Optional(Boolean),
      server: Match.Optional(Boolean),
      filter: Match.Optional([String])
    });

    if (rule.enable == null) {
      rule.enable = true;
    }

    if (rule.client == null) {
      rule.client = true;
    }

    if (rule.server == null) {
      rule.server = true;
    }

    this.logger.rule('Console', rule);
    return this;
  }
}

export { LoggerConsole };
