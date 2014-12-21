angular.module('controleTemp',[])
  .controller('controllerStatus', ['$scope','$http',
    function($scope, $http) {
        var statusText = ["DESLIGADO", "NORMAL", "ALARME", "ATRASADO", "MUDO"];
        $scope.getStatus = function() {
            $http.get('/status').success(function(lista) {
                $scope.dispositivos = lista.dispositivos;
            }).error(function(erro) {
            });
        };
        
        $scope.getAlertas = function() {
            $http.get('/alerta').success(function(lista) {
                $scope.dispAlerta = [];
                for (var x=0; x<lista.dispositivos.length;x++) {
                  lista.dispositivos[x].statusText = 
                      statusText[lista.dispositivos[x].status];
                  $scope.dispAlerta.push(lista.dispositivos[x]);
                }
                $scope.mostrarAlertas=true;
            }).error(function(erro) {
              alert("Erro ao consultar alertas: " + erro);
            });
        };
        
        $scope.getDispositivo = function(id) {
            $http.get('/dispositivo/' + id).success(function(dsp) {
                dsp.statusText = statusText[dsp.status];
                $scope.dispsel = dsp;
                $scope.mostrar = true;
            }).error(function(erro) {
            });
        };
        
        $scope.getMedia = function() {
          var qtdDias = document.getElementById("txtDias").value;
          var id = document.getElementById("txtDisp").value;
          var complemento = "/media";
          if (qtdDias) {
            complemento += "/" + qtdDias;
          }
          $http.get('/dispositivo/' + id + complemento).success(function(resultado) {
              alert("Média do dispositivo: " + id 
                    + "\r\n" + resultado.media);
          }).error(function(erro) {
          });
        }
        
        $scope.getStatus();
      }
]);
