import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
/**

   * @param {String} vdcId
   */
export async function enableVdc(vdcId, session) {
  // convert from urn:vcloud:org:vdcId -> vdcId
  vdcId = vdcId.split(':').slice(-1);

  const options = {
    headers: { Authorization: `Bearer ${session}` },
    urlParams: { vdcId: vdcId },
    body: null,
  };
  await new VcloudWrapper().posts('admin.vdc.enableVdc', options);
}