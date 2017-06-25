const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/html'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.get("/", function (req,res) {
    res.sendFile("/html/index.html", {root: __dirname + "/public/"});

});

app.use("/", require("./routes/indexRoutes.js"));
app.use("/notes", require("./routes/notesRoutes.js"));

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


app.use(function(err, req, res, next) {
    if (err) {
        res.status(500).send('Error! Sorry!');
    }
    else
    {
        next(err);
    }
});


const hostname = '127.0.0.1';
const port = 1993;
app.listen(port, hostname, () => {  console.log(`Server running at http://${hostname}:${port}/`); });
