// vi: set sw=2 et :

var completeWordList = [];
var wordListNames = [];

(function () {

  var warningSummary = {};

  var addWordList = function(listName, importResults) {
    if (importResults.pairs.length > 0) {
      importResults.pairs.forEach(function (pair) {
        pair.listName = listName;
      });

      completeWordList = completeWordList.concat(importResults.pairs);

      wordListNames.push(listName);
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

    koger = cooks, boils
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
    kender knows (a person)
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
      n-skål bowl
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

    mennesker = people, humans
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
    at stille = to put
    at få = to get
    at hente = to pick up, to get
    at øve = to increase
    at blive = to become

    at købe = to buy
    at tilføje = to add
    at vide = to know (a fact)
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
    n-måde = way, manner
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
      n-beskrivelse description
    indholdet = the contents
      t-indhold = content
    n-kategori category
    t-udstyr equipment
    billederne = the pictures
      t-billede picture
    n-værdi value
    n-handling action

    t-problem problem
    n-side page
    n-mulighed possibility
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
    har = has
    har læst = has read
    er gået = has gone
    har været = has been
    har lavet = has made
    har villet = has wanted
    er blevet = has become

    har regnet = has rained
    har spillet = has played
    har hørt = has heard
    har spist = has eaten
    har talt = has talked
    tidligere = previously, previous
    forrige previous

    har set = has seen
    har haft = has had
    siden since
    har betalt = has paid
    har fortalt = has told
    er kommet = has arrived
    har forladt = has left

    har givet = has given
    har skrevet = has written
    har gjort = has done
    har sat = has put
    har ringet = has called
    har kaldt = has called

    har modtaget = has received
    har taget = has taken
    har mistet = has lost
    har sendt = has sent
    har spurgt = has asked
    har udviklet = has developed
    for = too

    har præsenteret = has presented
    har lukket = has closed
    har produceret = has produced
    har mødt = has met
    har prøvet = has tried
    har ændret = has changed
    har fået = has had, has gotten, has received

    har følt = has felt
    har fulgt = has followed
    har forberedt = has prepared
    har tvunget = has forced
    har introduceret = has introduced
    har optrådt = has performed

    har reduceret = has reduced
    har vundet = has won
    har åbnet = has opened
    har bestilt = has ordered
    har boet = has lived
    har stoppet = has stopped
    er ankommet = has arrived

    har antaget = has assumed
    har tilladt = has allowed
    har kendt = has known
    har drukket = has drunk
    har sagt = has said
    har passeret = has passed
    har afsluttet = has completed, has finished
    har savnet = has missed
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
    man = one, you (subject)
    én = one, you (object)
    ens = one's, your
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

    undgå avoid
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
    skulle = should (past)

    da really
    vist = probably, supposedly
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
    havde kendt = had known (a person)
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
    han er ved at købe nye fisk = he is about to buy new fish
    han er ved at købe nye fisk = he is buying new fish
    er ved at = is about to, is (progressive)
    jeg sidder og spiser = I am eating
    han står og taler med hende nu = he is talking to her now

    han er i færd med at tænke over det = he is thinking it over
    i færd med at = in the process of (progressive)
    var ved at = was about to, was (progressive)
    stod og rørte = was touching
    hvilken som helst = whichever
    give op = give up

    hvad er du i gang med at se = what are you seeing
    i gang med at = (progressive)
    går og læser = is reading
    jeg sidder og ser fjernsyn = I am watching television
    stod og så = was seeing

    // talte
    // ved
    // at føde
    // at købe
    // at spise
    // at gøre
    // at blive

    // ventede
    // at give
    // at prøve
    // lavede
    // færd
    // at tage
    // at røre
    // at tænke

    // gang
    // at gå
    // at ser
    // ske
    // at drikke
    // at læse
    // at snakke
    // at svømme

    // at kigge
    // at løbe
    // at sove
    // at skrive
    // at betale
    // at arbejdede

    // at studere
    // at sige
    // at regne
    // at lege
    // kalde
    // at forlade
  `));

  addWordList('duo reflexive pronouns', importSimplePairs(`
    mig myself
    dig yourself
    sig = himself, herself, themself, itself, themselves

    os = ourselves
    selv = self // for emphasis
    jer = yourselves
  `));

  addWordList('duo sports', importSimplePairs(`
    bolde = balls
      n-bolde ball
    n-sport sport
    holdet = the team
      t-hold team
    n-spiller player
    n-håndbold handball
    n-sti path
    t-skridt = step, steps

    t-mål goal
    n-fodbold football
    t-spil game
    n-tennis tennis
    n-basketball basketball
    point
      n-pointe point
    n-score score

    n-badminton badminton
    n-volleyball volleyball
    n-ketsjer racket
    at sparke = to kick
    at hoppe = to jump
    n-træner coach
    at motionere = to exercise

    n-maraton marathon
    t-mesterskab championship
    n-atlet athlete
    n-svømning swimming (activity)
    n-kamp = fight, match
    n-fitness fitness
      fitness centret = the gym
      fitness centre = gym
    tabte lost
      at tabe = to lose
  `));

  addWordList('duo compound pronouns', importSimplePairs(`
    n-universitetsuddannelse = university education
    n-hundemad = dog food
    n-avisdreng = paperboy
    t-vinglas = wine glass
    n-frugtsaft = fruit juice
    t-natbord = night table // whatever one of those is

    n-romanforfatter = novelist
    n-tekop = teacup
    n-chokoladekage = chocolate cake
    n-havestol = garden chair
    skabsnøgle = locker key
    t-vejnavn = street name
      t-gadenavn = street name

    n-fuglesang = birdsong
    n-politistation = police station
    n-rejseguide = travel guide
    n-computerskærm = computer screen
    n-brødkniv = bread knife
    n-nødudgang = emergency exit

    havvandet seawater
      t-havvand
    t-gruppearbejde = group work
    t-kærlighedsbrev = love letter
    n-lagkage = layer cake, sponge cake
    n-kaffekop = coffee cup

    n-rollemodel = role model
    t-hukommelsestab = memory loss, amnesia
    n-racerbil = race car
    n-brandmand = fireman, firefighter
    t-skærebræt = chopping board
  `));

  addWordList('duo passive present', importSimplePairs(`
    mødes = is met
    ses = is seen
    spises = is eaten
    vides = is known
    koges = is cooked
    laves = is cooked, is made
    synges = is sung

    spilles = is played
    bruges = is used
    tages = is taken
    høres = is heard
    fortælles = is told
    findes = is found, exists
    arbejdes
    behøves = is needed

    fås = is available
    vises = is shown
    åbnes = is opened
    ændres = is changed
    gemmes = is hidden
    tilbydes = is offered
    gives = is given
    tales = is spoken

    føles = is felt
    ønskes = is wished for, is desired
    søges = is searched for, is sought
    svigtes = is failed
    opdrages = is being instructed
    følges = is followed
    afsluttes = is finished
    købes = is bought

    tælles = is counted
    savnes = is missed
    fyldes = is filled up
    produceres = is produced
    importeres = is imported
    fortsættes = is continued
    kræves = is needed, is desired
    skæres = is cut

    bliver becomes
    købt bought
    født felt
    dræbt killed
    skudt shot
    vasket washed
    set seen
    lavet = cooked, made

    bygget built
    talt counted
    fremstillet prepared
    sunget sung
    ødelagt destroyed
    fundet found
    fyldt filled
    opdraget = raised, brought up

    tilbudt offered
    fulgt followed
    svigtet = failed, let down
    skåret cut
    hørt heard
    brugt used
    vist shown
    gemt hidden
  `));

  addWordList('duo arts', importSimplePairs(`
    t-kamera camera
    n-musik music
    t-billede picture
    n-violin violin
    n-fløjte flute
    foto photo
    n-film = movie, film

    n-kunst art
    n-lyde = noises, sounds
      n-lyd = noise, sound
    n-sang song
    n-stil style
    n-figur figure
    fotografi photography
    maler = paints
      at male = to paint

    n-dans dance
    t-instrument instrument
    t-teatrene = the theatres
      t-teater theatre
    n-litteratur literature
    n-mode fashion
    n-poesi poetry
      t-digt poem
    n-koncert concert

    n-skuespillerinden = the actress
      n-skuespillerinde actress
    t-maleri painting
    n-maling paint
    t-band band
    t-publikum audience
    n-musical musical
    n-samling collection
    n-åbning opening
  `));

  addWordList('duo communication', importSimplePairs(`
    n-kommentar comment
    t-netværk network
    n-information information
    n-presse = press
    teksten = the text
      n-tekst text
    n-søgning search
    at søge = to search

    t-sprog language
    n-besked message
    t-internet internet
    nyhederne = the news
      nyheder news
      n-nyhed news
    n-kanal channel
    ligeglad = indifferent

    t-frimærke = stamp, postage stamp
    n-kommunikation communication
    journalisterne = the journalists
      n-journalist journalist
    t-postkort postcard
    at sende = to send
    n-adgang access
    ligegyldig irrelevant
  `));

  addWordList('duo politeness', importSimplePairs(`
    Dem = you
    De = you
    venlig kind
      Vil De være så venlig at stop = would you be so kind as to stop
    Deres = your
    bede om = ask for
    fru = Mrs (requires name)
    frue = ma'am
    hr. = Mr (may or may not have name)
    frøken = Miss
    frk = Miss (requires name)
  `));

  addWordList('duo present participles', importSimplePairs(`
    brændende burning
    lysende bright
    faldende falling
    skinnende shiny
    dansende dancing
    forførende seductive
    syngende singing

    smilende smiling
    grædende crying
    foruroligende alarming
    krævende demanding
    skrigende screaming
    sovende sleeping

    arbejdende working
    larmende noisy
    irriterende = irritating, annoying
    legende playing
    kommende coming
    besøgende = visitor, visitors
  `));

  addWordList('duo imperative', importSimplePairs(`
    gå go
    se see
    sov sleep
    løb run
    lav wash
    syng sing
    spil play
    kys kiss

    betal pay
    leg play
    brug use
    tag take
    lyt listen
    fortæl tell
    vis show
    hold

    kald
    red
    gem hide
    kom come
    giv give
    prøv try
    spørg ask

    tal = speak, speak up
    stop stop
    stå stand
    sid sit
    følg follow
    vend turn
    svar answer
    sæt = set, put

    stol
    tæl
    bland
    fortsæt
    hjælp help
    put
    læg
  `));

  addWordList('duo politics', importSimplePairs(`
    n-sikkerhed = security, safety
    loven = the law
      n-lov law
    regeringen = the government
      n-regering government
    n-krig = war
    n-skat tax
    n-moms = sales tax, VAT
    n-ret court

    nationale national
    n-strategi strategy
    n-investering investment
    t-råd = piece of advice
    n-gæld debt
      står i gæld = am in debt
    n-fred peace
    n-velfærd welfare

    n-hær army
    n-økonomi economy
    n-mening opinion
    n-forbrydelse crime
    fremskridt progress
    n-efterspørgsel demand
    n-statsminister = Prime Minister

    n-leder leader
    n-kampagnen = the campaign
      n-kampagne campaign
    valget = the choice, the election
      t-valg = choice, election
    n-tale speech
    n-stemme = voice, vote
    n-vold violence
    t-skænderier quarrel

    n-prins prince
    n-prinsesse princess
    n-konge king
    n-dronning queen
    n-konflikt conflict
    n-flåde fleet
    n-trussel threat
    n-kandidat candidate

    n-præsident president
    n-guvernør governor
    n-krise crisis
    n-strejke strike
    n-senator senator
    t-parlament parliament
    n-rigdom wealth

    n-kongres congress
    n-frihed freedom
    skylden = the blame
      n-skyld blame
    n-beslutning decision
    planer plans
      n-plan plan
    n-årsag cause
    t-våben weapon
    at arrestere = to arrest
  `));

  addWordList('duo future', importSimplePairs(`
    spiser
    tilføje
    komme
    blive
    ødelægge
    ændre
    vælge

    ringe
    fortsætte
    tælle
    lave
    drikke
    finder

    skrive
    sove
    betale
    bruge
    tage
    lytte
    fortælle

    ankommer
    viser
    give
    gå
    ske
    får
    åbner

    vide
    se
    tabe
    gøres
    tænk
    spørge
    lukke

    savne
    tilbyde
    regne
    læse
    modtage
    prøve
    stoppe
    flyve

    sige
    sælge
    følge
    overveje
    leve
    starte
    slutte
    begynder
  `));

  addWordList('duo passive past', importSimplePairs(`
    mødtes = met
    sås = was seen
    brugtes = was used
    hørtes = was heard
    åbnedes = was opened
    ændredes = was changed

    føltes = was felt
    fandtes = existed
    fulgtes
    afsluttedes
    fyldtes = was filled
    fortsattes = was continued
    krævedes = was needed, was desired

    blev became
    købt = was bought
    født = was born
    dræbt = was killed
    ødelagt = was destroyed
    bygget = was built
    vist = was shown
  `));

  addWordList('duo business', importSimplePairs(`
    n-dollar dollar
    produkterne = the products
      t-produkt product
    n-forsikring insurance
    n-butik shop
    n-forretning business
    n-bestyrelsen = the board of directors
      n-bestyrelse = board of directors
    t-udsalg sale

    t-kort card
    n-industrier industries
      n-industri industry
    t-guld gold
    t-tilbuddene = the offers
      t-tilbud offer
    n-mentor mentor
    n-handel trade
    n-risikoer risks
      n-risiko risk

    kontrakter contracts
      n-kontract contract
    budgetter budgets
      t-budget budget
    n-valuta currency
    kreditkortet = the credit card
      t-kreditkort = credit card
    t-værd worth
    t-mærke brand
    n-agent agent

    n-organisation organisation
    n-forfremmelse promotion
    at koste = to cost
    n-reklame advertising
    n-præmie premium
    firmaet = the firm
      t-firma firm
    n-markedsføring advertising

    n-regning bill
    t-møde meeting
    global global
    t-interviews interviews
      t-interview interview
    virksomheder companies
      n-virksomhed company
    n-priser prices
      n-pris price
    n-check = check, cheque
  `));

  addWordList('duo kitchen', importSimplePairs(`
    n-ovn = oven
    køleskabet = the fridge, the refrigerator
      t-køleskab = fridge, refrigerator
    kogeplader = hobs, burners
      n-kogeplade = hob, burner
    n-mikrobølgeovn = microwave, microwave oven
    n-fryser freezer
    t-komfur stove

    n-osteskærer = cheese slicer
    n-vask sink
    n-gryde pan
    n-brødrister toaster
    n-skraldespand = trash can, bin
    kaffemaskinen = the coffee machine
      n-kaffemaskine = coffee machine

    t-låg lid
    opvaskemaskinen = the dishwasher
      n-opvaskemaskine = dishwasher
    n-grydelap = oven mitt, oven glove
      grydelapper = oven mitts, oven gloves
    n-bordskåner trivet
    n-kedel kettle
  `));

  addWordList('duo attributes', importSimplePairs(`
    n-magt = power (might)
    n-kvalitet quality
    forskellene differences
      n-forskel difference
    t-udseende appearance
    n-identitet identity

    n-skønhed beauty
    n-personlighed personality
    t-udtryk expression
    n-vigtighed importance
  `));

  addWordList('duo future perfect', importSimplePairs(`
    fundet
    modtaget
    taget
    lavet
    ringet

    sendt
    levet
    besluttet
    valgt
    vendt
  `));

  addWordList('duo science', importSimplePairs(`
    linjerne = the lines
    detaljerne = the details
    teknologi technology
    projekt project
    artikel = article, paper
    forskningen
    størrelse size

    videnskab science
    analyse analysis
    energi energy
    vægt weight
    metoder methods
    udgaver
    enhederne

    hastighed
    længder lengths
    teori theory
    afstand
    publikationer publications
    lydstyrke = loudness, volume
    opgaven

    overflade surface
    temperatur temperature
    teknik technique
    definition definition
    skala scale
    masse mass

    højde height
    fysik physics
    filosofi philosophy
    laboratorie laboratory
    dybden = the depth
      n-dybde depth
    geografi geography
    benzin = petrol, gasoline, gas

    kemi chemistry
    formel formula
    opdagelse
    undersøgelse investigation
    koncept concept
    prikker point
    mål
    opdager

    elektrisk electric
    konklusion conclusion
    alkohol alcohol
    forsker
    kredsløb
    cyklus cycle
    grunde reason
    mindske
  `));

  addWordList('duo events', importSimplePairs(`
    n-trafik traffic
    leveringerne = the deliveries
      n-levering delivery
    diskussionerne = the discussions
      n-diskussion discussion
    død = dead
    n-død = death
    n-begyndelsen = beginning
    n-afslutning ending

    pludselig suddenly
    n-støj noise
    slaget = the battle
      t-slag
    t-angreb attack
    n-anledning occasion
  `));

  addWordList('duo conditional perfect', importSimplePairs(`
    været been
    haft had
    skrevet written
    overvejet considered
    ændret changed

    åbnet opened
    sagt said
    fået = gotten, got
    opdaget discovered
    vendt turned
    klaret finished
  `));

  addWordList('duo spiritual', importSimplePairs(`
    guder
      n-Gud = God
      n-gud god
    n-engle = angel, angels
    n-magi magic
    heksen = the witch
      n-heks
    vampyrer vampires
      n-vampyr vampire
    zombier zombies
      n-zombie zombie
    præsten = the priest
      n-præst priest
    rumvæsnet = the alien
      t-rumvæsen alien
    t-spøgelse ghost

    grav = grave
    gravsten = gravestone
    kirkeklokke = church bell
    dåb baptism
    at døbe = to baptise
    konfirmation confirmation
    troldmand wizard
    rumskib spaceship
    dyd virtue

    giftede married
    kors
    begravelsen = the funeral
    djævel devil
    paradis paradise
    synd
    død = dead, death
    kiste
    bryllup wedding
  `));

  addWordList('duo danish culture', importSimplePairs(`
    fødselsdage birthdays
    julegaver = Christmas presents
    fedt cool
    nisser elves
      n-nisse elf
      n-julenisse = Christmas elf
    jul Christmas
    juleaften = Christmas Eve
    julepynt = Christmas decorations
      n-juledekoration = Christmas decoration
      n-juleand = Christmas duck (for dinner)
      andesteg = roast duck
      stege = roast (adjective)
      at stege = to roast

    påskeæg = Easter egg
    n-fødselsdagsgave = birthday present
    kongehus = Royal Family
    påske Easter
    fastelavn = Shrovetide (?!)
    hygge cosy
    ballade
    ofte = often

    julemand = Santa Claus, Father Christmas
    stearinlys = candles
    påskehare = Easter Bunny
    kronprinser = Crown Prince
    nederen sucky
    hygge cosy
    vindmøllerne = the windmills
    slapper
      slap af = relax
      at slappe af = to relax

    cykelstien = the cycle path, the bike path
      n-cykelsti = cycle path, bike path
    n-cykelhjelm = cycle helmet
    kakaomælk = chocolate milk
    lænestol armchair
    træls annoying
    farfar = grandfather, father's father
    farmor = grandmother, father's mother

    dyne quilt
    pinsen Pentecost
    snemand = snowman
    sneboldskamp = snowball fight
    søde = cutie, sweetie
    skat = darling, sweetie
    morfar = grandfather, mother's father
    fryser
      jeg fryser = I'm freezing

    mormor = grandmother, mother's mother
    fjolle fool
    juletræet = the Christmas tree
      t-juletræe = Christmas tree
    skovtur picnic
    sejt tough
    tæppet = the blanket, the carpet
      t-tæppe = blanket, carpet
    dannebrog = Dannebrog (the Danish flag)
    viking viking
  `));

  addWordList('duo once upon', importSimplePairs(`
    havfrue = mermaid
    tinsoldat = Tin Soldier
    standhaftig steadfast
    andersen
    hans
    christian
    hc
    forelsker = falls in love
      at forelske = to fall in love
      forelsket = in love

    svovlstikker = matches
      svovl = sulphur
      stikker = sticks
    nattergal nightingale
    kejser emperor
    klæde cloth
    at klæde = to dress

    svinedreng swineherd
    flyvende flying
    ælling duckling
    grim ugly
    kysse kiss

    snedronning = Snow Queen
    hyrdinden = shepherdess
    skorstensfejer = chimney sweep
    klods-hans = Clumsy Hans
  `));

  addWordList('fra DR Nyheder', importSimplePairs(`
    // 2018-01-03
    aflyst cancelled
    at aflyse = to cancel
    at annullere = to cancel
    at sikre = to ensure
    at oplyse = to inform
      oplyser = informs
    at løse = to solve
    femårig = five-year-old
    at omkomme = to perish
    at dræbe = to kill
    nordlige = Northern
    ødelagt = destroyed
    n-kamp fight
      kampen = the fight
    mod = against
    identitetstyve = identity theft
    tyveri = theft
    n-tyv = thief
    t-tæppe blanket
    n-bænk bench
    at bringe = to bring
      bragt = brought
    t-spædbarn infant
    gravid = pregnant
    n-myndighed authority
      myndigheder = authorities
    kritisk critical
    t-spor = track, lead (investigation)
    at flytte = to move
    n-billet ticket

    // 2018-01-04
    at sår = to wound
      sårede wounded
    russiske russian
    n-civil civilian
    n-bombe bomb
    at kaste = to throw
  `));

  console.log(warningSummary);

})();
