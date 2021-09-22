const standard = require('./routes/standard');

const express = require("express");

const app = express();

app.use(express.json());

app.use('/servicebus/v1/standard', standard);

console.log(process.env);
const APP_PORT = parseInt(process.env.APP_PORT, 10);
app.listen(APP_PORT, () => {
    console.log(`API app running at port ${APP_PORT}`)
});