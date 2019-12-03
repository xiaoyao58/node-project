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
  config.keys = appInfo.name + '_123456';

  // add your middleware config here
  config.middleware = ['newMiddle','join'];

  //csrf
  config.security = {
    csrf:{
      enable:true,
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
      host:'10.2.100.123',
      port: '3306',
      user: 'root',
      password: '123456',
      database: 'wdoc'
    },
    app: true,
    agent: false
  };

  //egg-socket.io
  config.io = {
    init: {},
    namespace: {
      '/':{
        connectionMiddleware:['connection'],
        packetMiddleware:['packet'],
      }
    }
  };
  config.multipart = {
    fileSize: '100mb',
    mode: 'file',
    fileExtensions:['.xls','.txt','.jpg','png']
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
