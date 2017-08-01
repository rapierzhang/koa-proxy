const mongoose = require('mongoose');
const mongo = require('../../db/mongo');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  groupId: 'string',
  groupName: 'string'
});

module.exports = mongoose.model('Group', groupSchema);