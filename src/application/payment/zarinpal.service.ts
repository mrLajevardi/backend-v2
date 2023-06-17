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
    await axios
        .post('https://api.zarinpal.com/pg/v4/payment/verify.json', data)
        .then((res) => {
            if (
            res.data.data.message === 'Verified' &&
            (res.data.data.code === 100 || res.data.data.code === 101)
            ) {
            verified = true;
            refID = res.data.data.ref_id;
            } else verified = false;
        })
        .catch(
            (err) =>
            // err.response.data.errors.message,
                (verified = false),
        );
    return {verified, refID};
    }
}
