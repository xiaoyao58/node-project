/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1575622768630_3469';

  // add your middleware config here
  config.middleware = ['login'];
  //csrf
  config.security = {
    csrf: {
      enable: true,
      queryName: '_csrf',
      bodyName: '_csrf',
      cookieName: 'csrfToken',
      sessionName: 'csrfToken'
    }
  };

  //mysql
  config.mysql = {
    // client: {
    //   host: '10.1.92.232',
    //   port: '3306',
    //   user: 'wdzt',
    //   password: 'Wdzt!@2016',
    //   database: 'wdoc'
    // },
    client: {
      host: '127.0.0.1',
      port: '3306',
      user: 'root',
      password: '123456',
      database: 'wdzt'
    },
    app: true,
    agent: false
  };

  //redis 配置
  config.redis = {
    default: {
    },
    app: true,
    agent: false,
    // redis client will try to use TIME command to detect client is ready or not
    // if your redis server not support TIME command, please set this config to false
    // see https://redis.io/commands/time
    supportTimeCommand: true,
    //  Redis: require('ioredis'), // customize ioredis version, only set when you needed

    // Single Redis
    client: {
      host: '127.0.0.1',
      port: '6379',
      family: 'user',
      password: '123456',
      db: 0,
    },

    // Cluster Redis
    // client: {
    //   cluster: true,
    //   nodes: [{
    //     host: 'host',
    //     port: 'port',
    //     family: 'user',
    //     password: 'password',
    //     db: 'db',
    //   },{
    //     host: 'host',
    //     port: 'port',
    //     family: 'user',
    //     password: 'password',
    //     db: 'db',
    //   },
    // ]},

    // Multi Redis
    // clients: {
    //   instance1: {
    //     host: 'host',
    //     port: 'port',
    //     family: 'user',
    //     password: 'password',
    //     db: 'db',
    //   },
    //   instance2: {
    //     host: 'host',
    //     port: 'port',
    //     family: 'user',
    //     password: 'password',
    //     db: 'db',
    //   },
    // },
  },


    //egg-socket.io
    config.io = {
      init: {},
      namespace: {
        '/': {
          connectionMiddleware: ['connection'],
          packetMiddleware: ['packet'],
        }
      },
      namespace: {
        '/chat': {
          connectionMiddleware: ['connection'],
          packetMiddleware: ['packet'],
        }
      },
      namespace: {
        '/news':{
          connectionMiddleware: ['connection'],
          packetMiddleware: ['packet'],
        }
      },
      redis: {
        host: '127.0.0.1',
        port: '6379',
        auth_pass: '123456',
        db: 0,
        // load into app, default is open
        app: true,
        // load into agent, default is close
        agent: false,
      },
    };
  config.multipart = {
    fileSize: '100mb',
    mode: 'file',
    fileExtensions: ['.xls', '.txt', '.jpg', 'png']
  }
  
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};

