const nodemailer = require('nodemailer');
const path = require('path');

// Create transporter lazily so it always picks up latest env values
const getTransporter = () => {
  try {
    require('dotenv').config({ path: path.join(__dirname, '../.env') });
  } catch (e) {
    console.error('Failed to reload dotenv in mail service:', e.message);
  }
  return nodemailer.createTransport({
    host: process.env.MAIL_SERVER || 'smtp.gmail.com',
    port: parseInt(process.env.MAIL_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.MAIL_USER || 'shanmukharani20@gmail.com',
      pass: process.env.MAIL_PASS || 'ddte qmgi aked mtno'
    }
  });
};

// Send custom email helper
const sendEmail = async (options) => {
  const mailOptions = {
    from: `"HealthTracker Pro" <${process.env.MAIL_USER || 'shanmukharani20@gmail.com'}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html
  };

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${options.email}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Email delivery failure to ${options.email}: ${error.message}`);
    return false;
  }
};

// Mail service endpoints
const mailService = {
  sendOTP: async (email, otp) => {
    return sendEmail({
      email,
      subject: 'Your HealthTracker Pro Verification Code',
      message: `Your verification code is: ${otp}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: Montserrat, sans-serif; padding: 20px; border: 1px solid #dee2e6; border-radius: 10px;">
          <h2 style="color: #dc3545;">HealthTracker Pro</h2>
          <p>Hello,</p>
          <p>Your one-time verification code is:</p>
          <div style="background-color: #f8f9fa; font-size: 24px; font-weight: bold; text-align: center; padding: 15px; margin: 20px 0; letter-spacing: 5px; border-radius: 5px; color: #dc3545;">
            ${otp}
          </div>
          <p>This code is valid for 5 minutes. Do not share it with anyone.</p>
          <p>Regards,<br/>The HealthTracker Pro Team</p>
        </div>
      `
    });
  },

  sendRegistrationSuccess: async (email, name) => {
    return sendEmail({
      email,
      subject: 'Welcome to HealthTracker Pro!',
      message: `Hello ${name}, your registration was successful. Welcome to the portal!`,
      html: `
        <div style="font-family: Montserrat, sans-serif; padding: 20px;">
          <h2 style="color: #007bff;">Welcome to HealthTracker Pro, ${name}!</h2>
          <p>Your account registration was successful.</p>
          <p>You can now log in, schedule appointments, generate diet plans, and track your daily wellness metrics.</p>
          <p>Regards,<br/>The HealthTracker Pro Team</p>
        </div>
      `
    });
  },

  sendAppointmentUpdate: async (email, name, appointmentInfo, type) => {
    // type: 'booked' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
    const subjects = {
      booked: 'Appointment Booked Successfully - HealthTracker Pro',
      accepted: 'Appointment Approved - HealthTracker Pro',
      rejected: 'Appointment Declined - HealthTracker Pro',
      completed: 'Consultation Completed & Prescription Ready - HealthTracker Pro',
      cancelled: 'Appointment Cancelled - HealthTracker Pro'
    };

    const detailsHtml = `
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
        <p><strong>Doctor:</strong> ${appointmentInfo.doctorName}</p>
        <p><strong>Date:</strong> ${appointmentInfo.date}</p>
        <p><strong>Slot Time:</strong> ${appointmentInfo.slot}</p>
        <p><strong>Consultation Type:</strong> ${appointmentInfo.consultationType}</p>
        <p><strong>Status:</strong> <span style="text-transform: uppercase; font-weight: bold;">${type}</span></p>
      </div>
    `;

    let actionText = '';
    if (type === 'booked') actionText = 'Your appointment request has been submitted. The doctor will review and approve it shortly.';
    else if (type === 'accepted') actionText = 'Your appointment has been approved by the doctor. Please arrive on time or prepare for your online session.';
    else if (type === 'rejected') actionText = 'Your appointment request was declined. You can search for other slots or contact the clinic.';
    else if (type === 'completed') actionText = 'Your consultation is complete. Log in to your profile to download your digital prescription.';
    else if (type === 'cancelled') actionText = 'Your appointment has been successfully cancelled.';

    return sendEmail({
      email,
      subject: subjects[type] || 'Appointment Update - HealthTracker Pro',
      message: `Hello ${name}, ${actionText}`,
      html: `
        <div style="font-family: Montserrat, sans-serif; padding: 20px; border: 1px solid #dee2e6; border-radius: 10px;">
          <h2 style="color: #28a745;">Appointment Update</h2>
          <p>Hello ${name},</p>
          <p>${actionText}</p>
          ${detailsHtml}
          <p>Regards,<br/>The HealthTracker Pro Team</p>
        </div>
      `
    });
  },

  sendPasswordReset: async (email, link) => {
    return sendEmail({
      email,
      subject: 'Password Reset Request - HealthTracker Pro',
      message: `Click here to reset your password: ${link}`,
      html: `
        <div style="font-family: Montserrat, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Please click the button below to reset your password:</p>
          <a href="${link}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `
    });
  }
};

module.exports = mailService;
