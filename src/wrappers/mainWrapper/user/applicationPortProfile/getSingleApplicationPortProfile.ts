import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 *
 * @param {String} authToken
 * @param {String} applicationId
 * @return {Promise}
 */
export async function userGetSingleApplicationPortProfile(
  authToken,
  applicationId,
) {
  const options = {
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: { applicationId },
  };
  const applicationPortProfile = await new VcloudWrapper().posts(
    'user.applicationPortProfiles.getApplicationPortProfile',
    options,
  );
  return Promise.resolve(applicationPortProfile.data);
}

module.exports = userGetSingleApplicationPortProfile;
