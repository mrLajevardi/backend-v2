import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { CreateLinkDto } from './dto/create-link.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor() {
    const host = process.env.EMAIL_HOST;
    const port = 25;
    let auth = {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    };
    const secure = process.env.EMAIL_SECURE?.toLowerCase() === 'true';
    this.from = process.env.EMAIL_FROM;
    console.log(process.env.EMAIL_TLS);
    const tls = process.env.EMAIL_TLS
      ? JSON.parse(process.env.EMAIL_TLS)
      : null;
    // create transporter object
    // let options: nodemailer.TransportOptions;

    if (!auth.user) {
      auth = null;
    }

    this.transporter = nodemailer.createTransport({
      port: port,
      host: host,
      auth: auth,
      from: this.from,
      secure: secure, // Use TLS
      tls: tls,
    });
  }

  async sendMail(options: MailOptions): Promise<void> {
    const message = {
      ...options,
      from: this.from,
    };
    await this.transporter.sendMail(message);
  }

  async createLink(
    url: string,
    id: number,
    tokenType: string,
  ): Promise<CreateLinkDto> {
    const payload = {
      id: id,
      sub: tokenType,
    };

    const jwtService = new JwtService({ secret: process.env.EMAIL_JWT_SECRET });
    const token = jwtService.sign(payload);
    console.log(token);
    const link = url + token;
    return { link, token };
  }
}
