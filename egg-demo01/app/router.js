'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io,middleware } = app;
  router.get('/', controller.home.index);
  router.get('/hello',app.middleware.newMiddle(),app.controller.hello.sayHello);
  router.get('/getUrl',app.controller.getUrl.getUrl);
  router.post('/getUser',app.controller.getUser.getUsers);
  io.of('/').route('chat',io.controller.chat.ping);
  router.post('/upload',controller.upload.create);

  router.post('/doc/undertake/getUndertake',controller.undertake.getUndertake);
  router.post('/doc/undertake/getTopic',controller.undertake.getTopic);
  router.post('/doc/undertake/getMembers',controller.undertake.getMembers);
  router.post('/doc/undertake/getLogs',controller.undertake.getLogs);
  router.post('/doc/undertake/getFiles',controller.undertake.getFiles);
  router.post('/doc/undertake/addMembers',controller.undertake.addMembers);
  router.post('/doc/undertake/delUndertake',controller.undertake.delUndertake);
  
  router.post('/doc/organize/getGwDept',controller.organize.getGwDept);
  router.post('/doc/organize/addGwDept',controller.organize.addGwDept);
  router.post('/doc/organize/delGwDept',controller.organize.delGwDept);
  router.post('/doc/organize/editGwDept',controller.organize.editGwDept);
  router.post('/doc/organize/editParent',controller.organize.editParent);
  router.post('/doc/organize/getDeptRel',controller.organize.getDeptRel);
  router.post('/doc/organize/DRRel',controller.organize.DRRel);
  router.post('/doc/organize/editRel',controller.organize.editRel);
  router.post('/doc/organize/addAuth',controller.organize.addAuth);
  router.post('/doc/organize/getAuth',controller.organize.getAuth);
  router.post('/doc/organize/delAuth',controller.organize.delAuth);
  router.post('/doc/organize/editAuth',controller.organize.editAuth);
  router.post('/doc/organize/getFwSet',controller.organize.getFwSet);
  router.post('/doc/organize/getSwSet',controller.organize.getSwSet);
  router.post('/doc/fw/update',controller.fw.update);
  router.post('/doc/fw/doc',controller.fw.doc);
  router.post('/doc/fw/fix_list',controller.fw.fix_list);
};

