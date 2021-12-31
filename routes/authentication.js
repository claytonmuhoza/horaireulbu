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
    res.render('login.ejs',{title:"Se connecter sur horaire ULBU", connect: req.isAuthenticated()})
  })
  users = JSON.parse(fs.readFileSync('users.json','utf-8'));
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/upload',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
  app.get('/register', checkAuthenticated, (req, res) => {
    res.render('register.ejs',{title:"Inscrire une personne",connect:req.isAuthenticated()})
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
  
  app.get('/upload',checkAuthenticated, (req, res) => {
      res.render('upload',{connect:req.isAuthenticated()})
      //next()
  });
  
  
  app.post('/upload',checkAuthenticated, (req, res,next) => {
      let sampleFile;
      let fileName;
      let newFileName;
      let uploadPath;
    
      if(req.body.fileName == "" || (!req.files || Object.keys(req.files).length === 0) ){
  
              return res.render('upload',{connect:req.isAuthenticated(),message:{error:"Aucun fichier n'a été upload. veuillez selectionner le fichier à uploader"}});
      }
    
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      sampleFile = req.files.sampleFile;
  
          //The uploaded fileName
          fileName = req.body.fileName
          if(fileName!="horaire mutanga" && fileName!="horaire kinindo")
          {
            
            return res.render('upload',{connect:req.isAuthenticated(),message:{error:"Le fichier n'a pas été publié. veuillez réessayer"}});
  
          }
          //get file extention
          let ex = path.extname(sampleFile.name)
          if(ex !== ".xlsx")
          {
            req = null;
            return res.render('upload',{connect:req.isAuthenticated(),message:{error:"Le fichier n'a pas été publié. Le fichier doit être de type excel avec l'extension .xlsx"}});
  
          }
          //new file name
          newFileName = fileName + ex
  
      uploadPath =  './uploads/' + newFileName.toString();
      
  
  
  
      //mv() method to place the file somewhere on the server
      sampleFile.mv(uploadPath, (err) => {
        if (err)
        {
            console.log(err)
            return res.render('upload',{connect:req.isAuthenticated(),message:{error:"Le fichier n'a pas été publié. veuillez réessayer"}});
            
        }
        else{
            console.log('fileUploaded')
          return res.render('upload',{connect:req.isAuthenticated(),message:{success:"Le fichier a bien été publié"}});
        }
  
          
        
  
      });
    });
    module.exports = app;