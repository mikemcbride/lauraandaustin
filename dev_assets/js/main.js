// your javascript goes in here
$(document).ready(function() {
  // toggle the menu when clicking the icon
  $('#menuToggle').click(function() {
    $('body').toggleClass('show-nav');
  });

  // when we click a nav-item, remove the show-nav class so the menu hides on mobile
  $('.nav-item').click(function() {
    $('body').removeClass('show-nav');
  });

  // get the countdown!
  $('#countdown').html(getMessage());

  function getMessage() {
    var now = new Date(); // right now!
    var wed = new Date(2016, 5, 10); // wedding date!
    var days = daydiff(now, wed);
    var dayWord = days == 1 ? " day " : " days ";
    return (days > 0) ? "Only " + days + dayWord + "left!" : "They're married!";
  }

  function daydiff(first, second) {
    return Math.floor((second-first)/(1000*60*60*24));
  }
});
