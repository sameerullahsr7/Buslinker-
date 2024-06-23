export const emailPattern = /^[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // RFC 822 email specification
export const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,100}$/;
export const phonePattern = /^[+][0-9]{12}$/;
export const otpPattern = /^[0-9]{6}$/;
export const datePattern = /^\d{4}\/\d{2}\/\d{2}$/ ;
export const profilePicturePattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
export const noPasswordPlaceholder = 'no password';

export const otpMaxAgeInMinutes = 15;
export const forgetPasswordOtpMaxAgeInMinutes = 15;
export const initialSessionInDays = 15;
export const extendedSessionInDays = 30;
