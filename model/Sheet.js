const XLSX = require('xlsx')
module.exports = class Sheet
{
    constructor(url)
    {
        this.workbook = XLSX.readFile(url,{sheetStubs:true});
        this.sheet_name_list = this.workbook.SheetNames;
    }
    
    getColumn = function(a)
    {
    switch(a[0]) {
    case "A":
        // code block
        return 0;
        break;
    case "B":
        // code block
        return 1;
        break;
    case "C":
        // code block
        return 2;
        break;
    case "D":
        // code block
        return 3;
        break;
    case "E":
        // code block
        return 4;
        break;
    case "F":
        // code block
        return 5;
        break;
    case "G":
        // code block
        return 6;
        break;
    case "H":
        // code block
        return 7;
        break;
    case "I":
        // code block
        return 8;
        break;
    case "J":
        // code block
        return 9;
        break;
    case "K":
        // code block
        return 10;
        break;
    case "L":
        // code block
        return 11;
        break;
    case "M":
        // code block
        return 12;
        break;
    case "N":
        // code block
        return 13;
        break;
    case "O":
        // code block
        return 14;
        break;
    case "P":
        // code block
        return 15;
        break;
    case "Q":
        // code block
        return 16;
        break;
    case "R":
        // code block
        return 17;
        break;
    case "S":
        // code block
        return 18;
        break;
    case "T":
        // code block
        return 19;
        break;
    case "U":
        // code block
        return 20;
        break;
    case "V":
        // code block
        return 21;
        break;
    case "W":
        // code block
        return 22;
        break;
    case "X":
        // code block
        return 23;
        break;
    case "Y":
        // code block
        return 24;
        break;
    case "Z":
        // code block
        return 25;
        break;
    default:
        // code block
        return 0;
    }
    }
    getLine= function(a)
    {
    let b;
    b = a.slice(1);
    return b - 1
    }
 /* iterate through sheets */
    getData(sheetName)
    {
        var worksheet = this.workbook.Sheets[sheetName.replaceAll("%20"," ")];
        let a = [];
        let actuallyLine;
        let y;
        for (y in worksheet)
        {
            if(y[0] === '!') 
            {
            continue;
            }
            else
            {
            actuallyLine = y;
            break;
            }
            
        }
        let c = [];
        let z;
        for (z in worksheet) {
            
            /* all keys that do not begin with "!" correspond to cell addresses */
            if(z[0] === '!') continue;
            this.getLine(z)
            if(this.getLine(z) != this.getLine(actuallyLine))
            {
            actuallyLine = z
            a.push(c)
            c = []
            }
            
            if(this.getLine(z) == this.getLine(actuallyLine))
            {
            
                c[this.getColumn(z)]= worksheet[z].v
            
            
            // console.log(JSON.stringify(worksheet[z].v))
            }
            
            
            //console.log(workbook.SheetNames[0] + "!" + z + "=" + JSON.stringify(worksheet[z].v));
        
        
            
        }
        return a;
    }
  
}