const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        required: true
    },

    phone: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    profileimage: {
        type: String,
    },

    recentsearches: [{
        source: {
          type: String
        },
        destination: {
          type: String
        },
        date:{
            type: String
        }
    }]
})


const users = mongoose.model('Users', UserSchema)

module.exports = users