const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const detailMutanga = require("./detailmutanga");
const Sheet = require("../model/Sheet");

/* GET users listing. */
router.get('/*', function(req, res, next) {
    
        
        let workbook = new Sheet("./horaire.xlsx");
    
    let sheetname;
    workbook.sheet_name_list.forEach(
        element=>{
            if(element.replace(/\s/g,"")==(req.url.slice(1).replace(/%20/g,"")))
            {
                sheetname = element
            }
        })
    let a = workbook.getData(sheetname);    
    res.render('horaire',{data:a});

    
});
module.exports = router;
