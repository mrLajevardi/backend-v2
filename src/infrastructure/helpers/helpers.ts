const {getIPRange} = require('get-ip-range');

const crypto = require('crypto');

export function isEmpty(value){
  if (value === null || value === undefined) {
    return true;
  }
  return false;
};

export function isCidr(cidr){
  const regex = new RegExp('^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$');
  return cidr.match(regex);
};
export function isValidIpRange(range, cidr){
  const ipList = getIPRange(cidr);
  const startAddressExist = ipList.includes(range.startAddress);
  const endAddressExist = ipList.includes(range.endAddress);
  if (startAddressExist && endAddressExist) {
    if (ipList.indexOf(range.startAddress) < ipList.indexOf(range.endAddress)) {
      return true;
    }
    return false;
  }
  return false;
};

export function hasDuplicates(array) {
  return (new Set(array)).size !== array.length;
};

export function generatePassword(
    length = 32,
    wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$/}{[]+)(&;?<>*',
) {
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
      .map((x) => wishlist[(x as number) % wishlist.length])
      .join('');
};
