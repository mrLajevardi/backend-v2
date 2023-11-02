const axios = require('axios');
require('dotenv').config();
const password = process.env.ROBOT_TOKEN;

/**
 * send check email request to server
 */
async function checkServices() {
  const token = await getToken();
  await axios.default.put(
    'http://localhost:3000/robot/sendEmailToExpiredServices',
    null,
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );
}

/**
 * get jwt token from server
 * @returns {Promise<String>}
 */
async function getToken() {
  const response = await axios.default.post(
    'http://localhost:3000/auth/robot/login',
    {
      token: password,
    },
  );
  return response.data.access_token;
}

(function () {
  checkServices().then(() => {
    console.log('check service request has been sent');
  });
})();
