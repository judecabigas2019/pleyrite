import express from "express";
import fs from "fs";
import { exec } from "child_process";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json({ limit: "5mb" }));

// healthcheck
app.get("/", (req, res) => {
  res.send("✅ Playwright listener is running");
});

// run playwright script
app.post("/run", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "No code provided" });

  const id = uuidv4();
  const filePath = `/tmp/test-${id}.spec.js`;
  fs.writeFileSync(filePath, code);

  exec(`npx playwright test ${filePath} --reporter=list`, { timeout: 60000 }, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr || err.message });
    }
    res.json({ output: stdout });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Playwright listener running on port ${port}`));
