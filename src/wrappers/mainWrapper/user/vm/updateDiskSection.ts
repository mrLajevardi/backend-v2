import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';

/* eslint-disable guard-for-in */
import { VcloudWrapper } from '../../../vcloudWrapper/vcloudWrapper';
import { vdcWrapper } from '../vdc/vdcWrapper';
import { userGetVApp } from './getVapp';
import { vcdConfig } from '../../vcdConfig';
import { groupBy } from '../../../../infrastructure/utils/extensions/array.extensions';
import { DiskBusUnitBusNumberSpace } from './diskBusUnitBusNumberSpace';
/**
 *
 * @param {String} authToken
 * @param {String} vmId
 * @param {Object} diskSettings user disk settings
 * @return {Promise}
 */
function getBusUnitBusNumberFree(
  disksBusnumberBusUnitGrouped: Record<string, unknown[]>,
  // adapterType: string,
): Record<string, { busUnit: number; busNumber: number }[]> {
  const res: Record<string, { busUnit: number; busNumber: number }[]> = {};
  for (const adapterType in disksBusnumberBusUnitGrouped) {
    const model = disksBusnumberBusUnitGrouped[adapterType].map((d) => {
      return {
        busNumber: (d as any).busNumber,
        unitNumber: (d as any).unitNumber,
      };
    });
    const freeSpace = DiskBusUnitBusNumberSpace.find(
      (bus) => bus.legacyId == adapterType,
    ).info.filter((s) => {
      const x = model.filter(
        (f) => f.unitNumber == s.busNumber && f.busNumber == s.busUnit,
      );
      if (x.length <= 0) {
        return s;
      }
    });
    res[adapterType] = freeSpace;
  }
  return res;
}
export async function userUpdateDiskSection(
  authToken,
  vmId,
  diskSettings,
  vdcId,
): Promise<{ __vcloudTask: any }> {
  const vmInfo = await userGetVApp(authToken, vmId);
  // const hardwareInfo = await this.vdcWrapperService.getHardwareInfo(
  //   authToken,
  //   vdcId,
  // );
  const vmInfoData = vmInfo.data;
  // const controllers = await calcBusCombination(diskSettings, authToken, vdcId);

  const vmSpecSection = vmInfoData.section.find(
    (section) => section._type === 'VmSpecSectionType',
  );

  const disksGroupedByAdapterType = groupBy(
    diskSettings,
    (disk) => (disk as any).adapterType.legacyId,
  );

  const diskFreeByAdaptorType = getBusUnitBusNumberFree(
    disksGroupedByAdapterType,
    // settings.adapterType,
  );

  // vmInfoData.section.forEach((section) => {
  //   if (section._type === 'VmSpecSectionType') {
  const updatedDiskSettings = [];
  vmSpecSection.modified = true;
  vmSpecSection.diskSection.diskSettings.forEach((diskSection) => {
    diskSettings.forEach((settings) => {
      if (settings.id === diskSection.diskId) {
        const updatedSetting = {
          ...diskSection,
          // busNumber: diskSection.busNumber,
          // unitNumber: diskSection.unitNumber,
          // storageProfile: {
          //   _href: `${vcdConfig.baseUrl}/${vcdConfig.user.storageProfile.name}/${settings.storageId}`,
          //   _type: diskSection.storageProfile.type,
          //   __prefix: diskSection.storageProfile.prefix,
          //   // "__prefix": "root"?
          // },
          adapterType: settings.adapterType.legacyId.toString(),
          sizeMb: settings.size,
        };
        updatedSetting.overrideVmDefault = true;
        updatedSetting.storageProfile.href = `${vcdConfig.baseUrl}/${vcdConfig.user.storageProfile.name}/${settings.storageId}`;
        updatedSetting.storageProfile.id = `urn:vcloud:vdcstorageProfile:${settings.storageId}`;
        // updatedSetting.storageProfile.name = 'ssffs';
        // updatedSetting.storageProfile.name = 'ARAD-Tier-Fast-Amin';
        updatedDiskSettings.push(updatedSetting);
      }
    });
  });

  // const xx = t.map(d=>)

  diskSettings.forEach((settings) => {
    // let targetAdaptor = settings.adapterType;
    // if (targetAdaptor == '3' || targetAdaptor == '5' || targetAdaptor == 2) {
    //   targetAdaptor = '4';
    // }
    if (settings.id === null) {
      // const free = getBusUnitBusNumberFree(
      //   disksGroupedByAdapterType,
      //   // settings.adapterType,
      // );

      const uniNumber = (
        diskFreeByAdaptorType[settings.adapterType.legacyId] as any[]
      )[0].busNumber;

      const busNumber = (
        diskFreeByAdaptorType[settings.adapterType.legacyId] as any[]
      )[0].busUnit;
      // console.log(targetAdaptor, controllers, '👌👌');
      const newSetting = {
        sizeMb: settings.size,
        // unitNumber: controllers[targetAdaptor][0].unitNumber,
        unitNumber: uniNumber,
        // busNumber: controllers[targetAdaptor][0].busNumber,
        busNumber: busNumber,
        adapterType: settings.adapterType.legacyId,
        thinProvisioned: true,
        overrideVmDefault: false,
        virtualQuantityUnit: 'byte',
        iops: 0,
      };
      updatedDiskSettings.push(newSetting);
      // controllers[targetAdaptor].splice(0, 1);
    }
  });
  vmSpecSection.diskSection.diskSettings = updatedDiskSettings;
  console.log(updatedDiskSettings, '❤️❤️❤️');

  // vmInfoData.storageProfile = updatedDiskSettings[0];
  // }
  // });
  const diskSection = await new VcloudWrapper().posts('user.vm.updateVm', {
    headers: { Authorization: `Bearer ${authToken}` },
    urlParams: { vmId },
    body: vmInfoData,
  });
  return Promise.resolve({
    __vcloudTask: diskSection.headers['location'],
  });
}

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
  let bus;
  let element = null;
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
    let validCombCount =
      validBusNumberRange.length * validUnitNumberRange.length;
    if (bus.reservedBusUnitNumber) {
      validCombCount--;
    } // 32
    // check if there is enough combinations for given disks
    if (validCombCount < element.length) {
      const err = new BadRequestException();
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
          if (
            oldDisk.unitNumber == validUnitNumberRange[j] &&
            oldDisk.busNumber == validBusNumberRange[i]
          ) {
            combExists = true;
          }
          if (
            (oldDisk.adapterType == 3 ||
              oldDisk.adapterType == 4 ||
              oldDisk.adapterType == 2) &&
            element[index].adapterType == 5
          ) {
            if (oldDisk.busNumber == validBusNumberRange[i]) {
              combExists = true;
            }
          }
          if (
            (element[index].adapterType == 3 ||
              element[index].adapterType == 4 ||
              element[index].adapterType == 2) &&
            oldDisk.adapterType == 5
          ) {
            if (oldDisk.busNumber == validBusNumberRange[i]) {
              combExists = true;
            }
          }
        }
        // checks new combs
        for (const otherDisk of element) {
          // check if combination is duplicate
          if (
            otherDisk.unitNumber == validUnitNumberRange[j] &&
            otherDisk.busNumber == validBusNumberRange[i]
          ) {
            combExists = true;
          }
          // اداپتور با ایدی 5 نباید باس یکسان با بقیه اداپتور های اسکازی داشته باشد
          if (
            (otherDisk.adapterType == 3 ||
              otherDisk.adapterType == 4 ||
              otherDisk.adapterType == 2) &&
            element[index].adapterType == 5
          ) {
            if (otherDisk.busNumber == validBusNumberRange[i]) {
              combExists = true;
            }
          }
          if (
            (element[index].adapterType == 3 ||
              element[index].adapterType == 4 ||
              element[index].adapterType == 2) &&
            otherDisk.adapterType == 5
          ) {
            if (otherDisk.busNumber == validBusNumberRange[i]) {
              combExists = true;
            }
          }
        }
        if (
          bus.reservedBusUnitNumber &&
          bus.reservedBusUnitNumber.unitNumber == validUnitNumberRange[j] &&
          bus.reservedBusUnitNumber.busNumber === validBusNumberRange[i]
        ) {
          combExists = true;
        }
        if (!combExists) {
          element[index].unitNumber = validUnitNumberRange[j];
          element[index].busNumber = validBusNumberRange[i];
          index++;
        }
        j++;
      }
      i++;
    }
  }
  console.log(combinations, '💀💀💀');
  return combinations;
}
async function getHardDiskControllers(authToken, vdcId) {
  const hardwareInfo = await vdcWrapper.getHardwareInfo(authToken, vdcId);
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
