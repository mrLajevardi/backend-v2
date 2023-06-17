/* eslint-disable guard-for-in */
const HttpExceptions = require('../../../../exceptions/httpExceptions');
const VcloudWrapper = require('../../../vcloudWrapper/vcloudWrapper');
const {getHardwareInfo} = require('../vdc/vdcWrapper');
const userGetVApp = require('./getVapp');
/**
 *
 * @param {String} authToken
 * @param {String} vmId
 * @param {Object} diskSettings user disk settings
 * @return {Promise}
 */
async function userUpdateDiskSection(authToken, vmId, diskSettings, vdcId) {
  const vmInfo = await userGetVApp(authToken, vmId);
  const vmInfoData = vmInfo.data;
  const controllers = await calcBusCombination(diskSettings, authToken, vdcId);
  vmInfoData.section.forEach((section) => {
    if (section._type === 'VmSpecSectionType') {
      const updatedDiskSettings = [];
      section.modified = true;
      section.diskSection.diskSettings.forEach((diskSection) => {
        diskSettings.forEach((settings) => {
          if (settings.diskId === diskSection.diskId) {
            const updatedSetting = {
              ...diskSection,
              busNumber: diskSection.busNumber,
              unitNumber: diskSection.unitNumber,
              sizeMb: settings.sizeMb,
            };
            updatedDiskSettings.push(updatedSetting);
          }
        });
      });
      diskSettings.forEach((settings) => {
        let targetAdaptor = settings.adapterType;
        if (targetAdaptor == '3' || targetAdaptor == '5' || targetAdaptor == 2) {
          targetAdaptor = '4';
        }
        if (settings.diskId === null) {
          console.log(targetAdaptor, controllers, '👌👌');
          const newSetting = {
            sizeMb: settings.sizeMb,
            unitNumber: controllers[targetAdaptor][0].unitNumber,
            busNumber: controllers[targetAdaptor][0].busNumber,
            adapterType: settings.adapterType,
            thinProvisioned: true,
            overrideVmDefault: false,
            virtualQuantityUnit: 'byte',
            iops: 0,
          };
          updatedDiskSettings.push(newSetting);
          controllers[targetAdaptor].splice(0, 1);
        }
      });
      section.diskSection.diskSettings = updatedDiskSettings;
      console.log(updatedDiskSettings, '❤️❤️❤️');
    }
  });
  const diskSection = await new VcloudWrapper().posts('user.vm.updateVm', {
    headers: {Authorization: `Bearer ${authToken}`},
    urlParams: {vmId},
    body: vmInfoData,
  });
  return Promise.resolve({
    __vcloudTask: diskSection.headers['location'],
  });
};


async function calcBusCombination(settings, authToken, vdcId) {
  const combinations = {
    '4': [],
    '6': [],
    '7': [],
    '1': [],
  };
  const oldCombinations = {
    '4': [],
    '6': [],
    '7': [],
    '1': [],
  };
  const buses = await getHardDiskControllers(authToken, vdcId);
  settings.forEach((setting) => {
    let adaptor = setting.adapterType;
    if (adaptor == 3 || adaptor == 5 || adaptor == 2) {
      adaptor = '4';
    }
    if (setting.diskId === null) {
      console.log(adaptor, '💀');
      combinations[adaptor].push(setting);
    } else {
      oldCombinations[adaptor].push(setting);
    }
  });
  let bus; let element = null;
  for (const key in combinations) {
    element = combinations[key];
    if (element.length === 0) {
      continue;
    }
    bus = buses[key];
    const validBusNumberRange = [];
    const validUnitNumberRange = [];
    bus.busNumberRanges.forEach((range) => {
      for (let index = range.begin; index <= range.end; index++) {
        validBusNumberRange.push(index);
      }
    });
    bus.unitNumberRanges.forEach((range) => {
      for (let index = range.begin; index <= range.end; index++) {
        validUnitNumberRange.push(index);
      }
    });
    let validCombCount = validBusNumberRange.length * validUnitNumberRange.length;
    if (bus.reservedBusUnitNumber) {
      validCombCount --;
    }
    // check if there is enough combinations for given disks
    if (validCombCount < element.length) {
      const err = new HttpExceptions().badRequest();
      err.message = 'invalid adaptor type';
      return Promise.reject(err);
    }
    // bus number
    let i = 0;
    // index is number of assigned disk adaptor combinations
    let index = 0;
    while (index < element.length) {
      // unit number
      let j = 0;
      while (index < element.length && j < validUnitNumberRange.length) {
        let combExists = false;
        // checks old combs
        for (const oldDisk of oldCombinations[key]) {
          if (oldDisk.unitNumber == validUnitNumberRange[j] && oldDisk.busNumber == validBusNumberRange[i]) {
            combExists = true;
          }
          if ((oldDisk.adapterType == 3 || oldDisk.adapterType == 4 || oldDisk.adapterType == 2) && element[index].adapterType == 5) {
            if (oldDisk.busNumber == validBusNumberRange[i]) {
              combExists = true;
            }
          }
          if ((element[index].adapterType == 3 || element[index].adapterType == 4 || element[index].adapterType == 2) && oldDisk.adapterType == 5) {
            if (oldDisk.busNumber == validBusNumberRange[i]) {
              combExists = true;
            }
          }
        }
        // checks new combs
        for (const otherDisk of element) {
          // check if combination is duplicate
          if (otherDisk.unitNumber == validUnitNumberRange[j] && otherDisk.busNumber == validBusNumberRange[i]) {
            combExists = true;
          }
          // اداپتور با ایدی 5 نباید باس یکسان با بقیه اداپتور های اسکازی داشته باشد
          if ((otherDisk.adapterType == 3 || otherDisk.adapterType == 4 || otherDisk.adapterType == 2) && element[index].adapterType == 5) {
            if (otherDisk.busNumber == validBusNumberRange[i]) {
              combExists = true;
            }
          }
          if ((element[index].adapterType == 3 || element[index].adapterType == 4 || element[index].adapterType == 2) && otherDisk.adapterType == 5) {
            if (otherDisk.busNumber == validBusNumberRange[i]) {
              combExists = true;
            }
          }
        }
        if (
          bus.reservedBusUnitNumber && bus.reservedBusUnitNumber.unitNumber ==
          validUnitNumberRange[j] && bus.reservedBusUnitNumber.busNumber === validBusNumberRange[i]) {
          combExists = true;
        }
        if (! combExists) {
          element[index].unitNumber = validUnitNumberRange[j];
          element[index].busNumber = validBusNumberRange[i];
          index++;
        }
        j++;
      }
      i ++;
    }
  }
  console.log(combinations, '💀💀💀');
  return combinations;
}
async function getHardDiskControllers(authToken, vdcId) {
  const hardwareInfo = await getHardwareInfo(authToken, vdcId);
  console.log(hardwareInfo);
  const adaptors = {};
  hardwareInfo.hardDiskAdapter.forEach((adaptor) => {
    const busNumberRanges = adaptor.busNumberRanges.range.map((range) => {
      return {
        begin: range.begin,
        end: range.end,
      };
    });
    const unitNumberRanges = adaptor.unitNumberRanges.range.map((range) => {
      return {
        begin: range.begin,
        end: range.end,
      };
    });
    adaptors[adaptor.id] = {
      id: adaptor.id,
      busNumberRanges,
      legacyId: adaptor.legacyId,
      name: adaptor.name,
      reservedBusUnitNumber: adaptor.reservedBusUnitNumber,
      unitNumberRanges,
    };
  });
  const controllers = {};
  Object.keys(adaptors).forEach((key) => {
    controllers[adaptors[key].legacyId] = adaptors[key];
  });
  return controllers;
}
module.exports = userUpdateDiskSection;
