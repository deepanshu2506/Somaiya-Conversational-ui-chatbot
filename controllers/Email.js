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
        to: 'somaiyachatbot@gmail.com',
        cc: email,
        subject: 'Somaiya helper BOT',
        text: 'Please Help me with the following question: \n\n' + question 
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

module.exports.sendEmail = sendEmail;
