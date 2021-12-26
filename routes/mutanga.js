const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
var workbook = XLSX.readFile('./horaire.xlsx',{sheetStubs:true});
var detailRouter = require('./detailmutanga');

var sheet_name_list = workbook.SheetNames;

 
/* GET users listing. */
router.get('/', function(req, res, next) {

    res.render('listesheet',{data:sheet_name_list});
  
});
router.use('/',detailRouter)
module.exports = router;
