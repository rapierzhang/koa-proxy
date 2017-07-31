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

router.get('/module/urlList', async (ctx, next) => {
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

router.get('/module/urlItem/:id', async (ctx, next) => {
  const theUrl = ctx.url;
  await ctx.render('module/urlItem/index', {
    urlItem: {
      theUrl: ctx.url,
      title: '测试',
      id: 1,
      url: '/test1/test2',
      serverUrl: 'http://www.baidu.com',
      header: [{oldKey: 'userId', newKey: 'uid'}],
      headerAdd: [{key: 'add', value: 'add1'}],
      body: [{'asp': 'aspirine'}],
      bodyAdd: [{'pre': 'preciou'}]
    }
  });
});

module.exports = router;
