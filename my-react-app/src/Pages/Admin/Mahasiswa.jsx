import React, { useEffect, useState } from "react";
import { Button } from "../../Components/Button.jsx";
import { Table } from "../../Components/Table.jsx";
import Swal from "sweetalert2";
import axios from "axios";

export default function Mahasiswa() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fungsi untuk mengambil data dari API
  const fetchMahasiswa = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/longsor", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        setData(response.data.data || []); // Menyimpan data yang diterima dari API
      } else {
        setError(`Gagal mengambil data, Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error Detail:", error);
      setError("Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMahasiswa();
  }, [token]);

  // Fungsi untuk menambah data baru
  const swallAddStudent = async () => {
    try {
      const { value: formValues } = await Swal.fire({
        title: "Tambah Longsor",
        html: `
          <div class="flex flex-col gap-4">
            <input id="swal-input-lokasi" class="swal2-input" placeholder="Lokasi">
            <input id="swal-input-tanggal" class="swal2-input" placeholder="Tanggal">
            <input id="swal-input-tingkat_keparahan" class="swal2-input" placeholder="Tingkat Keparahan">
            <input id="swal-input-korban" class="swal2-input" placeholder="Jumlah Korban">
            <input id="swal-input-penyebab" class="swal2-input" placeholder="Penyebab">
            <input id="swal-input-status" class="swal2-input" placeholder="Status">
          </div>
        `,
        preConfirm: () => {
          return {
            lokasi: document.getElementById("swal-input-lokasi").value,
            tanggal: document.getElementById("swal-input-tanggal").value,
            tingkat_keparahan: document.getElementById("swal-input-tingkat_keparahan").value,
            korban: document.getElementById("swal-input-korban").value,
            penyebab: document.getElementById("swal-input-penyebab").value,
            status: document.getElementById("swal-input-status").value,
          };
        },
      });

      if (formValues) {
        // Validasi input
        if (!formValues.lokasi || !formValues.tanggal || !formValues.tingkat_keparahan || !formValues.korban || !formValues.penyebab || !formValues.status) {
          Swal.fire("Gagal!", "Semua kolom harus diisi.", "error");
          return;
        }

        // Konfirmasi sebelum menambah data
        const confirmation = await Swal.fire({
          title: "Konfirmasi",
          text: `Apakah Anda yakin ingin menambah data dengan lokasi: ${formValues.lokasi} dan tanggal: ${formValues.tanggal}?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Tambah",
          cancelButtonText: "Batal",
        });

        if (confirmation.isConfirmed) {
          const response = await axios.post(
            "http://localhost:5000/api/longsor",
            { ...formValues },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 201) {
            const newData = response.data.data; // Data baru yang dikembalikan dari server, pastikan mencakup ID
            setData((prevData) => [...prevData, newData]); // Menambahkan data baru ke state dengan ID
            Swal.fire("Berhasil!", "Data longsor berhasil ditambahkan.", "success");
            fetchMahasiswa(); // Memanggil ulang data terbaru
          } else {
            Swal.fire("Gagal!", "Terjadi kesalahan saat menambah data longsor.", "error");
          }
        }
      }
    } catch (error) {
      Swal.fire("Terjadi kesalahan", "Gagal saat menambah data longsor.", "error");
    }
  };

  return (
    <section className="max-h-full">
      <div className="flex justify-between pb-4">
        <h2 className="text-2xl font-semibold">Daftar Longsor</h2>
        <Button text="Tambah Longsor" variant="success" onClick={swallAddStudent} />
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <Table data={data} /> // Menampilkan tabel dengan data yang sudah ada
      )}
    </section>
  );
}
