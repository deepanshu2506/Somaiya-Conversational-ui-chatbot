var displayToast = (heading , type , text)=>{
    $.toast({
        heading: heading,
        text: text,
        icon: type,
        showHideTransition: 'slide',
        loader: false,
        position:"bottom-right"
        // position:{bottom: '20vh' , left:'40%'}
    });
};


$(document).ready(function () {
    // console.log(localStorage.jwtToken)
    if (localStorage.jwtToken != undefined) {
        $.ajax({
            method: 'POST', url: '/admin/get_question_data', headers: { Authorization: localStorage.jwtToken }, data: { id: 1 }, success: function (data) {
                if (data.code == 1) {
                    $('.question-container p').html(data.question.question);
                    $('.question-container').data('question_id', data.question.id);
            
                    if (data.options.length > 4) {
                        $('.option-container').css({ display: 'inline-block' });
                    }
                    else {
                        $('.option-container').css({ display: 'flex' });
                    }
                    if (data.options.length > 0) {
                        data.options.forEach(option => {
                            var optiondiv = $("<div class='option'>" + option.option_name + "</div>")
                            optiondiv.data('meta-data', option);
                            $('.option-container').append(optiondiv);
                        });
                    }
                    else {
                        optionContainer.append('<div class = "no-options">There are no options available</div>');
                    }
                }
                else {
                    displayToast('Error', 'error', 'Something went wrong');
                }
            }, error: function (error) {
                console.log('error');
                localStorage.removeItem('jwtToken');
                window.location.replace("/login");

            }
        });
    }
    else {
                window.location.replace("/login");
        
    }

    setInterval(()=>{
        $('#content').animate({
            scrollTop: $('#content').scrollHeight}, "slow");
    },1000);
});


$('body').on('click','.option',function(){
    $(this).siblings().removeClass('active');
    $(this).parent().nextAll().remove();
    var meta = $(this).data('meta-data');
    var nextQuestion = meta.next_question;
    if(nextQuestion != null && nextQuestion != -11 && nextQuestion != -1){
        $(this).addClass('active');
    
        $.ajax({
            method: 'POST', url: '/admin/get_question_data', headers: { Authorization: localStorage.jwtToken }, data: { id: nextQuestion }, success: function (data) {
                if (data.code == 1) {
                    var questionContainer = $("<div class='question-container'><p>" + data.question.question + "</p></div>");
                    questionContainer.data('question_id', data.question.id)
                    var optionContainer = $("<div class='option-container'></div>");
                    if (data.options.length > 4) {
                        optionContainer.css({ display: 'inline-block' });
                    }
                    else {
                        optionContainer.css({ display: 'flex' });
                    }
                    if (data.options.length > 0) {
                        data.options.forEach(option => {
                            var optiondiv = $("<div class='option'>" + option.option_name + "</div>")
                            optiondiv.data('meta-data', option);
                            optionContainer.append(optiondiv);
                        });
                    }
                    else {
                        optionContainer.append('<div class = "no-options">There are no options available</div>');
                    }
                    $('#content').append(questionContainer);
                    $('#content').append(optionContainer);
                }
                else {
                    displayToast('Error', 'error', 'Something went wrong');
                }
            
            
            }
        });
    }
    else if(nextQuestion == null){
        $(this).addClass('active');
        $(this).data('hasAnswer',true);
        $.ajax({
            method: 'POST', url: '/admin/get_answer', headers: { Authorization: localStorage.jwtToken }, data: { option: meta.option_name }, success: function (response) {
                if (response.code == 1) {
                    var answerContainer = $("<div class='answer-container'><p>" + response.data.answer + "</p></div>");
                    answerContainer.data('answer_id', response.data.id);
                    $('#content').append(answerContainer);
                }
                else {
                    displayToast('Error', 'error', 'Something went wrong');
                }
            
            }
        });
    }
    else{
        if(nextQuestion != -11){
            $(this).addClass('active');
            $('#content').append("<p class = 'incomplete'>This route is incomplete</p>");
        }
            
    }
    
});

