const express = require('express');
const app = express();
app.use(express.urlencoded({extended : true}));

const port = 8080;

const mongoClient = require('mongodb').MongoClient;
mongoClient.connect("mongodb+srv://kimchj:cjfwnddlek1!!@cluster0.mr3u6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", (err, client) => {
    
    if(err){
        return console.log(err);
    }

    app.get("/", (req, res) => {
        res.sendFile(__dirname + "/index.html");
    });
});


app.get("/write", (req, res) => {
    res.sendFile(__dirname + "/write.html");
});

app.post("/add", (req, res) => {
    console.log(req.body);
    res.send("입력됨");
});

app.listen(port, () => {
    console.log("server is running port: " + port);
});