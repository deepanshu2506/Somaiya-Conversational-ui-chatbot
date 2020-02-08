
const checkBox = `<div class="round">
    <input type="checkbox" id="checkbox" />
  </div>`;
const view = "<div class = 'view'><img src = '../resources/eye.svg'/></div>"
let groups = {};


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

let similarEmailReply = [];


function populate(status) {
    groups = {};
    $.ajax({
            method: 'POST', url: '/admin/queries/getQueries', headers: { Authorization: localStorage.jwtToken }, data: { replied: status }, success: function (response) {
                console.log(response)
                if (response.code == 1) {
                
                for (query of response.queries) {
                    if (groups[query.groupNo] instanceof Array && query.isReplied == 0) {
                        groups[query.groupNo].push(query);
                    } else {
                        groups[query.groupNo] = [query];
                    }
                }
                console.log(groups)
                    $('.query-container').children().remove();
                    for (query of response.queries) {   
                        let location = query.location
                        let email = query.email;
                        let question = query.question;
                        let id = query.id
                        let reply = query.reply;
                        let groupNo = query.groupNo;
                        let postedDate = query.timestamp.slice(0, 19) + 'Z';
                        postedDate = new Date(postedDate);
                        
                        let isReplied = query.isReplied;
                        let querybox = $('<div class="query"></div>');
                        querybox.append(checkBox +'<div>' + location + '</div><div>' + question + '</div>'+view+'<div>' + postedDate.getDay() + '/' + (postedDate.getMonth() + 1) + '/' + postedDate.getFullYear() + '</div><div>' + postedDate.getHours() + ':' + postedDate.getMinutes() + '</div>');
                        querybox.data('meta', { question, email ,id,isReplied,reply,groupNo,groups:groups[query.groupNo]});
                        
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
        },
        error: function (xhr, status, error) {
            
            if (xhr.status == 401) {
                window.location.replace("http://localhost:3000/login");
                localStorage.removeItem('jwtToken');
            }
        }
    }); 
}
$(document).ready(function () {
    if (localStorage.jwtToken != undefined) {
        // const questions = [
        //     "heyy",
        //     "hello",
        //     "what is the fees?",
        //     "fees for Ph.D?",
        //     "documents?",
        //     "docs for ST"
        // ];
        // $.ajax({
        //     method: 'POST', url: 'http://127.0.0.1:2000/api/rankings', headers: { Authorization: localStorage.jwtToken }, data: { questions }, success: function (response) {
        //         console.log(response)
        //      }
        // });
        populate(-1);
    }
    else {
        window.location.replace("http://localhost:3000/login");
    }
});


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
$('body').on('click', '.view', function () {
    $('#display-question-popup p').eq(0).text("Question: " + $(this).parent().data('meta').question);
    let isReplied = $(this).parent().data('meta').isReplied;
    // console.log(isReplied);
    if (isReplied) {
        $('#display-question-popup p').eq(1).text("Answer: " + $(this).parent().data('meta').reply);
    }
    else {
        $('#display-question-popup p').eq(1).text("");
    }
    $('#display-question-popup').fadeIn(200);
})
$('body').on('click', '.reply-button', function (event) {
    similarEmailReply = [];
    event.preventDefault()
    let meta = $(this).parent().data('meta');
    console.log(meta.groupNo);
    $('#send-email-popup .question').text("Question: "+ meta.question);
    $('#send-email-popup .answerbox').val('');
    $('#send-email-popup').fadeIn(200);
    if (groups[meta.groupNo].length > 1) {
        $('#similar #no-similar').hide();
        $('#similar #no-similar-img').hide();
        $('#similar ul').show();
        $('.similar-header div').show();
        $('#similar ul').children().remove();
        for (query of groups[meta.groupNo]) {
            if (meta.id != query.id) {
                let question = $('<li><span>' + query.question + '</span><input type="checkbox" /></li>');
                const data = { question: query.question, email: query.email, id: query.id, groupNo: meta.groupNo };
                question.data('meta',data)
                $('#similar ul').append(question);
            }
        }
    }
    else {
        $('#similar #no-similar').show();
        $('#similar #no-similar-img').show();
        $('#similar ul').hide();
        $('.select-all-btn').hide();
    }
    $('#send-email-popup .emailbox').val(meta.email);
    $('#send-email-popup .yes').data('meta', { id: meta.id, groupNo: meta.groupNo });
});

$('body').on('change', '#similar ul li input', function () {
    let boxState = $(this).is(":checked");
    const meta = $(this).parent().data().meta;
    // console.table(meta);
    if (boxState) {
        similarEmailReply.push(meta);
    }
    else {
        similarEmailReply = _.filter(similarEmailReply, function (obj) {
           return meta.id != obj.id 
        }); 
    }

    console.table(similarEmailReply);


    
});

$('.select-all-btn input').change(function () {
    const boxState = $(this).is(":checked");
    if (boxState) {
        similarEmailReply = [];
        $("#similar ul").children().each(function () {
            $(this).children('input').prop('checked',true)
           similarEmailReply.push($(this).data().meta) 
        });
    } else {
        $("#similar ul li input").prop('checked',false)
        similarEmailReply = []
    }
    console.table(similarEmailReply);
})



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
    let id = $(this).data('meta').id;
    const groupNo = $(this).data('meta').groupNo;
    let popup = $(this).parent();
    let email = popup.children('.emailbox').val();
    let reply = popup.children('.answerbox').val();
    let question = popup.children('.question').text();

    similarEmailReply.push({ question, email, id })
    similarEmailReply = _.map(similarEmailReply,(obj)=>({...obj,answer:reply}))

            

    $.ajax({
        method: 'POST',
        url: "/admin/queries/sendReplyMultiple",
        headers: { Authorization: localStorage.jwtToken },
        data: {
            queries: similarEmailReply
        },
        success: function (response) {
           const similarQueryIds = _.map(similarEmailReply, (obj) => obj.id);
            console.log(similarQueryIds);
            console.table(similarEmailReply);
            $('.query-container').children().each(function () {
                if (similarQueryIds.includes($(this).data('meta').id)) {
                    // console.log($(this).children())
                    $(this).children().remove('.reply-button');
                    $(this).children().eq(0).children('input').hide();
                    $(this).append("<div class = 'sent'></div>")
                    $(this).data('meta').reply = reply;
                    $(this).data('meta').isReplied = true;
                }
            });
            for (id of similarQueryIds) {
                groups[groupNo] = _.filter(groups[groupNo], obj => {
                    return obj.id != id
                });                
            }
            console.table(groups[groupNo]);
            displayToast('Success', 'success', 'Response sent successfully');
            $('#send-email-popup').fadeOut(200);
        },
        error: function (error) {
            displayToast('error', 'error', 'Something went wrong');
            $('#send-email-popup').fadeOut(200);
        }
    });
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




