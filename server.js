const express = require("express");
const multer = require("multer");
const path = require("path");
const tesseract = require("tesseract.js");
const pdf = require("pdf-parse");
const fs = require("fs");
const natural = require("natural");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateSummary = async (text, length = 3) => {
  const summary = await (
    await model.generateContent(
      `Generate summary of the given text make sure the summary has words counts of ${
        15 * length
      }% of the text word count:` + text
    )
  ).response.text();
  return summary;
};

const generateKeyPoints = async (text) => {
  const keyPoints = await (
    await model.generateContent(
      "Generate atmax 10 relevent key insights of the given text in ';' seperated paragraph:" +
        text
    )
  ).response
    .text()
    .split(";")
    .map((points) => {
      return points.charAt(0).toUpperCase() + points.slice(1);
    });
  return keyPoints;
};

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  const length = req.body.length;
  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  const filePath = path.resolve(file.path);

  if (file.mimetype === "application/pdf") {
    const fileBuffer = fs.readFileSync(filePath);

    try {
      const data = await pdf(fileBuffer);
      const result = {
        text: data.text,
        summary: await generateSummary(data.text, length),
        key_points: await generateKeyPoints(data.text),
      };
      res.send(result);
    } catch (err) {
      res.status(500).send("Error processing PDF.");
    }
  } else if (file.mimetype.startsWith("image/")) {
    try {
      const {
        data: { text },
      } = await tesseract.recognize(filePath);
      const result = {
        text: text,
        summary: await generateSummary(text, length),
        key_points: await generateKeyPoints(text),
      };
      res.send(result);
    } catch (err) {
      res.status(500).send("Error processing image.");
    }
  } else {
    res.status(400).send("Unsupported file type.");
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
