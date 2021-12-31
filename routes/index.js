const express = require('express'); 
const router = express.Router();
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
var listeCampus = JSON.parse(fs.readFileSync('./campus.json','utf-8')); 
const session = require('express-session');
/* GET users listing. */
router.use(session({
    secret: fs.readFileSync('session-code.txt','utf-8'),
    resave: false,
    saveUninitialized: false
  }));
  
/* GET home page. */
router.get('/', function(req, res, next) {
  let connecter
    if(req.session.passport)
    {
        connecter = true
    } 
  res.render('index', {connect:connecter,title: "Bienvenu sur Horaire ULBU",listecampus:listeCampus,menu:listeCampus });
});
module.exports = router;
