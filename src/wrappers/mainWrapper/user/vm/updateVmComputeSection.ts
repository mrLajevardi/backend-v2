const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const userGetVApp = require('./getVapp');
/**
 * compute part in vcloud panel
 * @param {String} authToken
 * @param {String} vmId
 * @param {Number} numCpus
 * @param {Number} numCoresPerSocket
 * @param {String} memory
 * @param {Boolean} memoryHotAddEnabled
 * @param {Boolean} cpuHotAddEnabled
 * @param {Boolean} nestedHypervisorEnabled
 * @return {Promise<Object>}
 */
async function userUpdateVmComputeSection(
    authToken,
    vmId,
    numCpus,
    numCoresPerSocket,
    memory,
    memoryHotAddEnabled,
    cpuHotAddEnabled,
    nestedHypervisorEnabled,
) {
  const vmInfo = await userGetVApp(authToken, vmId);
  const vmInfoData = vmInfo.data;
  vmInfoData.section.forEach((section) => {
    if (section._type === 'VmSpecSectionType') {
      section.numCpus = numCpus;
      // modified should be true;
      section.modified = true;
      section.numCoresPerSocket = numCoresPerSocket;
      section.memoryResourceMb.configured = memory;
    }
  });
  vmInfoData.nestedHypervisorEnabled = nestedHypervisorEnabled;
  vmInfoData.vmCapabilities.memoryHotAddEnabled = memoryHotAddEnabled;
  vmInfoData.vmCapabilities.cpuHotAddEnabled = cpuHotAddEnabled;
  const computeSection = await new VcloudWrapper().posts('user.vm.updateVm', {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {vmId},
    body: vmInfoData,
  });
  return Promise.resolve({
    __vcloudTask: computeSection.headers['location'],
  });
};

module.exports = userUpdateVmComputeSection;
