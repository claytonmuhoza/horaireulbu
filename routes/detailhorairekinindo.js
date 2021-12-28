const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const detailMutanga = require("./detailhoraire");
const Sheet = require("../model/Sheet");

/* GET users listing. */
router.get('/*', function(req, res, next) {
    
        try{
        let workbook = new Sheet("./uploads/horaire kinindo.xlsx");
    
    let sheetname;
    workbook.sheet_name_list.forEach(
        element=>{
            if(element.replace(/\s/g,"")==(req.url.slice(1).replace(/%20/g,"")))
            {
                sheetname = element
            }
        })
    let a = workbook.getData(sheetname);    
    res.render('horaire',{campus:"kinindo",title:sheetname,data:a});
    }
    catch(e)
    {
        next()
    }
    
});

module.exports = router;
