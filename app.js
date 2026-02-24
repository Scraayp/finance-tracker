import dotenv from "dotenv";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env file
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Check if dist folder exists
const distPath = path.join(__dirname, "dist");
const maxRetries = 5;
let retries = 0;

function startPreviewServer() {
  console.log(`🚀 Starting Vite preview server on port ${PORT}...`);

  const previewProcess = spawn(
    "npm",
    ["exec", "vite", "preview", "--", "--port", PORT.toString()],
    {
      cwd: __dirname,
      stdio: "inherit",
      shell: true,
    },
  );

  previewProcess.on("error", (error) => {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  });

  previewProcess.on("exit", (code) => {
    if (code !== 0) {
      console.error(`❌ Server exited with code ${code}`);
      process.exit(code);
    }
  });
}

function buildAndStart() {
  console.log("📦 Building application...");

  const buildProcess = spawn("npm", ["run", "build"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  buildProcess.on("error", (error) => {
    console.error(`❌ Build failed: ${error.message}`);
    process.exit(1);
  });

  buildProcess.on("exit", (code) => {
    if (code === 0) {
      console.log("✅ Build completed successfully");
      startPreviewServer();
    } else {
      console.error(`❌ Build failed with code ${code}`);
      process.exit(1);
    }
  });
}

// Main execution
const args = process.argv.slice(2);
const shouldBuild = args.includes("--build") || args.includes("-b");

if (shouldBuild) {
  buildAndStart();
} else {
  startPreviewServer();
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down server gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n👋 Server terminated");
  process.exit(0);
});
