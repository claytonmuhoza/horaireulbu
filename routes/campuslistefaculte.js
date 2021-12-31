const express = require('express');
const router = express.Router();
const session = require('express-session')
const XLSX = require('xlsx');
const fs = require('fs');
var detailRouter = require('./detailhoraire');
var detailKinindoRouter = require('./detailhorairekinindo')
var listeCampus = JSON.parse(fs.readFileSync('./campus.json','utf-8')); 
router.use(session({
    secret: fs.readFileSync('session-code.txt','utf-8'),
    resave: false,
    saveUninitialized: false
  }))
/* GET users listing. */
router.get('/*', function(req, res, next) {
    var campus;
    listeCampus.forEach(
        element=>{
            if(element.replace(/\s/g,"")==(req.url.slice(1).replace(/%20/g,"")))
            {
                campus = element
            }
        })
    if(campus){
        let sheet_name_list;
    try{
    let workbook = XLSX.readFile('./uploads/horaire '+ campus +'.xlsx',{sheetStubs:true});
    
     sheet_name_list = workbook.SheetNames;
    }catch{
     sheet_name_list = [];
    }
    let connecter
    if(req.session.passport)
    {
        connecter = true
    }
    console.log(req.session);
    res.render('listesheet',{connect:connecter,title:"liste des facultés campus de Kinindo",menu: listeCampus,campus: campus,data:sheet_name_list});
    }else
    {
        next();
    }
});

//detail feuille
router.use('/',detailRouter)
router.use('/',detailKinindoRouter)

module.exports = router;
