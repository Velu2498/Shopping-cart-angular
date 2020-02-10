const express = require("express")
const app = express()
const cors = require("cors")
const bodyp = require("body-parser")
const mongodb = require("mongodb")
const mongoclient = mongodb.MongoClient
const url = "mongodb://localhost:27017"
const port = 3800
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');

app.use(cors());
app.use(bodyp.json());

//authentication
function authentication(req, res, nxt) {
  var incomingToken=req.body.data
  jwt.verify(incomingToken,"code",function(err,decode){
    if(decode !== undefined){
      nxt()
    }
    else{
      res.json({
        mssg:"not permitted"
      })
    }
  })
}

//getting data from form & post to data base encrypted //registeration form
app.post('/data/:email', function (req, res) {
  email=req.params.email

  mongoclient.connect(url, function (err, client) {

    if (err) throw err;

    db = client.db("e-cart")

    bcrypt.genSalt(saltRounds, function (err, salt) {

      if (err) throw err;

      bcrypt.hash(req.body.password, salt, function (err, hash) {

        req.body.password = hash

        if (err) throw err;

        db.collection("users").insertOne(req.body, function (err, data) {

          if (err) throw err;
          res.status(200).json({ "mess": "inserted data in data base" })
        })
        client.close()

      })

    })
  })

})


//login with token //login
app.post('/login',function(req,res){

  mongoclient.connect(url, function(err, client) {
    if (err) throw err;

    db=client.db("e-cart")

    var result=db.collection("users").findOne({email:req.body.username})

    result.then(
      function (userdata){

        if(userdata == null){
          res.json({
            mess:"mail id not found"
          })
        }
       
        else{
        bcrypt.compare(req.body.password,userdata.password,function (err,hashresult){
          if(hashresult==true){
            
            const data={ //payload
              email:req.body.email
            }

            jwt.sign({data},"code",  { expiresIn: '500s' } ,function(err,token){
              if (err) throw err;
              res.status(200).json({
                mess:"welcome",
                token: token
              })
            })

          }

          else{
            res.json({
              mess:"invalid password"
            })
          }
        })
        }

        client.close()
      })

    })

  })

// getting data from form & post to data base encrypted //add to cart
app.post('/addcart/:username', function (req, res) {
  email = req.params.username;
  console.log(email)
    mongoclient.connect(url, function (err, client) {
  
      if (err) throw err;
  
      db = client.db("e-cart")
  
  db.collection("users").updateOne({ email },{ $set: {"cart":req.body} }, function(err, obj) {
    if (err) throw err;
    console.log(`matched count ${obj.matchedCount} ,modified count ${obj.modifiedCount}`)
    if(obj.matchedCount==0)  res.json({ mess: "no employee matched" });
    else  res.json({ mess: "added sucessfully" });
  })
  
  
      client.close()
    })
  
  })
  
  //add cart details in home page //home page cart details
  app.get("/cartdetails/:email", function(req, res) {
    email=req.params.email
  
    mongoclient.connect(url, function(err, client) {
      if (err) throw err;
  
      // console.log(req.body)
  
      db = client.db("e-cart");
  
      db.collection("users")
        .findOne({email},function(err, result) {
          if (err) throw err;
          console.log(result.cart);
          res.json(result.cart)
        }
          )
  
      client.close();
    });
  });

//message on empty url
app.get('/',function (req, res) {
  res.send("<h1>hellow switch to data</h1>")
})

//check token
app.post('/home', authentication , function (req, res) {
  res.status(200).json({
    "key":"val",
    mssg:"permitted"
  })
})

//port listering
app.listen(port, () => { console.log(`Example app listening on the port ${port}!`) })




