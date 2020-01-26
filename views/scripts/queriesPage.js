
const checkBox = `<div class="round">
    <input type="checkbox" id="checkbox" />
  </div>`;
const view = "<div class = 'view'><img src = '../resources/eye.svg'/></div>"

var displayToast = (heading, type, text) => {
    $.toast({
        heading: heading,
        text: text,
        icon: type,
        showHideTransition: 'slide',
        loader:false,
        position:'bottom-right'
    });
};

var currQuery = null;
let Selectedqueries = [];
let emailList = [];


$('#send-email-popup img').click(function () {
    $('#send-email-popup').fadeOut(200);
});
$('#display-question-popup img').click(function () {
    $('#display-question-popup').fadeOut(200);
});

$('.logout').click(() => {
    localStorage.removeItem('jwtToken');
    window.location.replace("http://localhost:3000/login");
});

$('.admin').click(() => {
    window.location.replace("http://localhost:3000/admin");
});

$('.queries').click(() => {
    // localStorage.removeItem('jwtToken');
    window.location.replace("http://localhost:3000/admin/queries");
});
$('body').on('click', '.view img', function () {
    $('#display-question-popup p').eq(0).text("Question: " + $(this).parent().parent().data('meta').question);
    let isReplied = $(this).parent().parent().data('meta').isReplied;
    // console.log(isReplied);
    if (isReplied) {
        $('#display-question-popup p').eq(1).text("Answer: " + $(this).parent().parent().data('meta').reply);
    }
    else {
        $('#display-question-popup p').eq(1).text("");
    }
    $('#display-question-popup').fadeIn(200);
})
$('body').on('click', '.reply-button', function (event) {
    event.preventDefault()
    let meta = $(this).parent().data('meta');
    
    $('#send-email-popup .question').text("Question: "+ meta.question);
    $('#send-email-popup .answerbox').val('');
    $('#send-email-popup').fadeIn(200);
    $('#send-email-popup .emailbox').val(meta.email);
    $('#send-email-popup .yes').data('id', meta.id);
});



function populate(status) {
    $.ajax({
            method: 'POST', url: '/admin/queries/getQueries', headers: { Authorization: localStorage.jwtToken }, data: { replied: status }, success: function (response) {
            if (response.code == 1) {
                console.log(response)
                    $('.query-container').children().remove();
                    for (query of response.queries) {   
                        let location = query.location
                        let email = query.email;
                        let question = query.question;
                        let id = query.id
                        let reply = query.reply;
                        let postedDate = query.timestamp.slice(0, 19) + 'Z';
                        postedDate = new Date(postedDate);
                        
                        let isReplied = query.isReplied;
                        let querybox = $('<div class="query"></div>');
                        querybox.append(checkBox +'<div>' + location + '</div><div>' + email + '</div>'+view+'<div>' + postedDate.getDay() + '/' + (postedDate.getMonth() + 1) + '/' + postedDate.getFullYear() + '</div><div>' + postedDate.getHours() + ':' + postedDate.getMinutes() + '</div>');
                        querybox.data('meta', { question, email ,id,isReplied,reply});
                        
                        if (isReplied) {
                            // querybox.hide('')
                            querybox.children().eq(0).children('input').hide();
                            querybox = querybox.append('<div class="sent"></div>');
                        }
                        else {
                            querybox = querybox.append('<button class="reply-button btn btn-success dropdown-toggle" type="button">Reply</button>');
                            
                        }
                        $('.query-container').append(querybox)
                    }
                }
                else {
                    window.location.replace("http://localhost:3000/login");
                    localStorage.removeItem('jwtToken');
                }
            }
        }); 
}
$(document).ready(function () {
    if (localStorage.jwtToken != undefined) {
        populate(-1);
    }
    else {
        window.location.replace("http://localhost:3000/login");
    }
});


$('.status ul li').click(function () {
    let option = $(this).text();

    if (option == 'Replied') {
        populate(1);
    }
    else if (option == 'Not Replied') {
        populate(0);
    }
    else if (option == 'All') {
        populate(-1);
    }
});


$('#send-email-popup .yes').click(function () {
    let id = $(this).data('id');
    let popup = $(this).parent();
    let email = popup.children('.emailbox').val();
    let reply = popup.children('.answerbox').val();
    let question = popup.children('.question').text();


    $('.query-container').children().each(function () {
        if ($(this).data('meta').id == id) {
            console.log($(this).children())
            $(this).children().remove('.reply-button');
            $(this).children().eq(0).children('input').hide();
            $(this).append("<div class = 'sent'></div>")
            $(this).data('meta').reply = reply;
            $(this).data('meta').isReplied = true;
        }
    });

    $.ajax({
        method: 'POST',
        url: "/admin/queries/sendReply",
        headers: { Authorization: localStorage.jwtToken },
        data: {
            id: id,
            email: email,
            answer: reply,
            question:question
        },
        success: function (response) {
            displayToast('Success', 'success', 'Response sent successfully');
            $('#send-email-popup').fadeOut(200);
        }
    })
});

$('body').on('change', '.round input', function () {
    let id = $(this).parent().parent().data('meta').id
    let boxState = $(this).is(":checked");
    if (boxState) {
        Selectedqueries.push($(this).parent().parent())
        
    }
    else {
        Selectedqueries = _.filter(Selectedqueries, function (query) {
            return query.data('meta').id != id
        })
    }
    console.log(Selectedqueries)

    // console.log(Selectedqueries);

    if (Selectedqueries.length == 0) {
        $('.reply-to-all').attr('disabled', true);
    }
    else {
        $('.reply-to-all').attr('disabled', false);

    }
});

$('.reply-to-all').click(function () {
    $('#send-email-multiple-popup').fadeIn(200);
    let emailbox = $('#send-email-multiple-popup .emailbox-multiple');
    emailbox.val("");
    Selectedqueries.forEach((query) => {
        if (!emailbox.val().includes(query.data('meta').email)) {
            emailbox.val(emailbox.val() + query.data('meta').email + ", ");
        }
        emailList.push({ question: query.data('meta').question, email: query.data('meta').email ,id:query.data('meta').id});
 
    }); 
    $('#send-email-multiple-popup .multiple-answerbox').val("");
});

$('#send-email-multiple-popup img').click(function () {
    $('#send-email-multiple-popup').fadeOut(200);
    $('.round input').prop('checked', false);
});

$('#send-email-multiple-popup .yes').click(function () {
    let answer = $(this).parent().children('.multiple-answerbox').val()
    if (answer == "") {
        alert('pleasse type an answer');
    }
    else {
        for (email of emailList) {
        email['answer'] = answer;


        $('.query-container').children().each(function () {
            if ($(this).data('meta').id == email.id) {
                // console.log($(this).children())
                $(this).children().remove('.reply-button');
                $(this).children().eq(0).children('input').hide();
                $(this).append("<div class = 'sent'></div>")
                $(this).data('meta').reply = email.answer;
                $(this).data('meta').isReplied = true;
            }
        });

        }
        console.log(emailList)
        $.ajax({
            method: 'POST',
            url: "/admin/queries/sendReplyMultiple",
            headers: { Authorization: localStorage.jwtToken },
            data: {
                queries: emailList
            },
            success: function (response) {
                console.log(response)
                displayToast('Success', 'success', 'Response sent successfully');
                
                
            }
        });
        $('#send-email-multiple-popup').fadeOut(200);
        $('.round input').prop('checked', false);

        
        emailList = [];
        Selectedqueries = [];
    }
    
});




