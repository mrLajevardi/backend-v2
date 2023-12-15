import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import process from 'process';
import axios from 'axios';
import * as fs from 'fs';

@Injectable()
export class VitrificationServiceService {
  async checkUserVerification(phoneNumber: string, nationalCode: string) {
    const secondsSinceEpoch: number = Math.floor(Date.now() / 1000);

    const timeString = new Date()
      .toISOString()
      .slice(11, -1)
      .replace(/[:.]/g, '');

    // const requestId = `${process.env.SHAHKAR_COMPANY_CODE}20231213${timeString}000`;
    const requestId = `127920231213${timeString}000`;

    const accessToken = 'bearer af7542d5-58be-4195-8bb7-ff85efb31a62';

    const hashedPhoneNumber: string = await this.getEncryptedToken(
      phoneNumber,
      secondsSinceEpoch,
    );
    const hashedNationalCode: string = await this.getEncryptedToken(
      nationalCode,
      secondsSinceEpoch,
    );

    console.log(hashedNationalCode, hashedPhoneNumber);
    // const testReq = await axios.post('https://op1.pgsb.ir/api/client/apim/v1/shahkaar/gwsh/serviceIDmatchingencrypted', {
    //     requestId: requestId,
    //     serviceNumber: hashedPhoneNumber,
    //     identificationNo: hashedNationalCode,
    //     identificationType: 0,
    //     serviceType: 2
    // }, {
    //     headers: {
    //         'pid': '656b2931951e980c88fc5983',
    //         'ext_username': 'Arad_cloud_pgsb',
    //         'ext_password': 'PhrJYy98WX8B',
    //         'Authorization': accessToken,
    //     }
    // })
    // console.log(testReq.data, testReq.status)
    //
    //
    // return testReq;
  }

  async getEncryptedToken(inputData: string, inputIat: number) {
    const key2 = `-----BEGIN PUBLIC KEY-----
MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQBZOZhO0214Wm243NHFcu9cwKizgfx
cb3ZgOqH2jBb1nxExxjvwS8z7JKBjvdlM9yegAUoG6Q1wxFoaeKB2gl72zEBijiB
mXcaKtmaB8RB37NywQMibdTHBbNZ9nNSfPYF0x4kSv7wG810N407cUdAJ7qYjRhc
AfsnkdIhwvexpDflhD4=
-----END PUBLIC KEY-----`;

    // const publicKey = fs.readFileSync('./public_key.pem', 'utf8');

    const asymmetricJwkKey = crypto.createPublicKey({
      key: key2,
      format: 'pem',
      type: 'spki',
    });

    const payload = {
      data: inputData,
      iat: inputIat,
    };

    const jsonPayload = JSON.stringify(payload);

    // Encryption part might differ based on the available crypto libraries in JavaScript/TypeScript
    // Below is a placeholder for encryption using asymmetricJwkKey
    const encryptedPayload = crypto.publicEncrypt(
      {
        key: asymmetricJwkKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256',
      },
      Buffer.from(jsonPayload, 'utf8'),
    );

    const encryptedToken = encryptedPayload.toString('base64'); // Convert to base64

    return encryptedToken;
  }
}
