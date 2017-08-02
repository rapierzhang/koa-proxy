const router = require('koa-router')();
const controller = require('./controller');
const uuid = require('uuid');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird'); // 用bluebird的promise代替nongoose的promise

const Group = require('../../schema/group/index');
const UrlList = require('../../schema/urlList/index');

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
  .get('/login', async (ctx, next) => {
    await ctx.render('index', {
      title: 'login'
    });
  });

router
  .post('/group/insert', async (ctx, next) => {
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
    ctx.redirect('/admin/urlList/0');
  })
  .get('/group/insert', async (ctx, next) => {
    await ctx.render('module/groupAdd/index', {})
  });

router
  .get('/group/:groupId/update', async (ctx, next) => {
    const { groupId } = ctx.params;
    const group = await Group.findOne({ groupId })
      .then(
        (res) => {
          return res;
        },
        (err) => {
          console.log('获取group失败');
        }
      );
    await ctx.render('module/groupUpdate/index', group);
  })
  .post('/group/:groupId/update', async (ctx, next) => {
    const { groupId } = ctx.params;
    const { groupName } = ctx.request.body;
    await Group.update({ groupId }, { groupName })
      .then(
        (res) => {
          console.log('修改group成功');
        },
        (err) => {
          console.log('修改group失败');
        }
      )
    await ctx.redirect(`/admin/urlList/${groupId}`);
  })

router
  .get('/group/:groupId/delete', async (ctx, next) => {
    const { groupId } = ctx.params;

    await Group.remove({ groupId })
      .then(
        (res) => {
          console.log('group删除成功');
        },
        (err) => {
          console.log('group删除失败');
        }
      )

    await ctx.redirect('/admin/urlList/0');
  });

router
  .get('/urlList/:groupId', async (ctx, next) => {
    const { groupId } = ctx.params;

    const urlList = await UrlList.find({ groupId }).exec()
      .then(
        (res) => {
          return res;
        },
        (err) => {
          console.log('查询urlList失败');
        }
      );

    await ctx.render('module/urlList/index', {
      urlList,
      groupId
    });
  });

router
  .post('/urlList/insert', async (ctx, next) => {
    const data = ctx.request.body;
    const { title, id, url, serverUrl, groupId, method } = data;
    console.log(1, groupId);
    const headerFieldChange = arrToJson(data, 'headerOldFieldInput', 'headerNewFieldInput');
    const headerFieldAdd = arrToJson(data, 'headerFieldAddKey', 'headerFieldAddValue');
    const bodyFieldChange = arrToJson(data, 'bodyOldFieldInput', 'bodyNewFieldInput');
    const bodyFieldAdd = arrToJson(data, 'bodyFieldAddKey', 'bodyFieldAddValue');
    const json = { title, groupId, id, url, method, serverUrl, headerFieldChange, headerFieldAdd, bodyFieldChange, bodyFieldAdd };
    // const json = { title, id, url, serverUrl, headerFieldChange };
    console.log(json);


    await UrlList.update({ id }, json, { upsert: true })
      .then(
        (res) => {
          console.log('插入或修改成功');
        },
        (err) => {
          console.log('error:', err);
        }
      )

    ctx.redirect('/admin/urlList');
  });

router
  .get('/urlList/:id/delete', async (ctx, next) => {
    const { id } = ctx.params;
    const groupId = ctx.cookies.get('groupId');

    UrlList.remove({ id })
      .then(
        (res) => {
          console.log('删除成功');
        },
        (err) => {
          console.log('删除失败');
        }
      )

    ctx.redirect(`/admin/urlList/${groupId}`);
  });

router
  .get('/urlItem/:groupId/:id', async (ctx, next) => {
  const id = ctx.params.id === '0' ? uuid.v1().replace(/-/g, '') : ctx.params.id;
  const { groupId } = ctx.params;
  const uri = ctx.url;
  if (ctx.params.id === '0') {
    await ctx.render('module/urlItem/index', {
      urlItem: {
        title: '',
        groupId,
        id,
        url: '',
        serverUrl: '',
        bodyFieldAdd: { '': '' },
        bodyFieldChange: { '': '' },
        headerFieldAdd: { '': '' },
        headerFieldChange: { '': '' },
      }
    });
  } else {
    const urlItem = await UrlList.findOne({id}).exec()
      .then(
        (res) => {
          return res;
        },
        (err) => {
          console.log('urlItem查询失败');
        }
      );

    console.log(urlItem);

    await ctx.render('module/urlItem/index', {
      urlItem
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
