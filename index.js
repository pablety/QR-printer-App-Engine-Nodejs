const axios = require('axios');
var CryptoJS = require("crypto-js");
const express = require('express')
const app = express()
let ejs = require('ejs');

app.set('view engine', 'ejs');

app.use( function(req, res, next) {
if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
      return res.sendStatus(204);
}  
next();
    
})

  
app.get('/', (req, res) =>{
    res.send('ERROR')
})

app.get('/pdf', (req, res) =>{     
    const state =req.query.state.replace(/[\s\uFEFF\xA0]/g, '+');


//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

//                 PUT SECRET KEY

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

    var bytes  = CryptoJS.AES.decrypt(state, 'SECRET KEY'); //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

    var originalText = bytes.toString(CryptoJS.enc.Utf8);

console.log(state)
console.log({originalText})
    var email = ''
    var uid = ''
    var status = ''
    
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

//                  CHECK code with API

//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
    axios.get('https://api.mercadopago.com/preapproval/'+originalText.split('"')[1] , {
        headers: {
            'Authorization': 'Bearer #################################################'
        }
    }).then((response)=> {
    status = response.data.status

/////          VERIFICATION ///////////////////////////////////////////////////////////
    if(status=='authorized'){
        email = response.data.reason
        uid = response.data.external_reference
        res.render('i.ejs', {
        email: email,
        uid: uid,

    })}
    else {
        res.send('ERROR')
    }
       
        }), (error) => {
        console.log(error);

      }

})

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});