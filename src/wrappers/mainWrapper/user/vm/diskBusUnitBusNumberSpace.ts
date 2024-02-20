import { DiskAdaptorTypeEnum } from '../../../../application/vm/enums/disk-adaptor-type.enum';

export const DiskBusUnitBusNumberSpace = [
  {
    // BusUnit ==> BusNumber (Excel !!)
    // BusNumber ==> UnitNumber (Excel !! )
    name: 'IDE',
    //IDE
    info: [
      // { busUnit: 0, busNumber: 0 },
      { busUnit: 0, busNumber: 1, isChosen: 0 },
      { busUnit: 1, busNumber: 0, isChosen: 0 },
      // { busUnit: 0, busNumber: 3 },
    ],
    legacyId: 1,
    usable: true,
  },
  {
    name: 'BUS_LOGIC_PARALLEL',

    //BUS_LOGIC_PARALLEL //RESERVED !!!!
    info: [
      { busUnit: 0, busNumber: 0, isChosen: 0 },
      { busUnit: 0, busNumber: 1, isChosen: 0 },
      { busUnit: 0, busNumber: 2, isChosen: 0 },
      { busUnit: 0, busNumber: 3, isChosen: 0 },
    ],
    legacyId: 2,
    usable: false,
  },
  {
    legacyId: 3,
    usable: true,
    name: 'LSI_LOGIC_PARALLEL',

    //LSI_LOGIC_PARALLEL
    info: [
      { busUnit: 2, busNumber: 0, isChosen: 0 },
      { busUnit: 2, busNumber: 1, isChosen: 0 },
      { busUnit: 2, busNumber: 2, isChosen: 0 },
      { busUnit: 2, busNumber: 3, isChosen: 0 },
    ],
  },
  {
    legacyId: 4,
    usable: true,
    name: 'LSI_LOGIC_SAS',
    //LSI_LOGIC_SAS
    info: [
      { busUnit: 0, busNumber: 0, isChosen: 0 },
      { busUnit: 0, busNumber: 1, isChosen: 0 },
      { busUnit: 0, busNumber: 2, isChosen: 0 },
      { busUnit: 0, busNumber: 3, isChosen: 0 },
    ],
  },

  {
    //PARA_VIRTUAL_SCSI
    legacyId: 5,
    usable: true,
    name: 'PARA_VIRTUAL_SCSI',
    info: [
      { busUnit: 1, busNumber: 0, isChosen: 0 },
      { busUnit: 1, busNumber: 1, isChosen: 0 },
      { busUnit: 1, busNumber: 2, isChosen: 0 },
      { busUnit: 1, busNumber: 3, isChosen: 0 },
    ],
  },
  {
    //SATA
    legacyId: 6,
    usable: true,
    name: 'SATA',
    info: [
      { busUnit: 0, busNumber: 0, isChosen: 0 },
      { busUnit: 0, busNumber: 1, isChosen: 0 },
      { busUnit: 0, busNumber: 2, isChosen: 0 },
      { busUnit: 0, busNumber: 3, isChosen: 0 },
    ],
  },
  {
    //NVME
    legacyId: 7,
    usable: true,
    name: 'NVME',
    info: [
      { busUnit: 0, busNumber: 0, isChosen: 0 },
      { busUnit: 0, busNumber: 1, isChosen: 0 },
      { busUnit: 0, busNumber: 2, isChosen: 0 },
      { busUnit: 0, busNumber: 3, isChosen: 0 },
    ],
  },
];
