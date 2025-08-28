const db = require('./config/db')

app.post("/api/instructor/check-phone", async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        message: "Số điện thoại không được để trống" 
      });
    }

    // Check if phone exists in instructors collection
    const instructorRef = db.collection('instructors');
    const snapshot = await instructorRef.where('phone', '==', phone).get();

    if (snapshot.empty) {
      return res.status(404).json({ 
        success: false, 
        message: "Số điện thoại chưa được đăng ký. Vui lòng liên hệ quản trị viên." 
      });
    }

    // Phone exists
    return res.status(200).json({ 
      success: true, 
      message: "Số điện thoại hợp lệ" 
    });

  } catch (error) {
    console.error("Error checking phone:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Lỗi hệ thống. Vui lòng thử lại sau." 
    });
  }
});