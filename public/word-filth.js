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
      console.log("addWordList", listName, "warning", w);
    });
  };

  var importSimplePairs = function (blockOfText) {
    var pairs = [];
    var warnings = [];

    blockOfText.split(/\n/).forEach(function (lineOfText) {
      var m;
      if (m = lineOfText.match(/^\s*(?:[nt]-)?([a-zéæøå]+)\s+(\w+)(\s\(.*\))?\s*$/)) {
        pairs.push({ en_gb: m[2], da_dk: m[1] });
      } else if (lineOfText.match(/\S/)) {
        warnings.push({ code: "not_imported", detail: lineOfText });
      }
    });

    return { pairs: pairs, warnings: warnings };
  };

  addWordList('duo basics 1', importSimplePairs(`
    kvinde woman
    jeg I
    drenge boy
    pige girl
    en a,an,one
    er is
    du you
    mand man

    han he
    og and
    hun she
    et a,an,one
    æble apple
    spiser eat

    brød bread
    drikker drink
    vand water
  `));

  addWordList('duo basics 2', importSimplePairs(`
    vi we
    mælk milk
    avis newspaper

    de they
    sandwich sandwich
    barn child
    ris rice
    kvinder women
    mænd men

    bog book
    det it
    har has
    i = you (plural)
    menu menu
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
    kaffe coffee
    æg egg
    kylling chicken
    tallerken plate
    appelsin orange
    vin wine
    fisk fish
    kartoffel potato

    sukker sugar
    frokost lunch
    morgenmad breakfast
    saft juice
    frugt fruit
    pasta pasta
    ost cheese
    is = ice cream

    øl beer
    bøf beef
    suppe soup
    tomat tomato
    jordbær strawberry
    mad food
    citron lemon
    kage cake

    olie oil
    salt salt
    kød meat
    måltid meal
    te tea
    svinekød pork
    vegetar vegetarian
    aftensmad dinner
  `));

  addWordList('duo animals', importSimplePairs(`
    hest horse
    elefant elephant
    and duck
    skildpadde tortoise
    fugl bird
    kat cat

    bjørn bear
    mus mouse
    krabbe crab
    hund dog
    kat cat
    dyr animal

    ugle owl
    edderkop spider
    løve lion
  `));

  addWordList('duo definites', importSimplePairs(`
  `));

  addWordList('duo plurals', importSimplePairs(`
  `));

  addWordList('duo genitive', importSimplePairs(`
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
    skjorte shirt
    kjole dress
    sko shoe
    frakke coat
    nederdel skirt
    jakke jacket
    har has
    //på

    hat hat
    bukser trousers
    jakkesættet suit
    tøj clothes
    strømpe sock
  `));

  addWordList('duo present 1', importSimplePairs(`
    skriver writes
    rører touches
    går going, walking
    svømmer swims
    ser sees
    løber runs
    sover sleeps

    koger cooks
    laver does
    synger sings
    gerne 
    vil
    have

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
    om

    hører hears
    lytter listens
    til to
    ved
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
    den

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
    dag
    i dag = today
    i morgen = tomorrow
    aften evening
    eftermiddag afternoon
    tid time
    om about
    formiddagene

    kalender calendar
    mandag Monday
    tirsdag Tuesday
    onsdag Wednesday
    torsdag Thursday
    fredag Friday
    nat night
    hverdage weekdays

    lørdag Saturday
    søndag Sunday
    år year
    uge week
    måned month
    time hour
    alder age
    weekend weekend

    januar January
    februar February
    marts March
    april April
    maj May
    juni June
    dato date

    november November
    december December
    sæson season
    juli July
    august August
    september September
    oktober October

    n-vinter Winter
    minut minute
    forår Spring
    sommer Summer
    efteråret Autumn
    århundred century
    perioderne periods

    fest party
    scene stage
    generation generation
    øjeblik moment
    fødsel birth
    midnat midnight
    marked = market, fair

    årti decade
    sekund second
    smule bit
    indtil until
    middag = midday, noon
  `));

  addWordList('duo family', importSimplePairs(`
    sønnerne = the sons
    søster sister
    datter daughter
    bror brother
    far father
    mor mother
    forældre parents

    ægteskab marriage
    familie family
    tante aunt
    onkel uncle
    søskende sibling
    mand husband
    kone wife

    navn name
    bedstemor grandmother
    bedstefar grandfather
    leg play
    legetøj toy
    bamse = teddy bear
    gæst guest
  `));

  addWordList('duo occupation', importSimplePairs(`
    doktor doctor
    model model
    personalet
    studerende student
    arbejde worker
    job job
    forfatter author

    arbejderne workers
    politiet police
    karriere career
    advokat lawyer
    n-direktør manager
    sekretærer secretary
    kunstner artist
    ninja ninja

    kaptajn captain
    vagt guard
    skuespiller actor
    dommer judge
    betjent officer
    professionel professional
    soldat soldier
    borgmester mayor

    chef boss
    landmand farmer
    arkitekt architect
    ingeniør engineer
    kok cook
    erhverv profession
    tjener waiter
    servitrice waitress
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
    effektive effective, efficient
    velkendt familiar, well-known
    live live
    underlig strange

    modsat opposite
    bange scared
    praktisk practical
    bekvemme convenient
    triste sad
    ked sorry
    hyppigt frequent
    sjov fun, funny
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
    rækker 
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
    meget very
    nu now
    så so
    der
    for
    mere more
    hen

    aldrig never
    altid always
    også also
    her
    ret right
    derefter then
    henne

    stadig still
    kun only
    bare only
    godt good
    selv self, only
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

    langt long
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
    hus house
    hotel hotel
    badeværelset bathroom
    strand beach
    køkken kitchen
    gård farm
    restauranten restaurant
    udenfor outside

    lufthavn airport
    kirker churches
    slotte castles
    land country
    gade street
    byer cities
    sted place

    langs along
    kontor office
    områderne areas
    hjem home
    ind in
    centrum centre, shopping mall
    plads place, space, square
    stue = living room

    adresserne = the addresses
    afdelingen = the department
    ejendom property
    rum room
    bygning building
    parken = the park
    soveværelser bedrooms
    distrikterne = the districts

    have garden
    øerne = the islands
    bank bank
    barerne = the bars
    region region
    foran = in front of
    derinde = in there
    værelse room

    station station
    jorden = the ground
    museum museum
    dalene = the valleys
    kysten = the coast
    indenfor within
    zone zone
    derude = out there

    nabolag neighbourhood
    ruten = the route
    grænse border
    hjørnet = the corner
    tårn tower
    biograf cinema
    boulevard boulevard
    derhenne = over there

    fængsel prison
    hovedstad capital
    paladserne = the palaces
    samfund community
    landsby village
    havnen = the port
    center = centre

    højre right
    torvet = the square
    oven top
    vest west
    norden north
    bondegård farm
    zoologisk have = zoo
  `));

  addWordList('duo objects', importSimplePairs(`
    stol chair
    bord table
    seng bed
    skålen = the bowl
    ske spoon
    flaskerne = the bottles
    blad magazine

    vinduerne = the windows
    fjernsyn = television
    radio radio
    spejl mirror
    urene = the clocks ???
    mobiltelefon = mobile, cellphone
    computeren = the computer

    sofa sofa
    lampe lamp
    skrivebordet = the desk
    kurv basket
    armbåndsur watch
    batteri battery
    sæbe soap

    pung purse
    døren = the door
    skærmene = the screens
    kasse box
    sengetøjet bedclothes
    tv tv
    skraber razor, scraper
    barberer shaves

    tandpastaen = the toothpaste
    væg wall
    telefoner = telephones
    taske bag
    hjulene wheels
    paraply umbrella
    gulv floor

    tag roof
    brev letter
    svamp sponge
    nøglen = the key
    skab cabinet
    svømmebassin = swimming pool
    ting thing

    saks scissors
    klokke bell
    glas glass
    kop cup
    pande pan
    papirerne = the papers
    maskine machine

    snor string
    arket = the sheet
    genstand object
    motor motor, engine
    stykke piece
    pakkerne = the packages

    rod root
    flag flag
    kæden chain
    roman novel
    pulveret = the powder
    kam comb

    tandbørsten = the toothbrush
    gaffel fork
    kniv knife
    gave gift
    smykke = piece of jewelry
  `));

  addWordList('duo animals 2', importSimplePairs(`
    girafferne = the giraffes
    hval whale
    abe monkey
    delfin dolphin
    haj shark
    kæledyr pet
    tiger tiger

    ko cow
    pingvin penguin
    gris pig
    vandmand jellyfish
    ræv fox
    ulv wolf
    hjort deer
    husdyr = domestic animals, livestock

    kanin rabbit
    myre ant
    insekt insect
    orm worm
    svane swan
    isbjørn = polar bear
    egern squirrel
    høne hen

    får sheep
    måge seagull
    solsortene = the blackbirds
    grævling badger
    slangerne = the snakes
    pindsvin hedgehog
    enhjørning unicorn
  `));

  addWordList('duo people', importSimplePairs(`
    person person
    fjende enemy
    ven friend
    offentligheden
    kæreste = girlfriend, boyfriend
    baby baby

    mennesker people
    ungdom youth
    kultur culture
    befolkningen
    konference conference
    fundament foundation
    komite committee

    forhold relationship
    individ individual
    par couple
    dame lady
    borger citizen
    offer victim
    ofre victims
    folk people
  `));

  addWordList('duo determiners', importSimplePairs(`
    den
    det
    denne
    dette
    disse
    én

    de
    ingen
    intet
    alle
    hver

    nogen
    noget
    både
    anden
    hinanden
    andre

    helst
    ingenting
    alting
    få
    sådan
  `));

  addWordList('duo prepositions 2', importSimplePairs(`
    iblandt = among, amongst
    undtagen except
    ligesom like
    blandt = among, amongst
    over
    imod against

    ifølge = according to
    gennem through
    grundet
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
    flydende

    eventyrene
    bro bridge
    italiener
    franskmand
    flyvemaskine
    tur = trip
    flyvetur flight

    rejsen
    tyske 
    afrejse
    turist tourist
    frankrig
    undergrundsbanen
    amerika

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
    rundt 
    drejer
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
    klokken o'clock

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
    spiste
    drak
    talte
    gik
    var
    lavede

    går
    elskede
    kunne
    ville
    hørte
    regnede

    spillede
    nylig
    så
    lyttede
    havde
    sagde
    kaldte

    født
    fandt
    fødte
    lagde
    fortalte
    brugte
    forlod

    skrev
    ringede
    tænkte
    mistede
    kom
    tog
    legede

    døde
    informerede
    gav
    prøvede
    støttede
    blev
    vendte

    kiggede
    slog
    fik
    fat
    svarede
    faldt
    snakkede
    viste
  `));

  addWordList('duo infinitive 1', importSimplePairs(`
    plejer
    skrive
    gå
    svømme
    være
    se
    sove
    drikke

    gøre
    besluttede
    løbe
    betale
    lave
    lege
    bruge
    bo

    plejede
    tale
    spille
    elske
    tillade
    lade
    komme
    tage

    regne
    høre
    lytte
    lukke
    leje
    sige
    røre

    fortælle
    hjælpe
    finde
    stille
    få
    hente
    øve
    blive

    købe
    tilføje
    vide
    arbejde
    putte
    placere
    nå
    køre

    vise
    åbne
    tænke
    ændre
    returnere
    ringe
    besøge
    sætte
    træne

    lære
    kigge
    leve
    starte
    studere
    give
    virke

    sælge
    begynde
    beholde
    tilbyde
    prøve
    spørge
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
    indeholder
    respekterer
    bliver
    går
    køber
    råber

    syne
    tæller
    savner
    regner
    sælger
    ryger
    glæder

    fylder
    producerer
    blander
    dukker
    sidder
    falder
    passer

    flyver
    importerer
    hjælper
    fortsætter
    stjæler
    henter

    hader
    antager
    leverer
    forlader
    ødelægger
    annoncerer

    tilføjer
    serverer
    efterlader
    tørrer
    putter
    dækker

    besøger
    kræver
    forklarer
    ankommer
    modtager
    vinder
    lægger

    reserverer
    ligger
    cykler
    skærer
    sætter
    stiller
    tillader
  `));

  addWordList('duo abstract objects 1', importSimplePairs(`
    udsigt
    liste
    del
    system
    kærlighed
    service
    anmeldelser

    ordrer
    gruppe
    vejen
    måde
    typer
    design
    tilfælde
    version

    medlemmerne
    kontrol
    opkald
    kontoer
    profiler
    ændringerne
    niveauet

    beskrivelserne
    indholdet
    kategori
    udstyr
    billederne
    værdi
    handling

    problem
    side
    mulighed
    resultat
    aktivitet
    forestilling

    løsning
    beskyttelse
    produktion
    aftalerne
    tur
    konstruktion

    håb
    ønske
    indgange
    sind
    effekt
    forening
    chancen

    valg
    stemme
    rolle
    formålet
    grad
    emne
    bevis

    introduktion
    pris
    succes
    hvile
    kræfter
    fag
    karakter

    mørke
    alternativ
    kant
    slags
    optegnelse
    hukommelse
  `))

  addWordList('duo past 2', importSimplePairs(`
    gjorde
    rørte
    returnerede
    drejede
    åbnede
    stoppede
    stod

    dukkede
    forklarede
    forekom
    da
    vandt
    skete
    sad

    opdagede
    efterlod
    fulgte
    introducerede
    spurgte
    bad
    lå

    optrådte
    præsterede
    tilføjede
    huskede
    beholdte
    kendte

    begyndte
    løb
    følte
    lod
    mærkede
    troede
    satte

    virkede
    arbejdede
    vidste
    sluttede
    behøvede
    startede
  `));

  addWordList('duo adjectives 2', importSimplePairs(`
    stor
    små
    ny
    god
    gammel
    end
    færdig
    klog

    mindre
    større
    ung
    ældre
    yngre
    smukt
    fulde
    sur
    flest

    smukkere
    gratis
    fri
    bedste
    lang
    renere
    mæt
    største
    mest

    billigere
    hård
    kort
    varme
    bedre
    dårlig
    stand
    forfærdelig
    bedst

    hurtig
    klar
    glad
    stærk
    sandt
    simpel
    dejligt
    sulten
    flot

    dyb
    fattig
    rig
    kold
    sød
    retfærdige
    skarpe
    tørstig

    alene
    svag
    sikker
    værre
    værst
    høj
    klar
    forskellige
    kedeligt
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
    boller
    smør
    rugbrød
    krydderi

    chokolade
    lakrids
    leverpostej
    sild
    wienerbrød
    æbleskive

    tærte
    rødkål
    fløde
    frikadelle
    flæskesteg
    slikket

    spejlæg
    pandekage
    risengrød
    agurk
    koldskål

    nød
    risalamande
    rødgrød
    pølse
  `));

  addWordList('duo relative pronouns', importSimplePairs(`
    hvis
    som
    der
    hvad
  `));

  addWordList('duo indefinite pronouns', importSimplePairs(`
    man
    én
    ens
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
    t-øje eye
    t-hoved head
    t-helbred health
    syg sick
    behandlingen = the treatment, the care
    at behandle = treat
    brug = need, use
    hænder hands
    øjne eyes

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
    virusser viruses

    n-hjerne brain
    n-drøm dream
    n-arme arm
    n-mund mouth
    n-hals neck
    n-ben leg
    benene legs
    n-ulykken accident
    at-græde cry
    n-nakke neck

    n-finger finger
    fingre fingers
    t-øre ear
    ørene ears
    n-tand tooth
    tænder teeth
    n-tunge tongue
    nakke
    ondt pains, a pain
    at-vaske wash
    n-mave stomach

    n-næse nose
    n-læbe lip
    læber lips
    n-ryg back
    ryggen back
    n-tilstand condition
    n-tid time, appointment
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
  `));

  addWordList('duo nature', importSimplePairs(`
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

  var doSimpleTextToText = function(promptText, challengeWord, correctResponseWord, challengeLanguage, responseLanguage) {
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

      if (matchingText(correctResponseWord, givenAnswer)) {
        $('.message-correct').show().delay(500).fadeOut(250, function () {
          nextQuestion();
        });
      } else {
        $('.message-incorrect').show().delay(750).fadeOut(250);
      }

      return false;
    });

    $('#game-form').on('reset', function (event) {
      $('.message-give-up .correct-answer').text(correctResponseWord);
      $('.message-give-up').show().delay(2000).fadeOut(250, function () {
        nextQuestion();
      });

      return false;
    });

    $('#change-wordlists').on('click', newGame);
  };

  var doSimpleDkToEn = function() {
    var pair = nextWordPair();
    doSimpleTextToText('Hvad er den engelsk ord for:', pair.da_dk, pair.en_gb, "da-dk", "en-gb");
  };

  var doSimpleEnToDk = function() {
    var pair = nextWordPair();
    doSimpleTextToText('Hvad er den dansk ord for:', pair.en_gb, pair.da_dk, "en-gb", "da-dk");
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

  $(document).ready(newGame);

})();
