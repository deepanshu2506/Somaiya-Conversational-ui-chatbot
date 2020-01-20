//Importing 'database-connection' module
const connectionPool = require('../config/database-connection');
//'start_conv_query' to store query to obtain starting question
var start_conv_query = 'select question from questions where id = 1';
//'get_options_query' to store query to obtain all options associated to given question_id 
var get_options_query = 'select * from options where for_question=?';
//'next_question_query' to store query to obtain next question associated with given id
var next_question_query = 'select * from questions where id = ?';
// var get_answer_query = 'select * from answers where optionid = (select id from options where option_name = ?)';
//'get_answer_query' to store query to obtain final answer of given option_name
var get_answer_query = 'select answer from answers join options where answers.optionid = options.id and options.option_name = ?';

var add_user_question_query = 'insert into other_questions(question,email) values(?,?);'


//If connection established and start_conv_query executed properly then start question will be stored in 'start_conv'
var start_conv = ()=>{
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn) => {
            if(err){
                reject(err);
            }
            conn.query(start_conv_query,(err,results,fields) =>{
                if(err){
                   reject(err);
                }
                resolve(results);
            });
            
            conn.release();        
        });
    });
};

//If connection established and 'get_options_query' executed properly then all options associated with given 'question_id' will be stored in 'get_options'
    var get_options = (id)=>{
        return new Promise((resolve,reject)=>{
            connectionPool.getConnection((err,conn) => {
                if(err){
                    reject(err);
                }
                conn.query(get_options_query,id,(err,results,fields) =>{
                    if(err){
                       reject(err);
                    }
                    resolve(results);
                });
                
                conn.release();        
            });
        });
};

//If connection established and 'next_question_query' executed properly then next question associated with given 'question_id' will be stored in 'next_question'
var next_question = (id)=>{
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn) => {
            if(err){
                reject(err);
            }
            conn.query(next_question_query,id,(err,results,fields) =>{
                if(err){
                   reject(err);
                }
                resolve(results);
            });
            
            conn.release();        
        });
    });
};

//If connection established and 'get_answer_query' executed properly then answer associated with given 'option' will be stored in 'get_answer'
var get_answer = (option)=>{
    console.log(option);
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn) => {
            if(err){
                reject(err);
            }
            conn.query(get_answer_query,option,(err,results,fields) =>{
                if(err){
                   reject(err);
                }
                resolve(results);
            });
            
            conn.release();        
        });
    });
}
var add_user_question = (question,email)=>{
    
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn) => {
            if(err){
                reject(err);
            }
            conn.query(add_user_question_query,[question,email],(err,results,fields) =>{
                if(err){
                   reject(err);
                }
                console.log(results);
                resolve();
            });
            
            conn.release();        
        });
    });
}

//Export to make them available in other files
module.exports.start_conv = start_conv;
module.exports.get_options = get_options;
module.exports.next_question = next_question;
module.exports.get_answer = get_answer;
module.exports.add_user_question = add_user_question;
