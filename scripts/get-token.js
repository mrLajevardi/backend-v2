/* eslint-disable @typescript-eslint/no-var-requires */
const axios = require('axios');
require('dotenv').config();
const password = process.env.ROBOT_TOKEN;
/**
 * get jwt token from server
 * @returns {Promise<String>}
 */
export async function getToken() {
  const response = await axios.default.post(
    'http://localhost:3000/auth/robot/login',
    {
      token: password,
    },
  );
  return response.data.access_token;
}
