'use strict';

class SimpleIntent {

    constructor(intentId) {
        this.intentId = intentId;
    }

    /**
     * @param app {ApiAiApp}
     */
    trigger(app) {
        throw new Error('Not implemented');
    }

    /**
     * @param app {ApiAiApp}
     */
    safeTrigger(app) {
        try {
            this.trigger(app);
        }
        catch (e) {
            console.error(e);
        }
    }

    register(actionMap) {
        actionMap.set(this.intentId, this.safeTrigger.bind(this));
    }
}

module.exports = SimpleIntent;