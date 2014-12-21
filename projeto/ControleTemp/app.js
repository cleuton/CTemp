var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

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

/*
 * Parãmetros globais
 */
 
global.MinutosEntreMedicoes = 2;
global.MinutosEntreAlertasGCM = 5;

/*
 * Modelo de dados
 */
mongoose = require('mongoose');
inspetor = require('./scheduled/inspetor');

var esquemaTecnico = require('./esquemas/esquemaTecnico').tecnico;
var esquemaDispositivo = require('./esquemas/esquemaDispositivo').dispositivo;

mongoose.connect('mongodb://localhost/ctempdb', function(erro) {
    if(erro) {
	    console.log('erro ao conectar com o banco: ' + erro);
    }
    else {
	    console.log('Conexao com o banco OK');
	    global.Tecnico = mongoose.model('Tecnico',esquemaTecnico, 'tecnico');
	    global.Dispositivo = mongoose.model('Dispositivo', esquemaDispositivo, 'dispositivo');
	    
	    var runInspetor = true;
	    if (process.argv.length > 2) {
  	    if (process.argv[2] == "-n") {
    	    runInspetor = false;
  	    }
	    }
	    if (runInspetor) {
  	    console.log('Iniciando loop de inspecao...');	    
	      setInterval(inspetor.verificar, 5000);
      }
      else {
        console.log('* SEM RODAR LOOP DE INSPECAO!');
      }
    }
});

// Desliga o cache:
app.disable('etag');

module.exports = app;
