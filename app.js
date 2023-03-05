const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); //to serve all static files like css and images etc

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){
    let firstname = req.body.fname;
    let lastname = req.body.lname;
    let email = req.body.email;
    console.log(firstname, lastname, email)

    let data1 = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname,
                }
            }
        ]
    }


    let jsonData = JSON.stringify(data1);

    let url = "https://us21.api.mailchimp.com/3.0/lists/add list id here"

    let options = {
    method: "POST",
    auth: "add auth here"
    }

    const request = https.request(url, options, function(response){

    response.on("data", function(data){
        let receivedData = JSON.parse(data)
            console.log((receivedData.errors).length)
        let errorArrayLength = (receivedData.errors).length;

        if(errorArrayLength == 0){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        // console.log((receivedData.new_members)[0]);
    });

    

});


request.write(jsonData);
request.end();




});








app.listen(3000, function(){console.log("Server Started!")})