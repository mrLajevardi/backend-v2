import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ZarinpalService {
  async paymentRequest(data) {
    let authorityCode;
    await axios
      .post('https://api.zarinpal.com/pg/v4/payment/request.json', data)
      .then((res) => {
        authorityCode = res.data.data.authority;
      })
      .catch((err) => (authorityCode = null));
    return authorityCode;
  }
  async paymentVerify(data) {
    let verified;
    let refID = null;
    let metaData: string;
    await axios
      .post('https://api.zarinpal.com/pg/v4/payment/verify.json', data)
      .then(async (res) => {
        await axios
          .post('https://api.zarinpal.com/pg/v4/payment/verify.json', data)
          .then((res) => {
            console.log('before if res of zarinpal ==>', res);
            if (
              res.data.data.message === 'Verified' &&
              (res.data.data.code === 100 || res.data.data.code === 101)
            ) {
              console.log('after if res of zarinpal ==>', res);
              verified = true;
              refID = res.data.data.ref_id;
              metaData = res.data.data;
            } else verified = false;
          })
          .catch(
            (err) => {
              console.log('zarinpal error ==>', err);
              verified = false;
            },
            // err.response.data.errors.message,
          );
      })
      .catch(
        (err) => {
          console.log('zarinpal error ==>', err);
          verified = false;
        },
        // err.response.data.errors.message,
      );
    return { verified, refID, metaData };
  }
}
