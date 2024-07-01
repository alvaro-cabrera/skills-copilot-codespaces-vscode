// Create web server with node.js
// npm install express
// npm install body-parser
// npm install express-handlebars
// npm install mongoose
// npm install method-override
// npm install connect-flash
// npm install express-session
// npm install passport
// npm install passport-local
// npm install passport-http
// npm install bcryptjs
// npm install express-validator
// npm install multer
// npm install connect-multiparty
// npm install connect-multiparty
// npm install fs-extra
// npm install moment
// npm install nodemailer
// npm install nodemailer-smtp-transport
// npm install async
// npm install crypto
// npm install jsonwebtoken

var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Coment = require('../models/coment');
var jwt = require('../services/jwt');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({ uploadDir: './uploads' });

// Save coment
router.post('/save-coment', function(req, res){
    var params = req.body;
    var coment = new Coment();
    coment.user = params.user;
    coment.text = params.text;
    coment.publication = params.publication;
    coment.save((err, comentStored) => {
        if(err) return res.status(500).send({message: 'Error al guardar el comentario'});
        if(!comentStored) return res.status(404).send({message: 'El comentario no se ha guardado'});
        return res.status(200).send({coment: comentStored});
    });
});

// Get coments by publication
router.get('/get-coments/:publication', function(req, res){
    var publication = req.params.publication;
    Coment.find({publication: publication}).sort('+_id').populate('user').exec((err, coments) => {
        if(err) return res.status(500).send({message: 'Error en la petición'});
        if(!coments) return res.status(404).send({message: 'No hay comentarios'});
        return res.status(200).send({coments});
    });
});

// Delete coment
router.delete('/delete-coment/:id', function(req, res){
    var comentId = req.params.id;
    Coment
