const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database Terhubung'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);  // Hentikan server jika koneksi database gagal
  });

// Schema Data Longsor
const LongsorSchema = new mongoose.Schema({
  lokasi: { type: String, required: true },
  tanggal: { type: Date, required: true },
  tingkat_keparahan: { type: String, required: true },
  korban: { type: Number, required: true },
  penyebab: { type: String, required: true },
  status: { type: String, required: true }
});

const Longsor = mongoose.model('Longsor', LongsorSchema);

// Schema Pengguna
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Fungsi untuk memverifikasi token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid token');
  }
};

// Fungsi untuk memeriksa dan mendapatkan token dari header
const getTokenFromHeader = (req) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) throw new Error('Access denied, no token provided');
  return token;
};

// Middleware untuk memverifikasi token sebelum melakukan operasi yang memerlukan otentikasi
const authenticate = (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    const decoded = verifyToken(token);
    req.user = decoded;  // Menyimpan decoded token untuk digunakan di endpoint
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Endpoint GET: Ambil semua data longsor
app.get('/api/longsor', authenticate, async (req, res) => {
  try {
    const data = await Longsor.find();
    const formattedData = data.map(item => ({
      ...item.toObject(),
      tanggal: item.tanggal.toLocaleDateString(),  // Format tanggal
    }));
    res.json(formattedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// Endpoint POST: Tambah data longsor
app.post('/api/longsor', authenticate, async (req, res) => {
  const { lokasi, tanggal, tingkat_keparahan, korban, penyebab, status } = req.body;
  if (!lokasi || !tanggal || !tingkat_keparahan || !korban || !penyebab || !status) {
    return res.status(400).json({ message: 'Semua kolom harus diisi!' });
  }

  try {
    const newData = new Longsor(req.body);
    const savedData = await newData.save();
    res.status(201).json({
      message: 'Data longsor berhasil ditambahkan',
      data: savedData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saat menyimpan data longsor' });
  }
});

// Endpoint PUT: Update data longsor berdasarkan ID
app.put('/api/longsor/update/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { lokasi, tanggal, tingkat_keparahan, korban, penyebab, status } = req.body;
  
  if (!lokasi || !tanggal || !tingkat_keparahan || !korban || !penyebab || !status) {
    return res.status(400).json({ message: 'Semua kolom harus diisi!' });
  }

  try {
    const updatedData = await Longsor.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedData) {
      return res.status(404).json({ message: 'Data longsor tidak ditemukan' });
    }
    res.json(updatedData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saat mengupdate data longsor' });
  }
});

// Endpoint DELETE: Menghapus data longsor berdasarkan ID
app.delete('/api/longsor/delete/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  
  try {
    const data = await Longsor.findById(id);
    if (!data) return res.status(404).json({ message: 'Data longsor tidak ditemukan' });

    await Longsor.findByIdAndDelete(id);
    res.json({ message: 'Data longsor berhasil dihapus' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saat menghapus data longsor' });
  }
});

// Endpoint Register
app.post('/api/longsor/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, dan password harus diisi!' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email sudah terdaftar' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saat registrasi user' });
  }
});

// Endpoint Login
app.post('/api/longsor/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password harus diisi!' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User tidak ditemukan' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error saat login' });
  }
});

// Endpoint Logout
app.post('/api/longsor/logout', (req, res) => {
  res.json({ message: 'Logout berhasil' });
});

// Menjalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
