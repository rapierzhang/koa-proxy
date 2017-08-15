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

exports.isLogin = async (ctx, next) => {
  if (ctx.session && ctx.session.username && ctx.session.isLogin === true) {
    await next();
  } else {
    ctx.redirect('/admin/login');
  }
}

exports.isNotLogin = async (ctx, next) => {
  if (!ctx.session || !ctx.session.username || ctx.session.isLogin !== true) {
    await next();
  } else {
    ctx.redirect('/admin/');
  }
}

exports.root = async (ctx, next) => {
  const groupList = await Group.find().exec()
    .then( // 异步查询
      res => res,
      err => console.log(err)
    );
  const username = ctx.session.username;
  console.log(username);
  await ctx.render('index', {
    groupList,
    username
  });
}

exports.registShow = async (ctx, next) => {
  await ctx.render('module/regist/index', {
    title: 'regist'
  });
}

exports.regist = async (ctx, next) => {
  const { username, password, mail } = ctx.request.body;
  const hasUser = await User.findOne({username}).exec().then(
    res => res,
    err => false
  );
  if (!hasUser) {
    const md5 = crypto.createHash('md5');
    md5.update(password);
    const _user = new User({
      username,
      password: md5.digest('hex'),
      mail
    });
    await _user.save().then(
      res => ctx.redirect('/admin/login'),
      err => ctx.redirect('/admin/regist')
    )
  } else {
    ctx.body = '用户名重复';
  }
}

exports.loginShow = async (ctx, next) => {
  const hasErr = ctx.request.query.hasErr;
  if (ctx.session.username) {
    ctx.redirect('/admin/');
  } else {
    await ctx.render('module/login/index', {
      title: 'login',
      hasErr
    });
  }
}

exports.login = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  const userData = await User.findOne({ username }).exec().then(
    res => res,
    err => ctx.redirect('/admin/login')
  );
  if (userData) {
    const md5 = crypto.createHash('md5');
    md5.update(password);
    const md5Pass = md5.digest('hex');
    if (userData.password === md5Pass) {
      ctx.session.username = username;
      ctx.session.isLogin = true;
      ctx.redirect('/admin');
    } else {
      ctx.redirect('/admin/login?hasErr=true');
    }
  } else {
    ctx.redirect('/admin/login?hasErr=true');
  }
}

exports.exit = async (ctx, next) => {
  ctx.session.username = undefined;
  ctx.session.isLogin = undefined;
  ctx.redirect('/admin/login');
}

exports.home = async (ctx, next) => {
  await ctx.render('module/home/index', {
    title: 'home'
  });
}

exports.groupInsertShow = async (ctx, next) => {
  await ctx.render('module/groupAdd/index', {})
}

exports.groupInsert = async (ctx, next) => {
  const groupId = uuid.v1().replace(/-/g, '');
  const { groupName } = ctx.request.body;
  if (groupName) {
    const _group = new Group({
      groupId,
      groupName
    });
    await _group.save().then(
      res => console.log(res),
      err => console.log(err)
    );
  };
  ctx.redirect('/admin/urlList/0');
}

exports.groupUpdateShow = async (ctx, next) => {
  const { groupId } = ctx.params;
  const group = await Group.findOne({ groupId })
    .then(
      res => res,
      err => console.log('获取group失败')
    );
  await ctx.render('module/groupUpdate/index', group);
}

exports.groupUpdate = async (ctx, next) => {
  const { groupId } = ctx.params;
  const { groupName } = ctx.request.body;
  await Group.update({ groupId }, { groupName })
    .then(
      res => console.log('修改group成功'),
      err => console.log('修改group失败')
    )
  await ctx.redirect(`/admin/urlList/${groupId}`);
}

exports.groupDelete = async (ctx, next) => {
  const { groupId } = ctx.params;

  await Group.remove({ groupId })
    .then(
      res => console.log('group删除成功'),
      err => console.log('group删除失败')
    )

  await ctx.redirect('/admin/urlList/0');
}

exports.urlListShow = async (ctx, next) => {
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
}

exports.urlListInsert = async (ctx, next) => {
  const data = ctx.request.body;
  const { title, id, url, serverUrl, groupId, method } = data;
  const headerFieldAllow = toArr(data, 'headerAllowField');
  const headerFieldChange = arrToJson(data, 'headerOldFieldInput', 'headerNewFieldInput');
  const headerFieldAdd = arrToJson(data, 'headerFieldAddKey', 'headerFieldAddValue');
  const bodyFieldChange = arrToJson(data, 'bodyOldFieldInput', 'bodyNewFieldInput');
  const bodyFieldAdd = arrToJson(data, 'bodyFieldAddKey', 'bodyFieldAddValue');
  const json = { title, groupId, id, url, method, serverUrl, headerFieldAllow, headerFieldChange, headerFieldAdd, bodyFieldChange, bodyFieldAdd };

  await UrlList.update({ id }, json, { upsert: true })
    .then(
      res => console.log('插入或修改成功'),
      err => console.log('error:', err)
    );

  ctx.redirect('/admin/urlList');
}

exports.urlListDelete = async (ctx, next) => {
  const { id } = ctx.params;
  const groupId = ctx.cookies.get('groupId');

  UrlList.remove({ id })
    .then(
      res => console.log('删除成功'),
      err => console.log('删除失败')
    );

  ctx.redirect(`/admin/urlList/${groupId}`);
}

exports.urlListUpdate = async (ctx, next) => {
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
        headerFieldAllow: [''],
        bodyFieldAdd: { '': '' },
        bodyFieldChange: { '': '' },
        headerFieldAdd: { '': '' },
        headerFieldChange: { '': '' },
      }
    });
  } else {
    const urlItem = await UrlList.findOne({id}).exec()
      .then(
        res => res,
        err => console.log('urlItem查询失败')
      );

    console.log(urlItem);

    await ctx.render('module/urlItem/index', {
      urlItem
    });
  }
}

exports.buildShow = async (ctx, next) => {
  await ctx.render('module/build/index', {});
}

exports.build = async (ctx, next) => {

  const data = await UrlList.find()
    .then(
      res => res,
      err => console.log('urlList查询失败')
    );

  const routeHeader = `const router = require('koa-router')();
const rp = require('request-promise');
    `;
  const routeFooter = `
module.exports = router;
    `;
  const indexUrl = './modules/request/index.js';

  await fs.writeFile(indexUrl, routeHeader, function (err) {
    err ? console.log(err) : console.log('----写入header成功----');
  });

  const lastNum = data.length - 1;

  await data.map((dataItem, index) => {
    const { headerFieldAllow, headerFieldAdd, headerFieldChange, bodyFieldAdd, bodyFieldChange, title, url, serverUrl, method } = dataItem;
    const headerFieldAllowItem = headerFieldAllow.filter(item => item);

    const test = `
router
  .post('${url}', async (ctx, next) => {
    const headers = ctx.request.headers;
    const body = ctx.request.body;
    const headerFieldAdd = ${JSON.stringify(filterJson(headerFieldAdd))};
    const bodyFieldAdd = ${JSON.stringify(filterJson(bodyFieldAdd))};
    
    const { ${headerFieldAllowItem} } = headers;
    const header = { ${changeField(headerFieldAllowItem, filterJson(headerFieldChange))} };
    
    const opt = {
      method: '${method}',
      uri: '${serverUrl}',
      headers: Object.assign({}, header, headerFieldAdd),
      form: Object.assign({}, body, bodyFieldAdd)
    };
    
    const req = await rp(opt)
      .then((bodyText) => {
        console.log('[--${title}--]', 'result: ', JSON.stringfy(bodyText));
        console.loh('');
        return bodyText;
      })
      .catch((err) => {
        console.error('[--${title}--]', 'error: ', JSON.stringfy(err));
        console.log('');
        return { errorMessage: '中转服务器错误', errorCode: 1 };
      });
    
    ctx.body = req;
  });
      `;

    fs.appendFile(indexUrl, test, function (err) {
      err ? console.log(err) : console.log('----写入body成功----');
    });

    if (index === lastNum) {
      const timer = setTimeout(() => {
        clearTimeout(timer);
        fs.appendFile(indexUrl, routeFooter, function (err) {
          err ? console.log(err) : console.log('----生成js成功----');
        });
      }, 500);
    }
  });

  ctx.redirect('/admin/build/finish');
}

exports.buildFinish = async (ctx, next) => {
  await ctx.render('module/build/buildFinish', {
    title: '代码生成完毕'
  });
}

exports.restartShow = async (ctx, next) => {
  await ctx.render('module/release/restartConfirm');
}

exports.restart = async (ctx, next) => {
  // 重启pm2使生成的js生效
  await shell.exec('pm2 restart proxy');
  console.log('----重启pm2----');
  ctx.body = '重启成功';
}


// 更改字段
function changeField(data, change) {
  let str = data.toString();
  let strChange = '';
  data.map((item) => {
    if (change.hasOwnProperty(item)) {
      strChange = str.replace(item ,`${change[item]}: ${item}`);
    } else {
      console.log('字段转换失败');
    }
  });
  return strChange;
}

// 两个数组组合成一个json
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

// 将form提交上来的数据，保证是array
function toArr(data, field) {
  if (data[field] != 'string') {
    return data[field];
  } else {
    return [data[field]];
  }
}

// 排除json的空数据
function filterJson(obj) {
  for(o in obj) {
    if(obj[o] === "" || obj[o] === undefined) {
      delete obj[o];
    }
  }
  return obj;
}

