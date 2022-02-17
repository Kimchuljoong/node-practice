const express = require('express');
const app = express();
app.use(express.urlencoded({extended : true}));
app.set('view engine', 'ejs');

const port = 8080;

const config = require('./config/db');

const mongoClient = require('mongodb').MongoClient;

let db;
mongoClient.connect(config.db, (err, client) => {
    
    if(err){
        return console.log(err);
    }

    db = client.db('todoDB');

    app.listen(port, () => {
        console.log("server is running port: " + port);
    });
    
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/write", (req, res) => {
    res.render("write.ejs");
});

app.post("/add", async (req, res) => {

    let saveId = await getNextSequence("post");
    let saveTitle = req.body.title;
    let saveDate = req.body.date;
    
    let saveData = {};
    saveData._id = saveId;
    saveData.title = saveTitle;
    saveData.date = saveDate;

    db.collection('post').insertOne( saveData , (err, result) => {

        if(err){
            console.log(err);
            return;
        }

        console.log("저장 완료");
        res.render("write.ejs");
    });
    
});

app.get("/list", (req, res) => {

    const data = db.collection("post").find().toArray((err, result) => {
        if(err){
            alert("데이터 조회 실패");
        }

        let listData = {};
        listData.posts = result;

        res.render("list.ejs", listData);

    });
});

app.delete("/list/delete", (req, res) => {
    
    req.body._id = parseInt(req.body._id);

    db.collection("post").deleteOne(req.body, (err ,result) => {
        if(err){
            console.log(err);
            res.status(400).send({ message : "처리중 오류 발생!" });
        }

        console.log("삭제완료");

        res.status(200).send({ message : "삭제완료!" });
    });
});

app.get("/list/detail/:id", (req, res) => {

    req.params.id = parseInt(req.params.id);

    db.collection("post").findOne({ _id : req.params.id }, function(err, result){

        if(err){
            console.log(err);
            res.status(400).send({ message : "상세 페이지를 가져오지 못했습니다." });
        }

        res.render('detail.ejs', {post : result});
    });
});

// util
// gen sequence
getNextSequence = async (name) => {
    
    var ret = await db.collection("sequence").findOneAndUpdate(
       { name: name },
       {
          $inc: {
             seq: 1
          }
       },
       { returnOriginal: false }
    );

    return ret.value.seq;
 }