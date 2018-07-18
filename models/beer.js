// Load required packages
var mongoose = require('mongoose');
var GeoJSON = require('mongoose-geojson-schema');

// Define our beer schema
var BeerSchema   = new mongoose.Schema({
  name: String,
  type: String,
  quantity: Number,
  coords: mongoose.Schema.Types.Point,
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

// Export the Mongoose model
module.exports = mongoose.model('Beer', BeerSchema);
