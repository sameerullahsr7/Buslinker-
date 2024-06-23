export const baseUrl = "https://sambus.onrender.com"
// export const baseUrl = "http://localhost:3000"

export const emailPattern = /^[a-zA-Z0-9!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // RFC 822 email specification
export const phonePattern = /^[+][0-9]{12}$/;
export const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,100}$/;
export const otpPattern = /^[0-9]{6}$/;
export const profilePicturePattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
export const noPasswordPlaceholder = 'no password';
export const otpMaxAgeInMinutes = 15;
export const forgetPasswordOtpMaxAgeInMinutes = 15;
export const initialSessionInDays = 15;
export const extendedSessionInDays = 30;

export const profileImage = "https://i.pinimg.com/originals/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg"
export const busImage = "https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"