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
  console.log(`[OTP STORE] Stored code "${otp}" for email "${email.toLowerCase()}"`);
};

const verifyOTP = (email, otp) => {
  console.log(`[OTP VERIFY] Verifying code "${otp}" for email "${email.toLowerCase()}"`);
  const record = otpStore.get(email.toLowerCase());
  if (!record) {
    console.log(`[OTP VERIFY] No OTP record found for "${email.toLowerCase()}"`);
    return false;
  }
  
  if (Date.now() > record.expiresAt) {
    console.log(`[OTP VERIFY] OTP has expired for "${email.toLowerCase()}"`);
    otpStore.delete(email.toLowerCase());
    return false;
  }
  
  console.log(`[OTP VERIFY] Comparing: Record OTP "${record.otp}" (type: ${typeof record.otp}) vs Input OTP "${otp}" (type: ${typeof otp})`);
  if (record.otp === otp) {
    console.log(`[OTP VERIFY] Match successful! Deleting code.`);
    otpStore.delete(email.toLowerCase());
    return true;
  }
  
  console.log(`[OTP VERIFY] Match failed.`);
  return false;
};

module.exports = {
  generateOTP,
  storeOTP,
  verifyOTP
};
