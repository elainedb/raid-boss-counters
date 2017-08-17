'use strict';

const SimpleIntent = require('./shared/simpleIntent');
const utils = require('./shared/_utils');
const chooseGameData = require('./chooseGame/chooseGameData');

const INTENT_ID = 'intent.input.welcome';

const CONTEXT_CHOOSE_GAME = "context_choose_game";
const DEFAULT_LIFESPAN = 5;

const WELCOME_SENTENCES = [
    "Hi little one! I am your cool auntie.",
    "Hello there, glad to hear you.",
    "Hi! I hope you are doing great.",
];

class Welcome extends SimpleIntent {

    constructor() {
        super(INTENT_ID);
    }

    trigger(app) {
        let welcomeResponse = utils.randomFromArray(WELCOME_SENTENCES);
        let chooseGameResponse = utils.randomFromArray(chooseGameData.CHOOSE_GAME_SENTENCES);

        app.setContext(CONTEXT_CHOOSE_GAME, DEFAULT_LIFESPAN, {});
        if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
            let richResponse = app.buildRichResponse()
                .addSimpleResponse(`<speak>${welcomeResponse} ${chooseGameResponse}</speak>`)
                .addSuggestions(chooseGameData.GAME_SUGGESTIONS);
            app.ask(richResponse);
        } else {
            app.ask(`<speak>${welcomeResponse} ${chooseGameResponse}</speak>`, chooseGameData.NO_INPUT_SUGGESTIONS);
        }
    }
}

module.exports = Welcome;