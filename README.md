# Somaiya-Conversational-ui-chatbot

version 2.0.0 released

install xampp, nodejs

start apache and mysql from xampp control panel

go to localhost/phpmyadmin

create new database as chat-bot

click on import

select the database.sql file
click go

go to project base directory

run the following commad from terminal

npm run start

Go to localhost:3000 from your browser

for grouping of queries: 

 clone the [query grouping API](https://github.com/deepanshu2506/SimilarSentenceGrouping "grouping API") follow the instructions given there
 
 $ which node
 
 copy the path of node
 
 sudo crontab -e 
 
 select nano editor
 
 go to bottom of file
 
 create a crontab "0 */1 * * * node_path <space> /absolute_path_to_repository/groupingService/index.js 

features: 
  create chat flows as you like
  
  chat history persistence and emailing
  
  ML model to answer not listed queries
  
  panel to list all not answered queries
  
  grouping of not listed queries for easier handling by administrator while replying 
  
