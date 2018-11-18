var express = require('express');
var router = express.Router();
const app = express();
const jwebt_simple = require('jwt-simple')
var mongoclient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const jwebtoken = require('jsonwebtoken');
const dbname = 'ProyectoED2';
/* GET users listing. */
router.post('/', function(req, res, next) { 
const user = req.body;
const token = gjwtToken(user,"Apikey");

res.json(token);

});
function gjwtToken(jwt,kword){
  jwebt_simple.encode(jwt,kword)

  return token = jwebtoken.sign(jwt,kword,{
      expiresIn: '30d'
  })
}

function WarrantToken(req,res,next){
  const bearerheader= req.headers['authorization'];
  console.log(bearerheader)
  if(typeof bearerheader !== 'undefined'){
    const bearer = bearerheader.split(" ");
    const bToken = bearer[1];
      req.token = bToken;
      next();
  }else{
    res.sendStatus(403);
  }
}
router.get('/authorize',WarrantToken, (req,res)=>{
jwebtoken.verify(req.token,"Apikey",(err,data)=>{
  if(err) {
   res.sendStatus(403);
  }else{
      res.json(data);
  }

})
});



module.exports = router;
