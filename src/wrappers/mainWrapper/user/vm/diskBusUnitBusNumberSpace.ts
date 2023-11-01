import { DiskAdaptorTypeEnum } from '../../../../application/vm/enums/disk-adaptor-type.enum';

export const DiskBusUnitBusNumberSpace = {
  // BusUnit ==> BusNumber (Excel !!)
  // BusNumber ==> UnitNumber (Excel !! )

  //IDE
  1: [
    // { busUnit: 0, busNumber: 0 },
    { busUnit: 0, busNumber: 1 },
    { busUnit: 1, busNumber: 0 },
    // { busUnit: 0, busNumber: 3 },
  ],
  //BUS_LOGIC_PARALLEL //RESERVED !!!!
  2: [
    { busUnit: 0, busNumber: 0 },
    { busUnit: 0, busNumber: 1 },
    { busUnit: 0, busNumber: 2 },
    { busUnit: 0, busNumber: 3 },
  ],
  //LSI_LOGIC_PARALLEL
  3: [
    { busUnit: 2, busNumber: 0 },
    { busUnit: 2, busNumber: 1 },
    { busUnit: 2, busNumber: 2 },
    { busUnit: 2, busNumber: 3 },
  ],
  //LSI_LOGIC_SAS
  4: [
    { busUnit: 0, busNumber: 0 },
    { busUnit: 0, busNumber: 1 },
    { busUnit: 0, busNumber: 2 },
    { busUnit: 0, busNumber: 3 },
  ],
  //PARA_VIRTUAL_SCSI
  5: [
    { busUnit: 1, busNumber: 0 },
    { busUnit: 1, busNumber: 1 },
    { busUnit: 1, busNumber: 2 },
    { busUnit: 1, busNumber: 3 },
  ],
  //SATA
  6: [
    { busUnit: 0, busNumber: 0 },
    { busUnit: 0, busNumber: 1 },
    { busUnit: 0, busNumber: 2 },
    { busUnit: 0, busNumber: 3 },
  ],
  //NVME
  7: [
    { busUnit: 0, busNumber: 0 },
    { busUnit: 0, busNumber: 1 },
    { busUnit: 0, busNumber: 2 },
    { busUnit: 0, busNumber: 3 },
  ],
};
