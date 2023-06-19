import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';

export const userGetHardwareInfo = async (authToken, vdcId) => {
  const formattedVdcId = vdcId.split(':').slice(-1);
  const response = await new VcloudWrapper().posts('user.vdc.getHardwareInfo', {
    urlParams: { vdcId: formattedVdcId },
    headers: { Authorization: `Bearer ${authToken}` },
  });
  return Promise.resolve(response.data);
};

module.exports = userGetHardwareInfo;
