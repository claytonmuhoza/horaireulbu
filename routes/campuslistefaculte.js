const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');

var detailRouter = require('./detailmutanga');



 
/* GET users listing. */
router.get('/mutanga', function(req, res, next) {
    var workbook = XLSX.readFile('./uploads/horaire mutanga.xlsx',{sheetStubs:true});
    var sheet_name_list = workbook.SheetNames;
    res.render('listesheet',{title:"liste des facultés campus mutanga",campus:"mutanga",data:sheet_name_list});
  
});
router.use('/mutanga',detailRouter)
module.exports = router;
