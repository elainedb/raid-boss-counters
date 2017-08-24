'use strict';

const SimpleIntent = require('./shared/simpleIntent');
const utils = require('./shared/_utils');

const INTENT_ID = 'input.welcome';

// TODO localize
const WELCOME_SENTENCES = [
    "Hi trainer! Please state a raid pokemon name and we will help you find the best counters.",
    "Hello trainer friend. Say a pokemon name you want to battle in a raid, I'll find the best counters for you!"
];

// TODO localize
const POKE_SUGGESTION = [
    "Tyranitar",
    "Muk",
    "Vaporeon"
];

class Welcome extends SimpleIntent {

    constructor(req) {
        super(INTENT_ID, req);
    }

    trigger(app) {

        let welcomeResponse = utils.randomFromArray(WELCOME_SENTENCES);

        if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
            let richResponse = app.buildRichResponse()
                .addSimpleResponse(`<speak>${welcomeResponse}</speak>`)
                .addSuggestions(POKE_SUGGESTION);
            app.ask(richResponse);
        } else {
            app.ask(`<speak>${welcomeResponse} </speak>`);
        }
    }
}

module.exports = Welcome;