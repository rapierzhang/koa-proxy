const router = require('koa-router')();
const controller = require('./controller');
const uuid = require('uuid').v1();
const Group = require('../../schema/group/index');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird'); // 用bluebird的promise代替nongoose的promise

router.prefix('/admin');

router
  .get('/', async (ctx, next) => {
    const groupList = await Group.find().exec()
      .then( // 异步查询
        (res) => {
          return res;
        },
        (err) => {
          console.log(err);
        }
      );
    await ctx.render('index', {
      groupList
    });
  });

router
  .post('/indexTransfer', async (ctx, next) => {
    const groupId = uuid.replace(/-/g, '');
    const { groupName } = ctx.request.body;
    if (groupName) {
      const _group = new Group({
        groupId,
        groupName
      });
      await _group.save().then(
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
    };
    ctx.redirect('/admin/module/urlList/0');
  });

router
  .get('/login', async (ctx, next) => {
    await ctx.render('index', {
      title: 'login'
    });
  });

router
  .get('/module/groupAdd', async (ctx, next) => {
    await ctx.render('module/groupAdd/index', {})
  });

router
  .get('/module/urlList/:id', async (ctx, next) => {
    const id = ctx.params;
    await ctx.render('module/urlList/index', {
      urlList: [
        {
          title: '测试',
          id: 1,
          url: '/test1/test2',
          serverUrl: 'http://www.baidu.com',
          header: {
            userId: 'uid'
          },
          headerAdd: {
            'add': 'add1'
          },
          body: {
            'asp': 'aspirine'
          },
          bodyAdd: {
            'pre': 'preciou'
          }
        },
        {
          title: '测试1',
          id: 2,
          url: '/test2/test3',
          serverUrl: 'http://www.qq.com',
          header: {
            userId: 'uid1'
          },
          headerAdd: {
            'add2': 'add13'
          },
          body: {
            'asp4': 'aspirine5'
          },
          bodyAdd: {
            'pre6': 'preciou7'
          }
        }
      ]
    });
  });

router
  .post('/module/urlListTransfer', async (ctx, next) => {
    const data = ctx.request.body;
    const title = data.title;
    const url = data.url;
    const serverUrl = data.serverUrl;
    const headerFieldChange = arrToJson(data, 'headerOldFieldInput', 'headerNewFieldInput');
    const headerFieldAdd = arrToJson(data, 'headerFieldAddKey', 'headerFieldAddValue');
    const bodyFieldChange = arrToJson(data, 'bodyOldFieldInput', 'bodyNewFieldInput');
    const bodyFieldAdd = arrToJson(data, 'bodyFieldAddKey', 'bodyFieldAddValue');

    const json = { title, url, serverUrl, headerFieldChange, headerFieldAdd, bodyFieldChange, bodyFieldAdd };

    ctx.redirect('/admin/module/urlList');
  });

router.get('/module/urlItem/:id', async (ctx, next) => {
  const theUrl = ctx.url;
  await ctx.render('module/urlItem/index', {
    urlItem: {
      theUrl: ctx.url,
      title: '测试',
      id: 1,
      url: '/test1/test2',
      serverUrl: 'http://www.baidu.com',
      header: [{userId: 'uid'}],
      headerAdd: [{key: 'add1'}],
      body: [{asp: 'aspirine'}],
      bodyAdd: [{pre: 'preciou'}]
    }
  });
});



function arrToJson(data, field1, field2) {
  let item = {};
  if (typeof data[field1] != 'string') {
    for (let i = 0, j = data[field1].length; i < j; i ++) {
      if (data[field1][i] && data[field2][i] && data[field1][i] != '' && data[field2][i] != '') {
        item[data[field1][i]] = data[field2][i];
      }
    }
  } else {
    if (data[field1] && data[field2] && data[field1] != '' && data[field2] != '') {
      item[data[field1]] = data[field2];
    }
  }
  return item;
}

module.exports = router;
