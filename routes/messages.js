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


router.put ('/messages/',(req,res,err)=>{
    var conversation = {
        "Receptor": req.body.Receptor,
        "Emisor": req.body.Emisor,
        "Messages" : req.body.Messages
    }
    mongoclient.connect(url,{useNewUrlParser:true},(err,client)=>{
        if(err) return next(createError(500))
        const database = client.db(dbname)
        const collection  = database.collection(cllname);
        collection.updateOne({Receptor:conversation.Receptor,Emisor:conversation.Emisor})

    })
})
module.exports = router;