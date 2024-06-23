import { readFileSync } from 'fs';

// check if all variables that are listed in env_template are actually present in env
const envTemplateLines = readFileSync('.env_template', 'utf8').split('\n');
const missingVariables = envTemplateLines
    .map((line) => line.split('=')[0].trim())
    .filter((name) => name && !process.env[name]);

if (missingVariables.length > 0) {
    console.error(`Missing environment variables: ${missingVariables.join(', ')}`);
    process.exit(1);
} else {
    console.info('All environment variables are set.');
}

export const errorCodes = {

    SUCCESS: 'SUCCESS',
    REQUIRED_PARAMETER_MISSING: 'REQUIRED_PARAMETER_MISSING',
    UNKNOWN_SERVER_ERROR: 'UNKNOWN_SERVER_ERROR',
    UNAUTHORIZED: 'UNAUTHORIZED',

    EMAIL_ALREADY_VERIFIED: 'EMAIL_ALREADY_VERIFIED',
    EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
    INVALID_EMAIL: 'INVALID_EMAIL',
    INVALID_EMAIL_OR_PASSWORD: 'INVALID_EMAIL_OR_PASSWORD',
    EMAIL_NOT_PROVIDED: 'EMAIL_NOT_PROVIDED',

    INVALID_PASSWORD: 'INVALID_PASSWORD',
    INVALID_OTP: 'INVALID_OTP',

    USER_ALREADY_EXIST: 'USER_ALREADY_EXIST',
    USER_NOT_EXIST: 'USER_NOT_EXIST',
    USER_SUSPENDED: 'USER_SUSPENDED',
    BUS_ALREADY_EXIST: "BUS_ALREADY_EXIST",
    BUS_NOT_EXIST: "BUS_NOT_EXIST",
    BUS_ROUTE_NOT_EXIST: "BUS_ROUTE_NOT_EXIST",
    INVALID_DATE: "INVALID_DATE",
    SEAT_ALREADY_BOOKED: "SEAT_ALREADY_BOOKED",
    INVALID_PHONE_NUMBER: "INVALID_PHONE_NUMBER",
    COMPANY_ALREADY_EXIST: "COMPANY_ALREADY_EXIST",
    COMPANY_NOT_FOUND: "COMPANY_NOT_FOUND",
    BUS_NOT_FOUND: "BUS_NOT_FOUND",
    DATE_FIELD_MISSING: "DATE_FIELD_MISSING",
    INVALID_BUS_ID: "INVALID_BUS_ID",
    PASSENGER_NOT_FOUND: "PASSENGER_NOT_FOUND",
    CANNOT_CANCEL_PAID_RESERVATION: "CANNOT_CANCEL_PAID_RESERVATION",
    LIMIT_EXCEED_TRY_IN_24HR: 'LIMIT_EXCEED_TRY_IN_24HR',
    LIMIT_EXCEED_TRY_IN_60MIN: 'LIMIT_EXCEED_TRY_IN_60MIN',
    LIMIT_EXCEED_TRY_IN_5MIN: 'LIMIT_EXCEED_TRY_IN_5MIN',

};

export default null;
