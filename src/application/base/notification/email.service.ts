import { Injectable } from '@nestjs/common';
import * as util from 'util';
import jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailService {

    private transporter: nodemailer.Transporter;
    private from: string;
    
    constructor(

    ){
        const host =process.env.EMAIL_HOST;
        const port = 25;
        const auth = {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        };
        const secure = process.env.EMAIL_SECURE;
        this.from = process.env.EMAIL_FROM;
        const tls = process.env.EMAIL_TLS;
        // create transporter object
        let options: nodemailer.TransportOptions;
        
        this.transporter = nodemailer.createTransport({
            port: port,
            host: host,
            auth:auth,
            from: this.from,
        });
    }


    sendMail(options) {
        const message = {
          ...options,
          from: this.from,
        };
        return new Promise((resolve, reject) => {
          this.transporter.sendMail(message, (err, info) => {
            if (err) {
              reject(err);
            } else {
              resolve(info);
            }
          });
        });
      }
    
      async createLink(url, id, tokenType) {
        const payload = {
          id,
          sub: tokenType,
        };
        const generateToken = util.promisify(jwt.sign);
        const token = await generateToken(payload, process.env.EMAIL_JWT_SECRET); //, {expiresIn: '2m'} removed. number of params error
        const link = url + token;
        return {link, token};
      }
}
