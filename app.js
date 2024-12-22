const express = require("express");
const app = express();
const session = require("express-session");
const bcrypt = require("bcrypt");
const path = require("path");
const mongoose=require("mongoose");
const PORT = 3000;
const Slider=require("./models/slider.js");
const Video = require("./models/video");
const TeachingTeam = require("./models/teaching_team");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "adminSecretKey",
  resave: false,
  saveUninitialized: false,
}));

mongoose.connect("mongodb://127.0.0.1:27017/oda", ).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


app.get("/", async (req, res) => {
  try {
  
    const sliders = await Slider.find(); 
    const team = await TeachingTeam.find(); 
    const videos = await Video.find();

    res.render("index", { sliders, team, videos });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data.");
  }
});

// app.get("/", (req, res) => {
//   res.render("index.ejs");
// });
// Admin Login Route
const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = bcrypt.hashSync("password123", 10); 

app.get("/admin/login", (req, res) => {
  res.render("admin/login");
});

app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && bcrypt.compareSync(password, ADMIN_PASSWORD)) {
    req.session.isAdmin = true;
    res.redirect("/admin/dashboard");
  } else {
    res.send("Invalid credentials. Please try again.");
  }
});

// Dashboard Route (Protected)
app.get("/admin/dashboard", (req, res) => {
  if (!req.session.isAdmin) {
    return res.redirect("/admin/login");
  }

  res.render("admin/dashboard");
});

// Logout
app.get("/admin/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/login");
});
function isAdmin(req, res, next) {
  if (req.session.isAdmin) {
    return next();
  }
  res.redirect("/admin/login");
}

// Protect Dashboard Route
app.get("/admin/dashboard", isAdmin, async (req, res) => {
  const heroes = await Slider.find();
  const videos = await Video.find();
  const team = await TeachingTeam.find();

  res.render("admin/dashboard", { slider, videos, team });
});


app.post("/slider", async (req, res) => {
  try {
    const { backgroundImage, heading, description } = req.body;
    const slider = new Slider({ backgroundImage, heading, description });
    await slider.save();
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding to Slider Section.");
  }
});
app.post("/video", async (req, res) => {
  try {
    const { videoLink, description } = req.body;
    const video = new Video({ videoLink, description });
    await video.save();
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding to Video Section.");
  }
});
app.post("/teaching_team", async (req, res) => {
  try {
    const { image, description } = req.body;
    const teamMember = new TeachingTeam({ image, description });
    await teamMember.save();
    res.redirect("/admin/dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding to Teaching Team.");
  }
});
 
// View Data
app.get("/slider", async (req, res) => {
  try {
    const slider = await Slider.find(); 
    res.render("view_slider", { slider });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving Slider Section data.");
  }
});

app.get("/teaching_team", async (req, res) => {
  try {
    const team = await TeachingTeam.find(); 
    res.render("view_teaching_team", { team });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving Teaching Team data.");
  }
});
app.get("/video", async (req, res) => {
  try {
    const videos = await Video.find(); 
    res.render("view_video", { videos });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving Video Section data.");
  }
});
app.delete("/teaching_team/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await TeachingTeam.findByIdAndDelete(id);
    res.redirect("/teaching_team");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting the teaching team member.");
  }
});
app.delete("/video/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    res.redirect("/video");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting the video.");
  }
});




app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
