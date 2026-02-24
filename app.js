// start.js
const path = require("path");
const express = require("express");
const { createServer } = require("vite");

async function startServer() {
  const app = express();

  // 1. Determine the port assigned by Plesk/Passenger
  const port = process.env.PORT || 3000;

  // 2. Setup Vite in production mode
  // Note: For production, you usually serve the 'dist' folder
  const distPath = path.resolve(__dirname, "dist/client");
  const serverPath = path.resolve(__dirname, "dist/server/entry-server.js");

  if (process.env.NODE_ENV === "production") {
    // Serve static assets from the build folder
    app.use("/", express.static(distPath, { index: false }));

    app.use("*", async (req, res) => {
      try {
        const render = require(serverPath).render;
        const html = await render(req.url);
        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        console.error(e.stack);
        res.status(500).end(e.stack);
      }
    });
  } else {
    // Development mode logic (rarely used on Plesk production)
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
  }

  // 3. Start listening on the dynamic Plesk port
  app.listen(port, () => {
    console.log(`Vite SSR App running on port: ${port}`);
  });
}

startServer();
