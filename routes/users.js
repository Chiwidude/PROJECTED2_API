/*Variables*/
var express = require('express');
var router = express.Router();
var Cryptojs = require('crypto-js');
var mongoclient = require('mongodb').MongoClient;
/*Constants*/
const app = express();
const jwebt_simple = require('jwt-simple')
const url = 'mongodb://localhost:27017';
const jwebtoken = require('jsonwebtoken');
const dbname = 'ProyectoED2';
const cllname = 'Users';
const secretPass = "keypass";
const keywrd = "Apikey";
/* GET users listing. */
/* Inserting users to db*/
router.post('/signup', function(req, res, next){ 
  var encrypted = Cryptojs.SHA256(req.body.Password,secretPass).toString();
      const user  = {
             "Username": req.body.Username,
              "Name": req.body.Name,
              "LastName" : req.body.LastName,
             "Password": encrypted,
              "Email" : req.body.Email
            }
   mongoclient.connect(url,{useNewUrlParser:true},(err,client)=>{
      if(err) return next(createError(500))
         const database = client.db(dbname)
         const collection  = database.collection(cllname);
        collection.findOne({Username: user.Username},function(err,doc){
          if(err) return next(createError(500));
          if(!doc){
              collection.insertOne(user,err =>{
                if(err) return next(createError(500))
                res.status(201).end();
              })
          }else{
            res.status(409).end();
          }
        })
});
});
router.get('/authorize',WarrantToken, (req,res)=>{
  jwebtoken.verify(req.token,keywrd,(err,data)=>{
    if(err) {
      res.sendStatus(403);
    }else{
        delete data["iat"];
        delete data["exp"];
        delete data["Password"];
        var newtoken = gjwtToken(data,keywrd);
      res.sendStatus(200).json(newtoken);
      
    }
  })
  });
  router.post('/signin',(req,res)=>{
    mongoclient.connect(url,{useNewUrlParser:true},(err,client)=>{
      if(err) return next(createError(500));
      const database = client.db(dbname);
      const collection = database.collection(cllname);
      var encrypted = Cryptojs.SHA256(req.body.Password,secretPass).toString();
      collection.findOne({Username:req.body.Username,Password:encrypted},function(err,doc){
            if(err) return next(createError(500))
            if(doc){
              delete doc["Email"];
              delete doc["Name"];
              delete doc["LastName"];
              delete doc["Password"];
              const token = gjwtToken(doc,keywrd);
              res.status(200).json(token).end();
            }else{
              res.status(404).end();
            }
      })
    })

  })
/* Generates jwtoken*/
function gjwtToken(jwt,kword){
  jwebt_simple.encode(jwt,kword);
  return token = jwebtoken.sign(jwt,kword,{
      expiresIn: '30d'
  })
}
/* validate if a token was sent */
function WarrantToken(req,res,next){
  const bearerheader= req.headers['authorization'];
  if(typeof bearerheader !== 'undefined'){
    const bearer = bearerheader.split(" ");
    const bToken = bearer[1];
      req.token = bToken;
      next();
  }else{
    res.sendStatus(403);
  }
}
/*Get petition db*/




module.exports = router;

