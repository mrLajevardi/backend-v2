import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**
 * @param {String} session
 * @param {String} vdcId
 * @return {void}
 */
export async function deleteVdc(session, vdcId) {
  // convert from urn:vcloud:org:vdcId -> vdcId
  vdcId = vdcId.split(':').slice(-1);

  const options = {
    headers: { Authorization: `Bearer ${session}` },
    urlParams: { vdcId: vdcId },
  };

  return await new VcloudWrapper().posts('admin.vdc.deleteVdc', options);
}
