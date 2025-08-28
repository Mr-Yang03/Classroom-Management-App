const express = require("express");
const router = express.Router();
const db = require("../firebase");

// Lấy tất cả instructors
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("instructors").get();
    const instructors = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Thêm instructor mới
router.post("/", async (req, res) => {
  try {
    const data = req.body; // ví dụ { phone: "0372259972" }
    const docRef = await db.collection("instructors").add(data);
    res.json({ id: docRef.id, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
