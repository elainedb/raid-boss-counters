'use strict';

class AbstractIntent {

    /**
     * @param actionMap {object<string, string>}
     */
    register(actionMap) {
        throw new Error('Not implemented');
    }
}

module.exports = AbstractIntent;