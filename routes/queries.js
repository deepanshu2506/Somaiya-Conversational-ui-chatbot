var express = require('express');
var router = express.Router();
const path = require('path');
var bodyParser = require('body-parser');
var queriesController = require('../controllers/queries');
const authMiddleware = require('../middleware/authMiddleware');
router.use(bodyParser.json()); 
router.use(bodyParser.urlencoded({ extended: true }));



router.get('/', (req, res) => {
    res.sendFile(path.resolve(path.join(__dirname + '/../views/html/queries.html')));

});

router.post('/getQueries', authMiddleware.validateToken, async (req, res) => {
    const replied = parseInt(req.body.replied);
    
    queriesController.getQueries(replied)
        .then((data) => {
            res.send({ code: 1, queries: data });
        })
        .catch((err) => {
            res.send({ code: 0, message: err });
        });
});

router.post('/sendReply', authMiddleware.validateToken, async (req, res) => {
    const id = parseInt(req.body.id);
    queriesController.setReply(req.body.answer, req.body.question, req.body.email, id)
        .then((data) => {
            res.send({ code: 1 }); 
        }).catch((err) => {
            res.send({ code: 0, message: err });
        })
});

router.post('/sendReplyMultiple', authMiddleware.validateToken, async (req, res) => {
    queriesController.setReplyMultiple(req.body.queries)
        .then((data) => {
            res.send({ code: 1 });
        })
        .catch(err => {
            res.send({ code: 0, message: err });
        });
});


module.exports = router