
import { useEffect, useState } from "react";

const API = "http://localhost:3000/api/repairs";

function App() {
  const [repairs, setRepairs] = useState([]);
  const [form, setForm] = useState({
    reporter_name: "",
    equipment: "",
    problem: "",
    location: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadRepairs() {
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error("โหลดข้อมูลไม่สำเร็จ");
      setRepairs(await res.json());
    } catch {
      setMessage("ไม่สามารถเชื่อมต่อ Backend ได้");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRepairs();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "แจ้งซ่อมไม่สำเร็จ");

      setMessage("แจ้งซ่อมสำเร็จ");
      setForm({
        reporter_name: "",
        equipment: "",
        problem: "",
        location: "",
      });

      await loadRepairs();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main style={{ maxWidth: 900, margin: "30px auto", padding: 20 }}>
      <h1>ระบบแจ้งซ่อมอุปกรณ์</h1>
      <p>Repair Request System</p>

      <form onSubmit={handleSubmit}>
        <p>
          <label>ชื่อผู้แจ้ง</label><br />
          <input
            name="reporter_name"
            value={form.reporter_name}
            onChange={handleChange}
            required
          />
        </p>

        <p>
          <label>อุปกรณ์ที่เสีย</label><br />
          <input
            name="equipment"
            value={form.equipment}
            onChange={handleChange}
            placeholder="เช่น คอมพิวเตอร์ เครื่องพิมพ์"
            required
          />
        </p>

        <p>
          <label>อาการเสีย</label><br />
          <textarea
            name="problem"
            value={form.problem}
            onChange={handleChange}
            required
          />
        </p>

        <p>
          <label>สถานที่</label><br />
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="เช่น ห้องปฏิบัติการ 301"
            required
          />
        </p>

        <button type="submit">ส่งแจ้งซ่อม</button>
      </form>

      {message && <p role="status">{message}</p>}

      <hr style={{ margin: "25px 0" }} />
      <h2>รายการแจ้งซ่อม</h2>

      {loading ? (
        <p>กำลังโหลด...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["รหัส", "ผู้แจ้ง", "อุปกรณ์", "อาการเสีย",
                  "สถานที่", "สถานะ"].map((title) => (
                  <th key={title} style={cellStyle}>{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {repairs.map((repair) => (
                <tr key={repair.id}>
                  <td style={cellStyle}>{repair.id}</td>
                  <td style={cellStyle}>{repair.reporter_name}</td>
                  <td style={cellStyle}>{repair.equipment}</td>
                  <td style={cellStyle}>{repair.problem}</td>
                  <td style={cellStyle}>{repair.location}</td>
                  <td style={cellStyle}>{repair.status}</td>
                </tr>
              ))}
              {repairs.length === 0 && (
                <tr>
                  <td style={cellStyle} colSpan={6}>
                    ยังไม่มีรายการแจ้งซ่อม
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

const cellStyle = {
  border: "1px solid #ccc",
  padding: 10,
  textAlign: "left",
};

export default App;
