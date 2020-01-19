var textBoxDisplayed = false;
var chatboxOpen = false;
var email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
let flagFirst = false;
//Function to display first question and it's options by appending option buttons
function start_chat(){
    $.get('/chat/start',(data)=>{
        $('.chat-content').append("<div class ='message-received'>"+data+"</div>").hide().fadeIn(400);

    });
    $.post('/chat/get_options',{'next_options':'1'},(data)=>{
        for(option of data){
            $('.options').append("<button class = 'optionbtn' value = '"+option.next_question+"'>"+option.option_name+"</button>").hide().fadeIn(400);
        }
    });
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
                    start_chat();
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

//Action to be taken after click on a option button
$('.options').on('click','.optionbtn',function(){
    //Create a div to display new message i.e. selected option button
    var newmsg = $("<div class ='message-sent'>"+$(this).text()+"</div>");
    newmsg.hide();
    $('.chat-content').append(newmsg);
    newmsg.fadeIn(400);
    //Option button's value is next question associated with that option
    var next_question = $(this).val();
    console.log(next_question);
    //If option with valid associated next question is selected
    if(next_question != 'null' && next_question != -11){
        setTimeout(()=>{
            $.post('/chat/next_question',{'next_question':next_question},function(data){
                //Create div to display reply message i.e. next question
                var msgrcd = $("<div class ='message-received'>"+data.question+"</div>");
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
        if(!textBoxDisplayed){
            //Create text box for email and query and button to send email
            var textBox = $("<input type = 'text' name = 'email' class = 'other email' placeholder='Enter your email' required/><input type = 'text' name = 'other' placeholder = 'enter your query' class = 'other text' required/><button class ='send '><i class = 'material-icons'>arrow_forward</i></button>");
            textBox.hide();
            $('.chat-content').append(textBox);
            textBox.delay(400).fadeIn(400);
            textBoxDisplayed = true;
        }
        $('.chat').animate({
            scrollTop: $('.chat')[0].scrollHeight}, "slow");
        $(this).prop('disabled',true);
        
    }else{
        //If selected option has a final answer then display answer and show start over button
        $.post('/chat/answer',{'option':$(this).text()}, function(data){
            //Create a div to display answer to user, here 'data' holds final answer
            var msgrcd = $("<div class ='message-received'>"+data+"</div>");
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
            },600);
            
        });
    }
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
                    var msgrcd = $("<div class ='message-received'>"+data.question+"</div>");
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
