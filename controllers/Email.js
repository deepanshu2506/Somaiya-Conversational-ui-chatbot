//Importing 'nodeemailer' module
var emailSender = require('nodemailer');
//Send email to somaiya and cc to user.

var sendEmail = (question , email)=>{
    var transporter = emailSender.createTransport({
        service: 'gmail',
        auth: {
          user: 'somaiyachatbot@gmail.com',
          pass: 'saheb@123'
        }
      });
      
      var mailOptions = {
        from: 'BOT <somaiyachatbot@gmail.com>',
        to: email,
        cc: 'somaiyachatbot@gmail.com',
        subject: 'Somaiya helper BOT',
        html: '<h2>Please Help me with the following question:</h2> <br><br><h4>' + question + '</h4>' 
      };
      return new Promise((resolve,reject)=>{
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              reject(error);
    
            } else {
              console.log('Email sent: ' + info.response);
              resolve(info.response);
            }
          });
      })
      
};



var sendResponseEmail = (answer,question , email)=>{
    var transporter = emailSender.createTransport({
        service: 'gmail',
        auth: {
          user: 'somaiyachatbot@gmail.com',
          pass: 'saheb@123'
        }
      });
      
      var mailOptions = {
        from: 'BOT <somaiyachatbot@gmail.com>',
        to: email,
        cc: 'somaiyachatbot@gmail.com',
        subject: 'Regarding your query on Somaiya Admission',
        html: question + "<h2>Response:</h2> <br><h4>" + answer + '</h4>'
      };
      return new Promise((resolve,reject)=>{
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              reject(error);
    
            } else {
              console.log('Email sent: ' + info.response);
              resolve(info.response);
            }
          });
      })
      
};

var sendChatHistory = (conversation, email)=>{
    var transporter = emailSender.createTransport({
        service: 'gmail',
        auth: {
          user: 'somaiyachatbot@gmail.com',
          pass: 'saheb@123'
        }
    });
  let text = "";
  for (message of conversation) {
    text += message.from + " : " + message.message + "<br><br>";
  }
  text = '<h2>' + text + '</h2>';
  console.log(text);
      
      var mailOptions = {
        from: 'BOT <somaiyachatbot@gmail.com>',
        to: email,
        contentType: 'text/html',
        cc: 'somaiyachatbot@gmail.com',
        subject: 'Chat history with SAHEB',
        html: text
      };
      return new Promise((resolve,reject)=>{
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              reject(error);
    
            } else {
              console.log('Email sent: ' + info.response);
              resolve(info.response);
            }
          });
      })
      
};

var sendResponseEmailMultiple = (emailList) => {
  var transporter = emailSender.createTransport({
    service: 'gmail',
    auth: {
      user: 'somaiyachatbot@gmail.com',
      pass: 'saheb@123'
    }
  });
  for (email of emailList) {
    var mailOptions = {
        from: 'BOT <somaiyachatbot@gmail.com>',
        to: email.email,
        contentType: 'text/html',
        cc: 'somaiyachatbot@gmail.com',
        subject: 'Regarding your query on Somaiya Admission',
        html: email.question + "<h2>Response:</h2> <br><h4>" + email.answer + '</h4>'
    };
    transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              // reject(error);
    
            } else {
              console.log('Email sent: ' + info.response);
              // resolve(info.response);
            }
          });
  }
};


module.exports.sendEmail = sendEmail;
module.exports.sendResponseEmail = sendResponseEmail;
module.exports.sendChatHistory = sendChatHistory;
module.exports.sendResponseEmailMultiple = sendResponseEmailMultiple;
