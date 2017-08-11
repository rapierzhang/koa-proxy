const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const logger = require('koa-logger');
const session = require('koa-session');

require('./db/mongo');

const admin = require('./modules/admin/index');

app.keys = ['key'];
// error handler
onerror(app);

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}));
app.use(json());
app.use(logger());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'pug'
}));

app.use(session(app));

// logger
app.use(async (ctx, next) => {
  // ignore favicon
  if (ctx.path === '/favicon.ico') return;

  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(admin.routes(), admin.allowedMethods());

app.listen(9001);

console.log('----启动成功----');

module.exports = app;
