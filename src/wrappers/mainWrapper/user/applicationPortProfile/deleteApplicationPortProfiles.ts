import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * @param {String} authToken
 * @param {String} applicationId
 * @return {Promise}
 */
export async function userDeleteApplicationPortProfile(
  authToken,
  applicationId,
) {
  const options = {
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: { applicationId },
  };
  const applicationPortProfile = await new VcloudWrapper().posts(
    'user.applicationPortProfiles.deleteApplicationPortProfile',
    options,
  );
  return Promise.resolve({
    __vcloudTask: applicationPortProfile.headers['location'],
  });
}
