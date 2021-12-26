const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const detailMutanga = require("./detailmutanga");
const Sheet = require("../model/Sheet");

/* GET users listing. */
router.get('/*', function(req, res, next) {
    try
    {
        
        let workbook = new Sheet("./horaire.xlsx");
    
    let sheetname;
    workbook.sheet_name_list.forEach(
        element=>{
            if(element.replaceAll(" ","")==(req.url.slice(1).replaceAll("%20","")))
            {
                sheetname = element
            }
        })
    let a = workbook.getData(sheetname);    
    res.render('horaire',{data:a});

    }
    catch(e)
    {
        res.send(req.url.slice(1))
    }
});
module.exports = router;
