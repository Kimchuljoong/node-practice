const express = require('express');
const app = express();
app.use(express.urlencoded({extended : true}));

const port = 8080;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
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