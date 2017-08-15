const router = require('koa-router')();
const controller = require('./controller');

router.prefix('/admin');

router
  .get('/', controller.isLogin)
  .get('/', controller.root);

router
  .get('/regist', controller.isNotLogin)
  .get('/regist', controller.registShow)
  .post('/regist', controller.regist);

router
  .get('/login', controller.loginShow)
  .post('/login', controller.login);

router
  .get('/exit', controller.exit);

router
  .get('/home', controller.home);

router
  .get('/group/insert', controller.groupInsertShow)
  .post('/group/insert', controller.groupInsert);

router
  .get('/group/:groupId/update', controller.groupUpdateShow)
  .post('/group/:groupId/update', controller.groupUpdate);

router
  .get('/group/:groupId/delete', controller.groupDelete);

router
  .get('/urlList/:groupId', controller.urlListShow);

router
  .post('/urlList/insert', controller.urlListInsert);

router
  .get('/urlList/:id/delete', controller.urlListDelete);

router
  .get('/urlItem/:groupId/:id', controller.urlListUpdate);

router
  .get('/build', controller.buildShow)
  .post('/build', controller.build);

router
  .get('/build/finish', controller.buildFinish);

router
  .get('/restart', controller.restartShow)
  .post('/restart', controller.restart)

module.exports = router;
