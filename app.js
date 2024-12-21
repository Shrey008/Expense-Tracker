const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Ensure the 'hisaab' directory exists
const hisaabDirectory = path.join(__dirname, "hisaab");
if (!fs.existsSync(hisaabDirectory)) {
  fs.mkdirSync(hisaabDirectory); // Create the directory if it doesn't exist
}

// Home Route
app.get("/", (req, res) => {
  fs.readdir(hisaabDirectory, (err, files) => {
    if (err) return res.status(500).send("Error reading directory.");
    res.render("index", { files });
  });
});

// Create New Hisaab Page
app.get("/create", (req, res) => {
  res.render("create");
});

// Create Hisaab - Save to File
app.post('/createhisab', (req, res) => {
  const currDate = new Date();
  const date = `${currDate.getDate()}-${currDate.getMonth() + 1}-${currDate.getFullYear()}`;

  const filepath = path.join(hisaabDirectory, `${date}.txt`);

  fs.writeFile(filepath, req.body.content, function(err) {
    if (err) return res.status(500).send(err);
    res.redirect("/");  // Redirect after successful creation
  });
});

// Update Hisaab
app.post("/update/:filename", (req, res) => {
  const filepath = path.join(hisaabDirectory, `${req.params.filename}.txt`);
  fs.writeFile(filepath, req.body.content, (err) => {
    if (err) return res.status(500).send("Error updating file.");
    res.redirect("/");
  });
});

// Edit Hisaab Page
app.get("/edit/:filename", (req, res) => {
  const filepath = path.join(hisaabDirectory, `${req.params.filename}.txt`);
  fs.readFile(filepath, "utf-8", (err, filedata) => {
    if (err) return res.status(500).send("Error reading file.");
    res.render("edit", { filedata, filename: req.params.filename });
  });
});

// View Hisaab Page
app.get("/hisaab/:filename", (req, res) => {
  const filepath = path.join(hisaabDirectory, `${req.params.filename}.txt`);
  
  fs.readFile(filepath, "utf-8", (err, filedata) => {
    if (err) return res.status(500).send("Error reading file.");
    res.render("hisaab", { filedata, filename: req.params.filename });
  });
});

// Delete Hisaab
 

app.post("/delete/:filename", (req, res) => {
  fs.unlink(`/hisaab${req.params.filename}`, function (err) {
    if (err) return res.status(500).send("Error deleting file.");
    res.redirect("/");
  });
});


app.listen(3000)