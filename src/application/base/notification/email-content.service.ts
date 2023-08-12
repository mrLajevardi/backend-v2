import { Injectable } from '@nestjs/common';
import { MailOptions } from 'nodemailer/lib/json-transport';

@Injectable()
export class EmailContentService {
  userVerification(link: string, to: string): MailOptions {
    const htmlContent = `<h1>
                <a href=${link}>احراز هویت</a>
            </h1>`;

    return {
      subject: 'احراز هویت',
      to,
      html: htmlContent,
    };
  }

  forgotPassword(link: string, to: string): MailOptions {
    const htmlContent = `<h1>
                <a href=${link}>بازیابی رمز عبور</a>
            </h1>`;

    return {
      subject: 'بازیابی رمز عبور',
      to,
      html: htmlContent,
    };
  }

  serviceExpirationWarning(
    message: string,
    to: string,
    subject: string,
  ): MailOptions {
    const htmlContent = `<h4 dir="rtl">
            ${message}
        </h4>`;
    return {
      subject,
      to,
      html: htmlContent,
    };
  }
}
