const express = require('express');
const router = express.Router();
const XLSX = require('xlsx');
const detailMutanga = require("./detailhoraire");
const Sheet = require("../model/Sheet");

/* GET users listing. */
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
    res.render('horaire',{campus:"mutanga",title:sheetname,data:a});
    }
    catch(e)
    {
        next()
    }
    
});

module.exports = router;
