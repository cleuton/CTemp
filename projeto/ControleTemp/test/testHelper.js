// Test Helper

var NodeunitAsync = require('nodeunit-async');
var esquemaTecnico = require('../esquemas/esquemaTecnico').tecnico;
var esquemaDispositivo = require('../esquemas/esquemaDispositivo').dispositivo;
var mongoose = require('mongoose');

module.exports = new NodeunitAsync({
    globalSetup: function(callback) {
      console.log('global setup -- called before each test');
      global.Dispositivo.remove({}, function(erro) {
            if (erro) {
              console.log("****** ERRO AO LIMPAR BANCO: " + erro);
            }
            else {
              global.Tecnico.remove({}, function(erro) {
                if(erro) {
                    console.log("****** ERRO AO LIMPAR BANCO 1: " + erro);
                }
                else {
                    callback();
                }
              });
              
            }
          });
    },
    globalTeardown: function(callback) {
      console.log('global teardown -- called after each test');
      callback();
    },
    fixtureSetup: function(callback) {
      console.log('fixture setup -- called once before all tests');
      global.MinutosEntreMedicoes = 2;
      global.MinutosEntreAlertasGCM = 5;
      mongoose.connect('mongodb://localhost/ctempdb', function(erro) {
        if(erro) {
    	    console.log('erro ao conectar com o banco: ' + erro);
        }
        else {
    	    console.log('Conexao com o banco OK');
    	    global.Tecnico = mongoose.model('Tecnico',esquemaTecnico, 'tecnico');
    	    global.Dispositivo = mongoose.model('Dispositivo', esquemaDispositivo, 'dispositivo');
          callback();
        } 
      });     
    },
    fixtureTeardown: function() {
      console.log('fixture teardown -- called once after all tests');
      mongoose.connection.close();
    }
});
