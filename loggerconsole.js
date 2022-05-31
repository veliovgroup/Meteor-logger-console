import { Meteor } from 'meteor/meteor';
import { Logger } from 'meteor/ostrio:logger';
import { check, Match } from 'meteor/check';

const helpers = {
  isObject(obj) {
    if (this.isArray(obj) || this.isFunction(obj)) {
      return false;
    }
    return obj === Object(obj);
  },
  isArray(obj) {
    return Array.isArray(obj);
  },
  isFunction(obj) {
    return typeof obj === 'function' || false;
  },
  isEmpty(obj) {
    if (this.isDate(obj)) {
      return false;
    }
    if (this.isObject(obj)) {
      return !Object.keys(obj).length;
    }
    if (this.isArray(obj) || this.isString(obj)) {
      return !obj.length;
    }
    return false;
  }
};

const _helpers = ['String', 'Date'];
for (let i = 0; i < _helpers.length; i++) {
  helpers[`is${_helpers[i]}`] = function (obj) {
    return Object.prototype.toString.call(obj) === `[object ${_helpers[i]}]`;
  };
}

/**
 * @class LoggerConsole
 * @summary Colorful console adapter for ostrio:logger (Logger)
 */
class LoggerConsole {
  constructor(logger, settings = {}) {
    check(logger, Match.OneOf(Logger, Object));
    check(settings, Match.Optional(Object));

    if (typeof settings.highlight === 'undefined') {
      settings.highlight = true;
    }

    this.logger = logger;
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
            if (settings.highlight) {
              message += '\x1B[' + styles[style][0] + 'm' + textArr[i] + '\x1B[' + styles[style][1] + 'm \n';
            } else {
              message += `${textArr[i]} \n`;
            }
          }
        }

        return message;
      };

      this.cons = {
        error(obj, message) {
          if (obj.level === 'FATAL') {
            process.stdout.write(colorize('red', colorize('bold', message)));
          } else {
            process.stdout.write(colorize('red', message));
          }
        },
        info(obj, message) {
          process.stdout.write(colorize('cyan', message));
        },
        warn(obj, message) {
          process.stdout.write(colorize('magenta', message));
        },
        debug(obj, message) {
          process.stdout.write(colorize('white', colorize('bold', message)));
        },
        trace(obj, message) {
          process.stdout.write(colorize('blue', message));
        },
        log(obj, message) {
          process.stdout.write(colorize('bold', message));
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

          if (helpers.isFunction(console.error)) {
            console.error(message, style, obj.data);
          } else {
            console.log(message, style, obj.data);
          }
        },
        info(obj, message) {
          if (helpers.isFunction(console.info)) {
            console.info(message, 'color:#34b1bf', obj.data);
          } else {
            console.log(message, 'color:#34b1bf', obj.data);
          }
        },
        warn(obj, message) {
          if (helpers.isFunction(console.warn)) {
            console.warn(message, 'color:#d025d1', obj.data);
          } else {
            console.log(message, 'color:#d025d1', obj.data);
          }
        },
        debug(obj, message) {
          if (helpers.isFunction(console.debug)) {
            console.debug(message, 'color:white;font-weight:bold;background-color:#000', obj.data);
          } else {
            console.log(message, 'color:white;font-weight:bold;background-color:#000', obj.data);
          }
        },
        trace(obj, message) {
          if (helpers.isFunction(console.trace)) {
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

      if (helpers.isString(data.stackTrace)) {
        data.stackTrace = data.stackTrace.split(/\n\r|\r\n|\r|\n/g);
      }

      if (data) {
        obj.data = data;
      }

      if (userId) {
        obj.userId = userId;
      }

      let _message = '';
      if (typeof this.settings.format === 'function') {
        _message = this.settings.format(obj);
        check(_message, String);

        if (!Meteor.isServer && this.settings.highlight) {
          _message = `%c${_message}`;
        }
      } else {
        if (Meteor.isServer) {
          _message = `[${obj.level}: ${obj.message} @ ${obj.time}] `;
          if (!helpers.isEmpty(obj.data)) {
            if (helpers.isObject(obj.data) || helpers.isArray(obj.data)) {
              _message += JSON.stringify(obj.data, false, 2);
            } else if (helpers.isString(obj.data)){
              _message += obj.data;
            }
          }
        } else {
          if (this.settings.highlight) {
            _message = `%c[${obj.level}: ${obj.message} @ ${obj.time}]`;
          } else {
            _message = `[${obj.level}: ${obj.message} @ ${obj.time}]`;
          }
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

    if (typeof rule.enable === 'undefined') {
      rule.enable = true;
    }

    if (typeof rule.client === 'undefined') {
      rule.client = true;
    }

    if (typeof rule.server === 'undefined') {
      rule.server = true;
    }

    this.logger.rule('Console', rule);
    return this;
  }
}

export { LoggerConsole };
