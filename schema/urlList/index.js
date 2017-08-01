const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const urlListSchema = new Schema({
  groupId: 'string',
  id: 'string',
  title: 'string',
  url: 'string',
  serverUrl: 'string',
  header: [],
  headerAdd: [],
  body: [],
  bodyAdd: []
});

module.exports = mongoose.model('UrlList', urlListSchema);