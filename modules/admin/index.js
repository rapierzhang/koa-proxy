const router = require('koa-router')();
const controller = require('./controller');

router.prefix('/admin');

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    moduleList: [
      'AAA',
      'BBB',
      'CCC'
    ]
  });
});

router.get('/login', async (ctx, next) => {
  await ctx.render('index', {
    title: 'login'
  });
});

router
  .get('/module/urlList', async (ctx, next) => {
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
  })
  .post('/module/urlList', async (ctx, next) => {
    console.log(ctx.request.body);
    ctx.body = 111;
  });

router
  .post('/module/urlListTransfer', async (ctx, next) => {
    const data = ctx.request.body;
    console.log(data);
    const title = data.title;
    const url = data.url;
    const serverUrl = data.serverUrl;
    const headerFieldChange = arrToJson(data, 'headerOldFieldInput', 'headerNewFieldInput');
    const headerFieldAdd = arrToJson(data, 'headerFieldAddKey', 'headerFieldAddValue');
    const bodyFieldChange = arrToJson(data, 'bodyOldFieldInput', 'bodyNewFieldInput');
    const bodyFieldAdd = arrToJson(data, 'bodyFieldAddKey', 'bodyFieldAddValue');

    const json = { title, url, serverUrl, headerFieldChange, headerFieldAdd, bodyFieldChange, bodyFieldAdd };

    console.log(json);

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
  let arr = [];
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
