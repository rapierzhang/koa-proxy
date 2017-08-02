const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlListSchema = new Schema({
  groupId: 'string',
  id: { type: 'string', index: true }, // 添加索引
  title: 'string',
  url: 'string',
  method: 'string',
  serverUrl: 'string',
  headerFieldChange: {},
  headerFieldAdd: {},
  bodyFieldChange: {},
  bodyFieldAdd: {}
});

module.exports = mongoose.model('UrlList', urlListSchema);