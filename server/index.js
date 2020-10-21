const express = require('express');
const cors = require('cors');
const monk = require('monk');





const app = express();

const db = monk('localhost/meower');
const data = db.get('data');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        title: 'server title',
        description: 'server description'
    });
});


function isValidMew(mew) {
    return mew.title && mew.title.toString().trim() !== '' &&
        mew.description && mew.description.toString().trim() !== '';
}

app.post('/data', (req, res) => {
    if (isValidMew(req.body)) {
        const mew = {
            title: req.body.title.toString(),
            description: req.body.description.toString(),
            created: new Date()
        };
        console.log(req.body);
        data
            .insert(mew)
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




app.listen(7000, () => {
    console.log('Listening on http://localhost:7000');
});