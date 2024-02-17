// const mongoose = require('mongoose')

// const BusesSchema = new mongoose.Schema({
//     name:{
//         type:String,
//         required: true
//     },

//     source:{
//         type: String,
//         required: true
//     },

//     destination:{
//         type: String,
//         required: true
//     },

//     startdate:{
//         type: String,
//         required: true
//     },

//     starttime:{
//         type: String,
//         required: true
//     },

//     endtime:{
//         type:String,
//         required: true
//     },

//     bustype: {
//         type:String,
//         required: true
//     },

//     busclass: {
//         type: String,
//         required: true
//     },

//     traveltime: {
//         type: String
//     },

//     no_of_tickets_available: {
//         type: String,
//         required: true
//     },

//     rating:{
//         type: String,
//         required: true
//     },

//     ticket_cost: {
//         type: String,
//         required: true
//     }

// })

// const buses = mongoose.model("Buses", BusesSchema)

// module.exports = buses

const mongoose = require("mongoose");

const BusesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  source: {
    type: String,
    required: true,
  },

  destination: {
    type: String,
    required: true,
  },

  startdate: {
    type: String,
    required: true,
  },

  starttime: {
    type: String,
    required: true,
  },

  endtime: {
    type: String,
    required: true,
  },

  bustype: {
    type: String,
    required: true,
  },

  busclass: {
    type: String,
    required: true,
  },

  traveltime: {
    type: String,
  },

  no_of_tickets_available: {
    type: String,
    required: true,
  },

  rating: {
    type: String,
    required: true,
  },

  ticket_cost: {
    type: String,
    required: true,
  },

  booked_seats: {
    type: Array,
    required: true,
  },
  via: {
    type: String,
    required: true,
  },
});

const buses = mongoose.model("Buses", BusesSchema);

module.exports = buses;
