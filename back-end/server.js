const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { db } = require("./config/db");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require('./swagger-output.json');

dotenv.config();

const app = express();

app.use(cors());
app.use("/api", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 9000;

// Test route để kiểm tra kết nối Firebase
app.get('/test-firebase', async (req, res) => {
  try {
    // Test đọc dữ liệu từ collection accounts
    const accountsSnapshot = await db.collection('accounts').limit(1).get();
    
    // Test đọc dữ liệu từ collection instructors  
    const instructorsSnapshot = await db.collection('instructors').limit(1).get();
    
    // Thử ghi một document test
    await db.collection('test').doc('connection').set({
      timestamp: new Date(),
      message: 'Firebase connection successful!',
      status: 'connected'
    });
    
    res.json({
      success: true,
      message: 'Kết nối Firebase thành công!',
      projectId: db._settings?.projectId || 'classroom-management-c88f6',
      timestamp: new Date().toISOString(),
      collections: {
        accounts: {
          exists: !accountsSnapshot.empty,
          count: accountsSnapshot.size
        },
        instructors: {
          exists: !instructorsSnapshot.empty, 
          count: instructorsSnapshot.size
        }
      }
    });
  } catch (error) {
    console.error('Firebase connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi kết nối Firebase',
      error: error.message
    });
  }
});

// Route để lấy dữ liệu từ collection accounts
app.get('/test-accounts', async (req, res) => {
  try {
    const snapshot = await db.collection('accounts').get();
    const accounts = [];
    snapshot.forEach(doc => {
      accounts.push({
        id: doc.id,
        data: doc.data()
      });
    });
    
    res.json({
      success: true,
      message: 'Đọc dữ liệu accounts thành công!',
      count: accounts.length,
      accounts: accounts
    });
  } catch (error) {
    console.error('Error reading accounts:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi đọc dữ liệu accounts',
      error: error.message
    });
  }
});

// Route để lấy dữ liệu từ collection instructors
app.get('/test-instructors', async (req, res) => {
  try {
    const snapshot = await db.collection('instructors').get();
    const instructors = [];
    snapshot.forEach(doc => {
      instructors.push({
        id: doc.id,
        data: doc.data()
      });
    });
    
    res.json({
      success: true,
      message: 'Đọc dữ liệu instructors thành công!',
      count: instructors.length,
      instructors: instructors
    });
  } catch (error) {
    console.error('Error reading instructors:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi đọc dữ liệu instructors',
      error: error.message
    });
  }
});

// Route hiển thị thông tin cơ bản
app.get('/', (req, res) => {
  res.json({
    message: 'Backend Classroom Management đang chạy!',
    endpoints: {
      'Test Firebase Connection': '/test-firebase',
      'Test Accounts Data': '/test-accounts',
      'Test Instructors Data': '/test-instructors',
      'API Documentation': '/api'
    },
    status: 'Server is running successfully!'
  });
});

// Error handlers
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Server đang bị lỗi. Vui lòng thử lại sau!');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT} ...`);
});