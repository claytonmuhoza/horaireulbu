const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const fs = require('fs');
var detailRouter = require('./detailhoraire');
var detailKinindoRouter = require('./detailhorairekinindo')
var listeCampus = JSON.parse(fs.readFileSync('./campus.json','utf-8')); 
 
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
    var workbook = XLSX.readFile('./uploads/horaire '+ campus +'.xlsx',{sheetStubs:true});
    
    var sheet_name_list = workbook.SheetNames;
    console.log(sheet_name_list);
    res.render('listesheet',{title:"liste des facultés campus de Kinindo",campus: campus,data:sheet_name_list});
    }else
    {
        next();
    }
});

//detail feuille
router.use('/',detailRouter)
router.use('/',detailKinindoRouter)

module.exports = router;
