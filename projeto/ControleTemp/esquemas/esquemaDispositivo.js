// Dispositivo - Esquema da coleção "Dispositivo"

var mongoose = require('mongoose');

exports.dispositivo = new mongoose.Schema(
	{
	    "idDispositivo" : String,
	    "status" : { type: Number},
	    "senha" : { type: String },
	    "ultAlerta" : {type: Date},
	    "ultMedicao" : {type: Date},
	    "novoAlerta" : {type: Boolean},
	    "medicoes" : [
	      {
	        "dataHora" : {type: Date},
	        "valor" : {type: Number},
	        "gerar" : {type: Boolean},
	        "processada" : {type: Boolean},
	        "conferencia": {
	          "tecnico" : {type: mongoose.Schema.Types.ObjectId, ref: 'tecnico'},
	          "dataHora" : {type: Date}
	        }
	      }
	    ]
	}
);