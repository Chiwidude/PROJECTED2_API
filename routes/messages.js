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
const cllname = 'Messages';
const secretPass = "keypass";
const keywrd = "Apikey";


router.post('/addnew',WarrantToken,(req,res)=>{
    jwebtoken.verify(req.token,keywrd,(err,data)=>{
        if(err) {
            res.sendStatus(403);
        }else{
            var conversation = {
                "participantes":req.body.participantes,
                "mensajes": req.body.mensajes
            }
            delete data["iat"]
            delete data["exp"]
            var newtoken = gjwtToken(data,keywrd);

            mongoclient.connect(url,{useNewUrlParser:true},(err,client)=>{
                if(err) return next(createError(500))
                const database = client.db(dbname)
                const collection = database.collection(cllname); 
                collection.insertOne(conversation,err=>{
                    if(err) return next(createError(500))
                    res.setHeader('authorization',newtoken)
                    res.sendStatus(201).end();
                })
            })
        }
    })
})
router.get('/validate',WarrantToken,(req,res)=>{
  jwebtoken.verify(req.token,keywrd,(err,data)=>{
      if(err){
          res.Status(403);
      }else{
        mongoclient.connect(url,{useNewUrlParser:true},(err,client)=>{
            if(err) return next(createError(500));
            const database = client.db(dbname)
            var username = data.Username;
            var part2 = req.headers["ouser"];
            const collection = database.collection(cllname);
            var participantesv = [username,part2];
            var participantesv2 = [part2,username];
            delete data["iat"];
            delete data["exp"];
            var newtoken = gjwtToken(data,keywrd);
            collection.findOne({$or:[{participantes:participantesv},{participantes:participantesv2}]},function(err,doc){
                if(err) next(createError(500))
                if(!doc){
                    res.setHeader('authorization',newtoken);
                    res.status(204).end();
                }else{
                    res.setHeader('authorization',newtoken);
                    res.status(409).json(doc).end();
                }
            });
        })
      }
  })
});
router.put('/update',WarrantToken,(req,res)=>{
    jwebtoken.verify(req.token,keywrd,(err,data)=>{
        if(err) {
          res.sendStatus(403);
        }else{
            var conversation = {
                "participantes":req.body.participantes,
                "mensajes": req.body.mensajes
            }
        delete data["iat"]
        delete data["exp"]
        var newtoken = gjwtToken(data,keywrd);
        mongoclient.connect(url,{useNewUrlParser:true},(err,client)=>{
            if(err) return next(createError(500));
            const database = client.db(dbname)
            const collection = database.collection(cllname);
            collection.findOneAndUpdate({participantes:conversation.participantes},req.body,function(err,res){
                if(err) return next(createError(500));
                if(res){
                        res.setHeader('authorization',newtoken);
                        res.status().end()
                }else{
                    res.status(404).end();
                }
            })
        })

    }
})
    })
    router.get('/getConversation',WarrantToken,(req,res)=>{
        jwebtoken.verify(req.token,keywrd,(err,data)=>{
            if(err){
                res.Status(403);
            }else{
              mongoclient.connect(url,{useNewUrlParser:true},(err,client)=>{
                  if(err) return next(createError(500));
                  const database = client.db(dbname)
                  var username = data.Username;
                  var part2 = req.headers["ouser"];
                  const collection = database.collection(cllname);
                  var participantesv = [username,part2];
                  var participantesv2 = [part2,username];
                  delete data["iat"];
                  delete data["exp"];
                  var newtoken = gjwtToken(data,keywrd);
                  collection.findOne({$or:[{participantes:participantesv},{participantes:participantesv2}]},function(err,doc){
                      if(err) next(createError(500))
                      if(!doc){
                          res.setHeader('authorization',newtoken);
                          res.status(204).end();
                      }else{
                          res.setHeader('authorization',newtoken);
                          res.status(409).json(doc).end();
                      }
                  });
              })
            }
        })
      });

/* Generates jwtoken*/
function gjwtToken(jwt,kword){
    jwebt_simple.encode(jwt,kword);
    return token = jwebtoken.sign(jwt,kword,{
        expiresIn: '5m'
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
  }    module.exports = router;