const express = require('express');
const cors = require('cors');





const app = express();


app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        title: 'server title',
        description: 'server description'
    });
});

app.post('/data', (req, res) => {
    console.log(req.body);
});




app.listen(7000, () => {
    console.log('Listening on http://localhost:7000');
});