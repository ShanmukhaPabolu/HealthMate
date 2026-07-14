// SMS Simulation Service (simulates Twilio confirmations)

const sendSMS = async (to, message) => {
  try {
    console.log(`[SMS SENDER SIMULATION] - Preparing Twilio message...`);
    console.log(`To: ${to}`);
    console.log(`Message body: ${message}`);
    console.log(`[SMS SENDER SIMULATION] - Delivery Success!`);
    return true;
  } catch (err) {
    console.error(`SMS Delivery failure: ${err.message}`);
    return false;
  }
};

const smsService = {
  sendOTPSMS: async (phone, otp) => {
    if (!phone) return false;
    return sendSMS(phone, `Your HealthTracker Pro verification OTP code is: ${otp}. It is valid for 5 minutes.`);
  },

  sendBookingConfirmationSMS: async (phone, name, doctorName, date, slot) => {
    if (!phone) return false;
    return sendSMS(phone, `Hello ${name}, your appointment with Dr. ${doctorName} is confirmed for ${date} at ${slot}. Thank you for booking with HealthTracker Pro!`);
  },

  sendStatusUpdateSMS: async (phone, name, date, slot, status) => {
    if (!phone) return false;
    return sendSMS(phone, `Hello ${name}, the status of your consultation appointment on ${date} at ${slot} has been updated to: ${status.toUpperCase()}.`);
  }
};

module.exports = smsService;
