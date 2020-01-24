
$('.login_btn').click(function () {
    let password = Sha256.hash($('.input_pass').val());
    let email = $('.input_user').val();
    if (email != "") {
        $.post("/login/authenticateUser", { email, password }, function (response) {
            if (response.code == 1) {
                localStorage.jwtToken = response.token;
                console.log('done');
                $('.loader-container').animate({
                    'z-index':10,
                    'opacity': 1
                },100);
                setTimeout(() => {
                    window.location.replace("http://localhost:3000/admin");    
                } , 1500);

                
            }
            else {
                $('#error').text('*' + response.message);
            }
        });
    }
    else {
        $('#error').text('*'+'username not specified');
    }
})