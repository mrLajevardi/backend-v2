import { getIPRange } from 'get-ip-range';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

export function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }
  return false;
}

export function isCidr(cidr) {
  const regex = new RegExp(
    '^([0-9]{1,3}.){3}[0-9]{1,3}(/([0-9]|[1-2][0-9]|3[0-2]))?$',
  );
  return cidr.match(regex);
}
export function isValidIpRange(range, cidr) {
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
}

export function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}

// compare two passwordes
export async function comparePassword(
  hashed: string,
  plain: string,
): Promise<boolean> {
  return await bcrypt.compare(plain, hashed);
}

// encrypt password
export async function encryptPassword(plain: string): Promise<string> {
  const saltRounds = 10; // Number of salt rounds, you can adjust as per your requirements
  const hashedPassword = await bcrypt.hash(plain, saltRounds);
  return hashedPassword;
}

export function generatePassword(
  length = 32,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$/}{[]+)(&;?<>*',
) {
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[(x as number) % wishlist.length])
    .join('');
}


export function  stringToEnum<T>(str: string, enumObj: T): T[keyof T] | undefined {
  const enumValues = Object.values(enumObj) as unknown as T[keyof T][];
  const enumKey = enumValues.find((value) => value === str);
  return enumKey;
}