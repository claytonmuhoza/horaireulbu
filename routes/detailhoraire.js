const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const detailMutanga = require("./detailhoraire");
const Sheet = require("../model/Sheet");
const fs = require('fs');
const session = require('express-session');
var listeCampus = JSON.parse(fs.readFileSync('./campus.json','utf-8')); 
/* GET users listing. */
router.use(session({
    secret: fs.readFileSync('session-code.txt','utf-8'),
    resave: false,
    saveUninitialized: false
  }));
router.get('/*/*', function(req, res, next) {
    
    let campus,fac;
    campus = req.url.split("/")[1].replace(/%20/g," ");
    fac = req.url.split("/")[2];
        try{
        let workbook = new Sheet("./uploads/horaire "+campus+".xlsx");
    let sheetname;
    workbook.sheet_name_list.forEach(
        element=>{
            if(element.replace(/\s/g,"")==(fac.replace(/%20/g,"")))
            {
                sheetname = element
            }
        })
    let a = workbook.getData(sheetname);
    let connecter
    if(req.session.passport)
    {
        connecter = true
    }    
    res.render('horaire',{connect:connecter,menu: listeCampus,campus:"mutanga",title:sheetname,data:a});
    }
    catch(e)
    {
        next()
    }
    
});

module.exports = router;
