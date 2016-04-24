// Handles game start and initial user interactions

$(document).ready(function() {
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
        console.log('login');
    });

    $('#signup').on('click', function() {
        console.log('signup');
    });
});

function findGame() {
    $('.introduction').fadeOut(500);
    $('.overlay').fadeOut(400);
}
