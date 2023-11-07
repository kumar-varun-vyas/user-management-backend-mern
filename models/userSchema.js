const mongoose = require('mongoose')
const validator = require('validator')

const usersSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trime: true
    },
    lname: {
        type: String,
        required: true,
        trime: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw Error('Email not valid!')
            }
        }
    },
    mobile: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10
    },
    gender: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
    },
    profile: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },

}, { timestamps: true })


const Users = new mongoose.model('Users', usersSchema)

module.exports = Users