'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  app.io.of('/').route('res', app.io.controller.chat.res);
  app.io.of('/chat').route('chat',app.io.controller.chat.chat);
  app.io.of('/news').route('news',app.io.controller.chat.news);
  router.post('/chat',controller.test.chat);
  router.post('/chat/redis',controller.test.redis);
  router.post('/chat/msg',controller.test.get_msg);
};
