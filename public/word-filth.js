// vi: set sw=2 et :

(function () {

  var wordList = [];

  var addWordList = function(listName, pairs) {
    wordList = wordList.concat(pairs);
  };

  var importSimplePairs = function (blockOfText) {
    var pairs = [];

    blockOfText.split(/\n/).forEach(function (lineOfText) {
      var m;
      if (m = lineOfText.match(/^\s*(\w+)\s+(\w+)\s*$/)) {
        pairs.push({ en_gb: m[2], da_dk: m[1] });
      }
    });

    return pairs;
  };

  addWordList('days', importSimplePairs(`
    mandag	Monday
    tirsdag	Tuesday
    onsdag	Wednesday
    torsdag	Thursday
    fredag	Friday
    lørdag	Saturday
    søndag	Sunday
  `));

  addWordList('months', importSimplePairs(`
    januar	January
    februar	February
    marts	March
    april	April
    maj	May
    juni	June
    juli	July
    august	August
    september	September
    oktober	October
    november	November
    december	December
  `));

  addWordList('seasons', importSimplePairs(`
    forår	Spring
    sommer	Summer
    efterår	Autumn
    vinter	Winter
  `));

  var pickRandomPair = function(pairs) {
    return pairs[Math.floor(Math.random() * pairs.length)];
  };

  var tidyText = function(t) {
    return t.toLowerCase().replace(/\s+/g, ' ').trim();
  };

  var matching_text = function(textA, textB) {
    return(tidyText(textA) === tidyText(textB));
  };

  var newGame = function() {
    var pair = pickRandomPair(wordList);
    $('.challenge').text(pair.da_dk);
    $('.response').val('');
    $('.response').focus();

    $('.message-correct').hide();
    $('.message-incorrect').hide();
    $('.message-give-up').hide();

    $('form').off('submit');
    $('form').off('reset');

    $('form').on('submit', function (event) {

      var givenAnswer = $('.response').val();

      if (matching_text(pair.en_gb, givenAnswer)) {
        $('.message-correct').show().delay(500).fadeOut(250, function () {
          newGame();
        });
      } else {
        $('.message-incorrect').show().delay(500).fadeOut(250);
      }

      return false;
    });

    $('form').on('reset', function (event) {
      $('.message-give-up .correct-answer').text(pair.en_gb);
      $('.message-give-up').show().delay(2000).fadeOut(250, function () {
        newGame();
      });

      return false;
    });
  };

  $(document).ready(newGame);

})();
