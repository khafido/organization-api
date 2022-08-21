const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const app = express();

var corsOptions = {
    origin: "http://localhost:8000"
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "Assessment Test." });
});

require('./app/routes/employees.route')(app);

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});