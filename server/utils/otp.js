// Simple In-Memory OTP Store
const otpStore = new Map();

const generateOTP = () => {
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};

const storeOTP = (email, otp) => {
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  otpStore.set(email.toLowerCase(), { otp, expiresAt });
};

const verifyOTP = (email, otp) => {
  const record = otpStore.get(email.toLowerCase());
  if (!record) return false;
  
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email.toLowerCase());
    return false;
  }
  
  if (record.otp === otp) {
    otpStore.delete(email.toLowerCase());
    return true;
  }
  
  return false;
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP
};
