'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  accountNumber: {
    type: String,
    trim: true
  },
  balance: {
    type: Number
  },
  income: {
    type: Number
  },
  type: {
    type: String
  },
  Credittype: {
    type: String,
    enum: ['Investment', 'Mortgage', 'Car', 'Buying Goods']
  },
  apr: {
    type: Number
  },
  occupation: {
    type: String,
    enum: [
      'Computers & Technology',
      'Health Care & Allied Health',
      'Education & Social Services',
      'Art & Communications',
      'Trade & Transportation',
      'Management, Business & Finance',
      'Architecture & Civial Engineering',
      'Science',
      'Hospitality, Tourism & Service Industry',
      'Law & Law Enforcement',
      'Other'
    ]
  },
  financialSupport: {
    type: Boolean
  },
  outstandingLoans: {
    type: Boolean
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  maritalStatus: {
    type: String,
    enum: ['Single', 'In a relationship', 'Married', 'Divorced', 'Widowed']
  },
  status: {
    type: String,
    enum: ['Active', 'NoActive'],
    default: 'Active'
  }
});

schema.statics.getCreditAccounts = async function(userID) {
  const Model = this;
  const userAccount = await Model.find({ $and: [{ userID }, { status: 'Active' }] })
    // .populate('accountID')
    .exec();

  return userAccount;
};

schema.statics.getCreditAccountById = async function(id) {
  const Model = this;
  const card = await Model.findById(id).exec();
  return card;
};

schema.statics.createCreditAccount = async function(
  accountNumber,
  type,
  balance,
  userID,
  outstanding,
  otherCredit,
  finanacialSupport,
  children,
  maritalStatus,
  income,
  occupation
) {
  const Model = this;
  const account = await Model.create({
    accountNumber,
    type,
    balance,
    userID,
    outstanding,
    otherCredit,
    finanacialSupport,
    children,
    maritalStatus,
    income,
    occupation
  });
  return account;
};

schema.statics.removeCreditAccount = async function(id) {
  const Model = this;
  const account = await Model.findByIdAndUpdate(id, {
    accountNumber: '',
    type: '',
    createdAt: null,
    status: 'NoActive'
  }).exec();
  return account;
};

module.exports = mongoose.model('Credit', schema);