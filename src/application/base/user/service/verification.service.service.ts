import { Injectable } from '@nestjs/common';
import * as jose from 'node-jose';
import axios from 'axios';
import * as moment from 'moment';
import * as process from 'process';
@Injectable()
export class VerificationServiceService {
  async checkUserVerification(
    phoneNumber: string,
    nationalCode: string,
  ): Promise<{ message: any; status: any }> {
    const dateInUTC = new Date();

    const dateInTehran = new Date(
      dateInUTC.toLocaleString('en-US', { timeZone: 'Asia/Tehran' }),
    );

    console.log(dateInTehran.getTime());

    const secondsSinceEpoch: number = Math.floor(dateInTehran.getTime() / 1000);
    const timeString = moment().zone('+0330').format('YYYYMMDDHHmmssSSS');

    const requestId = `1279${timeString}000`;

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

    const accessToken = 'Bearer ' + getAccessToken.data.access_token;

    const hashedPhoneNumber: string = await this.getEncryptedToken(
      phoneNumber,
      secondsSinceEpoch,
    );
    const hashedNationalCode: string = await this.getEncryptedToken(
      nationalCode,
      secondsSinceEpoch,
    );

    const verificationRequest = await axios.post(
      'https://op1.pgsb.ir/api/client/apim/v1/shahkaar/gwsh/serviceIDmatchingencrypted',
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
          Authorization: accessToken,
          basicAuthorization: 'Basic QXJhZF9jbG91ZF9wZ3NiOlBockpZeTk4V1g4Qg==',
        },
      },
    );

    const status =
      verificationRequest?.data?.result?.data?.result?.data?.response ?? 400;

    const comment =
      verificationRequest?.data?.result?.data?.result?.data?.comment ?? null;

    const data: any = {
      status: status,
      message: comment,
    };

    switch (status) {
      case 200:
        return data;
      case 600:
        return {
          status: 422,
          message: 'user.messages.personalCodeNotMatch',
        };
      default:
        return {
          status: 400,
          message: 'user.messages.shakarFailed',
        };
    }
  }

  async getEncryptedToken(inputData: string, inputIat: number) {
    const pemKey = process.env.SHAHKAR_PEM_KEY;

    const asymmetricJwkKey = await jose.JWK.asKey(pemKey, 'pem');

    const payload = {
      data: inputData,
      iat: inputIat,
    };

    const jsonPayload = JSON.stringify(payload);

    const jwe = await jose.JWE.createEncrypt(
      {
        format: 'compact',
        fields: {
          alg: 'ECDH-ES+A256KW',
          enc: 'A256GCM',
        },
      },
      asymmetricJwkKey,
    )
      .update(Buffer.from(jsonPayload))
      .final();

    console.log(jwe);

    return jwe;
  }

  isValidIranianNationalCode(input: string) {
    if (!/^\d{10}$/.test(input)) return false;
    const check = +input[9];
    const sum =
      input
        .split('')
        .slice(0, 9)
        .reduce((acc, x, i) => acc + +x * (10 - i), 0) % 11;
    return sum < 2 ? check === sum : check + sum === 11;
  }
}
