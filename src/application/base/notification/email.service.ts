import { Injectable } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import { CreateLinkDto } from './dto/create-link.dto';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private from: string;

  constructor() {
    const host = process.env.EMAIL_HOST;
    const port = 25;
    const auth = {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    };
    const secure = process.env.EMAIL_SECURE.toLowerCase() === 'true';
    this.from = process.env.EMAIL_FROM;
    const tls = process.env.EMAIL_TLS as any;
    // create transporter object
    // let options: nodemailer.TransportOptions;

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
    const token = jwt.sign(payload, process.env.EMAIL_JWT_SECRET);
    const link = url + token;
    return { link, token };
  }
}
