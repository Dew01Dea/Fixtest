require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const db = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// ตรวจสอบว่า Backend ทำงาน
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

// ดูรายการแจ้งซ่อมทั้งหมด
app.get("/api/repairs", async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM repair_requests ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "ไม่สามารถดึงรายการแจ้งซ่อมได้" });
  }
});

// ส่งรายการแจ้งซ่อมใหม่
app.post("/api/repairs", async (req, res) => {
  try {
    const { reporter_name, equipment, problem, location } = req.body;

    if (!reporter_name || !equipment || !problem || !location) {
      return res.status(400).json({
        message: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
      });
    }

    const result = await db.query(
      `INSERT INTO repair_requests
       (reporter_name, equipment, problem, location)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [reporter_name, equipment, problem, location]
    );

    res.status(201).json({
      message: "แจ้งซ่อมสำเร็จ",
      repair: result.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "ไม่สามารถบันทึกการแจ้งซ่อมได้" });
  }
});

const PORT = process.env.PORT || 3000;

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "error", database: "disconnected" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:$DIL0`);
});