// Static Const which are needed to run server
const fs = require('fs');
const express = require('express');
const path = require('path');

// Accessing the Notes Database
const notesDB = require('./db/db.json');

// Creates the unique ID for post
const { v4: uuidv4 } = require('uuid');

// Port created for server
const PORT = process.env.PORT || 3001;


const app = express();


// Middleware, got suggestion from stackoverflow
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// accessing public folder but not editing anything withing folder
app.use(express.static('public'));

// Get requests for both main page as well as notes page located in public folder
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET access to db.json in order to input new data
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf-8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.json(JSON.parse(data));
        }
    })});

// POST request for notes
app.post('/api/notes', (req, res) => {

    const {title, text} = req.body;

    if (title && text) {
        const newNote = { title, text, id: uuidv4() }

        fs.readFile('./db/db.json', 'utf-8', (err, data) => {
            if (err) {
                console.log(err);
            } else {
                const Notedata = JSON.parse(data);
                Notedata.push(newNote)
                fs.writeFile('./db/db.json', JSON.stringify(Notedata, null, 4), (err) => {
                    err ? console.log(err) : console.log('Note has been successfully added!')
                })
            }
        })

        const saved = {
            status: 'success',
            body: newNote
        }
        res.json(saved);
    } else {
        res.json('Error occured, unable to save note')
    }
})

// Server Connection port code
app.listen(PORT, () => {
    console.log(`server is now running, please go to http://localhost:${PORT}`);
})