// Handles game start and initial user interactions

$(document).ready(function() {
    $('.introduction').modal('show');

    $('#login-trigger').click(function(){
        $(this).next('#login-content').slideToggle();
        $(this).toggleClass('active');

        if ($(this).hasClass('active')) {
            $(this).find('span').html('&#x25B2;');
        } else {
            $(this).find('span').html('&#x25BC;');
        }
    });

    $('.play-now').on('click', function() {
        findGame();
    });

    $('.submit-login').on('click', function() {
        data = {
            username: $('#username').val(),
            password: $('#password').val()
        };
        console.log(data);
        $.ajax({
            type: "POST",
            url: "/login",
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                username: $('#username').val(),
                password: $('#password').val(),
            }),
            success: function (data) {
                return data;
            },
            error: function (error) {
                console.log(error);
                return "Error!";
            }
        });
    });

    $('#signup').on('click', function() {
        console.log('signup');
    });
});

function findGame() {
    $('.introduction').fadeOut(500);
    setTimeout(lobbyManager.enterLobby, 500);
}
