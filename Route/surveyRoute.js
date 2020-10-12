const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')

const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./mydb.db', (err) => { if (err) console.log(err); });

const router = express.Router();
router.use(express.json())
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())



// create a survey 
let lastid = 1;
router.post('/create', checkauth, (req, res) => {
    const survey = req.body;

    let user = req.user.username;
    let id = lastid;
    try {
        let questions = JSON.parse(survey.Questions);
        const globalerr = [];
        db.run('INSERT INTO survey(username ,surveyId , surveyname) values($username ,$id , $name)', user, id, survey.name, function (err) {

            if (err) {

                globalerr.push(err);

            }

            lastid = this.lastID + 1;
        })

        try {
            for (let i in questions) {


                db.run('INSERT INTO questions(surveyId , question) values($id,$question)', id, questions[i], function (err) {

                    if (err) {
                        // res.send({ err: "Formate of the question is not currect !! Formate : Json Object " });
                        globalerr.push(err);

                    }
                })


            }

            res.json({ ...survey, result: 'added to db' });

        }
        catch {
            res.json({ err: globalerr })
        }



    }
    catch {
        res.send({ err: "Formate of the question is not currect !! Formate : Json Object " });
    }


})

//  get questions of the specific survey

router.get('/get-questions/:id', checkauth, (req, res) => {
    let id = req.params.id;

    try {
        db.all('SELECT * FROM questions WHERE surveyId = $id ', Number(id), (err, result) => {

            let ans = {};

            for (let i in result) {
                ans[i] = result[i].question;
            }
            res.json({ 'questions': ans });
        })
    }
    catch {
        res.json({ err: 'something went wrong database error !!' });
    }

})

// submit the answer of the specific survey

router.post('/take/:id', checkauth, (req, res) => {
    let id = req.params.id;
    const Answers = req.body;
    let username = req.user.username;
    try {
        db.serialize(() => {

            db.all('SELECT * FROM questions WHERE surveyId = $id ', id, (err, data) => {
                const es = [];
                let questions = {};
                let ans = {};


                for (let i in data) {
                    questions[i] = data[i].question;
                }
                let p = 0;
                for (let i in Answers) {
                    ans[p] = Answers[i];
                    p++;
                }


                if (Object.keys(ans).length === 0) {
                    es.push({ info: "Try again answer have to be yes or no only" });

                }
                for (let i in ans) {

                    let currentanswer = ans[i].toLowerCase();

                    if (currentanswer === 'yes' || currentanswer === 'no') {

                    }
                    else {
                        es.push({ error: "Try again answer have to be yes or no only" });

                    }

                }
                db.serialize(() => {
                    for (let i in ans) {

                        let currentanswer = ans[i].toLowerCase();

                        db.run('INSERT INTO answers(surveyId , username ,question, answer) values($id,$user ,$question ,$answer)', id, username, questions[i], currentanswer, (err) => {

                            if (err) {


                                es.push(err);

                            }

                        });




                    }


                    setTimeout(() => {
                        if (es.length === 0) {
                            res.json({ Answers, result: "Success" });
                        }
                        else {
                            res.json({ es, result: "Failed" });
                        }
                    })
                }, 8000);



            })

        })
    }
    catch {
        res.json({ err: 'something went wrong database error !!' });
    }

})

// view reesult of the specific survey how yes is there .

router.get('/view-result/:id', checkauth, (req, res) => {
    let id = req.params.id;

    try {

        db.all('select * from answers where surveyId = $id ', id, (err, data) => {

            res.json({ data });
        })
    }
    catch {
        res.json({ err: 'something went wrong database error !!' });
    }


})


function checkauth(req, res, next) {
    const authheader = req.headers['authorization'];
    const token = authheader && authheader.split(' ')[1];
    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRETE_KEY, (err, user) => {
        if (err) return res.sendStatus(403)

        req.user = user
        next();
    })


}

module.exports = router;