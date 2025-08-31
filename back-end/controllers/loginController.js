const jwt = require('jsonwebtoken');
const { getInstructorByPhone, storeVerificationCode, validateVerificationCode } = require('../models/loginModel');
const dotenv = require("dotenv");
const axios = require('axios');

dotenv.config();

const infobipApiKey = process.env.INFOBIP_API_KEY;
const infobipApiUrl = process.env.INFOBIP_API_URL;

let infobipConfigured = false;
if (infobipApiKey && infobipApiUrl) {
  infobipConfigured = true;
  console.log('InfoBip SMS service configured successfully');
} else {
  console.error('InfoBip credentials missing!');
}

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendSMSViaInfobip(phoneNumber, message) {
  try {
    const response = await axios.post(
      `${infobipApiUrl}/sms/2/text/advanced`,
      {
        messages: [
          {
            destinations: [
              {
                to: phoneNumber
              }
            ],
            from: "ClassRoom",
            text: message
          }
        ]
      },
      {
        headers: {
          'Authorization': `App ${infobipApiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('Infobip SMS sent successfully:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Infobip SMS Error:', error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
}

async function createAccessCode(req, res) {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Phone number is required"
    });
  }

  try {
    const instructor = await getInstructorByPhone(phone);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Phone number is not registered."
      });
    }

    const verificationCode = generateVerificationCode();
    await storeVerificationCode(phone, verificationCode);

    try {
      if (!infobipConfigured) {
        console.log('Infobip not configured, using mock verification code:', verificationCode);
        return res.status(200).json({
          success: true,
          message: "Verification code has been created.",
          devCode: verificationCode
        });
      }

      const smsMessage = `Your verification code is: ${verificationCode}. The code is valid for 10 minutes.`;
      const phoneNumberFormatted = '+84' + phone.slice(1);
      
      const smsResult = await sendSMSViaInfobip(phoneNumberFormatted, smsMessage);

      if (!smsResult.success) {
        console.error("Failed to send SMS via InfoBip:", smsResult.error);
        return res.status(500).json({
          success: false,
          message: "Unable to send verification code. Please try again later."
        });
      }

      return res.status(200).json({
        success: true,
        message: "Verification code has been sent to your phone number."
      });
    } catch (smsError) {
      console.error("SMS Error:", smsError);
      return res.status(500).json({
        success: false,
        message: "Unable to send verification code. Please try again later."
      });
    }

  } catch (error) {
    console.error("Error checking phone:", error);
    return res.status(500).json({
      success: false,
      message: "System error. Please try again later."
    });
  }
}

async function validateAccessCode(req, res) {
  const { phone, accessCode } = req.body;

  if (!phone || !accessCode) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required information."
    });
  }

  try {
    // Validate the access code
    const validation = await validateVerificationCode(phone, accessCode);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    // Get instructor data for token generation
    const instructor = await getInstructorByPhone(phone);
    
    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Instructor information not found."
      });
    }

    // Generate JWT token
    const token = await generateToken(instructor);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      instructor: {
        id: instructor.id,
        name: instructor.name,
        phone: instructor.phone
      }
    });

  } catch (error) {
    console.error("Error validating access code:", error);
    return res.status(500).json({
      success: false,
      message: "System error. Please try again later."
    });
  }
}

async function generateToken(instructor) {
    const payload = {
        id: instructor.id,
        phone: instructor.phone,
        role: 'instructor'
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
}

module.exports = {
  createAccessCode,
  validateAccessCode
};