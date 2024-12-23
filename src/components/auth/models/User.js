// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { google } = require('googleapis');

const UserSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, sparse: true }, 
    username: { type: String, unique: true, sparse: true },
    password: { type: String },
    email: { type: String, required: true },
    isConfirmed: { type: Boolean, default: false },
    birthday: { type: Date },
    avatar: { type: String, default: '/img/default-avatar.png' },
    address: { type: String },
    phone: { type: String },
    facebook: { type: String },
    name: { type: String },

});

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
