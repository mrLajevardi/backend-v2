import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import process from 'process';

@Injectable()
export class VitrificationServiceService {
  async checkUserVerification(phoneNumber: string, nationalCode: string) {
    const secondsSinceEpoch: number = Math.floor(Date.now() / 1000);

    const timeString = new Date()
      .toISOString()
      .slice(11, -1)
      .replace(/[:.]/g, '');
    const requestId = `${process.env.SHAHKAR_COMPANY_CODE}20230628${timeString}000`;
  }

  async getEncryptedToken(inputData: string, inputIat: number) {
    const asymmetricJwkKey = crypto.createPublicKey({
      key: process.env.PUBLIC_KEY_SHAKAR,
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

    console.log(
      `----------------------------------Start ${inputData} --------------------------------`,
    );
    console.log('The Encrypted Payload is:');
    console.log(encryptedPayload);
    console.log();
    console.log('Its base64 form is:');
    console.log(encryptedToken);
    console.log(
      `----------------------------------Finish ${inputData} --------------------------------`,
    );

    return encryptedToken;
  }
}
