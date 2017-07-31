const rp = require('request-promise');

exports.getRequest =  async (ctx, next) => {
  // ctx.body = ctx.params;
  ctx.body = ctx.url;
}