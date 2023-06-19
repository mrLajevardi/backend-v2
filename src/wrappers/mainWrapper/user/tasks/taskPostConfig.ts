import { baseUrl, httpsAgent } from '../../postConfig';
export const configs = {
  getTask: {
    headers: {
      Accept: 'application/* +json;version=38.0.0-alpha',
      'Content-Type': 'application/* +json;',
    },
    url: baseUrl + '/api/task/$id',
    httpsAgent,
  },
};

module.exports.getTaskConfigs = () => {
  return configs;
};
