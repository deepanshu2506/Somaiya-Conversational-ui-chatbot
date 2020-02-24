
$('.login_btn').click(function () {
    let password = Sha256.hash($('.input_pass').val());
    let email = $('.input_user').val();
    if (email != "") {
        $('.loader-container').animate({
                    'z-index':10,
                    'opacity': 1
                },100);
                setTimeout(() => {
                    
                    $.post("/login/authenticateUser", { email, password }, function (response) {
                        if (response.code == 1) {
                            localStorage.jwtToken = response.token;
                            console.log('done');
                            window.location.replace("/admin");    
                        }
                        else {
                            $('#error').text('*' + response.message);
                            $('.loader-container').css({ opacity: 0 });
                        }
                    });
                }, 1500);
        
        
    }
    else {
        $('#error').text('*'+'username not specified');
    }
})