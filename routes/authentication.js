if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport')
const fs = require('fs')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const fileUpload = require('express-fileupload');
const path = require('path');
const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)
let users = []
let listeCampus = JSON.parse(fs.readFileSync('./campus.json','utf-8')); 

app.use(flash())
app.use(session({
  secret: fs.readFileSync('session-code.txt','utf-8'),
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))



app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs',{title:"Se connecter sur horaire ULBU", menu:listeCampus, connect: req.isAuthenticated()})
})
users = JSON.parse(fs.readFileSync('users.json','utf-8'));
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/upload',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/register', checkAuthenticated, (req, res) => {
  res.render('register.ejs',{title:"Inscrire une personne",menu: listeCampus,connect:req.isAuthenticated()})
})

app.post('/register', checkAuthenticated, async (req, res) => {
  try {
    users = JSON.parse(fs.readFileSync('users.json','utf-8'))
    if(users.findIndex(e=>e.email===req.body.email)<0)
    {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    fs.writeFileSync('users.json',JSON.stringify(users))
    
    res.redirect('/login');
    }
    else{
      res.render('register.ejs',{title:"Inscrire une nouvelle personne",message:"L'utilisateur existe déjà",connect:req.isAuthenticated()});
    }
    
 } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/upload')
  }
  next()
}
app.use(fileUpload())
app.get('/gestioncampus',checkAuthenticated,(req,res,next)=>{
  let message
      if(req.session.message)
      {
         message = Object.assign({}, req.session.message);
        delete req.session.message
      }
  res.render('gestionCampus',{menu:listeCampus,connect:req.isAuthenticated(),title:"Gestion des campus",listecampus:listeCampus,message:message});
})
app.post('/gestioncampus',checkAuthenticated,(req,res,next)=>{
      try
      {
        if(req.body.nomcampus && req.body.nomcampus.trim().length < 4)
        {
          req.session.message = {error:"Le nom du campus doit avoir au moins 4 caractère."};
          
        }
        else{
          let campus = req.body.nomcampus.toLowerCase();
          campus = campus.replace(/\s*$/,"");
          campus = campus.trim()
          if(listeCampus.indexOf(campus)<0){
          listeCampus.push(campus);
          fs.writeFileSync('campus.json',JSON.stringify(listeCampus));
          console.log(listeCampus);
          req.session.message = {success:"Le campus a été ajouter à la liste des campus."};
          }else
          {
            req.session.message = {error:"Le campus existe déjà."};
          }
        }
      }
      catch
      {
        req.session.message = {error:"Veuillez entre le nom du campus."};
      }
      res.redirect('/gestioncampus');
})
app.delete('/gestioncampus',checkAuthenticated,(req,res)=>{
  function removeArray(array, index) {
    return array.slice(0, index)
      .concat(array.slice(index + 1));
  }
  try
      {
        if(req.body.nomcampus && (listeCampus.indexOf(req.body.nomcampus.trim())>=0) )
        {
          
          listeCampus = removeArray(listeCampus,listeCampus.indexOf(req.body.nomcampus.trim()));
          fs.writeFileSync('campus.json',JSON.stringify(listeCampus));
          try{
            let link = "./uploads/horaire "+req.body.nomcampus.trim()+".xlsx"
            fs.stat(link, function (err, stats) {
              
           
              if (err) {
                  return console.error(err);
              }
           
              fs.unlink(link,function(err){
                   if(err) return console.log(err);
                   console.log('file deleted successfully');
              });  
           });
          }catch(err)
          {
            console.log("error"+err)
          }
          req.session.message = {success2:"Le nom du campus a été supprimé avec succes."};
        }
        else{
          
          req.session.message = {error2:"Il y a eu une erreur.Veuillez réessayer à nouveau."};
        }
      }
      catch(e)
      {
        req.session.message = {error2:"Il y a eu une erreur.Veuillez réessayer à nouveau." + e};
      }
      console.log(listeCampus.indexOf(req.body.nomcampus) )
      res.redirect('/gestioncampus');
})
app.get('/upload',checkAuthenticated, (req, res) => {
  try{
      
      let message
      if(req.session.message)
      {
         message = Object.assign({}, req.session.message);
        delete req.session.message
      }
      return res.render('upload',{connect:req.isAuthenticated(),listecampus:listeCampus,menu:listeCampus,message:message})
      
    }catch
  {
    next()
  }
    
    
});


app.post('/upload',checkAuthenticated, (req, res,next) => {
    let sampleFile;
    let fileName;
    let newFileName;
    let uploadPath;
  
    if(req.body.fileName == "" || (!req.files || Object.keys(req.files).length === 0) ){
              
            req.session.message={error:"Aucun fichier n'a été upload. veuillez selectionner le fichier à uploader"}
            return res.redirect('/upload')
    }
  
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    sampleFile = req.files.sampleFile;

        //The uploaded fileName
        fileName = "horaire "+ req.body.fileName;
        if(listeCampus.indexOf(req.body.fileName) < 0)
        {
         req.session.message={error:"Le fichier n'a pas été publié. veuillez réessayer"};
          return res.redirect('/upload');
        }
        //get file extention
        let ex = path.extname(sampleFile.name)
        if(ex !== ".xlsx")
        {
          req.session.message = {error:"Le fichier n'a pas été publié. Le fichier doit être de type excel avec l'extension .xlsx"}
          return res.redirect('/upload');
          //return res.render('upload',{connect:req.isAuthenticated(),message:{error:"Le fichier n'a pas été publié. Le fichier doit être de type excel avec l'extension .xlsx"}});

        }
        //new file name
        newFileName = fileName + ex

    uploadPath =  './uploads/' + newFileName.toString();
    



    //mv() method to place the file somewhere on the server
    sampleFile.mv(uploadPath, (err) => {
      if (err)
      {
          console.log(err)
          
         req.session.message={error:"Le fichier n'a pas été publié. veuillez réessayer"};
          return res.redirect('/upload');
      }
      else{
          req.session.message={success:"Le fichier a bien été publié"};
          return res.redirect('/upload');
      }

        
      

    });
  });
  module.exports = app;