var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var app = express();
var Usuario = require('../models/usuario');
const Empresa = require('../models/empresa');
var SEED = require('../config/config').SEED;
var objectid = require('objectid');

var nombreempresacceso;
var nombredelaempresa;
var emailempresa;



app.post('/', async(req, res) => {
    console.log ('entro en el psot');
    var body = req.body;
    console.log ('informacion total', req.body)

    

     await Usuario.findOne({ emailpersonal: body.emailpersonal }, (err, usuarioBD) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar  usuario',
                errors: err
            });
        }


        if (!usuarioBD) {
            console.log('usuario incorrecto');
            return res.status(400).json({

                ok: false,
                // mensaje: 'credenciales incorrectas',
                // errors: err
            });
        }

        console.log ('pass activado', usuarioBD.activado);
        if (!usuarioBD.activado) {
            return res.status(400).json({
                ok: false,

            });
        }





        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            console.log('todo bien');
            return res.status(400).json({
                
                ok: false,
                mensaje: 'credenciales incorrectas-pass',
                errors: err
            });
            console.log('fuu aceptado');
        }

       
        identificador= usuarioBD.idempresa;


         Empresa.findById({_id: identificador},(err, empresa) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario alias ',
                    errors: err
                });
            }



if (!empresa) {
            console.log('empresanoencontrada');
            return res.status(400).json({

                ok: false,
                
            });
        }
            

                nombreempresacceso = empresa;
                nombredelaempresa = empresa.nombrempresa;
                emailempresa =empresa.email;

                usuarioBD.password = ":)";
                var token = jwt.sign({ usuario: usuarioBD }, SEED, { expiresIn: 14400 });
        
        
        
        
                 res.status(200).json({
                     ok: true,
                     usuario: usuarioBD,
                     token: token,
                     id: usuarioBD.idempresa,
                     empresa: usuarioBD.role,
                     nombrempresa: nombredelaempresa,
                     emailempresa,
                     datosempresa: nombreempresacceso
                 });

           

        });









       







    });


   

});

module.exports = app;