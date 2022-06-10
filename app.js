
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");
const libre = require("libreoffice-convert");
var outputFilePath;
const express = require("express");
const app = express();
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

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads")
    },
    filename: function (req, file, cb) {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
});

app.get('/docxtopdf',(req,res) => {
    res.render('docxtopdf',{title:'Docs to Pdf'})
});
   
const docxtopdf = function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (
      ext !== ".docx" &&
      ext !== ".doc"
    ) {
      return callback('The extension is not supported.');
     
       
    }
    callback(null, true);
};

const docxtopdfupload = multer({storage:storage,fileFilter:docxtopdf});

app.post('/docxtopdf',docxtopdfupload.single('file'),(req,res) => {
    if(req.file){
        console.log(req.file.path)
    
        const file = fs.readFileSync(req.file.path);
    
        outputFilePath = Date.now() + "output.pdf" 
    
        libre.convert(file,".pdf",undefined,(err,done) => {
          if(err){
            fs.unlinkSync(req.file.path)    
            res.send("some error taken place in conversion process")
          }
    
          fs.writeFileSync(outputFilePath, done);
    
          res.download(outputFilePath,(err) => {
            if(err){
              fs.unlinkSync(req.file.path)
            fs.unlinkSync(outputFilePath)
    
            res.send("some error taken place in downloading the file")
            }
    
            fs.unlinkSync(req.file.path)
            fs.unlinkSync(outputFilePath)
          });
    
    
        });
    };
});

app.listen(PORT, () => console.log("Port is listening..."));