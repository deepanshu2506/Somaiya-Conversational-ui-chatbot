#!/usr/local/bin/node
var mysql = require('mysql');
const util = require('util'); 
const _ = require('lodash');
const axios = require('axios');
const fs = require('fs');
var os = require("os");


var config ={
  host     : 'localhost',
  user     : 'root',
  password : '',
    database: 'chat-bot',
  multipleStatements:true
};


function makeDb( config ) {
  const connection = mysql.createConnection( config );
  return {
    query( sql, args ) {
      return util.promisify( connection.query )
        .call( connection, sql, args );
    },
    close() {
      return util.promisify( connection.end ).call( connection );
    }
  };
}

var processData = async () => {
    const db = makeDb(config);
    try {
        const rows = await db.query('Select * from other_questions where isReplied = 0');
        const questionData = _.map(rows, (obj) => obj.question);
        const maxGroupNoQuery = await db.query('select max(groupNo) as max from other_questions where isReplied = 1');
        const max = maxGroupNoQuery[0].max;

        const groups = await axios.post('http://127.0.0.1:2000/api/rankings', { questions: questionData });
        const response = JSON.parse(groups.data);
        console.log(response);

        let count = 0
        for (res in response) {
            for (question of response[res]) {
                console.log((max + parseInt(res)))
                console.log(question)
                await db.query('update other_questions set groupNo = '
                    + (max + parseInt(res))
                    + ' where question = "'
                    + question
                    + '" and isReplied = 0');
            }
        }
        const logEntry = 'Grouping Service run successfully at ' + new Date() + os.EOL;
        fs.appendFileSync('log.txt', logEntry);
    } catch (err) {
        const logEntry = 'Error in grouping service on' + new Date() + os.EOL+"DETAILS OF ERROR:"+ os.EOL + err;
        fs.appendFileSync('log.txt', logEntry);
        console.log(err);
    } finally {
        await db.close();
    }
};

processData();