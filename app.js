
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const libre = require('libreoffice-convert');
var outputFilePath;
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(expressLayouts);
app.set('view engine','ejs');
var PORT = process.env.PORT || 3000;

app.get("/",(req, res)=>{
    res.render("services");
});

app.listen(PORT, () => console.log("Port is listening..."));