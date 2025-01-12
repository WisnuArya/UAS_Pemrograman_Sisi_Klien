import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

// Komponen Button
const Button = ({ text, variant, onClick }) => (
  <button
    onClick={onClick}
    className={`py-2 px-4 text-white rounded ${variant === 'warning' ? 'bg-yellow-500' : variant === 'danger' ? 'bg-red-500' : 'bg-blue-500'}`}
  >
    {text}
  </button>
);

// Komponen Row
const Row = ({ id, lokasi, tanggal, tingkat_keparahan, korban, penyebab, status, refreshData }) => {

  const swalDeleteConfirm = (id) => {
    Swal.fire({
      title: `Yakin Mau Hapus Data Dengan ID ${id}?`,
      text: "Tidak Bisa Melakukan Undo Setelah Menghapus!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "HAPUS",
      cancelButtonText: "BATAL",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.delete(`http://localhost:5000/api/longsor/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 200) {
            Swal.fire("TERHAPUS!", `Data dengan ID ${id} Berhasil Terhapus.`, "success");
            refreshData();  // Memanggil refreshData setelah data berhasil dihapus
          } else {
            Swal.fire("Gagal", `Data dengan ID ${id} Gagal Terhapus.`, "error");
          }
        } catch (error) {
          Swal.fire("Gagal", `Terjadi Kesalahan Saat Menghapus Data.`, "error");
        }
      }
    });
  };

  const swallEdit = async (id) => {
    try {
      const { value: formValue } = await Swal.fire({
        title: `Ganti Data dengan ID ${id}`,
        html: `
          <div class="flex flex-col gap-4">
            <input id="swal-input-lokasi" class="swal2-input" placeholder="Lokasi" value="${lokasi}" />
            <input id="swal-input-tanggal" class="swal2-input" placeholder="Tanggal" value="${tanggal}" />
            <input id="swal-input-tingkat_keparahan" class="swal2-input" placeholder="Tingkat Keparahan" value="${tingkat_keparahan}" />
            <input id="swal-input-korban" class="swal2-input" placeholder="Jumlah Korban" value="${korban}" />
            <input id="swal-input-penyebab" class="swal2-input" placeholder="Penyebab" value="${penyebab}" />
            <input id="swal-input-status" class="swal2-input" placeholder="Status" value="${status}" />
          </div>
        `,
        preConfirm: () => {
          const lokasi = document.getElementById("swal-input-lokasi").value;
          const tanggal = document.getElementById("swal-input-tanggal").value;
          const tingkat_keparahan = document.getElementById("swal-input-tingkat_keparahan").value;
          const korban = document.getElementById("swal-input-korban").value;
          const penyebab = document.getElementById("swal-input-penyebab").value;
          const status = document.getElementById("swal-input-status").value;

          if (!lokasi || !tanggal || !tingkat_keparahan || !korban || !penyebab || !status) {
            Swal.showValidationMessage("Semua kolom harus diisi!");
            return false;
          }

          return { lokasi, tanggal, tingkat_keparahan, korban, penyebab, status };
        },
      });

      if (formValue) {
        const confirmation = await Swal.fire({
          title: "Konfirmasi",
          text: "Apakah Anda Yakin Ingin Mengganti Data?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "GANTI",
          cancelButtonText: "BATAL",
        });

        if (confirmation.isConfirmed) {
          const token = localStorage.getItem("token");
          const response = await axios.put(`http://localhost:5000/api/longsor/update/${id}`, formValue, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 200) {
            Swal.fire("Berhasil!", `Data dengan ID ${id} Berhasil Diperbarui.`, "success");
            refreshData();  // Memanggil refreshData setelah data berhasil diperbarui
          } else {
            Swal.fire("Gagal!", `Data dengan ID ${id} Gagal Diperbarui.`, "error");
          }
        }
      }
    } catch (error) {
      Swal.fire("Error", `Terjadi kesalahan saat mengupdate data.`, "error");
    }
  };

  return (
    <tr key={id} className="border-collapse border-b border-green-700 py-2 px-4">
      <td>{id}</td>
      <td>{lokasi}</td>
      <td>{tanggal}</td>
      <td>{tingkat_keparahan}</td>
      <td>{korban}</td>
      <td>{penyebab}</td>
      <td>{status}</td>
      <td>
        <div className="flex flex-wrap gap-2">
          <Button text="Edit" variant="warning" onClick={() => swallEdit(id)} />
          <Button text="Delete" variant="danger" onClick={() => swalDeleteConfirm(id)} />
        </div>
      </td>
    </tr>
  );
};

// Komponen Table
export const Table = () => {
  const [data, setData] = useState([]);

  // Mengambil data dari API saat komponen pertama kali dimuat
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/longsor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      Swal.fire("Error", "Gagal mengambil data.", "error");
    }
  };

  return (
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th>ID</th>
          <th>Lokasi</th>
          <th>Tanggal</th>
          <th>Tingkat Keparahan</th>
          <th>Jumlah Korban</th>
          <th>Penyebab</th>
          <th>Status</th>
          <th>ACTION</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(data) && data.length > 0 ? (
          data.map((item) => (
            <Row
              key={item._id}
              id={item._id}
              lokasi={item.lokasi}
              tanggal={item.tanggal}
              tingkat_keparahan={item.tingkat_keparahan}
              korban={item.korban}
              penyebab={item.penyebab}
              status={item.status}
              refreshData={refreshData} // Menyertakan fungsi refreshData ke setiap baris
            />
          ))
        ) : (
          <tr>
            <td colSpan="8">Data tidak ditemukan</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};
