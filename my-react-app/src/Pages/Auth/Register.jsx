import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi input
    if (!formData.username || !formData.email || !formData.password) {
      setError("Semua field harus diisi!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/longsor/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201 || response.data.success) {
        alert("Registrasi berhasil!");
        navigate("/");
      } else {
        throw new Error(response.data.message || "Registrasi gagal");
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Terjadi kesalahan yang tidak terduga");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-200">
      <div className="p-6 rounded-lg shadow-lg bg-white w-80">
        <h2 className="text-2xl font-bold text-center mb-6">DAFTAR</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg">
            Daftar
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Sudah punya akun?{" "}
          <Link to="/" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
