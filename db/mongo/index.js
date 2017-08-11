const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/proxy', {
  useMongoClient: true,
});

