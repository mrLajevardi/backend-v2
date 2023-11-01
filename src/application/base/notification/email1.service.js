const nodemailer = require('nodemailer');
const jwtService = {};
const process = require('process');
class EmailService {
  constructor() {
    const host = 'mail.aradcloud.ir';
    const port = 587;
    let auth = {
      user: 'no_reply@aradcloud.ir',
      pass: 'z5pwjdqU',
    };
    const secure = false;
    this.from = 'no_reply@aradcloud.ir';
    // console.log(process.env.EMAIL_TLS);
    const tls = { rejectUnauthorized: false };
    // create transporter object
    // let options: nodemailer.TransportOptions;

    if (!auth.user) {
      auth = null;
    }

    const op = {
      port: port,
      host: host,
      auth: auth,
      from: this.from,
      secure: secure, // Use TLS
      tls: tls,
    };
    console.log(op);
    this.transporter = nodemailer.createTransport(op);
  }

  async sendMail(options) {
    const message = {
      ...options,
      from: this.from,
    };
    await this.transporter.sendMail(message);
  }

  async createLink(url, id, tokenType) {
    const payload = {
      id: id,
      sub: tokenType,
    };

    const jwtService = {};
    const token = jwtService.sign(payload);
    console.log(token);
    const link = url + token;
    return { link, token };
  }
}

(function () {
  const e = new EmailService();
  e.sendMail({
    subject: 'hello',
    to: 'lajevardi321@gmail.com',
    text: 'hello',
  })
    .then(() => {
      console.log('🍖🍖🍖');
    })
    .catch(console.error);
})();
