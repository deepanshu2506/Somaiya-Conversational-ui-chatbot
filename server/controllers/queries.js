const connectionPool = require('../config/database-connection');
const email = require('./Email')

const getQueries_query = 'select id, question , email , isReplied , location , timestamp(timestamp) as timestamp from other_questions where isReplied = ? ORDER BY timestamp DESC ';
const getQueries_all = 'select id,question , email , isReplied , location , timestamp(timestamp) as timestamp from other_questions ORDER BY timestamp DESC';
const set_reply_query = 'update other_questions set reply = ? , isReplied = 1 where id = ?';
let controllers = {
    getQueries: (replied) => {
        return new Promise((resolve,reject)=>{
            connectionPool.getConnection((err,conn) => {
                if(err){
                    reject('Error in connecting to DB');
                }

                if (replied < 0) {
                    conn.query(getQueries_all,[],(err,results,fields) =>{
                        if (err) {
                            console.log(err);
                            reject('error in fetching queries');
                        }
                        
                        resolve(results);
                    });
                }
                else {
                    conn.query(getQueries_query,[replied],(err,results,fields) =>{
                        if (err) {
                            console.log(err);
                            reject('error in fetching queries');
                        }
                        resolve(results);
                    });
                    
                }
                
                conn.release();        
            });
        });
    },
    setReply: (answer,question,emailid, id) => {
        email.sendResponseEmail(answer, question, emailid).then(()=>{}).catch(()=>{})
         return new Promise((resolve,reject)=>{
            connectionPool.getConnection((err,conn) => {
                if(err){
                    reject('Error in connecting to DB');
                }
                conn.query(set_reply_query,[answer,id],(err,results,fields) =>{
                    if (err) {
                        console.log(err);
                        reject('error in updating reply');
                    }
                    
                    resolve(results);
                });
                conn.release();        
            });
        });
    }
};

module.exports =controllers;

