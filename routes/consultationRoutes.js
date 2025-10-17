// const express = require("express");
// const router = express.Router();
// const {
//   getConsultations,
//   createConsultation,
//   updateConsultation,
//   deleteConsultation,
// } = require("../controllers/consultationController");

// router.get("/", getConsultations);
// router.post("/", createConsultation);
// router.put("/:id", updateConsultation);
// router.delete("/:id", deleteConsultation);

// module.exports = router;
// backend/routes/consultationRoutes.js
const express = require("express");
const router = express.Router();
const Consultation = require("../models/Consultation");
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

// ================= Email Setup =================
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= Get All Consultations =================
router.get("/", async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ scheduledAt: -1 });
    res.json(consultations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch consultations" });
  }
});

// ================= Add Consultation =================
router.post("/", async (req, res) => {
  try {
    const { clientName, clientEmail, astrologerName, type, status, scheduledAt, notes } = req.body;
    if (!clientName || !astrologerName) return res.status(400).json({ error: "Client and astrologer required" });

    let meetingLink = "";
    if (type === "Video") {
      meetingLink = `https://meet.google.com/${uuidv4().slice(0, 3)}-${uuidv4().slice(0, 4)}-${uuidv4().slice(0, 3)}`;
    }

    const newConsultation = new Consultation({ clientName, clientEmail, astrologerName, type, status, scheduledAt, notes, meetingLink });
    const saved = await newConsultation.save();

    // Send Email
    if (clientEmail) {
      const mailOptions = {
        from: `"Astrology Admin" <${process.env.EMAIL_USER}>`,
        to: clientEmail,
        subject: `Your Consultation with ${astrologerName}`,
        html: `
          <h2>Consultation Details</h2>
          <p><b>Client:</b> ${clientName}</p>
          <p><b>Astrologer:</b> ${astrologerName}</p>
          <p><b>Type:</b> ${type}</p>
          <p><b>Status:</b> ${status}</p>
          <p><b>Scheduled At:</b> ${scheduledAt ? new Date(scheduledAt).toLocaleString() : "-"}</p>
          <p><b>Notes:</b> ${notes || "-"}</p>
          ${meetingLink ? `<p><b>Google Meet Link:</b> <a href="${meetingLink}">${meetingLink}</a></p>` : ""}
        `,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) console.error("Email error:", err);
        else console.log("Email sent:", info.response);
      });
    }

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to add consultation" });
  }
});

// ================= Update Consultation =================
router.put("/:id", async (req, res) => {
  try {
    const updated = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to update consultation" });
  }
});

// ================= Delete Consultation =================
router.delete("/:id", async (req, res) => {
  try {
    await Consultation.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to delete consultation" });
  }
});

module.exports = router;


const express = require("express");
const router = express.Router();
const {
  getConsultations,
  createConsultation,
  updateConsultation,
  deleteConsultation,
} = require("../controllers/consultationController");

router.get("/", getConsultations);
router.post("/", createConsultation);
router.put("/:id", updateConsultation);
router.delete("/:id", deleteConsultation);

module.exports = router;
