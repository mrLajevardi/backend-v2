import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * @param {String} authToken
 * @param {String} params
 * @return {Promise}
 */
export async function userGetApplicationPortProfiles(authToken, params) {
  const applicationPortProfile = await new VcloudWrapper().posts(
    'user.applicationPortProfiles.getApplicationPortProfilesList',
    {
      headers: { Authorization: `Bearer ${authToken}` },
      params,
    },
  );
  return applicationPortProfile;
}

module.exports = userGetApplicationPortProfiles;
