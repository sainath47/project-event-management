const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  attendees: {type:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
default:[]},
//array of objects
createdBy:{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User'
}
},{timestamps:true});
//The `attendees` field in the Event schema is an array of User IDs, so using the `populate()` method will replace the IDs with the actual User documents.

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
