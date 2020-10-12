const express = require('express')
const jwt = require('jsonwebtoken')
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('mydb.db');
var md5 = require('md5');
const router = express.Router();

router.get('/', (req, res) => {

    res.json({ auth: 'sucess' });

});

router.post('/login', (req, res) => {
    const user = req.body;
   
    if (!user.username || !user.password) {
        res.json({ status: 'Login faild , User name or password not found' });
    }
    else {
       

        const accessToken = jwt.sign(user, process.env.SECRETE_KEY)
        db.all('INSERT INTO Users ( username, pswd ) VALUES  ( $username, $password);', user.username, md5(user.password), (err , user) => {
            if (err) res.json({ status: 'Login faild , try again with different user name' });
            else {
                    
                res.send({ accessToken: accessToken });
            }
        });
    }

})

module.exports = router;