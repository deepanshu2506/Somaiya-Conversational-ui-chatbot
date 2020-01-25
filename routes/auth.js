var express = require('express');
var router = express.Router();
const path = require('path');
var bodyParser = require('body-parser');
var adminController = require('../controllers/adminFuncs');
router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({ extended: true }));
const auth = require('../controllers/auth');

const config = require('../config/variables');

router.get("/",(req,res)=>{
    res.sendFile(path.resolve(path.join(__dirname + '/../views/html/loginPage.html')));
});

router.post('/authenticateUser' , auth.authenticateUser);

module.exports = router;