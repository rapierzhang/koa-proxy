const router = require('koa-router')();
const controller = require('./controller');
const uuid = require('uuid');
const fs = require('fs');
const rp = require('request-promise');
const shell = require('shelljs');
const crypto = require('crypto');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird'); // 用bluebird的promise代替nongoose的promise

const Group = require('../../schema/group');
const UrlList = require('../../schema/urlList');
const User = require('../../schema/user');

router.prefix('/admin');



router
  .get('/', controller.isLogin)
  .get('/', controller.root);

router
  .get('/regist', controller.isNotLogin)
  .get('/regist', async (ctx, next) => {
    await ctx.render('module/regist/index', {
      title: 'regist'
    });
  })
  .post('/regist', controller.regist);

router
  .get('/login', async (ctx, next) => {
    const hasErr = ctx.request.query.hasErr;
    if (ctx.session.username) {
      ctx.redirect('/admin/');
    } else {
      await ctx.render('module/login/index', {
        title: 'login',
        hasErr
      });
    }
  })
  .post('/login', controller.login);

router
  .get('/exit', async (ctx, next) => {
    ctx.session.username = undefined;
    ctx.session.isLogin = undefined;
    ctx.redirect('/admin/login');
  });

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
