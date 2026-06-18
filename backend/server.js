const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs/promises");
const { PDFParse } = require("pdf-parse");

const app = express();

app.use(express.json());

app.use(cors());

dotenv.config();

const upload = multer({ dest: "uploads/" });

app.get("/api/test", (req, res) => {
  res.send("The server is working.");
});

app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const fileLocation = req.file.path;

  try {
    const fileBuffer = await fs.readFile(fileLocation);
    const uint8Array = new Uint8Array(fileBuffer);
    const pdfParser = new PDFParse(uint8Array);
    const data = await pdfParser.getText();
    res.status(200).json(data.text);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error parsing PDF", details: error.message });
  } finally {
    await fs.unlink(fileLocation);
  }
});

app.listen(3000, () => console.log("Server is running on port 3000"));
