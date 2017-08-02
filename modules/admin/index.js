const router = require('koa-router')();
const controller = require('./controller');
const uuid = require('uuid');
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
    const groupId = uuid.v1().replace(/-/g, '');
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
    console.log(data);
    const { title, id, url, serverUrl } = data;
    const headerFieldChange = arrToJson(data, 'headerOldFieldInput', 'headerNewFieldInput');
    const headerFieldAdd = arrToJson(data, 'headerFieldAddKey', 'headerFieldAddValue');
    const bodyFieldChange = arrToJson(data, 'bodyOldFieldInput', 'bodyNewFieldInput');
    const bodyFieldAdd = arrToJson(data, 'bodyFieldAddKey', 'bodyFieldAddValue');
    const json = { title, id, url, serverUrl, headerFieldChange, headerFieldAdd, bodyFieldChange, bodyFieldAdd };
    // const json = { title, id, url, serverUrl, headerFieldChange };

    console.log(json);

    ctx.redirect('/admin/module/urlList');
  });

router.get('/module/urlItem/:id', async (ctx, next) => {
  console.log(ctx.params.id);
  const id = ctx.params.id === '0' ? uuid.v1().replace(/-/g, '') : ctx.params.id;
  const uri = ctx.url;
  console.log(id);
  if (ctx.params.id === '0') {
    await ctx.render('module/urlItem/index', {
      urlItem: {
        theUrl: uri,
        title: '',
        id,
        url: '',
        serverUrl: '',
        header: [{'': ''}],
        headerAdd: [{'': ''}],
        body: [{'': ''}],
        bodyAdd: [{'': ''}]
      }
    });
  } else {
    await ctx.render('module/urlItem/index', {
      urlItem: {
        theUrl: uri,
        title: '测试',
        id: id,
        url: '/test1/test2',
        serverUrl: 'http://www.baidu.com',
        header: [{userId: 'uid'}],
        headerAdd: [{key: 'add1'}],
        body: [{asp: 'aspirine'}],
        bodyAdd: [{pre: 'preciou'}]
      }
    });
  }
});



function arrToJson(data, field1, field2) {
  let item = {};
  if (typeof data[field1] != 'string' && typeof data[field2] != 'string') {
    for (let i = 0, j = data[field1].length; i < j; i ++) {
      (!!data[field1][i] && !!data[field2][i]) || (data[field1][i] == '' && data[field2][i] == '')
        ? item[data[field1][i]] = data[field2][i]
        : i === 0
          ? item[''] = ''
          : null
    }
  } else {
    (!!data[field1] && !!data[field2]) || (data[field1] == '' && data[field2] == '')
      ? item[data[field1]] = data[field2]
      : item[''] = ''
  }
  return item;
}

module.exports = router;
