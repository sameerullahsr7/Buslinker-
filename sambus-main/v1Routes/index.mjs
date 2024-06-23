import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import { promisify } from 'util';
import { rateLimit } from 'express-rate-limit';
import { refresherTokenModel, initialSessionInDays, extendedSessionInDays } from '../schema/index.mjs';


import authRoutes from './auth.mjs';
import profileRoutes from './profile.mjs';
import busRoutes from './bus.mjs';
import adminRoutes from './admin.mjs';
import passengerRoutes from './passenger.mjs'
import paymentRoutes from './payment.mjs'

const router = express.Router();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 500,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

router.use(limiter);

router.use(authRoutes);
router.use(profileRoutes)
router.use(busRoutes);
router.use(async (req, res, next) => {
    const token = req.signedCookies.hart;
    const refreshToken = req.signedCookies.hartRef;

    if (!token || !refreshToken) {
        res.status(401).send({
            message: 'Unauthorized - Tokens not provided',
            errorCode: 'UNAUTHORIZED',
        });
        return;
    }
    let decodedAccessToken = null;
    let decodedRefreshToken = null;

    try {
        decodedAccessToken = await promisify(jwt.verify)(token, process.env.SERVER_SECRET);
        decodedRefreshToken = await promisify(jwt.verify)(refreshToken, process.env.REFRESH_SECRET);
    } catch (e) {
        console.error('error verifying jwt token: ', e);
        res.status(401).send({
            message: 'Unauthorized - Tokens not provided',
            errorCode: 'UNAUTHORIZED',
        });
        return;
    }

    if (moment(decodedAccessToken.exp * 1000).isBefore(moment())) {
        if (moment(decodedRefreshToken.exp * 1000).isBefore(moment())) {
            res.status(401).send({
                message: 'please login first',
                errorCode: 'UNAUTHORIZED',
            });
            return;
        }

        const refreshTokenRecord = await refresherTokenModel
            .findOne({
                userId: decodedRefreshToken._id,
                isConsumed: false,
            })
            .sort({ _id: -1 })
            .exec();

        if (!refreshTokenRecord) {
            res.status(401).send({
                message: 'please login first',
                errorCode: 'UNAUTHORIZED',
            });
            return;
        }

        const isRefreshTokenMatchedInDatabase = bcrypt.compare(
            refreshToken,
            refreshTokenRecord.refreshTokenHash,
        );

        if (!isRefreshTokenMatchedInDatabase) {
            res.status(401).send({
                message: 'please login first',
                errorCode: 'UNAUTHORIZED',
            });
            return;
        }

        refreshTokenRecord.isConsumed = true;
        await refreshTokenRecord.save();

        const newAccessToken = jwt.sign({
            isAdmin: decodedAccessToken.isAdmin || false,
            profilePhoto: decodedAccessToken.profilePhoto,
            userName: decodedAccessToken.userName,
            email: decodedAccessToken.email,
            _id: decodedAccessToken._id,
        }, process.env.SERVER_SECRET, {
            expiresIn: `${initialSessionInDays}d`,
        });

        const newRefreshToken = jwt.sign({
            _id: decodedAccessToken._id,
        }, process.env.REFRESH_SECRET, {
            expiresIn: `${extendedSessionInDays}d`,
        });

        const refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

        await refresherTokenModel.create({
            _id: decodedAccessToken._id,
            refreshTokenHash,
        });

        res.cookie('hart', newAccessToken, {
            httpOnly: true,
            secure: true,
            signed: true,
            sameSite:'strict',
            expires: moment().add(initialSessionInDays, 'days').toDate(),
        });

        res.cookie('hartRef', newRefreshToken, {
            httpOnly: true,
            secure: true,
            signed: true,
            sameSite:'strict',
            expires: moment().add(extendedSessionInDays, 'days').toDate(),
        });

        req.user = {
            isAdmin: decodedAccessToken.isAdmin || false,
            profilePhoto: decodedAccessToken.profilePhoto,
            userName: decodedAccessToken.userName,
            email: decodedAccessToken.email,
            _id: decodedAccessToken._id,
        };

        next();
    } else {
        req.user = {
            isAdmin: decodedAccessToken.isAdmin || false,
            profilePhoto: decodedAccessToken.profilePhoto,
            userName: decodedAccessToken.userName,
            email: decodedAccessToken.email,
            _id: decodedAccessToken._id,
        };
        next();
    }
});
router.use(adminRoutes);
router.use(passengerRoutes);
router.use(paymentRoutes);
export default router;
