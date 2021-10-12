const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, function() {
    console.log("server is running on port 3000");
});

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
    const lastName = req.body.LName;
    const email = req.body.email;
    const firstName = req.body.FName;

    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LName: lastName
            }
        }]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us5.api.mailchimp.com/3.0/lists/53d0d6b810";
    const options = {
        method: "POST",
        auth: "shalev:37bd0da7bd5a94ab0f76561807380ccb-us5"
    }

    const request = https.request(url, options, function(response) {
        console.log(response.statusCode);
        if (response.statusCode == 200) //only return200 fix that
            res.sendFile(__dirname + "/success.html");
        else
            res.sendFile(__dirname + "/failure.html");


        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
        res.redirect("/");
    })
    //API KYE
    //37bd0da7bd5a94ab0f76561807380ccb-us5
    // list id  -53d0d6b810