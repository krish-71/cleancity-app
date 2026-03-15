import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertComplaintSchema } from "../shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadFolder = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: diskStorage });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

  app.get("/api/complaints", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Admin sees all, citizen sees only theirs
    const complaints = req.user.role === "admin" 
      ? await storage.getComplaints()
      : await storage.getComplaintsByUserId(req.user.id);
    res.json(complaints);
  });

  app.post("/api/complaints", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    try {
      const complaintData = insertComplaintSchema.parse(req.body);
      const complaint = await storage.createComplaint({
        ...complaintData,
        userId: req.user.id
      });
      res.status(201).json(complaint);
    } catch (err) {
      res.status(400).json({ error: "Invalid complaint data" });
    }
  });

  app.patch("/api/complaints/:id/status", async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.sendStatus(403);
    }
    
    const { status } = req.body;
    const complaint = await storage.updateComplaintStatus(parseInt(req.params.id), status);
    if (!complaint) return res.status(404).json({ error: "Complaint not found" });
    
    res.json(complaint);
  });

  return httpServer;
}
