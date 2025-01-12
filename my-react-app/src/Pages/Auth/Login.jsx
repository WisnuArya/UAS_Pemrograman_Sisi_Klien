import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../Redux/AuthSlice";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validasi input
    if (!form.email || !form.password) {
      setErrorMessage("Email dan Password harus diisi");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/longsor/login", form, {
        headers: { "Content-Type": "application/json" },
      });

      // Debugging response
      console.log(response.data); 

      // Pastikan token ada dalam response
      if (response.data.token) {
        const token = response.data.token; // Dapatkan token dari response
        const user = form.email; // Bisa juga menggunakan user yang lebih lengkap jika diinginkan

        // Menyimpan token di localStorage
        localStorage.setItem("token", token);

        // Dispatch login action ke Redux
        dispatch(login({ user, token }));

        // Redirect ke halaman admin
        navigate("/admin");
      } else {
        setErrorMessage("Terjadi kesalahan saat login.");
      }
    } catch (error) {
      console.error(error); // Menampilkan error di console untuk debug
      setErrorMessage(error.response?.data?.message || "Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-200">
      <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-lg bg-white w-80">
        <h2 className="text-2xl font-bold text-center mb-6">LOGIN</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            required
            type="text"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            required
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {errorMessage && <p className="text-red-500 text-sm text-center mb-4">{errorMessage}</p>}
        <button type="submit" className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg">
          LOGIN
        </button>
        <p className="mt-4 text-sm text-center text-gray-600">
          Belum Punya Akun?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
