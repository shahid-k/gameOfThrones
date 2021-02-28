const express = require("express");
const app = express();
const requestLogger = require("./utilities/requestLogger");
const errorLogger = require("./utilities/errorLogger");
const RouterObj = require("./routes/Routing");
const bodyParser = require("body-parser");
const cors = require("cors");
var PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

app.use(requestLogger);
app.use("/", RouterObj);

app.use(errorLogger);

app.listen(PORT);
console.log("Hoopla Server Started!!");
