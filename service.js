const express = require('express');
const app = express();
app.use(express.urlencoded({extended : true}));

const port = 8080;

const mongoClient = require('mongodb').MongoClient;

let db;
mongoClient.connect("mongodb+srv://kimchj:cjfwnddlek1!!@cluster0.mr3u6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", (err, client) => {
    
    if(err){
        return console.log(err);
    }

    db = client.db('todoDB');

    app.listen(port, () => {
        console.log("server is running port: " + port);
    });
    
});


app.get("/write", (req, res) => {
    res.sendFile(__dirname + "/write.html");
});

app.post("/add", (req, res) => {
    let saveTitle = req.body.title;
    let saveDate = req.body.date;

    let saveData = {};
    saveData.title = saveTitle;
    saveData.date = saveDate;

    db.collection('post').insertOne( saveData , (err, result) => {
        console.log("저장 완료");
    });
    res.send("입력됨");
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});