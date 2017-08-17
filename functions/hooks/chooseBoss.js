'use strict';

const SimpleIntent = require('./shared/simpleIntent');
const utils = require('./shared/_utils');

const INTENT_ID = 'intent.choose_boss';

const ENTITY_POKEMON = 'pokemon';

const ENTITY_TYRANATAR = 'tyranatar';

class ChooseBoss extends SimpleIntent {

    constructor() {
        super(INTENT_ID);
    }

    trigger(app) {
        switch (app.getArgument(ENTITY_POKEMON)) {
            case ENTITY_TYRANATAR:
                app.tell("YOYOYO");
                break;
            default:
                app.tell("NONONO");
        }
    }
}

module.exports = ChooseBoss;