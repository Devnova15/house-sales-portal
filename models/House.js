const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HouseSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  plotArea: {
    type: Number
  },
  floors: {
    type: Number
  },
  characteristics: {
    wallType: String,
    wallInsulation: String,
    roofType: String,
    bathroom: String,
    heating: String,
    floorHeating: Boolean
  },
  condition: {
    withRepair: Boolean,
    repairType: String,
    withFurniture: Boolean,
    yearBuilt: Number
  },
  features: {
    hasGarage: Boolean,
    hasGarden: Boolean,
    hasBasement: Boolean,
    hasTerrace: Boolean
  },
  location: {
    district: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  infrastructure: {
    school: Boolean,
    kindergarten: Boolean,
    hospital: Boolean,
    park: Boolean,
    publicTransport: Boolean,
    shopping: Boolean,
    distance: {
      toCenter: Number,
      toSchool: Number,
      toTransport: Number
    }
  },
  communications: {
    sewerage: String,
    electricity: Boolean,
    water: String,
    gas: Boolean,
    internet: Boolean
  },
  images: [String],
  contactInfo: {
    name: String,
    phone: String,
    email: String
  },
  status: {
    type: String,
    enum: ['available', 'sold', 'reserved'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = House = mongoose.model('houses', HouseSchema);
