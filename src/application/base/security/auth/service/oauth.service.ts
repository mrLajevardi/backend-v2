import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as https from 'https';
import { UserTableService } from 'src/application/base/crud/user-table/user-table.service';
import { BadRequestException } from 'src/infrastructure/exceptions/bad-request.exception';
import jwt from 'jsonwebtoken'
import { DisabledUserException } from 'src/infrastructure/exceptions/disabled-user.exception';
import { AuthService } from './auth.service';
import { throws } from 'assert';


@Injectable()
export class OauthService {

    constructor(
        private readonly userTable: UserTableService,
        private readonly authService: AuthService,
    ) { }

    async googleOauth(token)  {
        let email;
        let error;
        let verified = false;
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });
        try {
            const checkEmail = await axios.post(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`, {
                httpsAgent,
            });
            if (!checkEmail.data.verified_email) {
                error = new BadRequestException()
            }
            email = checkEmail.data.email;
            verified = true;
        } catch (err) {
            error = new BadRequestException("bad request", err);
        }
        return {
            error,
            verified,
            email,
        };
    }

    async githubOauth(code) {
        let email;
        let error;
        let verified = false;
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });

        try {
            const checkCode = await axios.post('https://github.com/login/oauth/access_token', {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code: code,
            }, {
                httpsAgent,
                headers: {
                    Accept: 'application/json',
                },
            });
            if (checkCode.data.error) {
                error = new BadRequestException()
            }
            const accessToken = checkCode.data.access_token;
            const checkEmail = await axios.get(`https://api.github.com/user`, {
                httpsAgent,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!checkEmail.data.email) {
                error = new BadRequestException()
                error.code = 'NO_EMAIL_REGISTERED';
            }
            email = checkEmail.data.email;
            verified = true;
        } catch (err) {
            console.log(err);
            error = new BadRequestException()
        }
        return {
            error,
            verified,
            email,
        };
    }

    async linkedinOauth(code) {
        let email;
        let error;
        let verified = false;
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false,
        });
        try {
            const checkCode = await axios.post('https://www.linkedin.com/oauth/v2/accessToken', null, {
                httpsAgent,
                headers: {
                    Accept: 'application/json',
                },
                params: {
                    grant_type: 'authorization_code',
                    client_id: '861dzg8q5lonwt',
                    client_secret: 'SQbP2qqMyGbNQVJL',
                    code: code,
                    redirect_uri: 'https://panel.aradcloud.ir/authentication/login',
                },
            });
            const accessToken = checkCode.data.access_token;
            const checkEmail = await axios.get(`https://api.linkedin.com/v2/clientAwareMemberHandles?q=members&projection=(elements*(primary,type,handle~))`, {
                httpsAgent,
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            console.log(checkEmail.data);

            if (!(checkEmail.data?.elements.length === 0)) {
                error = new BadRequestException();
                error.code = 'NO_EMAIL_REGISTERED';
            }

            const primaryEmail = checkEmail.data?.elements.filter((elem) => elem.primary);
            email = primaryEmail['handle~']?.emailAddress;
            verified = true;
        } catch (err) {
            console.log(err);
            error = new BadRequestException();
        }
        return {
            error,
            verified,
            email,
        };
    }

    async verifyGoogleOauth(token : string ) {
        const check = await this.googleOauth(token);
        const { email, verified, error } = check;
        console.log(email, '😉');
        if (error) {
            return error; 
        }
        const user = await this.userTable.findOne({
            where: {
                and: [
                    { email },
                ],
            },
        });
        if (!user) {
            const payload = {
                email,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
                expiresIn: 60 * 2, // 2 min
            });
            return Promise.resolve({
                userExists: false,
                emailToken: token,
            });
        }
        if (!user.active) {
            return Promise.reject(new DisabledUserException());
        }
        const ttl = process.env.USER_OPTIONS_TTL;

        return this.authService.login(user);
    };

    async verifyLinkedinOauth(code) {
        const check = await this.linkedinOauth(code);
        const { email, verified, error } = check;
        if (error) {
            return Promise.reject(error);
        }
        const user = await this.userTable.findOne({
            where: {
                and: [
                    { email },
                ],
            },
        });
        if (!user) {
            const payload = {
                email,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
                expiresIn: 60 * 2, // 2 min
            });
            return Promise.resolve({
                userExists: false,
                emailToken: token,
            });
        }
        if (!user.active) {
            return Promise.reject(new DisabledUserException());
        }

        return this.authService.login(user);
    };

    async verifyGithubOauth(code : string ) {
        const check = await this.githubOauth(code);
        const { email, verified, error } = check;
        if (error) {
            return Promise.reject(error);
        }
        const user = await this.userTable.findOne({
            where: {
                and: [
                    { email },
                ],
            },
        });
        if (!user) {
            const payload = {
                email,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
                expiresIn: 60 * 2, // 2 min
            });
            return Promise.resolve({
                userExists: false,
                emailToken: token,
            });
        }
        if (!user.active) {
            return Promise.reject(new DisabledUserException());
        }
        return this.authService.login(user);
    };

}
