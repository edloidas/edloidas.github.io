/**
 * EDLOIDAS DEVPAGE
 * NAVIGATION SCRIPT
 *
 * @author edloidas
 * @link edloidas@gmail.com
 */

$('.devpage').click(function () {
    if ($('.projects').hasClass('hidden')) {
        $('.quote').css('position', 'static');
        $('.logo').css('position', 'static');
        $('.logo').css('margin-top', '20px');
        $('.linewrap').css('max-width', '100%');
        $('.projects').removeClass('hidden');
    } else {
        $('.quote').css('position', 'fixed');
        $('.logo').css('position', 'fixed');
        $('.logo').css('margin-top', '-50px');
        $('.linewrap').css('max-width', '400px');
        $('.projects').addClass('hidden');
    }
});
