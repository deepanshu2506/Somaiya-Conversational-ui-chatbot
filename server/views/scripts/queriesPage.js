
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



$('#send-email-popup img').click(function () {
    $('#send-email-popup').fadeOut(400);
});
$('#display-question-popup img').click(function () {
    $('#display-question-popup').fadeOut(400);
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
$('body').on('click', '.query', function () {
    $('#display-question-popup p').text("Question: "+ $(this).data('meta').question);
    $('#display-question-popup').fadeIn(400);
})
$('body').on('click', '.reply-button', function (event) {
    event.preventDefault()
    let meta = $(this).parent().data('meta');
    
    $('#send-email-popup .question').text("Question: "+ meta.question);
    $('#send-email-popup .answerbox').val('');
    $('#send-email-popup').fadeIn(400);
    $('#send-email-popup .emailbox').val(meta.email);
    $('#send-email-popup .yes').data('id', meta.id);
});



function populate(status) {
    $.ajax({
            method: 'POST', url: '/admin/queries/getQueries', headers: { Authorization: localStorage.jwtToken }, data: { replied: status }, success: function (response) {
                if (response.code == 1) {
                    $('.query-container').children().remove();
                    for (query of response.queries) {   
                        let location = query.location
                        let email = query.email;
                        let question = query.question;
                        let id = query.id
                        let postedDate = query.timestamp.slice(0, 19) + 'Z';
                        postedDate = new Date(postedDate);
                        
                        let isReplied = query.isReplied;
                        let querybox = $('<div class="query"></div>');
                        querybox.append('<div>' + location + '</div><div>' + email + '</div><div>' + postedDate.getDay() + '/' + (postedDate.getMonth() + 1) + '/' + postedDate.getFullYear() + '</div><div>' + postedDate.getHours() + ':' + postedDate.getMinutes() + '</div>');
                        querybox.data('meta', { question, email ,id});
                        
                        if (isReplied) {
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
    $('.query-container').children().each(function () {
        if ($(this).data('meta').id == id) {
            console.log($(this).children())
            $(this).children().remove('.reply-button');
            $(this).append("<div class = 'sent'></div>")
        }
    });

    let popup = $(this).parent();
    let email = popup.children('.emailbox').val();
    let reply = popup.children('.answerbox').val();
    let question = popup.children('.question').text();

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
            $('#send-email-popup').fadeOut(400);
        }
    })
});

