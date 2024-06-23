import express from 'express';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import moment from 'moment';
import bcrypt from 'bcrypt';

import { errorCodes } from '../core.mjs';
import { issueNewTokenInCookies, removeTokenFromCookies } from './helperFunctions.mjs';

import {
    userModel, otpModel, emailPattern,routeModel,
    passwordPattern, otpPattern, otpMaxAgeInMinutes,
    forgetPasswordOtpModel, forgetPasswordOtpMaxAgeInMinutes,
} from '../schema/index.mjs';

const router = express.Router();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
    },
});

// completed
router.post('/validate-email', async (req, res) => {
    try {
        if (!req.body?.email) {
            res.status(403).send({
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
                message: `provide email in body. example request body:
                {
                    email: "John@gmail.com"
                }
        `,
            });
            return;
        }

        // step 1: check the pattern
        if (!emailPattern.test(req.body.email)) {
            res.status(403).send({
                message: `email is not valid, email must match this pattern: ${emailPattern}`,
                isValid: false,
                isUserAlreadyExist: false,
                errorCode: errorCodes.INVALID_EMAIL,
            });
            return;
        }

        const user = await userModel.findOne({ email: req.body.email }).lean();
        // step 2: check if user already exist
        if (user) {
            res.status(403).send({
                message: 'user already exist with this email',
                isValid: true,
                isAlreadyExist: true,
                errorCode: errorCodes.USER_ALREADY_EXIST,
            });
            return;
        }

        // step 3: if all above conditions are satisfied, then email is valid
        res.send({
            message: 'no user found with this email',
            isValid: true,
            isAlreadyExist: false,
            errorCode: errorCodes.SUCCESS,
        });
    } catch (e) {
        console.error('error getting data mongodb: ', e);
        res.status(500).send({
            message: 'server error, please try later',
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR,
        });
    }
});
router.post('/validate-password', async (req, res) => {
    if (!req.body?.password) {
        res.status(403).send({
            errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
            message: `provide password in body. example request body:
            {
                password: "some$Password"
            }
        `,
        });
        return;
    }

    // step 1: check the pattern
    if (!passwordPattern.test(req.body.password)) {
        res.send({
            message: `password is not valid, password must match this pattern: ${passwordPattern}`,
            isValid: false,
            errorCode: errorCodes.INVALID_PASSWORD,
        });
        return;
    }

    res.send({
        message: 'password is valid',
        isValid: true,
        errorCode: errorCodes.SUCCESS,
    });
});

// completed
router.post('/signup', async (req, res) => {
    try {
        if (
            !req.body?.email
            || !req.body?.userName
            || !req.body?.password
        ) {
            res.status(403).send({
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
                message: `required parameters missing, 
                    example request body:
                    {
                        userName: "Muhammad Awais", 
                        email: "awais@gmail.com",
                        password: "teatPassword123",
                    }
                    Password rules: 
                        1) 8 characters or more
                        2) mix of upper and lowercase.
                        3) at least one digit (0-9).
                        4) May contain special characters
                    `,
            });
            return;
        }

        // step 1: password validation
        if (!passwordPattern.test(req.body?.password)) {
            res.status(403).send({
                message: `password is not valid, password must match this pattern: ${passwordPattern}`,
                errorCode: errorCodes.INVALID_PASSWORD,
            });
            return;
        }

        // step 2: email validation: pattern
        if (!emailPattern.test(req.body?.email)) {
            res.status(403).send({
                message: `email is not valid, email must match this pattern: ${emailPattern}`,
                errorCode: errorCodes.INVALID_EMAIL,
            });
            return;
        }

        const foundUser = await userModel.findOne({ email: req.body?.email }).lean();

        // step 4: validation: user already exist
        if (foundUser) {
            res.status(403).send({
                message: 'user already exist with this email',
                errorCode: errorCodes.USER_ALREADY_EXIST,
            });
            return;
        }

        const passwordHash = await bcrypt.hash(req.body.password, 10);

        await userModel.create({
            userName: req.body?.userName || '',
            email: req.body?.email,
            password: passwordHash,
        });

        res.send({
            message: 'Signup successful',
            errorCode: errorCodes.SUCCESS,
        });
    } catch (e) {
        console.error('error getting data mongodb: ', e);
        res.status(500).send({
            message: 'server error, please try later',
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR,
        });
    }
});

// completed
router.post('/send-email-otp', async (req, res) => {
    if (!req.body?.email) {
        res.status(403).send({
            errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
            message: `provide email in body. example request body:
                {
                    email: "John@gmail.com"
                }
        `,
        });
        return;
    }

    // step 1: check email the pattern
    if (!emailPattern.test(req.body.email)) {
        res.send({
            message: `email is not valid, email must match this pattern: ${emailPattern}`,
            errorCode: errorCodes.INVALID_EMAIL,
        });
        return;
    }

    const user = await userModel.findOne({ email: req.body?.email }).lean();

    // step 2: check if user not exist
    if (!user) {
        res.status(403).send({
            message: 'user not exist',
            errorCode: errorCodes.USER_NOT_EXIST,
        });
        return;
    }

    // step 3: check if email is already verified
    if (user.isEmailVerified) {
        res.status(403).send({
            message: 'email is already verified, please login',
            errorCode: errorCodes.EMAIL_ALREADY_VERIFIED,
        });
        return;
    }

    // get otp for opt time based throttling
    const otp = await otpModel
        .find({
            medium: 'email',
            email: req.body.email,
            createdOn: {
                // getting otp that is created within last 24hr
                $gte: moment().subtract(24, 'hours').toDate(),
            },
        })
        .lean()
        .sort({ _id: -1 })
        .limit(3);

    // time based throttling criteria
    // 1st OTP: No delay.
    // 2nd OTP: 5 minutes delay.
    // 3rd OTP: 1 hour delay.
    // 4th OTP: 24 hours delay.

    if (otp?.length >= 3) { // if three otp created within 24hr
        res.status(405).send({
            message: 'limit exceed, please try again in 24hr',
            errorCode: errorCodes.LIMIT_EXCEED_TRY_IN_24HR,
        });
        return;
    } if (otp?.length === 2) { // if two otp created within 24hr
        // it should be older than 60 minutes
        if (moment().diff(moment(otp[0].createdOn), 'minutes') <= 60) {
            res.status(405).send({
                message: 'limit exceed, wait 60 minutes before sending another OTP',
                errorCode: errorCodes.LIMIT_EXCEED_TRY_IN_60MIN,
            });
            return;
        }
    } else if (otp?.length === 1) { // if only one otp created within 24hr
        // it should be older than 5 minutes
        if (moment().diff(moment(otp[0].createdOn), 'minutes') <= 5) {
            res.status(405).send({
                message: 'limit exceed, wait 5 minutes before sending another OTP',
                errorCode: errorCodes.LIMIT_EXCEED_TRY_IN_5MIN,
            });
            return;
        }
    }
    const otpCodeEmail = otpGenerator.generate(
        6,
        {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        },
    );
    const otpCodeEmailHash = await bcrypt.hash(otpCodeEmail, 10);

    await otpModel.create({
        medium: 'email',
        email: req.body.email,
        otpCode: otpCodeEmailHash,
    });

    await transporter.sendMail({
        from: `"Sambus" <${process.env.USER_EMAIL}>`,
        to: req.body.email,
        subject: 'Sambus - Verify your email',
        html:
            `Hi ${user.userName}! welcome onboard`
            + ` here is your email verification code that is valid`
            + ` for ${otpMaxAgeInMinutes} minutes:`
            + ` <h1>${otpCodeEmail}</h1>`,
    });



    res.send({
        message: 'email otp sent successfully',
        errorCode: errorCodes.SUCCESS,
        otpCodeEmail: otpCodeEmail
    });
});

router.post('/verify-email-otp', async (req, res) => {
    if (!req.body?.email || !req.body?.otpCode) {
        res.status(403).send({
            errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
            message: `provide email and otpCode in body. example request body:
                {
                    email: "John@gmail.com",
                    otpCode: "123456"
                }
        `,
        });
        return;
    }

    // step 1: check email pattern
    if (!emailPattern.test(req.body.email)) {
        res.status(403).send({
            message: `email is not valid, email must match this pattern: ${emailPattern}`,
            errorCode: errorCodes.INVALID_EMAIL,
        });
        return;
    }
    // step 2: check otp pattern
    if (!otpPattern.test(req.body.otpCode)) {
        res.status(403).send({
            message: `OTP is not valid, otp must match this pattern: ${otpPattern}`,
            errorCode: errorCodes.INVALID_OTP,
        });
        return;
    }

    // can not lean this query, calling .save later on
    const user = await userModel.findOne({
        email: req.body?.email,
    }).exec();

    // step 3: check if user not exist
    if (!user || user.isEmailVerified) {
        res.status(403).send({
            message: 'invalid otp',
            errorCode: errorCodes.INVALID_OTP,
        });
        return;
    }

    // get otp from database
    const otp = await otpModel
        .findOne({
            medium: 'email',
            email: req.body.email,
            createdOn: {
                // getting otp that is created within last ${otpMaxAgeInMinutes} minutes
                $gte: moment().subtract(otpMaxAgeInMinutes, 'minutes').toDate(),
            },
        })
        .sort({ _id: -1 })
        .lean();

    // step 5: incase no otp found
    if (!otp) {
        res.status(403).send({
            message: 'invalid otp',
            errorCode: errorCodes.INVALID_OTP,
        });
        return;
    }
    const isOtpMatched = await bcrypt.compare(req.body.otpCode, otp.otpCode);

    if (!isOtpMatched) {
        res.status(403).send({
            message: 'invalid otp',
            errorCode: errorCodes.INVALID_OTP,
        });
        return;
    }

    if (moment().diff(moment(otp?.createdOn), 'minutes') > otpMaxAgeInMinutes) {
        res.status(403).send({
            message: 'invalid otp',
            errorCode: errorCodes.INVALID_OTP,
        });
        return;
    }

    /// //////////it means otp is matched and generated within ${otpMaxAgeInMinutes} minutes

    user.isEmailVerified = true;
    await user.save();

    res.send({
        message: 'email verified successfully',
        errorCode: errorCodes.SUCCESS,
    });
});

router.post('/login', async (req, res) => {
    if (
        !req?.body?.email
        || !req?.body?.password
    ) {
        res.status(403)
            .send({
                errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
                message: `required parameters missing, 
        example request body:
        {
            email: "some@email.com",
            password: "some$password",
        } `,
            });
        return;
    }

    try {
        const user = await userModel.findOne({ email: req?.body?.email }).lean();

        if (!user) { // user not found
            res.status(401).send({
                message: 'email or password incorrect',
                errorCode: errorCodes.INVALID_EMAIL_OR_PASSWORD,
            });
            return;
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);

        if (!isMatch) {
            res.status(401).send({
                message: 'email or password incorrect',
                errorCode: errorCodes.INVALID_EMAIL_OR_PASSWORD,
            });
            return;
        }

        if (!user.isEmailVerified) {
            res.status(403).send({
                message: "email not verified",
                errorCode: errorCodes.EMAIL_NOT_VERIFIED
            });
            return;
        }

        await issueNewTokenInCookies(user, res);

        res.send({
            message: 'login successful',
            errorCode: errorCodes.SUCCESS,
            data: {
                isAdmin: user.isAdmin,
                profilePhoto: user.profilePhoto,
                userName: user.userName,
                email: user.email,
                _id: user._id,
            },
        });
    } catch (e) {
        console.error('error getting data mongodb: ', e);
        res.status(500).send({
            message: 'server error, please try later',
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR,
        });
    }
});

// completed
router.post('/logout', async (req, res) => {
    removeTokenFromCookies(res);

    res.send({
        message: 'logout successful',
        errorCode: errorCodes.SUCCESS,
    });
});

// completed
router.post('/forget-password', async (req, res) => {
    // step 1: check email parameter
    if (!req.body?.email) {
        res.status(403).send({
            errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
            message: `provide email in body. example request body:
                  {
                      email: "John@gmail.com"
                  }
          `,
        });
        return;
    }

    // step 2: check email the pattern
    if (!emailPattern.test(req.body.email)) {
        res.status(403).send({
            message: `email is not valid, email must match this pattern: ${emailPattern}`,
            errorCode: errorCodes.INVALID_EMAIL,
        });
        return;
    }

    const user = await userModel.findOne({ email: req.body?.email }).lean();

    // step 2: check if user exist
    if (!user) {
        res.status(403).send({
            message: 'user not exist',
            errorCode: errorCodes.USER_NOT_EXIST,
        });
        return;
    }

    const otpCodeEmail = otpGenerator.generate(
        6,
        {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        },
    );
    const otpCodeEmailHash = await bcrypt.hash(otpCodeEmail, 10);

    await forgetPasswordOtpModel.create({
        email: user.email,
        otpCodeHash: otpCodeEmailHash,
    });

    const otpCodeDigits = otpCodeEmail.split('');

    await transporter.sendMail({
        from: `"Sambus" <${process.env.USER_EMAIL}>`,
        to: req.body.email,
        subject: 'Sambus - Verify your email',
        html:
            `Hi ${user.userName}! welcome onboard`
            + ` here is your otp code that is valid`
            + ` for ${otpMaxAgeInMinutes} minutes:`
            + ` <h1>${otpCodeDigits}</h1>`,
    });

    res.send({
        message: 'otp sent on email successfully',
        errorCode: errorCodes.SUCCESS,
        otpCodeEmail: otpCodeEmail
    });
});

router.post('/forget-password-verify-otp', async (req, res) => {
    // step 1: check all parameters present
    if (!req.body?.email
        || !req.body?.otpCode) {
        res.status(403).send({
            errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
            message: `provide email and otp in body. example request body:
                  {
                      email: "John@gmail.com",
                      otpCode: "XXXXXX"
                  }
          `,
        });
        return;
    }

    // step 2: check email the pattern
    if (!emailPattern.test(req.body.email)) {
        res.status(403).send({
            message: `email is not valid, email must match this pattern: ${emailPattern}`,
            errorCode: errorCodes.INVALID_EMAIL,
        });
        return;
    }

    // can not lean down calling .save later
    const user = await userModel
        .findOne({ email: req.body?.email })
        .exec();

    // step 4: check if user exist
    if (!user) {
        res.status(403).send({
            message: 'user not exist',
            errorCode: errorCodes.USER_NOT_EXIST,
        });
        return;
    }

    const otp = await forgetPasswordOtpModel
        .findOne({ email: user.email })
        .sort({ _id: -1 })
        .lean();

    // step 5: check if otp not found
    if (!otp) {
        res.status(403).send({
            message: 'Invalid otp code, not found',
            errorCode: errorCodes.INVALID_OTP,
        });
        return;
    }
    // step 6: check if otp is already used
    if (otp.isUtilized) {
        res.status(403).send({
            message: 'Invalid otp code, already used',
            errorCode: errorCodes.INVALID_OTP,
        });
        return;
    }

    const xMinuteOld = moment().diff(moment(otp.createdOn), 'minutes');

    // step 7: check if otp not older than 15 minutes
    if (xMinuteOld > forgetPasswordOtpMaxAgeInMinutes) {
        res.status(403).send({
            message: 'Invalid otp code, older than 15 minute',
            errorCode: errorCodes.INVALID_OTP,
        });
        return;
    }

    const isOtpMatched = await bcrypt.compare(req.body.otpCode, otp.otpCodeHash);

    // step 8: check otp is incorrect
    if (!isOtpMatched) {
        res.status(403).send({
            message: 'Invalid otp code, not matched',
            errorCode: errorCodes.INVALID_OTP,
        });
        return;
    }

    res.send({
        message: 'otp is valid success, do not use this message for condition checking, use errorCode instead',
        errorCode: errorCodes.SUCCESS,
    });
});

// complete
router.post('/forget-password-complete', async (req, res) => {
    // step 1: check all parameters present
    if (!req.body?.email
        || !req.body?.otpCode
        || !req.body?.newPassword) {
        res.status(403).send({
            errorCode: errorCodes.REQUIRED_PARAMETER_MISSING,
            message: `provide email in body. example request body:
                  {
                      email: "John@gmail.com",
                      newPassword: "XXXXXXXXXXXXX",
                      otpCode: "XXXXXX"
                  }
          `,
        });
        return;
    }

    // step 2: check email the pattern
    if (!emailPattern.test(req.body.email)) {
        res.status(403).send({
            message: `email is not valid, email must match this pattern: ${emailPattern}`,
            errorCode: errorCodes.INVALID_EMAIL,
        });
        return;
    }

    // step 3: check password pattern
    if (!passwordPattern.test(req.body.newPassword)) {
        res.status(403).send({
            message: `password is not valid, password must match this pattern: ${passwordPattern}`,
            isValid: false,
            errorCode: errorCodes.INVALID_PASSWORD,
        });
        return;
    }

    // can not lean down calling .save later
    const user = await userModel
        .findOne({ email: req.body?.email })
        .exec();

    // step 4: check if user exist
    if (!user) {
        res.status(403).send({
            message: 'user not exist',
            errorCode: errorCodes.USER_NOT_EXIST,
        });
        return;
    }

    const otp = await forgetPasswordOtpModel
        .findOne({ email: user.email })
        .sort({ _id: -1 })
        .exec();

    // step 5: check if otp not found
    if (!otp) {
        res.status(403).send({
            message: 'Invalid otp code, not found',
            errorCode: errorCodes.INVALID_OTP,
        });
        return;
    }
    // step 6: check if otp is already used
    if (otp.isUtilized) {
        res.status(403).send({
            message: 'Invalid otp code, already used',
            errorCode: errorCodes.INVALID_OTP,
        });
        return;
    }

    const xMinuteOld = moment().diff(moment(otp.createdOn), 'minutes');

    // step 7: check if otp not older than 15 minutes
    if (xMinuteOld > forgetPasswordOtpMaxAgeInMinutes) {
        res.status(403).send({
            message: 'Invalid otp code, older than 15 minute',
            errorCode: errorCodes.INVALID_OTP,
        });
        return;
    }

    const isOtpMatched = await bcrypt.compare(req.body.otpCode, otp.otpCodeHash);

    // step 8: check otp is incorrect
    if (!isOtpMatched) {
        res.status(403).send({
            message: 'Invalid otp code, not matched',
            errorCode: errorCodes.INVALID_OTP,
        });
        return;
    }

    // step 9: mark otp as used and save in db
    otp.isUtilized = true;

    // const otpSaveResp =
    await otp.save();
    // console.log("otpSaveResp: ", otpSaveResp);

    const passwordHash = await bcrypt.hash(req.body.newPassword, 10);

    // step 10: update user password in db

    // const userSaveResp =
    user.password = passwordHash;
    await user.save();
    // console.log("userSaveResp: ", userSaveResp);

    res.send({
        message: 'your password has been updated, proceed to login',
        errorCode: errorCodes.SUCCESS,
    });
});

router.get('/filter', async (req, res, next) => {
    try {
        const origins = await routeModel.distinct('origin');
        const destinations = await routeModel.distinct('destination');
        const filters = {
            origins: origins,
            destinations: destinations,
        }
        res.status(200).send({
            message: "origins and  destinations",
            data: filters,
            errorCode: errorCodes.SUCCESS,
        })
    } catch (error) {
        res.status(500).send({
            message: "UNKNOWN_SERVER_ERROR",
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR,
        })
    }
})

export default router;
