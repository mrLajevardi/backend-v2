const userCreateNetwork = require('./createNetwork');
const userDeleteNetwork = require('./deleteNetwork');
const userGetNetwork = require('./getNetwork');
const userUpdateNetwork = require('./updateNetwork');
const usergetIPUsageNetwrok = require('./getIPUsageNetwrok');

export const networkWrapper = {
  createNetwork: userCreateNetwork,
  deleteNetwork: userDeleteNetwork,
  getNetwork: userGetNetwork,
  updateNetwork: userUpdateNetwork,
  getIPUsageNetwrok: usergetIPUsageNetwrok,
};

module.exports = networkWrapper;
