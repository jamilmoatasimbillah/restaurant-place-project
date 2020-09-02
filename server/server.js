const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const apiRoutes = require('./Routes/api');
const queryRoutes = require('./Routes/query');

const port = process.env.NODE_ENV === "production" ? process.env.PORT : 5000;


const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use('/query', queryRoutes);
app.use('/api', apiRoutes);

app.get('/', (req, res)=> {
    return res.status(200).send("Working")
})

/**
 * ! DISCLAIMER : For Security purpose, this database USER and PASSWORD will be destroyed shortly.
 * * INFO : This db-user will be removed on 14/08/2020....
 * * Please change the URL as this url may be invalid at the time of you are using this
 */

const url = 'mongodb+srv://edureka_intern:edureka_intern_password@edurekainternshipcluste.6vwki.mongodb.net/foodDeliveryApp?retryWrites=true&w=majority'

mongoose.connect(url,
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(client => {
    console.log('\n\nConnected To the database');
    console.log("Database URL = ", url, "\n\n");
    app.listen(port, () => {
        console.log(`Server running PORT = ${port}\n\n`)
    });
}).catch(err => {
    console.log(err);
})




