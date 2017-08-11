const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: 'string',
  password: 'string',
  mail: 'string'
});

module.exports = mongoose.model('User', userSchema);