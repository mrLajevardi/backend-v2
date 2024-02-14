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
      sender: process.env.EMAIL_FROM,
      subject,
      to,
      html: htmlContent,
    };
  }

  twoFactorAuth(code: string, to: string): MailOptions {
    const htmlContent = `<h4 dir="rtl">
        کد ورود شما :
        <br>
        ${code}
        </h4>`;

    return {
      subject: 'کد ورود دو مرحله ای',
      to,
      html: htmlContent,
    };
  }

  emailVerification(code: string, to: string): MailOptions {
    const htmlContent = `<h4 dir="rtl">
        کد تایید شما :
        <br>
        ${code}
        </h4>`;

    return {
      subject: 'کد تایید',
      to,
      html: htmlContent,
    };
  }
}
