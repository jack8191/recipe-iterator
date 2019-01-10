'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise

const UserSchema = mongoose.Schema({
    //_id: Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
        unique: true
      },
    password: {
        type: String,
        required: true
      }
})

const bucketSchema = mongoose.Schema({
    //_id: Schema.Types.ObjectId,
    title: String,
    description: String,
    user: { type: Schema.Types.ObjectId, ref: 'User', autopopulate: true },
})

const iterationSchema = mongoose.Schema({
    //_id: Schema.Types.ObjectId,
    iterationOf: { type: Schema.Types.ObjectId, ref: 'Bucket', autopopulate: true },
    date: Date,
    ingredients: String,
    procedure: String,
    notes: String
})

bucketSchema.methods.serialize = function() {
    console.log(this)
    return {
        id: this._id,
        title: this.title,
        description: this.description,
        username: this.username
    }
}

iterationSchema.methods.serialize = function() {
    console.log(this)
    return {
        id: this._id,
        iterationOf: this.iterationOf,
        date: this.date,
        ingredients: this.ingredients,
        procedure: this.procedure,
        notes: this.notes
        
    }
}

UserSchema.methods.serialize = function() {
    return {
        username: this.username
    }
}

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
  };
  
  UserSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
  };

const Bucket = mongoose.model('Bucket', bucketSchema)
const Iteration = mongoose.model('Iteration', iterationSchema)
const User = mongoose.model('User', UserSchema)
bucketSchema.plugin(require('mongoose-autopopulate'))
iterationSchema.plugin(require('mongoose-autopopulate'))


module.exports = {Bucket, Iteration, User}