import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// Load environment variables from .env file
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;
const app = express();

// Serve static files from dist folder
const distPath = path.join(__dirname, "dist");

// Middleware to serve static files
app.use(express.static(distPath, { etag: false }));

// Handle all other routes by serving index.html (for SPA routing)
app.use((req, res) => {
  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res
      .status(404)
      .send("Not found. Please build the project first with: npm run build");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Finance Tracker server running on port ${PORT}`);
  console.log(`📍 Open http://localhost:${PORT} in your browser`);
});
