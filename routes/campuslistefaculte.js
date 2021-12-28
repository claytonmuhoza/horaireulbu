const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');

var detailRouter = require('./detailhoraire');
var detailKinindoRouter = require('./detailhorairekinindo')



 
/* GET users listing. */
router.get('/kinindo', function(req, res, next) {
    console.log("before");
    var workbook = XLSX.readFile('./uploads/horaire kinindo.xlsx',{sheetStubs:true});
    console.log("after");
    var sheet_name_list = workbook.SheetNames;
    console.log(sheet_name_list);
    res.render('listesheet',{title:"liste des facultés campus de Kinindo",campus:"Kinindo",data:sheet_name_list});
  
});
router.get('/mutanga', function(req, res, next) {
    var workbook = XLSX.readFile('./uploads/horaire mutanga.xlsx',{sheetStubs:true});
    var sheet_name_list = workbook.SheetNames;
    res.render('listesheet',{title:"liste des facultés campus mutanga",campus:"mutanga",data:sheet_name_list});
  
});
//detail feuille
router.use('/mutanga',detailRouter)
router.use('/kinindo',detailKinindoRouter)

module.exports = router;
