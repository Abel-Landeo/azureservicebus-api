const express = require("express");

const app = express();

app.use(express.json());

const standardRoute = require('./routes/standard');
app.use('/servicebus/v1/standard', standardRoute);

const adminRoute = require('./routes/admin');
app.use('/servicebus/v1/admin', adminRoute);

const APP_PORT = parseInt(process.env.APP_PORT, 10);
app.listen(APP_PORT, () => {
    console.log(`API app running at port ${APP_PORT}`)
});