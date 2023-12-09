import { DiskItemCodes } from '../../base/itemType/enum/item-type-codes.enum';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const GetCodeDisk = (diskTitle: string) => {
  const itemsDiskCodes = Object.keys(DiskItemCodes);
  let diskCode = '';

  itemsDiskCodes.forEach((item) => {
    if (diskTitle.trim().toLowerCase().includes(item.trim().toLowerCase())) {
      diskCode = item.toLowerCase();
    }
  });
  return diskCode;
};
