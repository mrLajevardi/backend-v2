/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const getToken = require('./get-token');
/**
 * send check email request to server
 */
async function checkServices() {
  const token = await getToken();
  await axios.default.put(
    `http://localhost:${process.env.PORT}/robot/sendEmailToExpiredServices`,
    null,
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );
}

(function () {
  checkServices().then(() => {
    console.log('check service request has been sent');
  });
})();
