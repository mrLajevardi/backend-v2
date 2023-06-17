const userCreateIPSet = require('./createIPSet');
const userDeleteIPSet = require('./deleteIPSet');
const userGetIPSetsList = require('./getIPSetsList');
const userGetSingleIPSet = require('./getSingleIPSet');
const userUpdateIPSet = require('./updateIPSet');

const ipSetsWrapper = {
  getIPSetsList: userGetIPSetsList,
  getSingleIPSet: userGetSingleIPSet,
  createIPSet: userCreateIPSet,
  updateIPSet: userUpdateIPSet,
  deleteIPSet: userDeleteIPSet,
};

module.exports = ipSetsWrapper;
