// vi: set sw=2 et :

(function () {

  var shuffle = function(array) {
    var i = 0
      , j = 0
      , temp = null;

    for (i = array.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  };

  var completeWordList = [];
  var listNames = [];
  var filteredWordList;
  var warningSummary = {};

  var addWordList = function(listName, importResults) {
    if (!listName.match(/^duo /)) return;

    if (importResults.pairs.length > 0) {
      importResults.pairs.forEach(function (pair) {
        pair.listName = listName;
      });

      completeWordList = completeWordList.concat(importResults.pairs);

      listNames.push(listName);
    }

    importResults.warnings.forEach(function (w) {
      if (w.code != "no_translation") {
        console.log("addWordList", listName, "warning", w);
      }
      warningSummary[w.code] = warningSummary[w.code] || 0;
      ++warningSummary[w.code];
    });
  };

  var importSimplePairs = function (blockOfText) {
    var pairs = [];
    var warnings = [];

    blockOfText.split(/\n/).forEach(function (lineOfText) {
      lineOfText = lineOfText.replace(/\s*\/\/.*/, "");
      lineOfText = lineOfText.replace(/\s*\(.*/, "");
      lineOfText = lineOfText.replace(/^\s*/, "");
      lineOfText = lineOfText.replace(/\s*$/, "");
      var m;

      if (m = lineOfText.match(/^(?:([nt])-)?([a-zéæøå]+)\s+(\w+)?$/)) {
        pairs.push({ en_gb: m[3], da_dk: m[2], da_dk_gender: m[1] });
      } else if (m = lineOfText.match(/^(.*?)\s*=\s*(.*?)$/)) {
        var lhs = m[1];
        var rhs = m[2];
        lhs.split(/\s*,\s*/).forEach(function(l) {
          var m2 = l.match(/^(?:([nt])-)?(.*)$/);
          rhs.split(/\s*,\s*/).forEach(function(r) {
            pairs.push({ en_gb: r, da_dk: m2[2], da_dk_gender: m2[1] });
          });
        });
      } else if (lineOfText.match(/^\S+$/)) {
        // silently discard, for now
        warnings.push({ code: "no_translation", detail: lineOfText });
      } else if (lineOfText.match(/\S/)) {
        warnings.push({ code: "not_imported", detail: lineOfText });
      }
    });

    return { pairs: pairs, warnings: warnings };
  };

  addWordList('duo basics 1', importSimplePairs(`
    n-kvinde woman
    jeg I
    n-drenge boy
    n-pige girl
    en = a,an,one
    er is
    du you
    n-mand man

    han he
    og and
    hun she
    et = a,an,one
    t-æble apple
    spiser eat

    t-brød bread
    drikker drink
    t-vand water
  `));

  addWordList('duo basics 2', importSimplePairs(`
    vi we
    n-mælk milk
    n-avis newspaper

    de they
    n-sandwich sandwich
    t-barn child
    n-ris rice
    kvinder women
    mænd men

    n-bog book
    det it
    har has
    I = you (plural)
    n-menu menu
    mændene = the men
    kvinderne = the women
  `));

  addWordList('duo phrases', importSimplePairs(`
    ja yes
    farvel goodbye
    tak thanks
    nej no
    hej hello

    undskyld = sorry, excuse me
    ikke not
    velkommen welcome
    glad happy
    godmorgen = good morning
    siger says
    godaften = good evening

    snakker speaks
    engelsk English
    dansk Danish
    godnat = good night
    måske = maybe, perhaps
    goddag = good day
  `));

  addWordList('duo food', importSimplePairs(`
    n-kaffe coffee
    t-æg egg
    n-kylling chicken
    n-tallerken plate
    n-appelsin orange
    n-vin wine
    n-fisk fish
    n-kartoffel potato

    t-sukker sugar
    n-frokost lunch
    n-morgenmad breakfast
    n-saft juice
    n-frugt fruit
    n-pasta pasta
    n-ost cheese
    is = ice cream

    n-øl beer
    n-bøf steak
    n-suppe soup
    n-tomat tomato
    n-jordbær strawberry
    n-mad food
    n-citron lemon
    n-kage cake

    n-olie oil
    t-salt salt
    t-kød meat
    t-måltid meal
    n-te tea
    n-svinekød pork
    n-vegetar vegetarian
    n-aftensmad dinner
  `));

  addWordList('duo animals', importSimplePairs(`
    n-hest horse
    n-elefant elephant
    n-and duck
    n-skildpadde tortoise
    n-fugl bird
    n-kat cat

    n-bjørn bear
    n-mus mouse
    n-krabbe crab
    n-hund dog
    t-dyr animal

    n-ugle owl
    n-edderkop spider
    n-løve lion
  `));

  addWordList('duo definites', importSimplePairs(`
    mælken
    sandwichen
    barnet
    bogen
    kaffen
    ægget
    kyllingen
    appelsinen
    tallerkenen

    vinen
    fisken
    sukkeret
    frokosten
    morgenmaden
    saften
    pastaen
    osten
    frugten

    æblerne
    frugterne
    bøgerne
    ænderne
    hestene
    aviserne
    kattene
    dyrene
    hundene

    øllen
    bøffen
    suppen
    skildpadderne
    bjørnene
    risene
    tomaten
    jordbæret
    maden

    citronen
    olien
    saltet
    kødet
    måltidet
    børnene
    vegetarerne
    teen
    svinekødet

    vegetaren
    aftensmaden
    fuglene
    dyret
    appelsinerne
    elefanterne
    kagen

    anden
    sandwichene
    tallerknerne
    skildpadden
    elefanten
    hesten

    kartoflen
    bjørnen
    edderkoppen
    krabben
    øllene
    musen
  `));

  addWordList('duo plurals', importSimplePairs(`
    bøger
    aviser
    katte
    hunde
    heste
    ænder

    fugle
    børn
    frugter
    tallerkner
    appelsiner
    æbler

    elefanter
    bjørne
    kartofler
    vegetarer
    skildpadder
    sandwiches
  `));

  addWordList('duo genitive', importSimplePairs(`
    mands
    mandens
    kvindes
    kvindens
    bjørnens

    andens
    drengs
    piges
    drengens
    pigens

    kvindernes
    mændenes
    mænds
    kvinders
    fiskens
  `));

  addWordList('duo possessive pronoun', importSimplePairs(`
    min, mit, mine = my
    din, dit, dine = your (singular)
    hans his
    hendes her (possessive)

    deres their
    jeres your (plural)
    vores our
    dets its
    dens its

    //sin, sit, sine = self's
  `));

  addWordList('duo objective pronoun', importSimplePairs(`
    hende her (objective)
    ham him
    mig me
    dig you (objective singular)
    dem them

    det it (objective)
    den it (objective)
    os us
    jer you (objective plural)
  `));

  addWordList('duo clothing', importSimplePairs(`
    n-skjorte shirt
    n-kjole dress
    n-sko shoe
    n-frakke coat
    n-nederdel skirt
    jakke jacket
    har has
    på

    n-hat hat
    n-bukser trousers
    jakkesættet = the suit
      t-jakkesæt suit
    t-tøj clothes
    n-strømpe = sock, stocking
  `));

  addWordList('duo present 1', importSimplePairs(`
    skriver writes
    rører touches
    går = goes, walks
    svømmer swims
    ser sees
    løber runs
    sover sleeps

    koger cooks
    laver does
    synger sings
    gerne gladly
    vil = want, will
    have have

    leger plays
    spiller plays
    lide suffers
    kan can
    godt good
    betaler pays

    bruger uses
    tager takes
    afsted off
    elsker loves
    regner rains
    fortæller tells
    om about

    hører hears
    lytter listens
    til to
    ved by
    finder finds
    arbejder works

    støtter supports
    behøver needs
    kender knows
    designer designs
    viser shows
    får get
  `));

  addWordList('duo colours', importSimplePairs(`
    rød red
    hvid white
    gul yellow
    blå blue
    sort black
    grøn green
    den the

    farve colour
    lilla purple
    brun brown
    orange orange
    farverigt colourfully
    grå grey
    lys light
    mørke dark

    lyseblå = light blue
    lysegrøn = light green
    lyserød pink
    mørkeblå = dark blue
    mørkerød = dark red
    mørkegrøn = dark green
  `));

  addWordList('duo questions', importSimplePairs(`
    hvor where
    hvordan how
    hvad what
    hvorfor why
    hvem who
    hvis if

    hvilken which
    hvilket which
    hvornår when
    har has
    spørgsmål question
    svar answer
    hvilke which
  `));

  addWordList('duo prepositions 1', importSimplePairs(`
    fra from
    danmark Denmark
    i in
    ved by

    uden without
    med with
    om about
    til to

    efter after
    under under
    af of
    bag before

    nær near
    tilbage back
    omkring around
    som as

    før before
    for for
    mellem between
    på
  `));

  addWordList('duo conjunctions', importSimplePairs(`
    hvis if
    fordi because
    eller or
    men but
    når when
    mens while
    at that
    om = about, if
  `));

  addWordList('duo time', importSimplePairs(`
    n-dag day
    i dag = today
    i morgen = tomorrow
    n-aften evening
    n-eftermiddag afternoon
    n-tid time
    om about
    n-formiddagene = the morning
      n-formiddag morning

    n-kalender calendar
    mandag Monday
    tirsdag Tuesday
    onsdag Wednesday
    torsdag Thursday
    fredag Friday
    nat night
    hverdage weekdays

    lørdag Saturday
    søndag Sunday
    t-år year
    n-uge week
    n-måned month
    n-time hour
    n-alder age
    n-weekend weekend

    januar January
    februar February
    marts March
    april April
    maj May
    juni June
    n-dato date

    november November
    december December
    n-sæson season
    juli July
    august August
    september September
    oktober October

    n-vinter Winter
    t-minut minute
    forår Spring
    sommer Summer
    efteråret Autumn
    t-århundred century
    n-perioderne = the periods
      n-periode period

    n-fest party
    n-scene stage
    n-generation generation
    t-øjeblik moment
      i øjeblikket = at the moment
    n-fødsel birth
    n-midnat midnight
    t-marked = market, fair

    t-årti decade
    t-sekund second
    n-smule bit
    indtil until
    n-middag = midday, noon
  `));

  addWordList('duo family', importSimplePairs(`
    sønnerne = the sons
      n-søn son
    n-søster sister
    n-datter daughter
    n-bror brother
    n-far father
    n-mor mother
    forældre parents
      n-forælder parent

    t-ægteskab marriage
    n-familie family
    n-tante aunt
    n-onkel uncle
    n-søskende sibling
    n-mand husband
    n-kone wife

    t-navn name
    n-bedstemor grandmother
    n-bedstefar grandfather
    leg play
    legetøj toy
    n-bamse = teddy bear
    n-gæst guest
  `));

  addWordList('duo occupation', importSimplePairs(`
    doktor doctor
    n-model model
    t-personalet = the staff
      personale staff
    n-studerende student
      studerende students
      den studerende = the students
    arbejde worker
    t-job job
    n-forfatter author

    arbejderne = the workers
      arbejdere workers
    t-politiet police
      politi police
    n-karriere career
    n-advokat lawyer
    n-direktør manager
    n-sekretærer secretaries
      n-sekretær secretary
    n-kunstner artist
    n-ninja ninja

    n-kaptajn captain
    n-vagt guard
    n-skuespiller actor
    n-dommer judge
    betjent officer
    n-professionel professional
    n-soldat soldier
    n-borgmester mayor

    n-chef boss
    n-landmand farmer
    n-arkitekt architect
    n-ingeniør engineer
    n-kok cook
    t-erhverv profession
    n-tjener waiter
    n-servitrice waitress
  `));

  addWordList('duo adjectives 1', importSimplePairs(`
    lille little
    små small
    tosproget bilingual
    træt tired
    samme same
    næste next
    generelt general
    rigtig real

    lokale local
    speciel special
    åbent open
    egen own
    private private
    personlig personal
    stor big
    fantastisk fantastic

    venstre left
    anderledes different
    rene pure
    beskidt dirty
    lovlige legal
    menneskelig human
    nylige recent
    dansk danish

    vigtig important
    levende living
    tilgængeligt available
    populært popular
    mulige possible
    fremtidig future

    officielt official
    endeligt final
    nødvendige necessary
    militær military
    uafhængigt independent
    ansvarligt responsible
    hel whole

    moderne modern
    perfekte perfect
    smukt beautiful
    normal normal
    positivt positive
    fremragende excellent
    ond evil

    historisk historical
    interessant interesting
    traditionelle traditional
    religiøse religious
    seriøst serious
    forkerte wrong
    kulturel cultural

    dyre expensive
    umuligt impossible
    negative negative
    berømte famous
    effektive = effective, efficient
    velkendt = familiar, well-known
    live live
    underlig strange

    modsat opposite
    bange scared
    praktisk practical
    bekvemme convenient
    triste sad
    ked sorry
    hyppigt frequent
    sjov = fun, funny
  `));

  addWordList('duo present 2', importSimplePairs(`
    åbner opens
    tænker thinks
    ændrer changes
    kalder calls
    ringer calls
    redder saves
    gemmer hides
    sig says

    kigger looks
    bor lives
    lever plays
    kommer comes
    studerer studies
    tilbyder offers
    giver gives

    prøver tries
    underskriver signs
    inkluderer includes
    spørger asks
    præsenterer presents
    taler talks

    afmærker marks
    føler feels
    husker remembers
    stopper stops
    ønsker wishes
    synes thinks
    står stands

    håber hopes
    søger searches
    svigter fails
    rækker hands
    opdrager raises
    tror believes

    følger follows
    takker thanks
    overvejer considers
    returnerer returns
    vender waits
    danser dances

    hviler rests
    svarer answers
    begynder begins
    slutter finishes
    stoler trusts
  `));

  addWordList('duo adverbs', importSimplePairs(`
    meget = very, much
    nu now
    så = so, that // it is not so different
    der there
    for too
    mere more
    hen // hen til = over, to

    aldrig never
    altid always
    også also
    her here
    ret = right, pretty // pretty tired
    derefter then
    henne at // hvor er du henne

    stadig still
    kun only
    bare only
    godt good
    selv = self, only
    engang once
    endda even
    imidlertid however

    virkelig really
    igen again
    endnu yet
    væk away
    allerede already
    mindste minimum
    nogensinde ever
    lidt little

    lang, langt, lange = long
    ellers = or else
    senere later
    sædvanligvis usually
    tilstrækkeligt enough
    øjeblikket = the moment
    snart soon
    længe long

    næsten almost
    endelig finally
    nemt easy
    sommetider sometimes
    tidligt early
    sent late
    især especially
    generelt generally

    muligvis possibly
    tydeligt clearly
    fuldstændigt completely
    omtrent approximately
    præcist exactly
    ude out
    inde in

    hverken neither
    normalt normally
    sammen together
    nødvendigvis necessarily
    bestemt specific
    langsomt slowly
    perfekt perfect
    lige just
  `));

  addWordList('duo places', importSimplePairs(`
    t-hus house
    t-hotel hotel
    badeværelset = the bathroom
      t-badeværelse bathroom
    n-strand beach
    t-køkken kitchen
    n-gård farm
    restauranten = the restaurant
      n-restaurant = restaurant
    udenfor outside

    n-lufthavn airport
    kirker churches
      n-kirke church
    slotte castles
      t-slot castle
    t-land country
    n-gade street
    byer = cities, towns
      n-by = city, town
    t-sted place

    langs along
    t-kontor office
    områderne = the areas
      t-område area
    t-hjem home
    ind in
    centrum = centre, shopping mall
    plads = place, space, square
    n-stue = living room

    adresserne = the addresses
      n-addresse address
    afdelingen = the department
      n-afdeling = department
    n-ejendom property
    t-rum room
    n-bygning building
    parken = the park
      n-park park
    soveværelser bedrooms
      t-soveværelse bedroom
    distrikterne = the districts
      t-distrikt district

    n-have garden
    øerne = the islands
      n-ø island
    n-bank bank
    barerne = the bars
      n-bar bar
    n-region region
    foran = in front of
    derinde = in there
    t-værelse room

    n-station station
    jorden = the ground
      n-jord ground
    t-museum museum
    dalene = the valleys
      n-dal valley
    kysten = the coast
      n-kyst coast
    indenfor within
    n-zone zone
    derude = out there

    nabolag neighbourhood
    ruten = the route
      n-rute route
    n-grænse border
    hjørnet = the corner
      t-hjørne corner
    t-tårn tower
    n-biograf cinema
    n-boulevard boulevard
    derhenne = over there

    t-fængsel prison
    n-hovedstad capital
    paladserne = the palaces
      t-palads palace
    samfund community
    n-landsby village
    havnen = the port
      n-havn port
    t-center = centre

    højre right
    torvet = the square
    oven top
    vest west
    norden north
    n-bondegård farm
    zoologisk have = zoo
  `));

  addWordList('duo objects', importSimplePairs(`
    n-stol chair
    t-bord table
    n-seng bed
    skålen = the bowl
      n-skål bown
    n-ske spoon
    flaskerne = the bottles
      n-flaske bottle
    blad magazine

    vinduerne = the windows
      t-vindue window
    t-fjernsyn = television
    n-radio radio
    t-spejl mirror
    urene = the clocks ???
      t-ur clock
    n-mobiltelefon = mobile, cellphone
    computeren = the computer
      n-computer computer

    n-sofa sofa
    n-lampe lamp
    skrivebordet = the desk
      t-skrivebord = desk
    n-kurv basket
    t-armbåndsur watch
    t-batteri battery
    n-sæbe soap

    pung purse
    døren = the door
      n-dør door
    skærmene = the screens
      n-skærm screen
    n-kasse box
    sengetøjet bedclothes
    t-tv tv
    n-skraber = razor, scraper
    barberer shaves

    tandpastaen = the toothpaste
      n-tandpasta toothpaste
    n-væg wall
    telefoner = telephones
      n-telefon telephone
    n-taske bag
    hjulene wheels
      t-hjul wheel
    n-paraply umbrella
    t-gulv floor

    t-tag roof
    t-brev letter
    n-svamp sponge
    nøglen = the key
      n-nøgle key
    t-skab cabinet
    t-svømmebassin = swimming pool
    n-ting thing

    n-saks scissors
    n-klokke bell
    t-glas glass
    n-kop cup
    n-pande pan
    papirerne = the papers
      t-papir paper
    n-maskine machine

    snor string
    arket = the sheet
      t-ark sheet
    genstand object
    n-motor = motor, engine
    t-stykke piece
    pakkerne = the packages
      n-pakke package

    n-rod root
    t-flag flag
    n-kæden chain
    roman novel
    pulveret = the powder
      t-pulver powder
    n-kam comb

    tandbørsten = the toothbrush
      t-tandbørst toothbrush
    n-gaffel fork
    n-kniv knife
    n-gave gift
    t-smykke = piece of jewelry
  `));

  addWordList('duo animals 2', importSimplePairs(`
    girafferne = the giraffes
      n-giraf giraffe
    n-hval whale
    n-abe monkey
    n-delfin dolphin
    n-haj shark
    t-kæledyr pet
    n-tiger tiger

    n-ko cow
    n-pingvin penguin
    n-gris pig
    n-vandmand jellyfish
    n-ræv fox
    n-ulv wolf
    n-hjort deer
    t-husdyr = domestic animals, livestock

    n-kanin rabbit
    n-myre ant
    t-insekt insect
    n-orm worm
    n-svane swan
    n-isbjørn = polar bear
    n-egern squirrel
    n-høne hen

    t-får sheep
    n-måge seagull
    solsortene = the blackbirds
    grævling badger
    slangerne = the snakes
      n-slange snake
    n-pindsvin hedgehog
    n-enhjørning unicorn
  `));

  addWordList('duo people', importSimplePairs(`
    n-person person
    n-fjende enemy
    n-ven friend
    n-offentligheden = the public
    n-kæreste = girlfriend, boyfriend
    n-baby baby

    mennesker people, humans
      t-menneske human
    t-ungdom youth
    n-kultur culture
    n-befolkningen = the population
      n-befolkning population
    n-konference conference
    fundament foundation
    komite committee

    t-forhold relationship
    t-individ individual
    t-par couple
    n-dame lady
    n-borger citizen
    t-offer victim
    t-ofre victims
    t-folk people
  `));

  addWordList('duo determiners', importSimplePairs(`
    den it
    det it
    denne this
    dette this
    disse these
    én one

    de they
    ingen none
    intet nothing
    alle all
    hver each

    nogen someone
    noget something
    både both
    anden other
    hinanden = each other
    andre others

    helst
      hvor som helst = anywhere
    ingenting nothing
    alting everything
    få few
      færre fewer
    sådan such // such a fish ...
      sådanne such
  `));

  addWordList('duo prepositions 2', importSimplePairs(`
    iblandt = among, amongst
    undtagen except
    ligesom like // she plays like the boys
    blandt = among, amongst
    over = over, above
    imod = against, towards

    ifølge = according to
    gennem through
    grundet = because of, due to
    forbi = past, over
    henimod towards

    ud out
    op up
    ned down
    hos with
    ad of
    grund reason
  `));

  addWordList('duo travel', importSimplePairs(`
    rejser
    bil car
    cykel bicycle
    bus bus
    kuffert suitcase
    togene = the trains

    kører drives
    motorcykel motorbike
    båden = the boat
    rygsæk = rucksack, backpack
    fly
    besøg visit
    guide guide

    spansk
    portugisisk
    kort map
    vej way
    skib ship
    køretøjerne
    transport
    brasilianske
    flydende fluent

    eventyrene
    bro bridge
    italiener
    franskmand frenchman
    flyvemaskine aeroplane
    tur = trip
    flyvetur flight

    rejsen
    tyske
    afrejse
    turist tourist
    frankrig
    undergrundsbanen
    amerika America

    fransk
    tyskland Germany
    europa Europe
    england England
    syd south
    udenlands abroad
    kina China

    international
    italiensk
    amerikanske
    kinesisk
    europæer European
    pas passport
    rundt round
    drejer turns
  `));

  addWordList('duo numbers', importSimplePairs(`
    to two
    tre three
    fire four
    en one
    fem five
    nogle some
    flere more

    seks six
    syv seven
    ti ten
    otte eight
    ni nine
    mindre less
    mange many

    sidste last
    første first
    numre numbers
    million million
    tredje third
    mængder amounts
    tal

    elleve eleven
    tolv twelve
    tretten thirteen
    fjorten fourteen
    femten fifteen
    seksten sixteen
    sytten seventeen

    atten eighteen
    nitten nineteen
    tyve twenty
    tredive thirty
    fyrre forty
    halvtreds fifty
    tres sixty
    begge both

    halvfjerds seventy
    firs eighty
    halvfems ninety
    hundred hundred
    nok enough
    tusind thousand
    sum
    gang
    klokken = o'clock

    fjerde fourth
    meter metre
    gennemsnit average
    flertal majority
    halvdelen half
    per per
    antal number
    totale total
  `));

  addWordList('duo past 1', importSimplePairs(`
    spiste ate
    drak drank
    talte spoke
    gik went
    var was
    lavede made

    går
    elskede loved
    kunne could
    ville wanted
    hørte heard
    regnede rained

    spillede played
    nylig recent
    så saw
    lyttede listened
    havde had
    sagde said
    kaldte called

    født born
    fandt found
    fødte = gave birth
    lagde put
    fortalte told
    brugte used
    forlod left

    skrev wrote
    ringede = called, rang
    tænkte thanked
    mistede lost
    kom came
    tog took
    legede played

    døde died
    informerede informed
    gav gave
    prøvede tried
    støttede supported
    blev became
    vendte turned

    kiggede looked
    slog hurt
    fik got
    fat hold
    svarede answered
    faldt fell
    snakkede talked
    viste showed
  `));

  addWordList('duo infinitive 1', importSimplePairs(`
    plejer usually
    at skrive = to write
    at gå = to go, to walk
    at svømme = to swim
    at være = to be
    at se = to see
    at sove = to sleep
    at drikke = to drink

    at gøre = to do
    besluttede = decided
      at beslutte = to decide
    at løbe = to run
    at betale = to pay
    at lave = to make
    at lege = to play
    at bruge = to use
    at bo = to live

    plejede = used to
    at tale = to talk
    at spille = to play
    at elske = to love
    at tillade = to allow
    at lade = to let
    at komme = to come
    at tage = to take

    at regne = to rain
    at høre = to hear
    at lytte = to listen
    at lukke = to close
    at leje = to rent
    at sige = to say
    at røre = to touch

    at fortælle = to tell
    at hjælpe = to help
    at finde = to find
    at stille = to ask
    at få = to get
    at hente = to pick up
    at øve = to increase
    at blive = to become

    at købe = to buy
    at tilføje = to add
    at vide = to know
    at arbejde = to work
    at putte = to put
    at placere = to place
    at nå = to reach
    at køre = to drive

    at vise = to show
    at åbne = to open
    at tænke = to think
    at ændre = to change
    at returnere = to return
    at ringe = to call
    at besøge = to visit
    at sætte = to put
    at træne = to train

    at lære = to learn
    at kigge = to look
    at leve = to live
    at starte = to start
    at studere = to study
    at give = to give
    at virke = to work

    at sælge = to sell
    at begynde = to begin
    at beholde = to keep
    at tilbyde = to offer
    at prøve = to try
    at spørge = to ask
  `));

  addWordList('duo education', importSimplePairs(`
    lærer
    program
    virker
    kuglepenne
    seddel
    skolen
    underviser
    uddannelse
    elever

    bibliotek
    ansøgning
    eksempel
    afsnit
    kurserne
    selvfølgelig
    studierne
    prøve

    ordene
    kapitel
    viden
    øvelse
    time
    klasse
    idé
    lektie

    professoren
    institutterne
    præsentation
    forberedelse
    universitet
    forelæsninger
    forklaring
    vanskelighederne

    dokument
    sider
    målsætning
    rapporterne
    træningen
    undervisning
    betydning
    historie
  `));

  addWordList('duo present 3', importSimplePairs(`
    indeholder contains
    respekterer respects
    bliver
    går = goes, walks
    køber buys
    råber yells

    syne
    tæller counts
    savner misses
    regner rains
    sælger sells
    ryger smokes
    glæder = looks forward to

    fylder fills
    producerer produces
    blander mixes
    dukker = pop up
    sidder = sits
    falder falls
    passer fits

    flyver flies
    importerer imports
    hjælper helps
    fortsætter continues
    stjæler steals
    henter = picks up

    hader hates
    antager assumes
    leverer delivers
    forlader leaves
    ødelægger destroys
    annoncerer announces

    tilføjer adds
    serverer serves
    efterlader leaves
    tørrer dries
    putter puts
    dækker covers

    besøger visits
    kræver = needs, desires
    forklarer explains
    ankommer arrives
    modtager receives
    vinder wins
    lægger puts

    reserverer reserves
    ligger lies
    cykler cykles
    skærer cuts
    sætter puts
    stiller puts
    tillader allows
  `));

  addWordList('duo abstract objects 1', importSimplePairs(`
    udsigt view
    liste list
    del part
    system system
    kærlighed love
    service service
    anmeldelser

    ordrer orders
    gruppe group
    vejen = the way
    måde meeting
    typer types
    design design
    tilfælde
    version version

    medlemmerne
    kontrol control
    opkald call
    kontoer accounts
      konto account
    profiler profiles
    ændringerne = the changes
    niveauet = the level
      t-niveau level

    beskrivelserne = the descriptions
    indholdet = the contents
    kategori category
    udstyr equipment
    billederne = the pictures
      t-billede picture
    værdi value
    handling action

    t-problem problem
    n-side page
    mulighed possibility
    resultat result
    n-aktivitet = activity
    forestilling

    n-løsning solution
    n-beskyttelse protection
    n-produktion production
    n-aftalerne = the agreements
      n-aftale agreement
    n-tur = trip, tour
    n-konstruktion construction

    t-håb hope
    t-ønske wish
    indgange entrances
      n-indgang entrance
    t-sind mind
    n-effekt effect
    forening = club, union
    chancen = the chance
      n-chance chance

    t-valg choice
    n-stemme voice
    n-rolle role
    formålet = the purpose
      t-formål purpose
    n-grad degree
    t-emne = topic, matter, subject
    t-bevis = proof, evidence

    n-introduktion introduction
    n-pris prize
    n-succes success
    n-hvile rest
    kræfter powers
      kræft power
    fag subject
    n-karakter = character, grade

    t-mørke darkness
    t-alternativ alternative
    n-kant edge
    slags = kind of // en slags hund
    optegnelse record
    n-hukommelse memory
  `))

  addWordList('duo past 2', importSimplePairs(`
    gjorde did
    rørte touched
    returnerede
    drejede turned
    åbnede opened
    stoppede stopped
    stod stood

    dukkede appeared
    forklarede explained
    forekom happened
    da = then, as
    vandt won
    skete happened
    sad sat

    opdagede discovered
    efterlod left
    fulgte followed
    introducerede introduced
    spurgte asked
    bad asked
    lå lay

    optrådte performed
    præsterede
    tilføjede added
    huskede remembered
    beholdte kept
    kendte knew

    begyndte began
    løb ran
    følte felt
    lod let
    mærkede noticed
    troede believed
    satte sat

    virkede worked
    arbejdede worked
    vidste showed
    sluttede finished
    behøvede needed
    startede started
  `));

  addWordList('duo adjectives 2', importSimplePairs(`
    stor big
    små small
    ny new
    god good
    gammel old
    end than
    færdig done
    klog clever

    mindre less
    større bigger
    ung young
    ældre older
    yngre younger
    smukt beautiful
    fulde = full, drunk
    sur angry
    flest most

    smukkere = more beautiful
    gratis free
    fri free
    bedste best
    lang long
    renere cleaner
    mæt // satiated
    største largest
    mest most

    billigere cheaper
    hård hard
    kort = map, short
    varme hot
    bedre better
    dårlig bad
    stand able
    forfærdelig terrible
    bedst best

    hurtig fast
    klar ready
    glad happy
    stærk strong
    sandt true
    simpel simple
    dejligt lovely
    sulten hungry
    flot great

    dyb deep
    fattig poor
    rig rich
    kold cold
    sød sweet
    retfærdige // righteous
    skarpe sharp
    tørstig thirsty

    alene alone
    svag weak
    sikker safe
    værre worse
    værst worst
    høj high
    klar clear
    forskellige various
    kedeligt = dull, boring
  `));

  addWordList('duo present perfect', importSimplePairs(`
    har
    læst
    gået
    været
    lavet
    villet
    blevet

    regnet
    spillet
    hørt
    spist
    talt
    tidligere
    forrige

    set
    haft
    siden
    betalt
    fortalt
    kommet
    forladt

    givet
    skrevet
    gjort
    sat
    ringet
    kaldt

    modtaget
    taget
    mistet
    sendt
    spurgt
    udviklet
    for

    præsenteret
    lukket
    produceret
    mødt
    prøvet
    ændret
    fået

    følt
    fulgt
    forberedt
    tvunget
    introduceret
    optrådt

    reduceret
    vundet
    åbnet
    bestilt
    boet
    stoppet
    ankommet

    antaget
    tilladt
    kendt
    drukket
    sagt
    passeret
    afsluttet
    savnet
  `));

  addWordList('duo danish food', importSimplePairs(`
    grøntsag
    boller buns
      n-bolle bun
    smør butter
    rugbrød = rye bread
    krydderi spice

    chokolade chocolate
    lakrids liquorice
    leverpostej = liver pate
    sild herring
    wienerbrød = Danish pastry
    æbleskive

    n-tærte = pie, tart
    rødkål
    fløde cream
    frikadelle meatball
    flæskesteg
    slikket = the lick, licked
      n-slikke lick

    spejlæg
    pandekage pancake
    risengrød
    agurk cucumber
    koldskål

    nød nut
    risalamande
    rødgrød
    n-pølse sausage
  `));

  addWordList('duo relative pronouns', importSimplePairs(`
    hvis whose
    som = that, which
    der = that, which
    hvad what
  `));

  addWordList('duo indefinite pronouns', importSimplePairs(`
    man you
    én one
    ens = one's
  `));

  addWordList('duo infinitive 2', importSimplePairs(`
    snakke
    svare
    møde
    vælge
    huske
    føle
    dække
    øge

    besvare
    bygge
    fortsætte
    stoppe
    tro
    ansøge
    efterlade
    forlade

    vinde
    forbedre
    lader
    selvom
    skære
    kan
    falde

    gentage
    forstå
    udvikle
    lad
    vække
    overveje
    slikke

    dø
    enig
    tælle
    acceptere
    savne
    optræde
    passe

    undgå
    vente
    forhindre
    servere
    producere
    definere

    opnå
    slå
    forklare
    eksistere
    påvirke
    færdiggøre
    nå

    antage
    miste
    glemme
    hade
    introducere
    forberede
    synge

    høre
    lukke
    lide
    analysere
    læse
    spise
    komme
  `));

  addWordList('duo medical', importSimplePairs(`
    n-hånd hand
    kroppen = the body
      n-krop body
    t-øje eye
    t-hoved head
    t-helbred health
    syg sick
    behandlingen = the treatment, the care
      n-behandling = treatment, cure
    at behandle = to treat
    brug = need, use
    hænder hands
      n-hånd hand
    øjne eyes
      t-øje eye

    n-læge doctor (medical)
    n-hjælp help
    n-nødsituation emergency
    n-helbredelse cure
    t-hjerte heart
    t-ansigt face
    n-medicin medicine
    n-kræft cancer

    t-blod blood
    n-ambulance ambulance
    t-hår hair
    t-sygehus hospital
    n-patient patient
    n-sygdom = disease, illness
    n-operation operation

    n-hud skin
    n-fod foot
    n-kost diet
    t-syn sight
    n-smerte pain
    n-virus virus
    lægemiddel drug
    lægemidlerne drugs
    fødder feet
      n-fod foot
    virusser viruses
      n-virus virus

    n-hjerne brain
    n-drøm dream
    n-arme arm
    n-mund mouth
    n-hals neck
    n-ben leg
    benene legs
      t-ben leg
    n-ulykken accident
    at græde = to cry
    n-nakke neck

    n-finger finger
    fingre fingers
    t-øre ear
    ørene ears
    n-tand tooth
    tænder teeth
    n-tunge tongue
    nakke
    ondt = pains, a pain
    at vaske = to wash
    n-mave stomach

    n-næse nose
    n-læbe lip
    læber lips
    n-ryg back
    ryggen back
    n-tilstand condition
    n-tid = time, appointment
    n-sygeplejerske nurse
    n-brystkasse chest
  `));

  addWordList('duo modality', importSimplePairs(`
    kan can
    må = are allowed
    kunne could
    skal shall
    ville wanted
    skulle should (past)

    da really
    vist
    burde ought (past)
    bør ought
    tør dare

    måtte = were allowed
    vil will
    nok = probably, supposedly, enough
    jo yes
    turde dared
  `));

  addWordList('duo past perfect', importSimplePairs(`
    havde = had
    havde hørt = had heard
    havde spist = had eaten
    havde fundet = had found
    havde givet = had given
    havde gået = had gone ?
    var gået = had gone ?
    var kommet = had come

    havde skrevet = had written
    havde mistet = had lost
    havde taget = had taken
    havde skåret = had cut
    havde ringet = had called
    havde kaldt = had called
    havde etableret = had established

    havde lukket = had closed
    havde prøvet = had tried
    havde følt = had felt
    havde åbnet = had opened
    havde ledt = had led
    havde besluttet = had decided

    havde boet = had lived
    havde opdaget = had discovered
    var ankommet = had arrived
    havde antaget = had assumed
    havde fortjent = had deserved
    havde kendt = had known
  `));

  addWordList('duo abstract objects 2', importSimplePairs(`
    n-religion religion
    n-titel title
    n-indsats effort
    fordelene = the benefits
      n-fordel benefit
    n-situation situation
    respekt respect
    n-ondskab malice

    n-konkurrence competition
    t-liv life
    opmærksomme attentive
    tilladelse permission
    n-sandhed truth
    n-interesse interest (hobby)
    n-rente interest (financial)
    læs loads
    n-tro faith

    n-fiasko failure
    t-signal signal
    n-karakter character
    n-hemmeligheder secret
    n-skade damage
    n-virkelighed reality
    n-oprindelse origin

    n-retning direction
    n-mangel shortcoming
    t-forsøg attempt
    målet = the goal, the aim
      t-mål = goal, aim
    n-underskrift signature
    opførsel behaviour
    t-jubilæum anniversary

    t-symbol symbol
    stilling position
    udgangen = the exit
      n-udgang exit
    n-oplevelse experience
    n-styrke strength
    n-cirkel circle
    heldig lucky
    // Din heldig kartoffel = lucky you (if you want to sound like a 60-year-old)

    frygten = the fear
      n-frygt fear
    n-form shape
    t-had hatred
    n-plads = square, place, space
    relation
    n-tvivl doubt
    n-humor humour

    rummet = the room
      t-rum = room, space
    t-ansvar responsibility
    konsekvenserne = the consequences
      n-konsekvens
    n-fornøjelse pleasure
    n-eksistens existence
    n-lykke = luck, good fortune

    overraskelsen = the surprise
      n-overraskelse surprise
    samtaler conversations
      n-samtale conversation
    traditioner traditions
      n-tradition tradition
    n-skyld = guilt, blame
    n-tjeneste favour
    n-trend trend
    n-sætning sentence

    mordene = the murders
      t-mord murder
    t-smil smile
    n-ære honour
    n-glæde joy
    n-fare danger
    holdning behaviour
    n-fejl = mistake, fault, error

    n-skygge shadow
    minder memories
    n-indgang entrance
    erfaring experience
    n-penge money
  `));

  addWordList('duo nature', importSimplePairs(`
    n-blomst flower
    træerne = the trees
      t-træ
    t-græs grass
    himlen = the sky
      n-himmel sky
    månen = the moon
      n-måne moon
    n-sol sun
    t-hav sea

    n-verden = world
      verden = the world
    n-regn rain
    farligt dangerous
    ilden = the fire
      n-ild fire
    marker
    t-korn grain
    luften = the air
      n-luft air
    vulkaner volcanoes
      n-vulkan volcano

    vejret = the weather
      n-vejr
    n-natur nature
    n-jord ground
    n-stjerne star
    floden = the river
      n-flod river
    bjerge mountains
      t-bjerg mountain
    t-brænde = wood, firewood

    skovene forests
      n-skov forest
    n-sten stone
    n-vind wind
    roser roses
      n-rose rose
    n-planet planet
    varmen = the heat
      n-varme heat
    søen = the lake
      n-sø lake
    uvejr = bad weather

    klimaet = the climate
      klima climate
    universer universes
      t-univers universe
    n-røg smoke
    blade leaves
      t-blad leaf
    t-landskab landscape
    t-lys light
    n-jungle jungle
    n-sky cloud

    n-plante plant
    n-sand sand
    t-støv dust
    t-materiale material
    n-gas gas
      gasser gases
    afgrøderne = the crops
      n-afgrøde crop
    bakken = the hill
      n-bakke hill
    regnbuen = the rainbow
      n-regnbue rainbow
  `));

  addWordList('duo progressive', importSimplePairs(`
  `));

  addWordList('duo ref pronouns', importSimplePairs(`
  `));

  addWordList('duo sports', importSimplePairs(`
  `));

  addWordList('duo com pronouns', importSimplePairs(`
  `));

  addWordList('duo passive present', importSimplePairs(`
  `));

  addWordList('duo arts', importSimplePairs(`
  `));

  addWordList('duo communication', importSimplePairs(`
  `));

  addWordList('duo politeness', importSimplePairs(`
  `));

  addWordList('duo present participles', importSimplePairs(`
  `));

  addWordList('duo imperative', importSimplePairs(`
  `));

  addWordList('duo politics', importSimplePairs(`
  `));

  addWordList('duo future', importSimplePairs(`
  `));

  addWordList('duo passive past', importSimplePairs(`
  `));

  addWordList('duo business', importSimplePairs(`
  `));

  addWordList('duo kitchen', importSimplePairs(`
  `));

  addWordList('duo attributes', importSimplePairs(`
  `));

  addWordList('duo future perfect', importSimplePairs(`
  `));

  addWordList('duo science', importSimplePairs(`
  `));

  addWordList('duo events', importSimplePairs(`
  `));

  addWordList('duo continuous perfect', importSimplePairs(`
  `));

  addWordList('duo spiritual', importSimplePairs(`
  `));

  addWordList('duo danish culture', importSimplePairs(`
  `));

  addWordList('duo once upon', importSimplePairs(`
  `));

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

  addWordList('nouns', importSimplePairs(`
adress	address
advokat	lawyer
æble	apple
æg	egg
ægteskab	marriage
afdeling	department
aftensmad	dinner
and	duck
appelsin	orange
arbejde	worker
arkitekt	architect
armbåndsur	watch
avis	newspaper
bad	bath
badeværelse	bathroom
bamse	teddy bear
bank	bank (money??)
bar	bar (pub)
barn	child
batteri	battery
bedstefar	grandfather
bedstemor	grandmother
betjent	cop???
biograf	cinema
bjørn	bear
blad	magazine
bøf	beef
bog	book
bondegårde	farm
bord	table
borgmester	mayor
børn	children
boulevard	boulevard
brød	bread
bror	brother
bukserne	the trousers
by	city, town
bygning	building
centrum	centre
chef	boss
citron	lemon
computer	computer
dal	valley, dale
datter	daughter
den studerende	the student
derhenne	over there
direktør	manager
distrikt	district
doktor	doctor
dommer	judge
døtre	daughters
dotrene	the daughters
drengen	the boy
dyr	animal
edderkop	spider
ejendom	property (building??)
elefant	elephant
enhjørning	unicorn
erhverv	profession
fængsel	jail
familien	the family
far	father
fest	party
fisk	fish
fjernsyn	television
flask	bottle
fødsel	birth
forældre	parents
forfatter	author
frakken	the coat
frokost	lunch
frugter	fruit
fugle	bird
gad	street
gæst	guest
gård	garden (US: yard)
generation	generation
græns	border
hatten	the hat
hav	garden
havn	harbour, port
hesten	the horse
hjem	home
hjørn	corner
højre	right (direction)
hotel	hotel
hovedstad	capital (city)
hund	dog
hus	house
ingeniør	engineer
is	ice cream
jakke	jacket
jakkesættet	the suit
jobbet	the job
jord	ground, earth, Earth
kage	cake
kaptaijn	captain
karriere	career
kartoffel	potato
kat	cat
kirke	church
kjolen	the dress
kød	meat
kokken	cook
kokken	kitchen
kone	wife
kontor	office
krabbe	crab
kunstner	artist
kurv	basket
kvinden	the woman
kylling	chicken
kyster	coast
lampe	lamp
land	country
landmand	farmer
landsby	village
leg	game
legetøj	toy
løve	lion
lufthavne	airport
mad	food
mælk	milk
måltid	meal
mand	husband
manden	the man
marked	fair
menuen	the menu
mobiltelefon	cellphone, mobile
model	model
mor	mother
morgenmad	breakfast
mus	mouse
museum	museum
nabolag	neighbourhood
navn	name
nederdel	skirt
ninja	ninja
norden	The North
ø	island!
olien	the oil
område	area
onkel	uncle
ost	cheese
palads	palace
park	park
pasta	pasta
personale	staff
pigen	the girl
plads	place, square
politi	police
professionel	professional (adj)
radio	radio
regnbue	rainbow
restaurant	restaurant
ris	rice
rut	route
sæb	soap
saft	juice
salt	salt
samfund	community
sandwich	sandwich
sang	song
scene	stage (performance)
sekretær	secretary
seng	bed
servitrice	waitress
skål	bowl
ske	spoon
skildpadde	tortoise
skjort	the shirt
sko	the shoe
skrivebord	desk
skuespiller	actor
slange	snake
slot	castle
smule	a bit
sofa	sofa
soldater	soldier
søn	son
søskende	siblings
spelj	mirror
station	station
sted	place
stol	chair
strand	beach
strømper	socks
studerende	student
stue	living room
sukker	sugar
suppe	soup
svinekød	pork
tallerken	the plate
tante	aunt
tårn	tower
tjener	waiter
tøjet	clothes
tomat	tomato
torv	square
tur	tour
ugle	owl
ur	clock
værelse	room
vagt	guard
vampyr	vampire
vand	water
venstre	left (not right)
vesten	The West
vin	wine
vindue	window
visen	show
zone	zone
zoologisk have	zoo
dør	door
skrab	razor
skærm	screen
kasse	box
pung	wallet
TV	TV
sengetøj	sheet (bed clothes)
gulv	floor
telefon	telephone
væg	wall
task	bag
paraply	umbrella
hjul	wheel
tandpasta	toothpaste
tandbørst	toothbrush
nøgl	key
svamp	sponge
svømmebassin	swimming pool
brev	letter (correspondence)
skab	cupboard
tag	roof
ting	thing
glass	glass
papir	paper
klokke	bell
pand	pan
maskin	machine
	scissors
kop	cup
styk	piece
motor	motor, engine
ark	sheet (bed)
pak	package
snor	string
genstand	object
flag	flag
roman	novel ("romance")
kæde	chain
pulver	powder
kam	comb
rod	root
kniv	knife
gave	present, gift
smykke	piece of jewelry
gaffel	fork
haj	shark
kæledyr	pet
tiger	tiger
hval	whale
giraf	giraffe
ab	monkey
delfin	dolphin
ulv	wolf
husdyr	livestock / domestic animals
ko	cow
pingvin	penguin
ræv	fox
vandman	jellyfish
hjorte	deer
gris	pig
myre	ant
insekt	insect
svane	swan
kanin	rabbit
høne	hen
orm	worm
egern	squirrel
isbjørn	polar bear
grævling	badger
pindsvin	hedgehog
slanger	snake
får	sheep
solsort	blackbird
måger	seagulls
alder	age
baby	baby
person	person
kæreste	boyfriend/girlfriend
offentlighed	public
fjende	enemy ("fiend")
ven	friend
komite	committee
ungdomme	youth
befolkning	population
konference	conference
fundament	foundation
ungdom	youth
folk	people ("a people")
borger	citizen
par	couple (people)
individ	individual (person)
offer	victim
forhold	relationship
anden	another
cykl	bicycle
bil	car
tog	train
kuffert	suitcase
bus	bus
motorcykel	motorcycle
fly	aeroplane
båd	boat
besøg	visit
guide	guide
køretøj	vehicle
kort	map, card
skib	ship
transport	transport, transportation
vej	way, road
eventyr	adventure
bro	bridge
flyvemaskine	aeroplane ("fly machine")
flyvetur	flight
tur	tour, trip, turn
afrejse	departure
rejse	journey
undergrundsban	Underground (metro, subway)
rum	room
pas	passport
europæer	European
én	one
hinanden	each other
samtale	conversation
rygsæk	rucksack, backpack
system	system
kærlighed	love
del	part
andmendelse	review
liste	list
udsigt	view
gruppe	group
type	type
pung	wallet
design	design
måde	way, method?
ordre	order
vej	way, road
tilfældet	the case (situation, fact)
version	version
indhold	content
handling	act, action, plot
billede	picture
pung	wallet
kategorie	category
udstyr	equipment
værdi	value
beskrivelse	description
mulighed	option, possibility
problem	problem
resultat	result
forestilling	performance
system	system
profil	profile
kontrol	control
opkald	call
medlem	member
niveau	level
konto	account (bank)
ændringer	changes
produktion	production
løsning	solution
aftale	agreement
tur	turn
konstruktion	construction
beskyttelse	protection
forening	club, union
håb	hope
indgang	entrance, entry
sind	mind
ønske	wish
chance	chance
grad	degree (temperature)
formål	purpose
bevis	proof, evidence
stemme	voice
emne	topic, matter, subject
valg	choice
rolle	role
introduktion	introduction
succes	success
hvile	rest
kræft	power
fag	subject
prise	prize
karakter	character, grade
alternativ	alternative
kant	edge
mørk	dark
slags	kind of
hukommelse	memory
optangelse	record (data)
gamle	age, old
færdig	ready
stor	big
klog	smart, clever, wise
mere end	more than
ny	new
hvor gammel	how old
større	bigger
mindre	smaller
ældre	older
sur	angry, sour
ret	pretty
yngre	younger
flest	most, the most
ungt	young
trist	sad
fuld	drunk
lang	long
størst	biggest
mest	most
bedst	best
smukkere	prettier
gratis	free (beer)
fri	free (liberty)
mæt	full (food)
ren	clean
renere	cleaner
kort	short
dårlig	bad
billig	cheap
billigere	cheaper
forfærdelig	terrible
varm	hot (warm)
bedre	better
i stand til	able
hård	hard (physical)
tilgængelig	available
dejlig	lovely
klar	clear, ready
simpel	simple
stærk	strong
sammen	together
flot	pretty
sulten	hungry
glad	happy
hurtig	fast, quick
sand	true
rig	rich (money)
fattig	poor (money)
retfærdig	fair
kold	cold
dyb	deep
skarp	sharp
tørstig	thirsty
sød	sweet (person)
høj	tall
værre	worse
sikker	sure
svag	weak
kedelig	boring
alene	alone
forskellig	different
  `));

  addWordList('adjectives', importSimplePairs(`
åben	open
allerede	already
anderledes	different
ansvarlig	responsible
bange	scared, afraid
bekvem	convenient
berømt	famous
beskidt	dirty
beskidt(e)	dirty
dyr	expensive
egen, egne (pl)	own
endelig	final
fantastiske	fantastic, amazing
forkert	wrong
framragende	excellent
fremtidige	future
generelle	general
håber	hope
hel	whole, entire
historiske	historical
hyppige	frequent
i live	alive
imidlertid	however
interessant	interesting
kede af det	sorry
kulturelt	cultural
levende	living
lille	little, small
lokalt 	local
lovlig	legal
menneskelig	human
militær	military
moderne	modern
modsatte	opposite
mulige	possible
næste	next
negativ	negative
nødvendig(e)	necessary
normal(e)	normal
normalt	normally
nylige	recent
officielt	official
ond(e)	evil [ones]
opdrager	raise
perfekte	perfect
personligt	personal
populære	popular
positiv	positive
praktisk	practical, convenient
privat	private
rækker ... til	hands ... to
religiøs	religious
ren	clean
rigtig	correct, real
sædvanligvis	usually
samme	same
seriøst	serious
sjov	fun, funny
små	small
smuk	beautiful
søg	search, seek, look for
speciel	special
stor	great, big
svær	difficult
svigter	fail
tilgængelig 	available
tosproget	bilingual
traditionel	traditional
træt(te)	tired
trist	sad
tror	think, believe
uafhængig	independent
umulig	impossible
underligt	strange
velkendt	familiar
venstre	left (as in, right)
vigtig	important
fuldstændig	completely
nemt	easily
især	especially
tidlig	soon
effektiv	efficient
bestemt	definitely
stor	big
hverken	neither
lige	straight
både	both
andre	other
hinanden	each other
få	few, get
sådan	such, like that
stille	quiet
så vidt	as far as
faktisk	in fact
lækker	delicious
forsigtig	carefully
uanset	whatever, no matter
uanset hvad	no matter what
ligesom	like
tilstrækkelig	enough, sufficient
bestemt	definitely
portugisisk	Portuguese
spansk	Spanish
brasiliansk	Brazilian
flyden	fluent
udenlands	abroad
tilsyneladende	apparently
plejer	usually
grundet	due to
sent	late
afgørende	essential
velkend	familiar
tidligere	previously
forrige	previous
tidlig	early
siden	since (time)
  `));

  const SHUFFLE_EVERY = 5;
  const SHUFFLE_EXCEPT_LAST_N = 5;
  var iterations = 0;
  var nextWordPair = function() {
    var p = filteredWordList.pop();
    filteredWordList.unshift(p);

    if (++iterations >= SHUFFLE_EVERY) {
      var p1 = filteredWordList.splice(0, filteredWordList.length - SHUFFLE_EXCEPT_LAST_N);
      shuffle(p1);
      filteredWordList = p1.concat(filteredWordList);
      iterations = 0;
    }

    return(p);
  };

  var tidyText = function(t) {
    return t.toLowerCase().replace(/\s+/g, ' ').trim();
  };

  var matchingText = function(textA, textB) {
    return(tidyText(textA) === tidyText(textB));
  };

  var doSimpleTextToText = function(promptText, challengeWord, possibleAnswers, challengeLanguage, responseLanguage) {
    $('.heading').text(promptText);
    $('.challenge').text(challengeWord);
    $('.challenge').attr('lang', challengeLanguage);
    $('.response').val('');
    $('.response').focus();
    $('.response').attr('lang', responseLanguage);

    $('.message-correct').hide();
    $('.message-incorrect').hide();
    $('.message-give-up').hide();

    $('#game-form').off('submit');
    $('#game-form').off('reset');
    $('#change-wordlists').off('click');

    $('#game-form').on('submit', function (event) {

      var givenAnswer = $('.response').val();

      if (possibleAnswers.filter(function (e) {
        return matchingText(e, givenAnswer);
      }).length > 0) {
        $('.message-correct').show().delay(500).fadeOut(250, function () {
          nextQuestion();
        });
      } else {
        $('.message-incorrect').show().delay(750).fadeOut(250);
      }

      return false;
    });

    $('#game-form').on('reset', function (event) {
      $('.message-give-up .correct-answer').text(possibleAnswers.join(", "));
      $('.message-give-up').show().delay(2000).fadeOut(250 * possibleAnswers.length, function () {
        nextQuestion();
      });

      return false;
    });

    $('#change-wordlists').on('click', newGame);
  };

  var doSimpleDkToEn = function() {
    var pair = nextWordPair();
    // console.log("gender", pair.da_dk_gender);

    var possibleAnswers = filteredWordList.filter(function (e) {
      return e.da_dk == pair.da_dk;
    }).map(function (e) {
      return e.en_gb;
    });
    // TODO uniqify

    doSimpleTextToText('Hvad er den engelsk ord for:', pair.da_dk, possibleAnswers, "da-dk", "en-gb");
  };

  var doSimpleEnToDk = function() {
    var pair = nextWordPair();
    // console.log("gender", pair.da_dk_gender);

    var possibleAnswers = filteredWordList.filter(function (e) {
      return e.en_gb == pair.en_gb;
    }).map(function (e) {
      return e.da_dk; // discards gender
    });
    // TODO uniqify

    doSimpleTextToText('Hvad er den dansk ord for:', pair.en_gb, possibleAnswers, "en-gb", "da-dk");
  };

  var nextQuestion = function() {
    if (Math.random() > 0.5) {
      doSimpleDkToEn();
    } else {
      doSimpleEnToDk();
    }
  };

  var newGame = function () {
    $('#game').hide();

    $('#wordlists').empty();
    listNames.forEach(function (listName) {
      var opt = $("<option selected></option>");
      opt.text(listName);
      $('#wordlists').append(opt);
    });
    $('#wordlists').attr('size', listNames.length);

    $('#wordlists-form').off('submit');
    $('#wordlists-form').on('submit', function (event) {
      var chosenWordLists = {};
      $('#wordlists option[selected]').each(function (i, opt) {
        if (opt.selected) {
          chosenWordLists[opt.innerText] = true;
        }
      });

      filteredWordList = completeWordList.filter(function (e) {
        return chosenWordLists[e.listName];
      });

      if (filteredWordList.length <= SHUFFLE_EXCEPT_LAST_N) {
        alert('Ikke nok ord for at øve med');
      } else {
        $('#select-wordlists').hide();
        $('#game').show();

        $('#word-count').text(filteredWordList.length);
        shuffle(filteredWordList);
        nextQuestion();
      }

      return false;
    });

    $('#select-wordlists').show();
  };

  console.log(warningSummary);
  $(document).ready(newGame);

})();
