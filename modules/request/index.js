const router = require('koa-router')();
const controller = require('./controller');

// 初始化路由
((len = 20) => {
  let arr = [];
  for (let i = 1; i < len; i++) {
    arr.push([]);
    for (let j = 0; j < i; j++) {
      arr[i-1].push(`/:s${j}`);
    }
  }

  let arrStr = arr.map((item) => {
    return item.toString().replace(/,/g, '');
  });

  arrStr.map((item) => {
    return (
      router
        .get(item, controller.getRequest)
        .post(item, controller.getRequest)
    );
  });
  console.log('路由初始化完成');
})();

module.exports = router;
