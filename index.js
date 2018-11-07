var N = 4;

var avg = 6.624;
var avgs = [6.624];
var avgindexes = [];

function genAll (n) {
  var set = [];
  var max = parseFloat(new Array(n+1).join('9'));
  var num;
  var isUnique;
  for ( var i = 0; i <= max; i++ ) {
    num = ('0000000000' + i).slice(-n);
    isUnique = true;
    for ( var j = 0; j < n-1; j++ ) {
      for ( var k = j+1; k < n; k++ ) {
        if ( num[j] == num[k] ) isUnique = false;
      }
    }
    if ( isUnique )
      set.push(num);
  }
  return set;
}

function searchInHash (hash, pos, val) {
  var hashLen = hash.length;
  for ( var i = 0; i < hashLen; i++ )  
    if ( hash[i].pos == pos && hash[i].val == val )
      return hash[i]

  return undefined;
}

function getHashTable (s) {
  var hash = [];
  s.forEach(function(num) {
    for ( var i = 0; i < 4; i++ ) {
      // { pos: i, val: num[i], count: 0 }
      var res = searchInHash(hash, i, num[i])
      if ( res ) res.count++
      else hash.push({ pos: i, val: num[i], count: 1 })
    }
  });

  hash.sort(function(a, b) {
    if ( a.count > b.count ) return 1
    if ( a.count < b.count ) return -1
    return 0;
  })
  return hash;
}

function printHash (hash) {
  var res = '';
  hash.forEach(function(h) {
    res += JSON.stringify(h) + '\n';
  })
  console.log(res);
}

var gg=[];
var lastCow = false;

function makeGuess (s, repeats) {
  if ( s.length == 1 )
    return s;

  if ( s.length < 100 ) {
    var uniq = findUniqueGuess(s)
    if ( uniq && uniq.length ) {
      return uniq[0];
    }
  }

  var sortedHash = getHashTable(s);
  var num = [];

  var i = 0;
  if ( repeats ) i++;

  while ( num.length !== N ) {
    if ( num.indexOf(sortedHash[i].val) == -1 )
      num.push(sortedHash[i].val)
    i++;
  }
  if(gg.indexOf(num.join(''))>=0 || lastCow){
    lastCow = false;
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
    //console.log(num.join('') + "?")
  }
  gg.push(num.join(''));//console.log(num.join(''));

  return num;
}


function respondToNum(num, guess) {
  var response = { bulls: 0, cows: 0 };
  guess.forEach(function(dig, i) {
    dig = parseFloat(dig)
    if ( num.indexOf(dig) !== -1 ) {
      if ( num.indexOf(dig) == i )
        response.bulls++
      else 
        response.cows++
    }
  });

  return response;
}

function pruneSet(set, guess, ans, debug, display, $to) {
  var response = respondToNum(ans, guess);
  if ( debug ) console.log(response);
  if ( display ) {
    if ( ans.join('') != guess.join('') ) {
      $to.append('<div class="bc">Bulls: ' + response.bulls + ' Cows: ' + response.cows + '</div>');
    }
  }
  var pruned = [];
  set.forEach(function(num, pos) {
    var numRes = respondToNum(num, guess)
    if ( numRes.bulls == response.bulls && numRes.cows == response.cows ) {
      pruned.push(num)
    }
  });
  if(!response.bulls && response.cows == 1) lastCow = true;
  return pruned;
}

function findUniqueGuess (set) {
  if ( set.length == 0 ) return set[0];

  var responses = [];
  var uniques = [];

  allUniques.forEach(function(number) {
    var num = number.split('');

    set.forEach(function(n) {
      var res = respondToNum(n, num);
      var resStr = 'b' + res.bulls + 'c' + res.cows;
      responses.push(resStr);
    });


    var matches = -responses.length;
    responses.forEach(function(res) {
      responses.forEach(function(r) {
        if ( res == r ) matches++
      });
    })
    if ( matches == 0 ) {
      uniques.push(num);
      return uniques;
    }

    responses = [];
  });
  return uniques;
}

function strNumToArray (number) {
  var num = [];
  number.split('').forEach(function(n) {
    num.push( parseInt(n, 10) )
  });
  return num
}


var allUniques = genAll(N);

function checkAll () {
  var num, times;
  var histogram = {};
  allUniques.forEach(function(number) {
    num = strNumToArray(number);
    times = playSingle(num)// true

    histogram[times] = histogram[times] ? histogram[times] + 1 : 1;
  })
  console.log(histogram);
}

function playSingle (ans, debug, display, $to) {
  var set2 = allUniques.slice();
  var playedTimes = 0; // Computer repeats the last guess
  var guess;
  var guesses = [];
  do {
    guess = makeGuess(set2);
    if ( guesses.indexOf(guess.join('')) !== -1 ) {
      guess = makeGuess(set2);
    }
    guesses.push(guess.join(''));
    if ( debug ) console.log('guess - ', guess.join(''));
    if ( display ) $to.append('<div class="guess">Guess: ' + guess.join('') + '</div>');

    set2 = pruneSet(set2, guess, ans, debug, display, $to);

    if ( debug ) console.log('set - ', set2.join(' '));
    playedTimes++;
  } while ( ( set2.join('') !== guess.join('') && set2.length ) && playedTimes < 50 )


  if ( debug ) console.log(playedTimes + ' guesses for ' + ans.join(''));
  if ( display ) $to.append('<div class="turns">Got it in ' + playedTimes + ' guesses.')

  avgs.push(playedTimes);
  avg = median(avgs);

  avgindexes = getAvgIndexes(avgs);

  var $benchmid = $('.bench-middle');
  $benchmid.html(" - Avg:"+avg.toFixed(3));

  var $benchavg = $('.bench-avg');
  $benchavg.html(avgindexes);

  gg = [];
  allUniques = genAll(N);
  return playedTimes;
}

function getAvgIndexes(arr){
  var result = "<table width='100%' border=='1'><tr><td>0-3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>10+</td></tr>";
  var index=[];
  var indexes = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  for(var i = 0; i < arr.length; i++){
    if(index.indexOf(arr[i]) == -1) {
      index.push(arr[i]);
    }
    indexes[arr[i]] += 1;
  }
  result += "<tr><td>"+(indexes[0] + indexes[1] + indexes[2] + indexes[3])+"</td>";
  for(i = 4; i < 11; i++){
    result += "<td>" + indexes[i] + "</td>";
  }
  var rr = 0;
  for(i = 11; i < indexes.length; i++){
    rr += indexes[i];
  }
  result += "<td>" + rr + "</td></tr></table>";
  return result;
}

function median(arr){
  var sum = arr.reduce(function(a, b) { return a + b; }, 0);
  return sum / arr.length;
}
