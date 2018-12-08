const 
    request = require('request'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cricketApiKey = "Dy06sly2bMR7in8tIjaXtGejkJ03 "
    apecricket = require("ape-cricket"),
    app = express(),
    port = process.env.PORT ? process.env.PORT : 4122;

    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended : true }));
    app.use('/slds', express.static(__dirname + '/node_modules/@salesforce-ux/design-system/assets'));

    app.get('/', function(req,res){

        var scheduleAPI = new Promise(function(resolve) {
            apecricket.schedule( cricketApiKey, function(response){ 
                resolve(JSON.parse(response).data.data);
            });
        });

        var scoreAPI = new Promise(function(resolve) {
            apecricket.cricket( cricketApiKey, function(response){ 
                resolve(JSON.parse(response).data.data);
            });
        });


        var newsAPI = new Promise(function(resolve) {
            apecricket.news( cricketApiKey, function(response){ 
                resolve(JSON.parse(response).data.data);
            });
        });
        
        Promise.all([scheduleAPI, scoreAPI, newsAPI]).then(function(payloads) {
            res.render('index', {"schedule" : payloads[0], "score" : payloads[1], "news" : payloads[2]});
        });
    });

    const { Pool } = require('pg');
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL || 'postgres://postgres:paytm@localhost:5432/postgres',
        ssl: true
    });

    app.get('/db', async (req, res) => {
        try{
            const client = await pool.connect(),
                result = await client.query('SELECT * FROM test_table'),
                results = { 'results': (result) ? result.rows : null};
            res.send(results);
            client.release();
        }catch(err){
            res.send("Error " + err);
        }
    });

    app.post('/',function(req,res){
        var city = req.body.city,
            apiKey = '339293dca727d551b7428a11b68cf8c3',
            url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
        request(url,function(err,response,body){
            if(err){
                res.send('Error, please try again');
            }else{
                var weather = JSON.parse(body);
                if(weather.main == undefined){
                    res.send('Error, please try again');
                }else{
                    res.send(`It's ${weather.main.temp} fahrenheit in ${weather.name}!`);
                }
            }
        });
    });

    app.listen(port, function(){
        console.log('listening on port ', port);
    });