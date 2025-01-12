import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

// Komponen Sidebar untuk navigasi antar halaman admin
const Sidebar = () => {
  return (
    <aside className="bg-blue-950 p-4 space-y-4 w-25">
      <h1 className="text-xl font-bold text-white">ADMIN PANEL</h1>
      <hr className="border-1 my-4 border-white" />
      <nav>
        <ul className="space-y-5">
          <li>
            {/* Link menuju Dashboard Admin */}
            <Link to="/admin/" className="text-white text-lg font-semibold">
              Dashboard
            </Link>
          </li>
          <li>
            {/* Link menuju halaman Mahasiswa */}
            <Link to="/admin/mahasiswa" className="text-white text-lg font-semibold">
              Data Tanah Longsor
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

// Komponen Header yang menampilkan nama user dan tombol logout
const Header = () => {
  const user = useSelector((state) => state.auth.user); // Mengambil data user dari Redux store
  const navigate = useNavigate(); // Hook untuk navigasi antar halaman

  // Fungsi untuk logout
  const handleLogout = async () => {
    const token = localStorage.getItem("authToken"); // Mengambil token dari localStorage
    if (!token) {
      alert("Silahkan Login Kembali."); // Pesan jika token tidak ditemukan
      navigate("/"); // Arahkan ke halaman login
      return;
    }

    navigate("/"); // Redirect ke halaman login setelah logout

    try {
      // Request logout ke API
      const response = await axios.post(
        "http://localhost:5000/api/longsor/",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Mengirim token di header
          },
        }
      );

      console.log("Logout Response:", response); // Log response di console
      localStorage.removeItem("authToken"); // Hapus token dari localStorage
    } catch (error) {
      console.error("Logout gagal:", error); // Log error jika gagal logout
      alert("Logout gagal, coba lagi nanti."); // Pesan error
    }
  };

  return (
    <header className="bg-blue-700 w-full text-right p-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex flex-col text-left">
          {/* Menampilkan nama user */}
          <h1 className="text-white text-xl font-bold">{user.name}</h1>
        </div>
        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="py-2 px-5 bg-green-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-500 focus:ring-opacity-75"
        >
          LOGOUT
        </button>
      </div>
    </header>
  );
};

// Komponen Footer
const Footer = () => {
  return <footer className="py-2">&copy; 2024 - A11.2022.14205</footer>; // Menampilkan footer sederhana
};

// Komponen Utama AdminLayout
export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-blue-200">
      <Sidebar /> {/* Sidebar di sebelah kiri */}
      <div className="flex flex-col flex-1 items-center">
        <Header /> {/* Header di bagian atas */}
        <main className="bg-white flex-grow w-[90%] my-4 p-4 rounded-lg space-y-4 shadow-lg">
          <Outlet /> {/* Tempat untuk render konten halaman lain */}
        </main>
        <Footer /> {/* Footer di bagian bawah */}
      </div>
    </div>
  );
}
