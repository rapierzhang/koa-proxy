const router = require('koa-router')();
const rp = require('request-promise');
    
router
  .post('/test', async (ctx, next) => {
    const headers = ctx.request.headers;
    const body = ctx.request.body;
    const headerFieldAdd = {};
    const bodyFieldAdd = {};
    
    const { aaa,bbb,ccc } = headers;
    const header = { aaa,ddd: bbb,ccc };
    
    const opt = {
      method: 'post',
      uri: 'https://help.huli.com/element/xiaohulist/index.json',
      headers: Object.assign({}, header, headerFieldAdd),
      form: Object.assign({}, body, bodyFieldAdd)
    };
    
    const req = await rp(opt)
      .then((bodyText) => {
        console.log('[--测试--]', 'result: ', JSON.stringfy(bodyText));
        console.loh('');
        return bodyText;
      })
      .catch((err) => {
        console.error('[--测试--]', 'error: ', JSON.stringfy(err));
        console.log('');
        return { errorMessage: '中转服务器错误', errorCode: 1 };
      });
    
    ctx.body = req;
  });
      
router
  .post('/huli', async (ctx, next) => {
    const headers = ctx.request.headers;
    const body = ctx.request.body;
    const headerFieldAdd = {};
    const bodyFieldAdd = {};
    
    const {  } = headers;
    const header = {  };
    
    const opt = {
      method: 'get',
      uri: 'https://help.huli.com/element/xiaohulist/index.json',
      headers: Object.assign({}, header, headerFieldAdd),
      form: Object.assign({}, body, bodyFieldAdd)
    };
    
    const req = await rp(opt)
      .then((bodyText) => {
        console.log('[--狐狸--]', 'result: ', JSON.stringfy(bodyText));
        console.loh('');
        return bodyText;
      })
      .catch((err) => {
        console.error('[--狐狸--]', 'error: ', JSON.stringfy(err));
        console.log('');
        return { errorMessage: '中转服务器错误', errorCode: 1 };
      });
    
    ctx.body = req;
  });
      
router
  .post('/list', async (ctx, next) => {
    const headers = ctx.request.headers;
    const body = ctx.request.body;
    const headerFieldAdd = {};
    const bodyFieldAdd = {};
    
    const {  } = headers;
    const header = {  };
    
    const opt = {
      method: 'get',
      uri: 'https://help.huli.com/element/xiaohulist/index.json',
      headers: Object.assign({}, header, headerFieldAdd),
      form: Object.assign({}, body, bodyFieldAdd)
    };
    
    const req = await rp(opt)
      .then((bodyText) => {
        console.log('[--列表--]', 'result: ', JSON.stringfy(bodyText));
        console.loh('');
        return bodyText;
      })
      .catch((err) => {
        console.error('[--列表--]', 'error: ', JSON.stringfy(err));
        console.log('');
        return { errorMessage: '中转服务器错误', errorCode: 1 };
      });
    
    ctx.body = req;
  });
      
router
  .post('/newList', async (ctx, next) => {
    const headers = ctx.request.headers;
    const body = ctx.request.body;
    const headerFieldAdd = {};
    const bodyFieldAdd = {};
    
    const {  } = headers;
    const header = {  };
    
    const opt = {
      method: 'get',
      uri: 'https://help.huli.com/element/xiaohulist/index.json',
      headers: Object.assign({}, header, headerFieldAdd),
      form: Object.assign({}, body, bodyFieldAdd)
    };
    
    const req = await rp(opt)
      .then((bodyText) => {
        console.log('[--真列表--]', 'result: ', JSON.stringfy(bodyText));
        console.loh('');
        return bodyText;
      })
      .catch((err) => {
        console.error('[--真列表--]', 'error: ', JSON.stringfy(err));
        console.log('');
        return { errorMessage: '中转服务器错误', errorCode: 1 };
      });
    
    ctx.body = req;
  });
      
module.exports = router;
    