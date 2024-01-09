import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';
import * as jose from 'node-jose';
import axios from 'axios';

@Injectable()
export class VitrificationServiceService {
  async checkUserVerification(phoneNumber: string, nationalCode: string) {
    const secondsSinceEpoch: number = Math.floor(Date.now() / 1000);

    const timeString = new Date()
      .toISOString()
      .slice(11, -1)
      .replace(/[:.]/g, '');

    const requestId = `127920231213${timeString}000`;
    const basicAuth =
      'Basic MmRjNmU3ZWEwNTNjNGEzZmEyYTJjZWUxMWJiYjkwZmM6QzVocEwwMGxtREpSbndFTQ==';
    const getAccessToken = await axios.post(
      'https://op1.pgsb.ir/oauth/token',
      {
        grant_type: 'password',
        username: 'donyayearad',
        password: 'Se%0h9d!jA6',
      },
      {
        headers: {
          Authorization: basicAuth,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const accessToken =
      getAccessToken.data.token_type + ' ' + getAccessToken.data.access_token;

    const hashedPhoneNumber: string = await this.getEncryptedToken(
      phoneNumber,
      secondsSinceEpoch,
    );
    const hashedNationalCode: string = await this.getEncryptedToken(
      nationalCode,
      secondsSinceEpoch,
    );

    const testReq = await axios.post(
      'https://op1.pgsb.ir/api/client/apim/v1/shahkaar/gwsh/ser-viceIDmatchingencrypted',
      {
        requestId: requestId,
        serviceNumber: hashedPhoneNumber,
        identificationNo: hashedNationalCode,
        identificationType: 0,
        serviceType: 2,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          pid: '656b2931951e980c88fc5983',
          ext_username: 'Arad_cloud_pgsb',
          ext_password: 'PhrJYy98WX8B',
          Authorization: accessToken,
          basicAuthorization: basicAuth,
        },
      },
    );

    return true;
    // return testReq;
  }

  async getEncryptedToken(inputData: string, inputIat: number) {
    const pemPath = join(__dirname, './public-key.pem');
    const pemKey = fs.readFileSync(pemPath, 'ascii');
    const asymmetricJwkKey = await jose.JWK.asKey(pemKey, 'pem');

    const payload = {
      data: inputData,
      iat: inputIat,
    };

    const jsonPayload = JSON.stringify(payload);

    const asyDescriptorPlainText = {
      key: asymmetricJwkKey,
      fields: {
        alg: 'ECDH-ES+A256KW',
        enc: 'A256GCM',
      },
      plaintext: Buffer.from(jsonPayload),
    };

    const jwe = (await jose.JWE.createEncrypt(asyDescriptorPlainText as any)
      .update(asymmetricJwkKey)
      .final()) as any;

    return jwe.protected.toString();
  }
}
