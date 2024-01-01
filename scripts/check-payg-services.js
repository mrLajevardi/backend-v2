/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const getToken = require('./get-token');
/**
 * send check email request to server
 */
async function checkPaygServices() {
  const token = await getToken();
  await axios.default.post(
    `http://${process.env.HOST}:${process.env.PORT}/robot/checkPaygServices`,
    null,
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );
}

(function () {
  checkPaygServices().then(() => {
    console.log('check service request has been sent');
  });
})();

console.log('working');
