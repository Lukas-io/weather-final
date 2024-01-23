const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./model");
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("signin");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/dashboard", (req, res) => {
  res.render("dashboard");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const MONGO_URI =
  "mongodb+srv://lukasiou:pkvRxAen70GXKySW@cluster0.umptrp1.mongodb.net/weather-user";

mongoose.connect(MONGO_URI);

const db = mongoose.connection;

app.use(express.json());
app.use(cors());

db.on("connected", () => {
  console.log("Connected to MongoDB");
});

db.on("error", (err) => {
  console.error("Error connecting to MongoDB:", err);
});

app.post("/saveData", async (req, res) => {
  try {
    const { userID, weather, location } = req.body;

    const newWeather = new User({ userID, weather, location: location });
    await newWeather.save();

    res.json({ message: "Data saved successfully" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/getData/:userID", async (req, res) => {
  try {
    const user = req.params.userID;

    // Find documents with the specified userID
    const occurrences = await User.find({ userID: user });

    // Do something with the occurrences
    console.log("Occurrences:", occurrences);

    res.json({ occurrences });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
