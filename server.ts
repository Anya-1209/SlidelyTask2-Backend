import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;
const dbFilePath = path.join(__dirname, 'db.json');

app.use(bodyParser.json());

app.get('/ping', (req, res) => {
    res.send(true);
});

app.post('/submit', (req, res) => {
    const { name, email, phone, github_link, stopwatch_time } = req.body;
    const newSubmission = { name, email, phone, github_link, stopwatch_time };

    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        const db = JSON.parse(data);
        db.submissions.push(newSubmission);
        fs.writeFile(dbFilePath, JSON.stringify(db, null, 2), 'utf8', (err) => {
            if (err) throw err;
            res.send('Submission saved');
        });
    });
});

app.get('/read', (req, res) => {
    const index = parseInt(req.query.index as string);
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        const db = JSON.parse(data);
        if (index < 0 || index >= db.submissions.length) {
            res.status(404).send('Submission not found');
        } else {
            res.json(db.submissions[index]);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
