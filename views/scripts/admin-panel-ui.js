var popupActive = false;
var textboxEmpty= false;
var currQuestion = null;
var currOption = null;
var currAnswer = null;

var displayToast = (heading , type , text)=>{
    $.toast({
        heading: heading,
        text: text,
        icon: type,
        showHideTransition: 'slide',
        loader:false,
        position:'bottom-right'
    });
};

$(document).contextmenu(function(e){
    e.preventDefault();
});

$('.logout').click(() => {
    localStorage.removeItem('jwtToken');
    window.location.replace("/login");
});

$('.admin').click(() => {
    window.location.replace("/admin");
});

$('.queries').click(() => {
    // localStorage.removeItem('jwtToken');
    window.location.replace("/admin/queries");
});


$('body').on('contextmenu','.question-container',function(e){
    e.preventDefault();
    console.log(e.clientY + " ");
    $('#question-menu').css({
        top: e.clientY + "px",
        left: e.clientX + "px"
    }).fadeIn(300);
    currQuestion = $(this);
});
$(document).bind("mousedown", function (e) {
        if($(e.target).parents("#question-menu").length==0)
            $("#question-menu").fadeOut(200);
    
});

$('body').on('contextmenu','.answer-container',function(e){
    e.preventDefault();
    $('#answer-menu').css({
        top: e.clientY + "px",
        left: e.clientX + "px"
    }).fadeIn(300);
    currAnswer = $(this);
});

$(document).bind("mousedown", function (e) {
        if($(e.target).parents("#answer-menu").length==0)
            $("#answer-menu").fadeOut(200);
    
});

$('body').on('contextmenu','.option',function(e){
    e.preventDefault();
    const meta = $(this).data('meta-data');
    if(meta.next_question != -11 ){
        if($(this).data('hasAnswer') || meta.next_question != -1){
            $('#option-menu ul li').eq(3).addClass('menu-item--disabled')
            $('#option-menu ul li').eq(2).addClass('menu-item--disabled')

        }
        else{
            $('#option-menu ul li').eq(2).removeClass('menu-item--disabled')
            $('#option-menu ul li').eq(3).removeClass('menu-item--disabled')

        }
    
        $('#option-menu').css({
            top: e.clientY + "px",
            left: e.clientX + "px"
        }).fadeIn(300);
        currOption =$(this); 
    }else{
        
        displayToast('Danger' , 'error' , 'Please do not alter this option')
    }
});


$(document).bind("mousedown", function (e) {
        if($(e.target).parents("#option-menu").length==0)
            $("#option-menu").fadeOut(200);
    
});


$('.menu ul li').click(function(e){
    action = $(this).text();
    $(this).parent().parent().fadeOut(200);
    if(action == 'Delete Question' && !popupActive){
        $('#delete-question-popup').fadeIn(200);
        popupActive = true;
    }
    else if(action == 'Delete option' && !popupActive){
        $('#delete-option-popup').fadeIn(200);
        popupActive = true;
    }
    else if(action == 'Edit Question' && !popupActive){
        $('#edit-question-popup textarea').val(currQuestion.children('p').html().replace('<br>',"\n"))
        $('#edit-question-popup').fadeIn(200);
        popupActive = true;
    }
    else if(action == 'Add Question' && !popupActive){
        $('#add-question-popup').fadeIn(200);
        popupActive = true;
    }
    else if(action == 'Add Answer' && !popupActive){
        $('#add-answer-popup').fadeIn(200);
        popupActive = true;
    }
    else if(action == 'Add option' && !popupActive){
        $('#add-option-popup').fadeIn(200);
        popupActive = true;
    }
    else if(action == 'Edit option' && !popupActive){
        $('#edit-option-popup input').val(currOption.text())
        $('#edit-option-popup').fadeIn(200);
        popupActive = true;
    }
    else if(action == 'Edit Answer' && !popupActive){
        $('#edit-answer-popup textarea').val(currAnswer.children('p').html().replace(/<br>/g,"\n"))
        $('#edit-answer-popup').fadeIn(200);
        popupActive = true;
    }
    else if(action == 'Delete Answer' && !popupActive){
        $('#delete-answer-popup').fadeIn(200);
        popupActive = true;
    }
    else{
        
    }
});

$('.menu-item--disabled').click(function(e){
    e.preventDefault();
});


$('.popup img').click(function(){
    $(this).parent().fadeOut(200);
    popupActive = false;
    textboxEmpty = null;
});


$('.no').click(function(){
    $(this).parent().fadeOut(200);
    popupActive = false;
    textboxEmpty = null;
});

$('.textbox').blur(function(){
    if($(this).val() == '' && !textboxEmpty){
        $(this).next('p').text('*this field is required')
        textboxEmpty = true;
    }
    else{
        if($(this).val()!=""){
            $(this).next('p').text('');
            textboxEmpty = false;
        }
    }
});

$('#edit-question-popup .yes').click(function(){
    if(!textboxEmpty || $(this).parent().children('textarea').val()!=""){
        var newQuestion = $(this).parent().children('textarea').val().replace('\n','<br/>');
        currQuestion.children('p').html(newQuestion);
        $(this).parent().fadeOut(200);
        popupActive = false;
        const questionId = currQuestion.data().question_id;
        $.ajax({
            method: 'POST', url: '/admin/update_question', headers: { Authorization: localStorage.jwtToken }, data: { id: questionId, value: newQuestion }, success: function (response) {
                if (response.code === 1) {
                    displayToast('Success', 'success', response.message);
                }
                else {
                    displayToast('Error', 'error', response.message);
                }
            }
        });
    }
    else{
        displayToast('Incomplete' , 'warning' , 'please do not leave this field blank');
        
    }
    
});

$('#edit-answer-popup .yes').click(function(){
    if(!textboxEmpty || $(this).parent().children('textarea').val()!=""){
        var newAnswer = $(this).parent().children('textarea').val().replace(/\n/g,'<br/>');
        currAnswer.children('p').html(newAnswer);
        $(this).parent().fadeOut(200);
        popupActive = false;
        const answerId = currAnswer.data().answer_id;
        $.ajax({
            method: 'POST', url: '/admin/update_answer', headers: { Authorization: localStorage.jwtToken }, data: { id: answerId, value: newAnswer }, function(response) {
                if (response.code === 1) {
                    displayToast('Success', 'success', response.message);
                }
                else {
                    displayToast('Error', 'error', response.message);
                }
            }
        });
    }
    else{
        displayToast('Incomplete' , 'warning' , 'please do not leave this field blank');
    }
    
});

$('#edit-option-popup .yes').click(function(){
    if(!textboxEmpty || $(this).siblings('input').val() != ""){
        const newOption = $(this).siblings('input').val();
        currOption.html(newOption);
        $(this).parent().fadeOut(200);
        popupActive = false;
        const optionId = currOption.data().metaData.id;
        $.ajax({
            method: 'POST', url: '/admin/update_option', headers: { Authorization: localStorage.jwtToken }, data: { id: optionId, value: newOption },success: function(response) {
                if (response.code === 1) {
                    displayToast('Success', 'success', response.message);
                }
                else {
                    displayToast('Error', 'error', response.message);
                }
            }
        });
    }
    else{
        displayToast('Incomplete' , 'warning' , 'please do not leave this field blank');
    }
});

$('#add-option-popup .yes').click(function(){
    if(!textboxEmpty || $(this).siblings('input').val() !=""){
        const newOption = $(this).siblings('input').val();
        var optionContainer = currQuestion.next('.option-container');
        if(optionContainer.children('.no-option').length > 0){
            optionContainer.children('.no-option').remove();
        }

        if(optionContainer.children('.option').length > 4){
            optionContainer.css({display:'block'});
        }else{
            optionContainer.css({display:'flex'});
        }
        const forquestion = currQuestion.data('question_id');
        $.ajax({
            method: 'POST', url: '/admin/add_option', headers: { Authorization: localStorage.jwtToken }, data: { optionName: newOption, forQuestion: forquestion }, success: function (response) {
                if (response.code == 1) {
                    var option = $('<div class="option">' + newOption + '</div>');
                    option.data('meta-data', response.meta);
                    optionContainer.append(option);

                    displayToast('Success', 'success', response.message);
                }
                else {
                    displayToast('Error', 'error', response.message);
                }
            
            }
        });

        
        $(this).parent().fadeOut(200);
        popupActive = false;
    }
    else{
        displayToast('Error' , 'error' , response.message);
    }
    

});

//meta data is answer id for answer box.

$('#add-answer-popup .yes').click(function(){
    var answer = $(this).siblings('textarea').val().replace(/\n/g , '<br/>');
    var optionId = currOption.data('meta-data').id;
    currOption.parent().siblings('.incomplete').remove();
    
    $.ajax({
        method: 'POST', url: '/admin/add_answer', headers: { Authorization: localStorage.jwtToken }, data: { option: optionId, answerContent: answer }, success: function (response) {
            if (response.code == 1) {
                var answerContainer = $("<div class='answer-container'><p>" + answer + "</p></div>");
                answerContainer.data("answer_id", response.answer_id);
                currOption.data('meta-data').next_question = null;
                currOption.siblings().removeClass('active');
                currOption.parent().nextAll().remove();
                $(this).addClass('active');
                $('#content').append(answerContainer);

                displayToast('Success', 'success', response.message);
            }
            else {
                displayToast('Error', 'error', response.message);
            }
        }
    });

    
    $(this).parent().fadeOut(200);
    popupActive = false;

});

//add question_id as data to question container
//add new question in questions table and update next_question in calling option to the new question_id added 
$('#add-question-popup .yes').click(function(){
    var question = $(this).siblings('textarea').val().replace(/\n/g , '<br/>');
    var optionId = currOption.data('meta-data').id;
    currOption.parent().siblings('.incomplete').remove();
    var questionContainer = $("<div class='question-container'><p>" + question + "</p></div>");
    currOption.siblings().removeClass('active');
    currOption.parent().nextAll().remove();
    $(this).addClass('active');
    $.ajax({
        method: 'POST', url: '/admin/add_question', headers: { Authorization: localStorage.jwtToken }, data: { option: optionId, question: question }, success: function (response) {
            if (response.code == 1) {
                questionContainer.data('question_id', response.question_id);
                $('#content').append(questionContainer);
                currOption.data('meta-data').next_question = response.question_id;
                var optionContainer = $("<div class='option-container'><div class = 'no-option'>There are no options available</div></div>");
                $('#content').append(optionContainer);
            
                displayToast('Success', 'success', response.message);
            }
            else {
                displayToast('Error', 'error', response.message);
            }
        
        }
    });
    
    
});

$('#delete-answer-popup .yes').click(function(){
    var answerId = currAnswer.data('answer_id');
    var possibleOptions = currAnswer.siblings('.option-container').last().children();
    console.log(possibleOptions.html());
    $.ajax({
        method: 'POST', url: '/admin/delete_answer', headers: { Authorization: localStorage.jwtToken }, data: { id: answerId }, success: function (response) {

            if (response.code == 1) {
                currAnswer.remove();
                $('#content').append("<p class = 'incomplete'>This route is incomplete</p>");
                possibleOptions.each(function () {
                    var meta = $(this).data('meta-data');
                    if (meta.id == response.meta.id) {
                        meta.next_question = -1;
                    }
                });
            
                displayToast('Success', 'success', response.message);
            }
            else {
                displayToast('Error', 'error', response.message);
            }
        }
    });
    $(this).parent().fadeOut(200);
    popupActive = false;
}); 

$('#delete-option-popup .yes').click(function(){
    var meta = currOption.data('meta-data');
    
    $.ajax({
        method: 'POST', url: '/admin/delete_option', headers: { Authorization: localStorage.jwtToken }, data: { id: meta.id, next: meta.next_question }, success: function (response) {
            if (response.code == 1) {
                currOption.parent().nextAll().remove();
                currOption.remove();
            
                displayToast('Success', 'success', response.message);
            }
            else {
                displayToast('Error', 'error', response.message);
            }
        }
    });
    $(this).parent().fadeOut(200);
    popupActive = false;
    
});

$('#delete-question-popup .yes').click(function(){
    var questionid = currQuestion.data('question_id');
    if(questionid != 1){
        $.ajax({
            method: 'POST', url: '/admin/delete_question', headers: { Authorization: localStorage.jwtToken }, data: { id: questionid }, success: function (response) {
                if (response.code == 1) {
                    currQuestion.nextAll().remove();
                    $('#content').append("<p class = 'incomplete'>This route is incomplete</p>")
                    currQuestion.remove();
                
                    displayToast('Success', 'success', response.message);
                }
                else {
                    displayToast('Error', 'error', response.message);
                }
            }
        });
       
    }
    else{
        displayToast('Error' , 'error' , 'The root question cannot be deleted');
    }
    $(this).parent().fadeOut(200);
    popupActive = false;
    
});