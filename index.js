const 
    request = require('request'),
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express();

    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({ extended : true }));

    app.get('/', function(req,res){
        res.render('index', {weather: null, error: null});
    });

    app.post('/',function(req,res){
        var city = req.body.city,
            apiKey = '339293dca727d551b7428a11b68cf8c3',
            url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
        request(url,function(err,response,body){
            if(err){
                res.render('index', {weather: null, error: 'Error, please try again'});
            }else{
                var weather = JSON.parse(body);
                if(weather.main == undefined){
                    res.render('index', {weather: null, error: 'Error, please try again'});
                }else{
                    var weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
                    res.render('index', {weather: weatherText, error: null});
                }
            }
        });
    });

    app.listen(3000, function(){
        console.log('listening on port 3000!');
    });

    


