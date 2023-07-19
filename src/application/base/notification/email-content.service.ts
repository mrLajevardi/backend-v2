import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailContentService {

    userVerification(link, to) {
        const htmlContent = `<h1>
                <a href=${link}>احراز هویت</a>
            </h1>`;

        return {
            subject: 'احراز هویت',
            to,
            html: htmlContent,
        };
    }

    forgotPassword(link, to) {
        const htmlContent = `<h1>
                <a href=${link}>بازیابی رمز عبور</a>
            </h1>`;

        return {
            subject: 'بازیابی رمز عبور',
            to,
            html: htmlContent,
        };
    }

    serviceExpirationWarning(message, to, subject) {
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
