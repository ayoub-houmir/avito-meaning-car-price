
var request = require('request');
var rp = require('request-promise');
var calculService = require('../services/calcul')

var LevenshteinArray = require("levenshtein-array");

var reconciliation = {};

getMeanPrice = (params)=>{
    return new Promise(
        (resolve,reject)=>{
            getPricesAvito(params).then((data)=>{
                resolve({average: calculService.meanPrices(data.prices_filtred),
                    resolved: data.resolved,
                    }
                    );
            })
            //resolve("test");
        }
    )

};

const brandId = {
    'alfa romeo': {
        id: 1,
        list: [{"text":"4c","value":"4c"},{"text":"75","value":"75"},{"text":"8c","value":"8c"},{"text":"145","value":"145"},{"text":"146","value":"146"},{"text":"147","value":"147"},{"text":"155","value":"155"},{"text":"156","value":"156"},{"text":"159","value":"159"},{"text":"164","value":"164"},{"text":"166","value":"166"},{"text":"147 gta","value":"147_gta"},{"text":"brera","value":"brera"},{"text":"giulia","value":"giulia"},{"text":"giulietta","value":"giulietta"},{"text":"gt","value":"gt"},{"text":"gtv","value":"gtv"},{"text":"mito","value":"mito"},{"text":"spider","value":"spider"}]
    },
    'aston martin': {
        id: 2,
        list: [{"text":"db7","value":"db7"},{"text":"db9","value":"db9"},{"text":"dbs","value":"dbs"},{"text":"vanquish","value":"vanquish"},{"text":"vantage","value":"vantage"},{"text":"virage","value":"virage"}],
    },
    'audi' : {
        id:3,
        list: [{"text":"80","value":"80"},{"text":"90","value":"90"},{"text":"100","value":"100"},{"text":"200","value":"200"},{"text":"a1","value":"a1"},{"text":"a2","value":"a2"},{"text":"a3","value":"a3"},{"text":"a4","value":"a4"},{"text":"a5","value":"a5"},{"text":"a6","value":"a6"},{"text":"a7","value":"a7"},{"text":"a8","value":"a8"},{"text":"allroad","value":"allroad"},{"text":"coupe","value":"coupe"},{"text":"q3","value":"q3"},{"text":"q5","value":"q5"},{"text":"q7","value":"q7"},{"text":"r8","value":"r8"},{"text":"rs2","value":"rs2"},{"text":"rs3","value":"rs3"},{"text":"rs4","value":"rs4"},{"text":"rs5","value":"rs5"},{"text":"rs6","value":"rs6"},{"text":"s2","value":"s2"},{"text":"s3","value":"s3"},{"text":"s4","value":"s4"},{"text":"s5","value":"s5"},{"text":"s6","value":"s6"},{"text":"s8","value":"s8"},{"text":"tt","value":"tt"},{"text":"tts","value":"tts"},{"text":"v8","value":"v8"}],
    },
    'bentley': {
        id: 4,
        list: [{"text":"arnage","value":"arnage"},{"text":"azure","value":"azure"},{"text":"brooklands","value":"brooklands"},{"text":"camargue","value":"camargue"},{"text":"continental t","value":"continental"},{"text":"continental flying spur","value":"continental_flying_spur"},{"text":"continental gt","value":"continental_gt"},{"text":"continental gtc","value":"continental_gtc"},{"text":"continental r","value":"continental_r"},{"text":"continental s","value":"continental_s"},{"text":"corniche convertible","value":"corniche_convertible"},{"text":"corniche coupé","value":"corniche_coupe"},{"text":"continental gt coupé","value":"coupe"},{"text":"eight","value":"eight"},{"text":"mulsanne","value":"mulsanne"},{"text":"t series","value":"t_series"},{"text":"turbo r","value":"turbo_r"}],
    },
    'bmw': {
        id: 5,
        list: [{"text":"cabriolet","value":"cabriolet"},{"text":"compact","value":"compact"},{"text":"m","value":"m"},{"text":"m3","value":"m3"},{"text":"m4","value":"m4"},{"text":"m5","value":"m5"},{"text":"m6","value":"m6"},{"text":"serie 2","value":"serie2"},{"text":"serie 3 gt","value":"serie3gt"},{"text":"serie 1","value":"serie_1"},{"text":"serie 3","value":"serie_3"},{"text":"serie 4","value":"serie_4"},{"text":"serie 5","value":"serie_5"},{"text":"serie 6","value":"serie_6"},{"text":"serie 7","value":"serie_7"},{"text":"serie 8","value":"serie_8"},{"text":"x1","value":"x1"},{"text":"x3","value":"x3"},{"text":"x4","value":"x4"},{"text":"x5","value":"x5"},{"text":"x6","value":"x6"},{"text":"z1","value":"z1"},{"text":"z3","value":"z3"},{"text":"z4","value":"z4"},{"text":"z8","value":"z8"}],
    },
    'byd': {
        id: 6,
        list: [{"text":"f1","value":"f1"},{"text":"f3","value":"f3"}],
    },
    'chery':{
        id :9,
        list : [{"text":"a1","value":"a1"},{"text":"a113","value":"a113"},{"text":"a3","value":"a3"},{"text":"a5","value":"a5"},{"text":"a516","value":"a516"},{"text":"eastar","value":"eastar"},{"text":"qq","value":"qq"},{"text":"qq6","value":"qq6"},{"text":"tiggo","value":"tiggo"},{"text":"v5","value":"v5"},{"text":"v525","value":"v525"}],
    },
    'chevrolet':{
        id: 10,
        list: [{"text":"alero","value":"alero"},{"text":"astro","value":"astro"},{"text":"avalanche","value":"avalanche"},{"text":"aveo","value":"aveo"},{"text":"beretta","value":"beretta"},{"text":"blazer","value":"blazer"},{"text":"camaro","value":"camaro"},{"text":"caprice","value":"caprice"},{"text":"captiva","value":"captiva"},{"text":"cavalier","value":"cavalier"},{"text":"cmp","value":"cmp"},{"text":"corvette","value":"corvette"},{"text":"corvette cabrio","value":"corvette_cabrio"},{"text":"cr8","value":"cr8"},{"text":"cruze","value":"cruze"},{"text":"el camino","value":"el_camino"},{"text":"epica","value":"epica"},{"text":"express","value":"express"},{"text":"hhr","value":"hhr"},{"text":"lacetti","value":"lacetti"},{"text":"metro","value":"metro"},{"text":"monte-carlo","value":"montecarlo"},{"text":"nubira sw","value":"nubirasw"},{"text":"optra","value":"optra"},{"text":"s-10","value":"s10"},{"text":"silverado","value":"silverado"},{"text":"spark","value":"spark"},{"text":"ssr","value":"ssr"},{"text":"suburban","value":"suburban"},{"text":"tacuma","value":"tacuma"},{"text":"tahoe","value":"tahoe"},{"text":"tracker","value":"tracker"},{"text":"trailblazer","value":"trailblazer"},{"text":"trans sport","value":"transsport"},{"text":"traverse","value":"traverse"},{"text":"uplander","value":"uplander"}],
    },
    'citroen': {
        id: 12,
        list: [{"text":"2 cv","value":"2cv"},{"text":"ax","value":"ax"},{"text":"berlingo","value":"berlingo"},{"text":"bx","value":"bx"},{"text":"c1","value":"c1"},{"text":"c15","value":"c15"},{"text":"c2","value":"c2"},{"text":"c25","value":"c25"},{"text":"c3","value":"c3"},{"text":"c35","value":"c35"},{"text":"c3 picasso","value":"c3_picasso"},{"text":"c3 pluriel","value":"c3pluriel"},{"text":"c4","value":"c4"},{"text":"c4 aircross","value":"c4_aircross"},{"text":"c4 picasso","value":"c4_picasso"},{"text":"c4 cactus","value":"c4cactus"},{"text":"c5","value":"c5"},{"text":"c6","value":"c6"},{"text":"c8","value":"c8"},{"text":"c-elysée","value":"c_elysee"},{"text":"c-crosser","value":"ccrosser"},{"text":"c-elysee","value":"celysee"},{"text":"cx","value":"cx"},{"text":"ds","value":"ds"},{"text":"ds19","value":"ds19"},{"text":"ds20","value":"ds20"},{"text":"ds21","value":"ds21"},{"text":"ds23","value":"ds23"},{"text":"ds3","value":"ds3"},{"text":"ds4","value":"ds4"},{"text":"ds5","value":"ds5"},{"text":"evasion","value":"evasion"},{"text":"grand c4 picasso","value":"grandc4picasso"},{"text":"jumper","value":"jumper"},{"text":"jumpy","value":"jumpy"},{"text":"nemo","value":"nemo"},{"text":"saxo","value":"saxo"},{"text":"sm","value":"sm"},{"text":"visa","value":"visa"},{"text":"xantia","value":"xantia"},{"text":"xm","value":"xm"},{"text":"xsara","value":"xsara"},{"text":"xsara picasso","value":"xsara_picasso"},{"text":"zx","value":"zx"}],
    },
    'dacia':{
        id: 13,
        list: [{"text":"dokker","value":"dokker"},{"text":"duster","value":"duster"},{"text":"lodgy","value":"lodgy"},{"text":"logan","value":"logan"},{"text":"logan mcv","value":"loganmcv"},{"text":"pick-up double cab","value":"pickupdoublecab"},{"text":"sandero","value":"sandero"},{"text":"solenza","value":"solenza"}],
    },
    'ferrari': {
        id: 16,
        list: [{"text": "modèle", "value": ""}, {"text": "458", "value": "458"}, {
            "text": "488",
            "value": "488"
        }, {"text": "california", "value": "california"}, {"text": "f40", "value": "f40"}, {
            "text": "f430",
            "value": "f430"
        }, {"text": "nitro", "value": "nitro"}, {"text": "ram", "value": "ram"}],
    },
    'fiat': {id: 17,
        list: [{"text":"126","value":"126"},{"text":"127","value":"127"},{"text":"131","value":"131"},{"text":"500","value":"500"},{"text":"500c","value":"500c"},{"text":"500l","value":"500l"},{"text":"500x","value":"500x"},{"text":"albea","value":"albea"},{"text":"barchetta","value":"barchetta"},{"text":"bertone","value":"bertone"},{"text":"brava","value":"brava"},{"text":"bravo","value":"bravo"},{"text":"burstner","value":"burstner"},{"text":"cinquecento","value":"cinquecento"},{"text":"croma","value":"croma"},{"text":"doblo","value":"doblo"},{"text":"ducato","value":"ducato"},{"text":"fiorino","value":"fiorino"},{"text":"freemont","value":"freemont"},{"text":"grande punto","value":"grandepunto"},{"text":"idea","value":"idea"},{"text":"linea","value":"linea"},{"text":"marea","value":"marea"},{"text":"multipla","value":"multipla"},{"text":"palio","value":"palio"},{"text":"panda","value":"panda"},{"text":"pinto","value":"pinto"},{"text":"punto","value":"punto"},{"text":"regata","value":"regata"},{"text":"ritmo","value":"ritmo"},{"text":"scudo","value":"scudo"},{"text":"sedici","value":"sedici"},{"text":"seicento","value":"seicento"},{"text":"siena","value":"siena"},{"text":"stilo","value":"stilo"},{"text":"tempra","value":"tempra"},{"text":"tipo","value":"tipo"},{"text":"ulysse","value":"ulysse"},{"text":"uno","value":"uno"}]},
    'ford': {id: 18, list: [{"text":"bedford","value":"bedford"},{"text":"c-max","value":"c-max"},{"text":"capri","value":"capri"},{"text":"connect","value":"connect"},{"text":"cougar","value":"cougar"},{"text":"courrier","value":"courrier"},{"text":"crown victoria","value":"crownvictoria"},{"text":"edge","value":"edge"},{"text":"escape","value":"escape"},{"text":"escort","value":"escort"},{"text":"excursion","value":"excursion"},{"text":"expedition","value":"expedition"},{"text":"explorer","value":"explorer"},{"text":"f150","value":"f150"},{"text":"f250","value":"f250"},{"text":"f350","value":"f350"},{"text":"fiesta","value":"fiesta"},{"text":"focus","value":"focus"},{"text":"focus c-max","value":"focuscmax"},{"text":"fusion","value":"fusion"},{"text":"galaxy","value":"galaxy"},{"text":"gt","value":"gt"},{"text":"ka","value":"ka"},{"text":"kuga","value":"kuga"},{"text":"maverick","value":"maverick"},{"text":"minibus","value":"minibus"},{"text":"mondeo","value":"mondeo"},{"text":"mustang","value":"mustang"},{"text":"orion","value":"orion"},{"text":"probe","value":"probe"},{"text":"puma","value":"puma"},{"text":"ranger","value":"ranger"},{"text":"s-max","value":"s-max"},{"text":"scorpio","value":"scorpio"},{"text":"sierra","value":"sierra"},{"text":"street ka","value":"streetka"},{"text":"super duty","value":"superduty"},{"text":"thunderbird","value":"thunderbird"},{"text":"tourneo","value":"tourneo"},{"text":"transit","value":"transit"},{"text":"victoria","value":"victoria"}]},
    'honda': {id: 22,
        list: [{"text":"accent","value":"accent"},{"text":"accord","value":"accord"},{"text":"acty","value":"acty"},{"text":"aerodeck","value":"aerodeck"},{"text":"boss","value":"boss"},{"text":"city","value":"city"},{"text":"civic","value":"civic"},{"text":"concerto","value":"concerto"},{"text":"cr-v","value":"cr-v"},{"text":"cr-x","value":"crx"},{"text":"fr-v","value":"frv"},{"text":"hr-v","value":"hrv"},{"text":"integra","value":"integra"},{"text":"jazz","value":"jazz"},{"text":"legend","value":"legend"},{"text":"logo","value":"logo"},{"text":"nsx","value":"nsx"},{"text":"odyssey","value":"odyssey"},{"text":"prelude","value":"prelude"},{"text":"s 2000","value":"s2000"},{"text":"shuttle","value":"shuttle"},{"text":"stream","value":"stream"},{"text":"vigor","value":"vigor"}]
    },
    'hummer': {id: 23,
        list: [{"text":"h2","value":"h2"},{"text":"h3","value":"h3"}]},
    'hyundai': {id: 24,
        list: [{"text":"accent","value":"accent"},{"text":"atos","value":"atos"},{"text":"atos prime","value":"atos_prime"},{"text":"azera","value":"azera"},{"text":"centennial","value":"centennial"},{"text":"county","value":"county"},{"text":"coupe","value":"coupe"},{"text":"creta","value":"creta"},{"text":"elantra","value":"elantra"},{"text":"excel","value":"excel"},{"text":"galloper","value":"galloper"},{"text":"genesis","value":"genesis"},{"text":"getz","value":"getz"},{"text":"grand i10","value":"grand_i10"},{"text":"grandeur","value":"grandeur"},{"text":"h","value":"h"},{"text":"h-1","value":"h-1"},{"text":"h-100","value":"h-100"},{"text":"h200","value":"h200"},{"text":"i 10","value":"i_10"},{"text":"i 20","value":"i_20"},{"text":"i 30","value":"i_30"},{"text":"i 40","value":"i_40"},{"text":"ix55","value":"ix55"},{"text":"ix 35","value":"ix_35"},{"text":"lantra","value":"lantra"},{"text":"matrix","value":"matrix"},{"text":"pony","value":"pony"},{"text":"santa fe","value":"santa_fe"},{"text":"santamo","value":"santamo"},{"text":"satellite","value":"satellite"},{"text":"sonata","value":"sonata"},{"text":"sonica","value":"sonica"},{"text":"terracan","value":"terracan"},{"text":"trajet","value":"trajet"},{"text":"tucson","value":"tucson"},{"text":"veloster","value":"veloster"},{"text":"veracruz","value":"veracruz"},{"text":"xg","value":"xg"}]},
    'infiniti':
        {
            id: 25,
            list: [{"text":"ex35","value":"ex35"},{"text":"fx35","value":"fx35"},{"text":"fx50","value":"fx50"},{"text":"g35","value":"g35"},{"text":"g37","value":"g37"}]
        },
    'jaguar': {id: 28,
        list: [{"text":"f-type","value":"f-type"},{"text":"s-type","value":"s-type"},{"text":"sovreign","value":"sovreign"},{"text":"x-type","value":"x-type"},{"text":"xf","value":"xf"},{"text":"xj","value":"xj"},{"text":"xj6","value":"xj6"},{"text":"xj8","value":"xj8"},{"text":"xk8","value":"xk8"},{"text":"xkr","value":"xkr"}]},

    'jeep':{id:29,
        list: [{"text":"cherokee","value":"cherokee"},{"text":"cj5","value":"cj5"},{"text":"commander","value":"commander"},{"text":"compass","value":"compass"},{"text":"dallas","value":"dallas"},{"text":"grand cherokee","value":"grand_cherokee"},{"text":"kaisser","value":"kaisser"},{"text":"liberty","value":"liberty"},{"text":"m151 mutt","value":"m151mutt"},{"text":"patriot","value":"patriot"},{"text":"wrangler","value":"wrangler"}]},
    'kia': 30,
    'land rover':{ id: 33,
        list: [{"text":"defender","value":"defender"},{"text":"freelander","value":"freelander"},{"text":"range rover","value":"range_rover"},{"text":"range rover evoque","value":"range_rover_evoque"},{"text":"range rover sport","value":"range_rover_sport"}]
    },
    'lexus': {id: 34,
        list: [{"text":"ls","value":"ls"},{"text":"rx","value":"rx"}],
    },
    'maserati': {id: 38,
        list: [{"text":"3200 gt","value":"3200_gt"},{"text":"4200 gt","value":"4200_gt"},{"text":"quattroporte","value":"quattroporte"}]
    },
    'mazda': {
        id: 40,
        list: [{"text":"2","value":"2"},{"text":"3","value":"3"},{"text":"5","value":"5"},{"text":"6","value":"6"},{"text":"121","value":"121"},{"text":"323","value":"323"},{"text":"626","value":"626"},{"text":"929","value":"929"},{"text":"astina","value":"astina"},{"text":"b 2500","value":"b2500"},{"text":"bk","value":"bk"},{"text":"bongo","value":"bongo"},{"text":"bt-50","value":"bt-50"},{"text":"cx-9","value":"cx-9"},{"text":"cx-3","value":"cx3"},{"text":"cx-5","value":"cx5"},{"text":"cx7","value":"cx7"},{"text":"demio","value":"demio"},{"text":"e2000","value":"e2000"},{"text":"familia","value":"familia"},{"text":"mpv","value":"mpv"},{"text":"mx-5","value":"mx-5"},{"text":"mx3","value":"mx3"},{"text":"mx6","value":"mx6"},{"text":"premacy","value":"premacy"},{"text":"rx-8","value":"rx-8"},{"text":"rx7","value":"rx7"},{"text":"sportiva","value":"sportiva"},{"text":"tribute","value":"tribute"},{"text":"xedos","value":"xedos"}]
    },
    'mercedes-benz': {id: 41,
        list:[{"text":"190","value":"190"},{"text":"210","value":"210"},{"text":"220","value":"220"},{"text":"230","value":"230"},{"text":"240","value":"240"},{"text":"250","value":"250"},{"text":"260","value":"260"},{"text":"270","value":"270"},{"text":"280","value":"280"},{"text":"300","value":"300"},{"text":"400","value":"400"},{"text":"408","value":"408"},{"text":"410","value":"410"},{"text":"412","value":"412"},{"text":"560","value":"560"},{"text":"608","value":"608"},{"text":"207d","value":"207d"},{"text":"310d","value":"310d"},{"text":"amg gt","value":"amggt"},{"text":"citan","value":"citan"},{"text":"classe a","value":"classe_a"},{"text":"classe b","value":"classe_b"},{"text":"classe c","value":"classe_c"},{"text":"classe cl","value":"classe_cl"},{"text":"classe cla","value":"classe_cla"},{"text":"classe clk","value":"classe_clk"},{"text":"classe cls","value":"classe_cls"},{"text":"classe e","value":"classe_e"},{"text":"classe g","value":"classe_g"},{"text":"classe gl","value":"classe_gl"},{"text":"classe gla","value":"classe_gla"},{"text":"classe glc","value":"classe_glc"},{"text":"classe gle","value":"classe_gle"},{"text":"classe gls","value":"classe_gls"},{"text":"classe m","value":"classe_m"},{"text":"classe s","value":"classe_s"},{"text":"classe sl","value":"classe_sl"},{"text":"classe slk","value":"classe_slk"},{"text":"classe v","value":"classe_v"},{"text":"classe c coupe","value":"classeccoupe"},{"text":"classe clc","value":"classeclc"},{"text":"classe glk","value":"classeglk"},{"text":"classe ml","value":"classeml"},{"text":"classe r","value":"classer"},{"text":"classe slc","value":"classeslc"},{"text":"classe slr","value":"classeslr"},{"text":"classe sls","value":"classesls"},{"text":"mb","value":"mb"},{"text":"road star","value":"roadstar"},{"text":"sprinter","value":"sprinter"},{"text":"utilitaire","value":"utilitaire"},{"text":"vaneo","value":"vaneo"},{"text":"viano","value":"viano"},{"text":"vito","value":"vito"}]
    },
    'mini':{id: 42,
        list: [{"text":"cabrio","value":"cabrio"},{"text":"clubman","value":"clubman"},{"text":"cooper","value":"cooper"},{"text":"country man","value":"country_man"},{"text":"one","value":"one"}]
    },
    'mitsubishi':{id: 43,
        list: [{"text":"canter","value":"canter"},{"text":"l200","value":"l200"},{"text":"lancer","value":"lancer"},{"text":"nativa","value":"nativa"},{"text":"outlander","value":"outlander"},{"text":"pajero","value":"pajero"},{"text":"pajero sport","value":"pajero_sport"},{"text":"pick up","value":"pick_up"}]},
    'nissan':{id: 44,
        list: [{"text":"280","value":"280"},{"text":"300","value":"300"},{"text":"350z","value":"350z"},{"text":"370z","value":"370z"},{"text":"240sx","value":"240sx"},{"text":"almera","value":"almera"},{"text":"altima","value":"altima"},{"text":"bluebird","value":"bluebird"},{"text":"cabstar","value":"cabstar"},{"text":"evalia","value":"evalia"},{"text":"gtr","value":"gtr"},{"text":"infiniti","value":"infiniti"},{"text":"juke","value":"juke"},{"text":"king cab","value":"kingcab"},{"text":"king double cab","value":"kingdoublecab"},{"text":"kubistar","value":"kubistar"},{"text":"maxima","value":"maxima"},{"text":"micra","value":"micra"},{"text":"murano","value":"murano"},{"text":"navara","value":"navara"},{"text":"note","value":"note"},{"text":"pathfinder","value":"pathfinder"},{"text":"patrol","value":"patrol"},{"text":"patrol gr","value":"patrol_gr"},{"text":"pick up","value":"pick_up"},{"text":"prairie","value":"prairie"},{"text":"primastar","value":"primastar"},{"text":"primera","value":"primera"},{"text":"qashqai","value":"qashqai"},{"text":"rogue","value":"rogue"},{"text":"serena","value":"serena"},{"text":"sunny","value":"sunny"},{"text":"terrano","value":"terrano"},{"text":"tiida","value":"tiida"},{"text":"tino","value":"tino"},{"text":"trade","value":"trade"},{"text":"urvan","value":"urvan"},{"text":"vanette","value":"vanette"},{"text":"versa","value":"versa"},{"text":"x-trail","value":"x-trail"}]},
    'opel': {
        id: 45,
        list: [{"text":"adam","value":"adam"},{"text":"agila","value":"agila"},{"text":"antara","value":"antara"},{"text":"ascona","value":"ascona"},{"text":"astra","value":"astra"},{"text":"calibra","value":"calibra"},{"text":"campo","value":"campo"},{"text":"combo","value":"combo"},{"text":"corsa","value":"corsa"},{"text":"frontera","value":"frontera"},{"text":"gt","value":"gt"},{"text":"insignia","value":"insignia"},{"text":"kadett","value":"kadett"},{"text":"meriva","value":"meriva"},{"text":"mokka","value":"mokka"},{"text":"monterey","value":"monterey"},{"text":"movano","value":"movano"},{"text":"omega","value":"omega"},{"text":"opc","value":"opc"},{"text":"rekord","value":"rekord"},{"text":"signum","value":"signum"},{"text":"sintra","value":"sintra"},{"text":"speedster","value":"speedster"},{"text":"tigra","value":"tigra"},{"text":"vectra","value":"vectra"},{"text":"vivaro","value":"vivaro"},{"text":"zafira","value":"zafira"}]
    },
    'peugeot':{id: 46,
        list: [{"text":"104","value":"104"},{"text":"106","value":"106"},{"text":"107","value":"107"},{"text":"204","value":"204"},{"text":"205","value":"205"},{"text":"206","value":"206"},{"text":"207","value":"207"},{"text":"208","value":"208"},{"text":"301","value":"301"},{"text":"304","value":"304"},{"text":"305","value":"305"},{"text":"306","value":"306"},{"text":"307","value":"307"},{"text":"308","value":"308"},{"text":"309","value":"309"},{"text":"403","value":"403"},{"text":"404","value":"404"},{"text":"405","value":"405"},{"text":"406","value":"406"},{"text":"407","value":"407"},{"text":"504","value":"504"},{"text":"505","value":"505"},{"text":"506","value":"506"},{"text":"507","value":"507"},{"text":"508","value":"508"},{"text":"604","value":"604"},{"text":"605","value":"605"},{"text":"607","value":"607"},{"text":"806","value":"806"},{"text":"807","value":"807"},{"text":"1007","value":"1007"},{"text":"2008","value":"2008"},{"text":"206+","value":"206+"},{"text":"3008","value":"3008"},{"text":"4007","value":"4007"},{"text":"4008","value":"4008"},{"text":"5008","value":"5008"},{"text":"206 cc","value":"206cc"},{"text":"206 sw","value":"206sw"},{"text":"207 cc","value":"207cc"},{"text":"207 sw","value":"207sw"},{"text":"307 cc","value":"307cc"},{"text":"307 sw","value":"307sw"},{"text":"308 sw","value":"308sw"},{"text":"407 sw","value":"407sw"},{"text":"407 coupe","value":"407coupe"},{"text":"bipper","value":"bipper"},{"text":"boxer","value":"boxer"},{"text":"expert","value":"expert"},{"text":"j5","value":"j5"},{"text":"j9","value":"j9"},{"text":"partner","value":"partner"},{"text":"rcz","value":"rcz"},{"text":"tepee","value":"tepee"}]},
    'porsche': {id: 48,
        list: [{"text":"911 turbo","value":"911_turbo"},{"text":"911 carrera","value":"911_carrera"},{"text":"boxster","value":"boxster"},{"text":"carrera gt","value":"carrera_gt"},{"text":"cayenne","value":"cayenne"},{"text":"cayman","value":"cayman"},{"text":"panamera","value":"panamera"}]},
    'renault': {id: 49,
        list: [{"text":"12","value":"12"},{"text":"14","value":"14"},{"text":"16","value":"16"},{"text":"19","value":"19"},{"text":"30","value":"30"},{"text":"avantime","value":"avantime"},{"text":"b110","value":"b110"},{"text":"b120","value":"b120"},{"text":"b80","value":"b80"},{"text":"captur","value":"captur"},{"text":"capture","value":"capture"},{"text":"clio","value":"clio"},{"text":"espace","value":"espace"},{"text":"estafette","value":"estafette"},{"text":"express","value":"express"},{"text":"fluence","value":"fluence"},{"text":"fuego","value":"fuego"},{"text":"grand espace","value":"grand_espace"},{"text":"grand modus","value":"grandmodus"},{"text":"grand scenic","value":"grandscenic"},{"text":"kadjar","value":"kadjar"},{"text":"kangoo","value":"kangoo"},{"text":"koleos","value":"koleos"},{"text":"laguna","value":"laguna"},{"text":"laguna estate","value":"lagunaestate"},{"text":"latitude","value":"latitude"},{"text":"logan","value":"logan"},{"text":"mascott","value":"mascott"},{"text":"master","value":"master"},{"text":"megane","value":"megane"},{"text":"megane cabriolet","value":"meganecabriolet"},{"text":"megane cc","value":"meganecc"},{"text":"megane estate","value":"meganeestate"},{"text":"messenger","value":"messenger"},{"text":"microbus","value":"microbus"},{"text":"midlum","value":"midlum"},{"text":"modus","value":"modus"},{"text":"nevada","value":"nevada"},{"text":"r11","value":"r11"},{"text":"r18","value":"r18"},{"text":"r19","value":"r19"},{"text":"r20","value":"r20"},{"text":"r21","value":"r21"},{"text":"r25","value":"r25"},{"text":"r4","value":"r4"},{"text":"r5","value":"r5"},{"text":"r8","value":"r8"},{"text":"r9","value":"r9"},{"text":"safrane","value":"safrane"},{"text":"scenic","value":"scenic"},{"text":"spider","value":"spider"},{"text":"super 5","value":"super5"},{"text":"symbol","value":"symbol"},{"text":"talisman","value":"talisman"},{"text":"trafic","value":"trafic"},{"text":"twingo","value":"twingo"},{"text":"vel satis","value":"vel_satis"}]},
    'rover': {id: 62,
        list: [{"text":"25","value":"25"},{"text":"45","value":"45"},{"text":"75","value":"75"},{"text":"mini","value":"mini"},{"text":"serie 100","value":"s100"},{"text":"serie 200","value":"s200"},{"text":"serie 400","value":"s400"},{"text":"serie 600","value":"s600"},{"text":"serie 800","value":"s800"},{"text":"sd1","value":"sd1"},{"text":"streetwise","value":"streetwise"}]},
    'seat': {
        id: 50,
        list:[{"text":"alhambra","value":"alhambra"},{"text":"altea","value":"altea"},{"text":"altea xl","value":"alteaxl"},{"text":"arosa","value":"arosa"},{"text":"cordoba","value":"cordoba"},{"text":"exeo","value":"exeo"},{"text":"ibiza","value":"ibiza"},{"text":"inca","value":"inca"},{"text":"leon","value":"leon"},{"text":"leon st","value":"leonst"},{"text":"malaga","value":"malaga"},{"text":"marbella","value":"marbella"},{"text":"toledo","value":"toledo"},{"text":"vario","value":"vario"}]
    },
    'skoda': {
        id: 51,
        list:[{"text":"fabia","value":"fabia"},{"text":"favorit","value":"favorit"},{"text":"felicia","value":"felicia"},{"text":"octavia","value":"octavia"},{"text":"rapid","value":"rapid"},{"text":"roomster","value":"roomster"},{"text":"superb","value":"superb"},{"text":"yeti","value":"yeti"}],
    },
    'smart': {
        id: 52,
        list: [{"text":"crossblade","value":"crossblade"},{"text":"fortwo","value":"fortwo"},{"text":"smart","value":"smart"}]
    },

    'suzuki':{id: 55,
        list: [{"text":"aerio","value":"aerio"},{"text":"alto","value":"alto"},{"text":"apv","value":"apv"},{"text":"baleno","value":"baleno"},{"text":"carry","value":"carry"},{"text":"celerio","value":"celerio"},{"text":"grand vitara","value":"grand_vitara"},{"text":"ignis","value":"ignis"},{"text":"jimmy","value":"jimmy"},{"text":"jimny","value":"jimny"},{"text":"liana","value":"liana"},{"text":"maruti","value":"maruti"},{"text":"samurai","value":"samurai"},{"text":"splash","value":"splash"},{"text":"swift","value":"swift"},{"text":"sx4","value":"sx4"},{"text":"vitara","value":"vitara"},{"text":"wagon r","value":"wagonr"},{"text":"x-90","value":"x90"},{"text":"xl7","value":"xl7"}]},
    'toyota': {
        id: 56,
        list: [{"text":"4runner","value":"4runner"},{"text":"auris","value":"auris"},{"text":"avensis","value":"avensis"},{"text":"avensis verso","value":"avensisverso"},{"text":"aygo","value":"aygo"},{"text":"camry","value":"camry"},{"text":"carina","value":"carina"},{"text":"celica","value":"celica"},{"text":"corolla","value":"corolla"},{"text":"corolla verso","value":"corolla_verso"},{"text":"corona","value":"corona"},{"text":"fj","value":"fj"},{"text":"fj cruiser","value":"fjcruiser"},{"text":"hi ace","value":"hi_ace"},{"text":"highlander","value":"highlander"},{"text":"hilux","value":"hilux"},{"text":"land cruiser","value":"land_cruiser"},{"text":"lexus","value":"lexus"},{"text":"lite ace","value":"liteace"},{"text":"mr","value":"mr"},{"text":"paseo","value":"paseo"},{"text":"picnic","value":"picnic"},{"text":"prado","value":"prado"},{"text":"previa","value":"previa"},{"text":"prius","value":"prius"},{"text":"rav 4","value":"rav_4"},{"text":"runner","value":"runner"},{"text":"sienna","value":"sienna"},{"text":"starlet","value":"starlet"},{"text":"supra","value":"supra"},{"text":"tercel","value":"tercel"},{"text":"tundra","value":"tundra"},{"text":"verso","value":"verso"},{"text":"yaris","value":"yaris"},{"text":"yaris verso","value":"yaris_verso"}],
    },
    'volkswagen': {id: 58,
        list: [{"text":"amarok","value":"amarok"},{"text":"beetle","value":"beetle"},{"text":"bora","value":"bora"},{"text":"caddy","value":"caddy"},{"text":"caravelle","value":"caravelle"},{"text":"cc","value":"cc"},{"text":"coccinelle","value":"coccinelle"},{"text":"combi","value":"combi"},{"text":"corrado","value":"corrado"},{"text":"crafter","value":"crafter"},{"text":"eos","value":"eos"},{"text":"fox","value":"fox"},{"text":"gol","value":"gol"},{"text":"golf","value":"golf"},{"text":"golf 2","value":"golf2"},{"text":"golf 3","value":"golf3"},{"text":"golf 4","value":"golf4"},{"text":"golf 5","value":"golf5"},{"text":"golf 6","value":"golf6"},{"text":"golf 7","value":"golf7"},{"text":"golf plus","value":"golfplus"},{"text":"jetta","value":"jetta"},{"text":"karman","value":"karman"},{"text":"lt","value":"lt"},{"text":"lupo","value":"lupo"},{"text":"multivan","value":"multivan"},{"text":"new beetle","value":"newbeetle"},{"text":"parati","value":"parati"},{"text":"passat","value":"passat"},{"text":"passat cc","value":"passatcc"},{"text":"phaeton","value":"phaeton"},{"text":"polo","value":"polo"},{"text":"scirocco","value":"scirocco"},{"text":"sharan","value":"sharan"},{"text":"thing","value":"thing"},{"text":"tiguan","value":"tiguan"},{"text":"touareg","value":"touareg"},{"text":"touran","value":"touran"},{"text":"transporter","value":"transporter"},{"text":"up","value":"up"},{"text":"vento","value":"vento"}]
    },
    'volvo':
        {id: 59,
            list: [{"text":"c30","value":"c30"},{"text":"c70","value":"c70"},{"text":"s40","value":"s40"},{"text":"s60","value":"s60"},{"text":"s80","value":"s80"},{"text":"xc60","value":"xc60"},{"text":"xc70","value":"xc70"},{"text":"xc90","value":"xc90"}],
        }
};

getBrindId = (brind) => {
    let brands = Object.keys(brandId);
    let nearData = LevenshteinArray(brands, brind)[0].w;
    reconciliation.brand = nearData;
    //console.log('nearData', LevenshteinArray(brands, brind));
    return brandId[nearData];

};

getPricesAvito = (query)=>{
    let query_form = (query , page =1)=> {
        return {query:query,
            p:page,
            hasMapItems:true,
            suggest:false,
            firstPageCount:20};
    };
    getNearedModel = (model, list) => {
        textList =  Object.keys(list).map(val => list[val].text);
        let nearModel = LevenshteinArray(textList, model)[0];
        for(var o in list) {
            if(list[o].text === nearModel.w){
                console.log(list[o].value);
                return list[o].value;
            }
        }
    };
    const options = (query,page)=>{
        let myBrand = getBrindId(query.query);

        //calc year ==2019 = 39
        const model = getNearedModel(query.model, myBrand.list);
        console.log(
            `https://www.avito.ma/lij?cg=2010&cb=${myBrand.id}&rs=${parseInt(query.year) - 1980}&re=${parseInt(query.year) - 1980}&mo=${model}&o=${page}`
        );
        reconciliation.model = model;
        return {
            method: 'GET',
            uri: `https://www.avito.ma/lij?cg=2010&cb=${myBrand.id}&rs=${parseInt(query.year) - 1980}&re=${parseInt(query.year) - 1980}&mo=${model}&o=${page}`,
            json: true ,// Automatically stringifies the body to JSON
            family : 4
        };
    };
    let prices = [];
    return new Promise(
        function (resolve, reject) {
            rp(options(query,1)).then((data)=>{
                const extracted_ads = parseInt(data.extracted_ads);
                if(extracted_ads > 0)
                prices = prices.concat(data.list_ads.map((e)=>{
                    if(e.price){
                        let price = e.price;
                        price = price.replace('.','');
                        return parseFloat(price);
                    }
                }));
                rp(options(query,2)).then((data)=>{
                    if(extracted_ads > 20)
                    prices = prices.concat(data.list_ads.map((e)=>{
                        if(e.price){
                            let price = e.price;
                            price = price.replace('.','');
                            return parseFloat(price);
                        }
                    }));
                    //console.log('data.extracted_ads', data.extracted_ads);
                    rp(options(query,3)).then((data)=>{
                        if(extracted_ads > 40)
                        prices = prices.concat(data.list_ads.map((e)=>{
                            if(e.price){
                                let price = e.price;
                                price = price.replace('.','');
                                return parseFloat(price);
                            }

                        }));
                       rp(options(query,4)).then((data)=>{
                            if(extracted_ads > 60)
                            prices = prices.concat(data.list_ads.map((e)=>{
                                if(e.price){
                                    let price = e.price;
                                    price = price.replace('.','');
                                    return parseFloat(price);
                                }
                            }));
                        })
                    })
                })
            })
                .then(()=>{
                    //console.log('tes');
                    let query_price = {provider : 'avito',query : query , resolved: reconciliation, prices : prices, prices_filtred : calculService.filterOutliers(prices)}
                    resolve(query_price);
                });
        });

};

module.exports = {
    getMeanPrice
};
