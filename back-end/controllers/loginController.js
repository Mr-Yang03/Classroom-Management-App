const jwt = require('jsonwebtoken');
const { getInstructorByPhone, storeVerificationCode, validateVerificationCode } = require('../models/loginModel');
const dotenv = require("dotenv");

dotenv.config();

let client;
if (accountSid && authToken) {
  client = twilio(accountSid, authToken);
} else {
  console.error('Twilio credentials missing!');
}

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function checkInstructorPhone(req, res) {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Số điện thoại không được để trống"
    });
  }

  try {
    const instructor = await getInstructorByPhone(phone);

    if (!instructor) {
      return res.status(404).json({
        success: false,
        message: "Số điện thoại chưa được đăng ký. Vui lòng liên hệ quản trị viên."
      });
    }

    // Generate and store verification code
    const verificationCode = generateVerificationCode();
    await storeVerificationCode(phone, verificationCode);

    // Send SMS via Twilio
    try {
      // Check if Twilio is properly configured
      if (!client) {
        console.log('Twilio not configured, using mock verification code:', verificationCode);
        // In development, just log the code instead of sending SMS
        return res.status(200).json({
          success: true,
          message: "Mã xác thực đã được tạo (Development mode - check console)",
          devCode: verificationCode // Remove this in production
        });
      }

      await client.messages.create({
        body: `Mã xác thực của bạn là: ${verificationCode}. Mã có hiệu lực trong 10 phút.`,
        from: twilioPhoneNumber,
        to: '+84' + phone.slice(1)
      });

      return res.status(200).json({
        success: true,
        message: "Mã xác thực đã được gửi về số điện thoại của bạn"
      });
    } catch (twilioError) {
      console.error("Twilio SMS Error:", twilioError);
      return res.status(500).json({
        success: false,
        message: "Không thể gửi mã xác thực. Vui lòng thử lại sau."
      });
    }

  } catch (error) {
    console.error("Error checking phone:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống. Vui lòng thử lại sau."
    });
  }
}

async function validateAccessCode(req, res) {
  const { phone, accessCode } = req.body;

  if (!phone || !accessCode) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhập đầy đủ thông tin"
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
        message: "Không tìm thấy thông tin instructor"
      });
    }

    // Generate JWT token
    const token = await generateToken(instructor);

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
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
      message: "Lỗi hệ thống. Vui lòng thử lại sau."
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
  checkInstructorPhone,
  validateAccessCode
};