import express from 'express';
import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import moment from 'moment';
import bcrypt from 'bcrypt';

import { errorCodes } from '../core.mjs';
import { issueNewTokenInCookies, removeTokenFromCookies } from './helperFunctions.mjs';

import {
    userModel, otpModel, emailPattern,
    passwordPattern, otpPattern, otpMaxAgeInMinutes,
    forgetPasswordOtpModel, forgetPasswordOtpMaxAgeInMinutes,
} from '../schema/index.mjs';
import { isValidObjectId } from 'mongoose';

const router = express.Router();

router.get('/profile', async (req, res, next) => {

    if (!req?.user) {
        res.status(401).send({
            errorCode: errorCodes.UNAUTHORIZED,
            message: `tokens not provided`,
        })
        return
    }

    const { _id } = req?.user

    if (!_id) {
        res.status(401).send({
            errorCode: errorCodes.UNAUTHORIZED,
            message: `id not provided`,
        })
        return
    }

    if (!isValidObjectId(_id)) {
        res.status(401).send({
            errorCode: errorCodes.UNAUTHORIZED,
            message: `invalid id`,
        })
        return
    }

    try {

        const user = await userModel.findById(_id).lean().exec()

        if (!user) {
            res.status(404).send({
                errorCode: errorCodes.USER_NOT_EXIST,
                message: `account not found`,
            })
            return
        }

        if(!user?.isEmailVerified){
            res.status(403).send({
                errorCode: errorCodes.EMAIL_NOT_VERIFIED,
                message: `email not verified`,
            })
            return
        }

        res.send({
            errorCode: errorCodes.SUCCESS,
            message: "account fetched",
            data: {
                userName: user?.userName,
                email: user?.email,
                _id: user?._id,
                isAdmin: user?.isAdmin,
                profilePhoto: user?.profilePhoto,
            }
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            errorCode: errorCodes.UNKNOWN_SERVER_ERROR,
            message: `internal server error`,
        })
    }

})

export default router