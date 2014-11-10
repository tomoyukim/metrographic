require('newrelic');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function(){
    console.log('server listen at port %d',port);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



///////
var count = 0;
var stop = false;
var intervalId;
var dct_valid;
io.sockets.on('connection', function(socket) {
    count++;
    stop = false; //reset flag
    console.log('connection:'+count);
    intervalId = setInterval(checkValidation, 1000);
    getTrainPosition();

    socket.on('disconnect', function() {
    count--;
    console.log('disconnect:'+count);
    if(count == 0){
        stop = true;
        clearInterval(intervalId);
    }
    });
});

var request = require('request');

var API_ENDPOINT = 'https://api.tokyometroapp.jp/api/v2/';
var DATAPOINTS_URL = API_ENDPOINT + 'datapoints';
var ACCESS_TOKEN = process.env.COSUMER_KEY;

var query = {
    'rdf:type':'odpt:Train',
//    'odpt:railway':'odpt.Railway:TokyoMetro.Chiyoda',
    'acl:consumerKey':ACCESS_TOKEN
}

function getTrainPosition() {
    request.get({url:DATAPOINTS_URL, qs:query}, function(err, response, body){
    if(!err && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log('res by getTrainPosition');
        io.sockets.emit('trains', info);

        dct_valid = new Date(info[0]['dct:valid']);
        if(!stop){
        console.log('setTimer for update position');
        var delay = info[0]['odpt:frequency'];
        setTimeout(getTrainPosition, delay * 1000);
        }
    } else {
        console.log(response.statusCode);
    }
    });
}

function checkValidation() {
    // nothing to do because https://developer.tokyometroapp.jp/errata
}
