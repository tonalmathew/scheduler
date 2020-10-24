const express = require('express');
const cors = require('cors');
const monk = require('monk');
const Filter = require('bad-words');
// const rateLimit = require("express-rate-limit");



const app = express();

const db = monk('localhost/dbdata');
const data = db.get('data');
filter = new Filter();

app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.json({
        date: 'server Date',
        title: 'server title',
        description: 'server description'
    });
});

app.get('/data', (req, res) => {
    data
        .find()
        .then(data => {
            res.json(data);
        })
});


function isValidData(dat) {
    return dat.title && dat.title.toString().trim() !== '' &&
        dat.description && dat.description.toString().trim() !== '';
}

// app.use(rateLimit({
//     windowMs: 30 * 1000, // 30 seconds
//     max: 1
// }));

app.post('/data', (req, res) => {
    if (isValidData(req.body)) {
        const dat = {
            date: req.body.date,
            title: filter.clean(req.body.title.toString()),
            description: filter.clean(req.body.description.toString()),
            created: new Date()
        };
        // console.log(req.body);
        data
            .insert(dat)
            .then(createdData => {
                res.json(createdData);
            });


    } else {
        // res.status(422);
        // res.json({
        //     message: 'Hey! Title and Description are required!'
        // });
    }
});

app.delete('/data', (req, res) => {
    // console.log(req.body._id)
    data
        .remove({ _id: req.body._id })
        .then(createdData => {
            res.json(createdData);
            // console.log(createdData);
        });
});




app.listen(7000, () => {
    console.log('Listening on http://localhost:7000');
});