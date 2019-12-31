'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  app.router.resources('topics','/api/v2/topics',controller.topics);
  router.get('/', controller.home.index);
  router.get('/sharp', controller.sharp.sharp);
  router.post('/user/create_user', controller.user.user.create_user);
  router.post('/user/get_user', controller.user.user.get_user);
  router.post('/file/download', controller.file.file.download);
  router.post('/file/upload', controller.file.file.upload);
  router.post('/user/set_avatar', controller.user.user.set_avatar);
  router.post('/user/get_user', controller.user.user.get_user);
  router.post('/conv/conv/create_private_conv', controller.conv.conv.create_private_conv);
  router.post('/conv/convMember/add_conv_member', controller.conv.convMember.add_conv_member);
  router.post('/conv/conv/create_conv', controller.conv.conv.create_conv);


  // app.io.of('/chat').route('news',app.io.controller.chat.chat);

  // "/chat"是命名空间; "chat"是前端发布事件，即socket.emit('chat', '......');
  app.io.of('/chat').route('chat', app.io.controller.chat.chat);
};
