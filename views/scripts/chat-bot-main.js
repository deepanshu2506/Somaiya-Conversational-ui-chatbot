var textBoxDisplayed = false;
var chatboxOpen = false;
var email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
let flagFirst = false;

function loadInitialState() {
    let conversation = JSON.parse(localStorage.conversation);
    for (message of conversation) {
        if (message.type == 1){
            $('.chat-content').append("<div class ='message-received'>" + message.message + "</div>");
        }
        else if (message.type == 2) {
            $('.chat-content').append("<div class ='message-sent'>" + message.message + "</div>");
            
        }
        else if (message.type == 3) {
            $('.chat-content').append("<div class ='message-received'>" + message.message + "</div>");
        }

      
    }
    let lastQuery = conversation[conversation.length - 1]
      if ( lastQuery.type == 3) {
          console.log('answer')
          $('.options').append("<button class = 'optionbtn' value = '1'>Start Over</button>")
    }
      else if (lastQuery.type == 1) {
          console.log(lastQuery.id)
          $.post('/chat/get_options',{next_options:lastQuery.id},function(data){
                for(option of data){
                    $('.options').append("<button class = 'optionbtn' value = '"+option.next_question+"'>"+option.option_name+"</button>").hide().fadeIn(400);
                }
          });
          
    }
      else if (lastQuery.message == 'Not Listed') {
          $('.options').append("<button class = 'optionbtn' value = '1'>Start Over</button>")
    }
     $('.chat').animate({
               scrollTop: $('.chat')[0].scrollHeight
           },"slow");
}

//Function to display first question and it's options by appending option buttons
function start_chat() {
    // console.log(JSON.parse(localStorage.conversation).length)
    if (localStorage.conversation == undefined ||localStorage.conversation == '[]' || JSON.parse(localStorage.conversation).length == 1) {
         $.get('/chat/start',(data)=>{
            $('.chat-content').append("<div class ='message-received'>"+data+"</div>").hide().fadeIn(400);
            localStorage.setItem('conversation', JSON.stringify([]));
            var conversation = JSON.parse(localStorage.conversation);
            conversation.push({ from: 'SAHEB', message: data ,type:1 , id:1});
            localStorage.setItem('conversation', JSON.stringify(conversation));
        });
        $.post('/chat/get_options',{'next_options':'1'},(data)=>{
            for(option of data){
                $('.options').append("<button class = 'optionbtn' value = '"+option.next_question+"'>"+option.option_name+"</button>").hide().fadeIn(400);
            }
            
        });
    }
    else {
        loadInitialState();
       
    }
}
    
    //Function to open and close chat box after click on arrow
$('#arrow').click(()=>{
    
    if(!chatboxOpen){
        $('.chatbot').animate({
            bottom: "0px"
        },{
            duration: 600,
            queue: false,
            complete: () => {
                if (!flagFirst) {
                    
                    var textBox = $("<input type = 'text' name = 'email' class = 'other email start_email' placeholder='Enter your email' required/><input type = 'tel' name = 'other' placeholder = 'enter your phone number' class = 'other phone' required/>");
                    $('.chat-content').append(textBox)
                    $('.options').append("<button class = 'startbtn'>Start chat</button>");
                    flagFirst = true;
                }
            }
        });
        chatboxOpen = true;
    }else{
        $('.chatbot').animate({
            bottom: "-420px"
        },{
            duration: 600,
            queue: false,
            
        });
        
        chatboxOpen = false;
    }
});            


$('body').on('click', '.startbtn', function () {
    email = $('.start_email').val()
    phone = $('.phone').val()

    if (email == '' || !email.match(email_regex)){
        localStorage.setItem('email', "");
    }
    else {
        localStorage.setItem('email', email);
    }
    if (phone == '') {
        localStorage.setItem('phone','')
    }
    else {
        localStorage.setItem('phone', phone);

    }

    $('.chat-content').children().remove();
    $('.options').children().remove();
    start_chat(); 
});
//Action to be taken after click on a option button
$('.options').on('click','.optionbtn',function(){
    //Create a div to display new message i.e. selected option button
    var newmsg = $("<div class ='message-sent'>" + $(this).text() + "</div>");
    var conversation = JSON.parse(localStorage.conversation);
    conversation.push({ from: 'user', message: $(this).text(), type:2 });
    localStorage.setItem('conversation', JSON.stringify(conversation));
    newmsg.hide(); 
    $('.chat-content').append(newmsg);
    newmsg.fadeIn(400);
    //Option button's value is next question associated with that option
    var next_question = $(this).val();
    console.log(next_question);
    //If option with valid associated next question is selected
    if(next_question != 'null' && next_question != -11 && next_question != ""){
        setTimeout(()=>{
            $.post('/chat/next_question',{'next_question':next_question},function(data){
                //Create div to display reply message i.e. next question
                var msgrcd = $("<div class ='message-received'>" + data.question + "</div>");
                var conversation = JSON.parse(localStorage.conversation);
                conversation.push({ from: 'SAHEB', message: data.question, type:1 , id:data.id});
                localStorage.setItem('conversation', JSON.stringify(conversation));
                msgrcd.hide();
                $('.chat-content').append(msgrcd);
                msgrcd.fadeIn(400);
                $('.chat').animate({
                    scrollTop: $('.chat')[0].scrollHeight}, "slow");
                $('.optionbtn').fadeOut(400);
                //Clear previous options
                $('options').empty();
                //Add new options by passing id of current question to obtain it's associated options
                $.post('/chat/get_options',{'next_options':data.id},function(data){
                    for(option of data){
                        $('.options').append("<button class = 'optionbtn' value = '"+option.next_question+"'>"+option.option_name+"</button>").hide().fadeIn(400);
                    }
                }); 
            });
            },400);

    }else if(next_question == -11){
        //If question not listed
        console.log('not listed');
        //Creating div to display message to user
        var newmsg = $("<div class ='message-sent'>Type your query</div>");
        newmsg.hide();
        $('.chat-content').append(newmsg);
        newmsg.fadeIn(400);
        if (!textBoxDisplayed) {
            var textBox = null;
            if (localStorage.email != "") {
                 textBox= $("<input type = 'text' name = 'email' class = 'other email' placeholder='Enter your email' required/><input type = 'text' name = 'other' placeholder = 'enter your query' class = 'other text' required/><button class ='send '><i class = 'material-icons'>arrow_forward</i></button>");
            }
            else {
                textBox = $("<input type = 'text' name = 'other' placeholder = 'enter your query' class = 'other text' required/><button class ='send '><i class = 'material-icons'>arrow_forward</i></button>");
            }
            textBox.hide();
            $('.chat-content').append(textBox);
            textBox.delay(400).fadeIn(400);
            textBoxDisplayed = true;
        }
        $('.chat').animate({
            scrollTop: $('.chat')[0].scrollHeight}, "slow");
        $(this).prop('disabled',true);
        
    }
    else if (next_question == "") {
        console.log('hello')
     }else {
        //If selected option has a final answer then display answer and show start over button
        $.post('/chat/answer',{'option':$(this).text()}, function(data){
            //Create a div to display answer to user, here 'data' holds final answer
            var msgrcd = $("<div class ='message-received'>" + data + "</div>");
            var conversation = JSON.parse(localStorage.conversation);
            conversation.push({ from: 'SAHEB', message: data , type:3 });
            localStorage.setItem('conversation', JSON.stringify(conversation));
            msgrcd.hide();
            $('.chat-content').append(msgrcd);
            msgrcd.delay(400).fadeIn(400);
            $('.chat').animate({
                scrollTop: $('.chat')[0].scrollHeight}, "slow");
            $('.optionbtn').fadeOut(400);
            //Clear all previous options
            $('options').empty();
            //Show Start over button
            setTimeout(()=>{
                $('.options').append("<button class = 'optionbtn' value = '1'>Start Over</button>").hide().fadeIn(400);
                $('.options').append("<button class = ' email optionbtn'>Email History</button>").hide().fadeIn(400);
            },600);
            
        });
    }
});

function sendEmail(email) {
    var conversation = JSON.parse(localStorage.conversation);
    conversation.pop();
    console.log(conversation);
    
    localStorage.setItem('conversation', JSON.stringify([]));
    $('.chat-content').append("<div class ='message-received'>History sent to: <br>" + email + "</div>");
    
    $.post('/chat/next_question', { 'next_question': 1 }, function (data) {
            var msgrcd = $("<div class ='message-received'>" + data.question + "</div>");
            var conversation = JSON.parse(localStorage.conversation);
            conversation.push({ from: 'SAHEB', message: data.question,type:1, id:1 });
            localStorage.setItem('conversation', JSON.stringify(conversation));
            msgrcd.hide();
            $('.chat-content').append(msgrcd);
            msgrcd.fadeIn(400);
            textBoxDisplayed = false
            $('.chat').animate({
                scrollTop: $('.chat')[0].scrollHeight}, "slow");
            $('.optionbtn').fadeOut(400);
            //Clear previous options
            $('options').empty();
            //Add new options
            $.post('/chat/get_options',{'next_options':data.id},function(data){
                for(option of data){
                    $('.options').append("<button class = 'optionbtn' value = '"+option.next_question+"'>"+option.option_name+"</button>").hide().fadeIn(400);
                }
            }); 
    });
    $.post('/chat/send_chat_history', { conversation: conversation, email: email }, function (response) {
        console.log(response)
        
    });
}
$('.options').on('click', '.email', function (e) {
    
    if (localStorage.email == "") {
        var textBox = $("<input type = 'text' name = 'email' class = 'other email history-email' placeholder='Enter your email' required/><button class ='send-email '><i class = 'material-icons'>arrow_forward</i></button>");
        textBox.hide();
        $('.chat-content').append(textBox);
        textBox.delay(400).fadeIn(400);
        textBoxDisplayed = true;
        $('.chat').animate({
            scrollTop: $('.chat')[0].scrollHeight}, "slow");
        $(this).prop('disabled', true);
    }
    else {
        sendEmail(localStorage.email);
    }
    
    
});
 

$('body').on('click', '.send-email', function () {
    let email = $('.history-email').last().val();
    console.log(email);
    sendEmail(email)
});


//Action to be taken after click on send button
$('.chat-content').on('click','.send',function(){
    //Store user query in 'text' and user email in 'email'
    var text = $('.text').val();
    var email = $('.email').val();
    console.log(text);
    console.log(email);
    //Check whether user entered a question or not
    if(text == ''){
        alert('please type a question before sending.');
    }
    //Check email validity
    else if(email == '' || !email.match(email_regex)){
        alert('enter valid email');
    }
    else {
        
        //Create div to display acknowledgement message to user
                var msgrcd = $("<div class ='message-received'>Your query has been recorded<br> We will reachout to you shortly.</div>");
                    msgrcd.hide();
                    textBoxDisplayed = false;
                    $('.chat-content').append(msgrcd);
                    msgrcd.fadeIn(400);
                    $('.chat').animate({
                        scrollTop: $('.chat')[0].scrollHeight
                    }, "slow");
            $.post('/chat/next_question',{'next_question':1},function(data){
             var msgrcd = $("<div class ='message-received'>" + data.question + "</div>");
             var conversation = JSON.parse(localStorage.conversation);
            conversation.push({ from: 'SAHEB', message: data.question ,type:1,id:1});
            localStorage.setItem('conversation', JSON.stringify(conversation));
                    msgrcd.hide();
                    $('.chat-content').append(msgrcd);
                    msgrcd.fadeIn(400);
                    $('.chat').animate({
                        scrollTop: $('.chat')[0].scrollHeight}, "slow");
                    $('.optionbtn').fadeOut(400);
                    //Clear previous options
                    $('options').empty();
                    //Add new options
                    $.post('/chat/get_options',{'next_options':data.id},function(data){
                        for(option of data){
                            $('.options').append("<button class = 'optionbtn' value = '"+option.next_question+"'>"+option.option_name+"</button>").hide().fadeIn(400);
                        }
                    }); 
                });
        $.post('/chat/send_email',{'question' : text,'email': email} , function(data){
            console.log(data);
            console.log("email sent");

                
                //Display first question and it's options by appending option buttons
               
        });
    }
});
