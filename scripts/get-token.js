/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const password = process.env.ROBOT_TOKEN;
/**
 * get jwt token from server
 * @returns {Promise<String>}
 */
module.exports = async function getToken() {
  const response = await axios.default.post(
    `http://${process.env.HOST}:${process.env.PORT}/auth/robot/login`,
    {
      token: password,
    },
  );
  return response.data.access_token;
};
