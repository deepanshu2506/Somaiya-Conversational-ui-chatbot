//Importing 'database-connection' module
const connectionPool = require('../config/database-connection');
//'get_question_query' to store query to obtain question from id
const get_question_query = 'select * from questions where id=?';
//'get_options_query' to store query to obtain all options for given question id
const get_options_query = 'select * from options where for_question=?';
//'get_answer_query' to obtain answer associated with given option name
const get_answer_query = 'select answers.id, answers.answer from answers join options where answers.optionid = options.id and options.option_name = ?';
//'updateQuestionQuery' to update question for the given id
const updateQuestionQuery = 'update questions set question = ? where id = ?';
//'updateOptionQuery' to update option for the given id
const updateOptionQuery = 'update options set option_name = ? where id = ?';
//'updateAnswerQuery' to update answer for given id
const updateAnswerQuery = 'update answers set answer = ? where id = ?'
//'addOptionQuery' to add new option
const addOptionQuery = 'insert into options(option_name,for_question,next_question) values(? , ? , ?)';
//'addAnswerQuery' to add new answer
const addAnswerQuery = 'insert into answers(optionid , answer) values(? , ?)';
//'addQuestionQuery' to and new question
const addQuestionQuery = 'insert into questions(question) values (?)';0
//'delAnswerQueries' to delete answer by first updating the next question of option whose answer is being deleted, then deleting the answer
const delAnswerQueries = 'update options set next_question = ? where id = (select optionid from answers where id = ?); select id from options where id = (select optionid from answers where id = ?); delete from answers where id = ?; ';
//'delOptionQuery' to delete option with given id
const delOptionQuery = 'delete from options where id = ?';
//'delQuestionQuery' to delete question by first updating next question of options to '-1', then delete to question 
const delQuestionQuery = 'update options set next_question = -1 where next_question = ?; delete from questions where id = ?';

//If connection established and 'get_question_query' executed properly then question associated with given id will get stored in 'get_question'
var get_question = (id)=>{
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn) => {
            if(err){
                reject('Error in connecting to DB');
            }
            conn.query(get_question_query,id,(err,results,fields) =>{
                if(err){
                   reject('error in fetching the question');
                }
                resolve(results);
            });
            
            conn.release();        
        });
    });
};

//If connection established and 'get_options_query' executed properly then options associated with given question id will get stored in 'get_option'
var get_options = (id)=>{
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn) => {
            if(err){
                reject('Error in connecting to DB');
            }
            conn.query(get_options_query,id,(err,results,fields) =>{
                if(err){
                   reject('error in fetching options');
                }
                resolve(results);
            });
            
            conn.release();        
        });
    });
};

//If connection established and 'get_answer_query' executed properly then answer associated with given option name will get stored in 'get_answer'
var get_answer = (option)=>{
    console.log(option);
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn) => {
            if(err){
                reject('Error in connecting to DB');
            }
            conn.query(get_answer_query,option,(err,results,fields) =>{
                if(err){
                   reject('error in fetching answers');
                }
                resolve(results);
            });
            
            conn.release();        
        });
    });
}

//If connection established and 'updateQuestionQuery' executed properly then question associated with given id will get updated with given value
var updateQuestion = (id,value)=>{
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn)=>{
            if(err){
                reject('error in conecting to DB');
            }
            conn.query(updateQuestionQuery,[value,id],(err,results,fields)=>{
                if(err){
                    reject('could not update the question');
                }
                resolve('question updated successfully');
            });
            conn.release();
        });
    });
};

//If connection established and 'updateAnswerQuery' executed properly then answer associated with given id will get updated with given value
var updateAnswer = (id,value)=>{
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn)=>{
            if(err){
                reject('error in conecting to DB');
            }
            conn.query(updateAnswerQuery,[value,id],(err,results,fields)=>{
                if(err){
                    reject('could not update the answer');
                }
                resolve('answer updated successfully');
            });
            conn.release();
        });
    });
};

//If connection established and 'updateOptionQuery' executed properly then option associated with given id will get updated with given value
var updateOption = (id,value)=>{
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn)=>{
            if(err){
                reject('error in connecting to DB');
            }
            conn.query(updateOptionQuery , [value,id],(err,results,fields)=>{
                if(err){
                    reject('could not update the option');
                }
                resolve();
            });
            conn.release();
        });
    });
}

//If connection established and 'addOption' executed properly then option will be added with given values
var addOption = (optionName , forQuestion) => {
    return new Promise((resolve , reject)=>{
        connectionPool.getConnection((err,conn)=>{
            if(err){
                reject('Error in connecting to DB');
            }
            conn.query(addOptionQuery , [optionName , forQuestion , -1] , (err,results,fields)=>{
                if(err){
                    reject('could not insert the option');
                }
                conn.query('select * from options where id = ?' ,results.insertId , (err,res,fields)=>{
                    if(err){
                        reject('could not make the view consistent');
                    }
                    resolve(res[0]);
                });
            });
            conn.release();
        });
    });
};

//If connection established and 'addAnswer' executed properly then answer will be added with given values
var addAnswer = (optionId , answer) => {
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn)=>{
            if(err){
                reject('could not connect to the DB');
            }
            conn.query(addAnswerQuery , [optionId , answer] , function(err,results,fields){
                if(err){
                    reject('could not insert new answer');
                }
                conn.query('update options set next_question = NULL where id = ?' , optionId , function(err,res,fields){
                    if(err){
                        reject('could not complete the task successfully');
                    }
                });
                resolve(results.insertId);
            });

            conn.release();
        });
    });
};

//If connection established and 'addQuestion' executed properly then question will be added with given values
var addQuestion = (optionId , question)=>{
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn)=>{
            if(err){
                reject('error in connecting to db')
            }
            conn.query(addQuestionQuery , question , (err,results,fields)=>{
                if(err){
                    reject('could not insert new question');
                }
                conn.query('update options set next_question = ? where id = ?' , [results.insertId , optionId] , (err,res,fields)=>{
                    if(err){
                        reject('could not complete your request');
                    }
                });
                
                resolve(results.insertId);
            });
        });
    });
};

//If connection established and 'deleteAnswer' executed properly then answer will get deleted with given id
var deleteAnswer = (id)=>{
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn)=>{
            if(err){
                reject('error in conecting to DB');
            }
            conn.query(delAnswerQueries,[-1,id,id,id],(err,results,fields)=>{
                if(err){
                    reject('could not delete the answer');
                }
                console.log(results[1]);
                resolve(results[1]);
            });
            conn.release();
        });
    });
};

var deleteOption = (optionId) =>{
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn)=>{
            if(err){
                reject('connection not established');
            }
            conn.query(delOptionQuery, optionId , (err,results , fields)=>{
                if(err){
                    reject('error in deleting');
                }
                resolve('option deleted');
            });
        });
    });
};

//If connection established and 'deleteQuestion' executed properly then question will get deleted with given id
var deleteQuestion = (questionId) =>{
    return new Promise((resolve,reject)=>{
        connectionPool.getConnection((err,conn)=>{
            if(err){
                reject('connection not established');
            }
            conn.query(delQuestionQuery, [questionId, questionId] , (err,results , fields)=>{
                if(err){
                    reject('error in deleting');
                }
                resolve('option deleted');
            });
        });
    });
};

//Exporting all to make them available in other files
module.exports.get_question = get_question;
module.exports.get_options = get_options;
module.exports.get_answer = get_answer;
module.exports.updateQuestion = updateQuestion;
module.exports.updateOption = updateOption;
module.exports.updateAnswer = updateAnswer;
module.exports.addOption = addOption;
module.exports.addAnswer = addAnswer;
module.exports.addQuestion = addQuestion;
module.exports.deleteAnswer = deleteAnswer;
module.exports.deleteOption = deleteOption;
module.exports.deleteQuestion = deleteQuestion;
