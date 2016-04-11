var express = require("express");
var fs = require("fs");
var multer  = require("multer");
var fsextra = require("fs.extra");

var app = express();

var directory = "";
var dest = "./public/uploads" + directory;
var name = "";
var extension = "";
var uploadDir =  "./public/uploads";

var storage = multer.diskStorage({
  destination: "./public/uploads",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

/*
name = file.originalname;
extension = name.split(".")[1];
var direct = redirect(extension);
*/

//storage.destination=redirect(extension);

var upload = multer({ storage: storage });

app.use(express.static('./public'));

app.post('/api/file', upload.array('file'), function (req, res) {

  console.log("received " + req.files.length + " files");// form files
  for (var i=0; i < req.files.length; i++) {
  	console.log("### " + req.files[i].path);
    var newName = req.files[i].path.substr(req.files[i].path.lastIndexOf('/')+1);
    var extension = newName.split(".")[1];
    var dest = redirect(extension);
    //var myObject, f;
    //myObject = new ActiveXObject("Scripting.FileSystemObject");
    //fsextra.copy(req.files[i].path, uploadDir+"/"+dest+"/"+name);
    fsextra.copy(req.files[i].path, uploadDir+dest+"/"+newName, { replace : true }, function (err) {
        if (err) {
    throw err;
  }
 
  //console.log("Moved " + req.files[i].path + " to " + uploadDir+dest+"/"+newName);
});
  }
  //console.log("The URL for the file is:" + "localhost:3000\\"+req.file.path);

  res.status(204).end();  

});

app.get('/', function (req, res) {

  res.sendFile("index.html");

});

app.get('/uploads', function (req, res) {
	fs.readdir("./public/uploads", function(err, list) {
			res.end(JSON.stringify(list));
	});
  
});

app.listen(3000, function () {

  console.log("Server is listening on port 3000");
  console.log("Open http://localhost:3000 and upload some files!")

});

function redirect(extension) {
    console.log("Extension 2" + extension);
    switch(extension){
        case "html":
            directory="/html";
            break;
        default:
            directoy="/other";
            break;
    }
    dest=dest+directory;
    return directory;
}
