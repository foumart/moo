$(function() {

  $('.benchmark').on('click', function() {
    $('.main-menu').slideUp();
    $('.benchmark').slideDown();
    setTimeout(startReport, 100)
  })

  $('.guess-computer').on('click', function() {
    $('.main-menu').slideUp();
    $('.guesses-computer').slideDown();
  })

  $('.guess-you').on('click', function() {
    $('.main-menu').slideUp();
    $('.guesses-you').slideDown();
  })

  $('.computer-guess-number').on('submit', function(e) {
    //$('.computer-guess-number').prop('disabled', true);
    //e.preventDefault();
    var val = parseFloat($('.computer-guess-number input[type="text"]').val().substr(0, 4));
    var $output = $('.guesses-computer__result');
    $output.html('');
    
    if ( isNaN(val) || allUniques.indexOf((val.toString()).length==3 ? "0"+val.toString() : val.toString()) == -1 ) {
      $output.text("Please enter a valid number")
      return false;
    }

    var num = strNumToArray((val.toString()).length==3 ? "0"+val.toString() : val.toString());

    playSingle(num, false, true, $output)

    return false;
  })

  var interval;
  function startReport(){
    interval = setInterval(nextTry, 320);
  }
  function nextTry(){
    var r1 = parseInt(Math.random()*9.99);
    var r2 = parseInt(Math.random()*9.99);
    while(r2 == r1){
      r2 = parseInt(Math.random()*9.99);
    }
    var r3 = parseInt(Math.random()*9.99);
    while(r3 == r1 || r3 == r2 ){
      r3 = parseInt(Math.random()*9.99);
    }
    var r4 = parseInt(Math.random()*9.99); 
    while(r4 == r1 || r4 == r2 || r4 == r3){
      r4 = parseInt(Math.random()*9.99);
    }
    num = [r1, r2, r3, r4];
    var $benchnum = $('.bench-num');
    $benchnum.html(num.join(' '));
    var $benchres = $('.bench-result');
    $benchres.html('');
    playSingle(num, false, true, $benchres);
  }





  var ansStr = allUniques[Math.floor(Math.random()*allUniques.length)];
  var ans = strNumToArray(ansStr);

  $('.you-guess-number').on('submit', function(e) {
    e.preventDefault();
    var val = parseFloat($('.you-guess-number input[type="text"]').val().substr(0, 4));
    var $output = $('.guess-you__result');
    var showPruned = $('.you-guess-number input[type="checkbox"]').is(':checked');
    var qset = allUniques.slice();

    $output.html('');

    if ( isNaN(val) || allUniques.indexOf((val.toString()).length==3 ? "0"+val.toString() : val.toString()) == -1 ) {
      $output.text("Please enter a valid guess")
      return false;
    }

    if ( val == ansStr ) {
      $output.text('You got it!');
      return false;
    }

    var num = strNumToArray(val.toString());
    qset = pruneSet(qset, num, ans, false, true, $output);

    if ( showPruned )
      $output.append('<div class="pruned">' + qset.join(' ') + '</div>');
    return false
  })

});
