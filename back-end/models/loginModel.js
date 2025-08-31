const { db } = require('../config/db')

async function getInstructorByPhone(phone) {
  try {
    const instructorRef = db.collection('instructors');
    const snapshot = await instructorRef.where('phone', '==', phone).get();

    if (snapshot.empty) {
      return null;
    }

    const instructorData = snapshot.docs[0].data();
    return {
      id: snapshot.docs[0].id,
      ...instructorData
    };
  } catch (error) {
    console.error("Error fetching instructor by phone:", error);
    throw new Error("Error fetching instructor");
  }
}

async function storeVerificationCode(phone, code) {
  try {
    const verificationRef = db.collection('verificationCodes');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await verificationRef.doc(phone).set({
      code: code,
      phone: phone,
      createdAt: new Date(),
      expiresAt: expiresAt,
      used: false
    });

    return true;
  } catch (error) {
    console.error("Error storing verification code:", error);
    throw new Error("Error storing verification code");
  }
}

async function validateVerificationCode(phone, code) {
  try {
    const verificationRef = db.collection('verificationCodes');
    const doc = await verificationRef.doc(phone).get();

    if (!doc.exists) {
      return { valid: false, message: "Access Code is nonexistent" };
    }

    const data = doc.data();
    const now = new Date();

    if (data.used) {
      return { valid: false, message: "Access Code has already been used" };
    }

    if (now > data.expiresAt.toDate()) {
      return { valid: false, message: "Access Code has expired" };
    }

    if (data.code !== code) {
      return { valid: false, message: "Access Code is invalid" };
    }

    // Mark as used
    await verificationRef.doc(phone).update({ used: true });

    return { valid: true, message: "Access Code is valid" };
  } catch (error) {
    console.error("Error validating verification code:", error);
    throw new Error("Error validating verification code");
  }
}

module.exports = {
  getInstructorByPhone,
  storeVerificationCode,
  validateVerificationCode
};
