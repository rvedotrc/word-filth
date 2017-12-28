// vi: set sw=2 et :

(function () {

  var daysOfTheWeek = [
    { en_gb: "Monday", da_dk: "mandag" },
    { en_gb: "Tuesday", da_dk: "tirsdag" },
    { en_gb: "Wednesday", da_dk: "onsdag" },
    { en_gb: "Thursday", da_dk: "torsdag" },
    { en_gb: "Friday", da_dk: "fredag" },
    { en_gb: "Saturday", da_dk: "lørdag" },
    { en_gb: "Sunday", da_dk: "søndag" },
  ];

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

  var monthsOfTheYear = importSimplePairs(`
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
  `);

  var wordList = daysOfTheWeek.concat(monthsOfTheYear);

  var pickRandomPair = function(pairs) {
    return pairs[Math.floor(Math.random() * pairs.length)];
  };

  var tidyText = function(t) {
    return t.toLowerCase().replace(/\s+/g, ' ').trim();
  };

  var matching_text = function(textA, textB) {
    console.log([textA, textB]);
    return(tidyText(textA) === tidyText(textB));
  };

  var newGame = function() {
    var pair = pickRandomPair(wordList);
    $('.challenge').text(pair.da_dk);
    $('.response').val('');
    $('.response').focus();

    $('.message-correct').hide();
    $('.message-incorrect').hide();

    $('form').off('submit');
    $('form').on('submit', function (event) {

      var givenAnswer = $('.response').val();

      if (matching_text(pair.en_gb, givenAnswer)) {
        $('.message-correct').show().delay(500).fadeOut(250, function () {
          newGame();
        });
        return false;
      } else {
        $('.message-incorrect').show().delay(500).fadeOut(250);
        return false;
      }
    });
  };

  $(document).ready(newGame);

})();
