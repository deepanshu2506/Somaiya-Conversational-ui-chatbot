//Importing 'express' module
var express = require('express');
//Creating router object
var router = express.Router();
//Importing 'path' module
const path = require('path');
//Importing 'chat_db_funcs' module
const chatController = require('../controllers/chat_db_funcs');
//Importing 'Email' module
const emailController = require('../controllers/Email');
//Importing 'body-parser' module
var bodyParser = require('body-parser');

//Returns middleware that only parses json
router.use(bodyParser.json()); 
//Returns middleware that only parses urlencoded bodies
router.use(bodyParser.urlencoded({ extended: true })); 

//For route '/start' send response as starting question
router.get('/start',(req,res)=>{
    var result = chatController.start_conv();
    result.then((data)=>{
        res.send(data[0].question)
    });
    result.catch((err)=>{
        console.log('start');
    });
});

//For route '/get_options' send response as options for given question
router.post('/get_options',(req,res)=>{
    var result = chatController.get_options(req.body.next_options);
    result.then((data)=>{
        res.send(data)
    });
    result.catch((err)=>{
        console.log('get option');
    });
});

//For route '/next_question' send response as next question for given option
router.post('/next_question',(req,res)=>{
    var result = chatController.next_question(req.body.next_question);
    result.then((data)=>{
        res.send(data[0]);
    });
    result.catch((err)=>{
        console.log('here');
    });
});

//For route '/answer' send response as answer for given option
router.post('/answer' , (req,res)=>{
    console.log(req.body.option);
    var result = chatController.get_answer(req.body.option);
    result.then((data)=>{
        console.log(data);
        res.send(data[0].answer);
    });
    result.catch((err)=>{
        console.log('answer');
    })
});

//For route 'send_email' send user query as email to somaiya
router.post('/send_email', (req, res) => {
    
    chatController.add_user_question(req.body.question)
        .then(() => {
        })
        .catch(() => {
            res.send({code: 0 , message: 'error in adding question to db'})
        });
    
    var result = emailController.sendEmail(req.body.question , req.body.email);
        result.then(() => {
            res.send({code: 1, message: "email sent successfully" });
        });
        result.catch((error) => {
            res.send({code:0 , message: 'email not sent'});
        });
    });

//Export router to make them available in other files
module.exports = router;
