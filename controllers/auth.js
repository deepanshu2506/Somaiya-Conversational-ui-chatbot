const connectionPool = require('../config/database-connection');
const get_user_query = 'select * from users where email_id=?';

const jwt = require('jsonwebtoken');
const config = require('../config/variables');
let controllers = {
    authenticateUser: async (req, res) => {
        if (req.body.password == undefined) {
            res.send({ code: 0, message: "password not specified" });
        }
        connectionPool.getConnection((err,conn) => {
            if(err){
                res.send({code : 0 , message : 'could  not connect '})
            }
            conn.query(get_user_query, req.body.email, (err, results, fields) => {
                console.log(err)
                if (results.length == 0) {
                    res.send({code:0, message:'username incorrect'})
                }
                else {
                    if (req.body.password === results[0].password) {
                        var token = jwt.sign({user: req.body.email}, config.jwtSecretKey , {expiresIn:'3h'});
                        token = "Bearer " + token;
                        res.send({ code: 1, message: 'user authenticated', token });    
                    }
                    else {
                        res.send({ code: 0, message: 'password does not match' });
                    }   
                }
                
            });
            conn.release();        
        });
    }
}

module.exports = controllers;