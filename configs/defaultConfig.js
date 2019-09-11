'use strict';

module.exports = {
    sites: [
        "https://pikabu.ru",
        "https://yandex.ru"
    ],
    emulatedFormFactors: ["desktop", ],
    throttlingMethods: ["provided",]
}


/*
    https://github.com/GoogleChrome/lighthouse/blob/master/docs/throttling.md
    
    throttlingMethods = [
        devtools: applied slow, 
        provided: no restrictions,
        simulated: simulated slow
    ],
    emulatedFormFactors = [
        desktop, mobile
    ]
*/