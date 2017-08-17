'use strict';
exports.DEFAULT_LIFESPAN = 5;

exports.reinitArrayIfEmpty = function (reference, actual) {
    return actual && actual.length > 1 && [... actual] || [... reference];
}

/**
 * Pick a random element from an array. Additional argument allow to exclude elements to be picked up from array
 *
 * @param array {[]} source array
 * @param exclusions {*|[]=} elements which should not be picked up
 * @return {*} picked element on null if array is null or empty
 */
exports.randomFromArray = function (array, exclusions) {
    if (!array || array.length === 0) {
        return null;
    }

    let picked = array[Math.floor(Math.random() * array.length - 1)];

    if (exclusions) {
        // pick again while in exclusions
        const exclusionsArray = exclusions instanceof Array ? exclusions : [exclusions];
        let limit = 10;
        do {
            picked = array[Math.floor(Math.random() * array.length)];
        } while (exclusionsArray.includes(picked) && limit-- >= 0);
    } else {
        picked = array[Math.floor(Math.random() * array.length)];
    }

    return picked;
};

exports.randomIndex = function (array) {
    let index = (Math.random() * (array - 1)).toFixed();
    return parseInt(index, 10);
};

/**
 * Remove an element from an array if element is present
 *
 * @param array {[]}
 * @param element {*}
 * @return {boolean} true if element was present, false otherwise
 */
exports.removeFromArray = function (array, element) {
    const index = array.indexOf(element);
    if (index >= 0) {
        array.splice(index, 1);
        return true;
    }
    return false;
};

/**
 * Return first array if defined and not empty, return fallback value otherwise
 *
 * @param array {[]}
 * @param fallback {[]}
 * @return {[]}
 */
exports.arrayOrDefaults = function (array, fallback) {
    return (array && array.length) ? array : fallback;
};

/**
 * Shortcut to ask something and display suggestions if display is available
 *
 * @param app {ApiAiApp}
 * @param text {string} ssml including <speak>
 * @param suggestions {string[]}
 * @param noInputs {Array<string>=} ask noInputs
 * @return {Object} ask HTTP response.
 */
exports.askWithSuggestions = function (app, text, textScreen, suggestions, noInputs) {
    if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
        let richResponse = app.buildRichResponse()
            .addSimpleResponse({speech: text,
                                displayText: textScreen})
            .addSuggestions(suggestions);
        return app.ask(richResponse);
    } else {
        return app.ask(text, noInputs);
    }
};

/**
 * @param {any} app
 * @param {T[]} answers
 * @return {T}
 */
exports.getRandomAnswer = function (answers) {
    if (!answers || answers.size < 1) {
        return null;
    }

    let randomIndex = (Math.random() * (answers.length - 1)).toFixed();
    let randomAnswer = answers[randomIndex];

    answers = answers.splice(randomIndex, 1);
    return randomAnswer;
};

/**
 * @param {*} app app passed from triiger function
 * @param {*} referenceList
 * @return {AnimalModel}
 */
exports.getAnimalList = (app, referenceList) => {
    return app.data.animalAnswers && app.data.animalAnswers.length > 0
        ? app.data.animalAnswers
        : referenceList.slice();
}

exports.getSong = function(app, chosenSong, songs, songsSrc) {
    let chosenSongSrc = chosenSong.content;

    app.data.song = `<audio src="${chosenSongSrc}"></audio>`;

    // songs.delete(chosenSong);
    // songsSrc.delete(chosenSongSrc);

    return `<audio src="${chosenSongSrc}"></audio>`;
};

exports.article = function indefinite_article(phrase) {

    // Getting the first word
    let match = /\w+/.exec(phrase);
    let word;
    if (match) word = match[0];
    else return "an";

    let l_word = word.toLowerCase();
    // Specific start of words that should be preceded by 'an'
    let alt_cases = ["honest", "hour", "hono"];
    for (let i in alt_cases) {
        if (l_word.indexOf(alt_cases[i]) === 0)
            return "an";
    }

    // Single letter word which should be preceeded by 'an'
    if (l_word.length === 1) {
        if ("aedhilmnorsx".indexOf(l_word) >= 0)
            return "an";
        else
            return "a";
    }

    // Capital words which should likely be preceeded by 'an'
    if (word.match(/(?!FJO|[HLMNS]Y.|RY[EO]|SQU|(F[LR]?|[HL]|MN?|N|RH?|S[CHKLMNPTVW]?|X(YL)?)[AEIOU])[FHLMNRSX][A-Z]/)) {
        return "an";
    }

    // Special cases where a word that begins with a vowel should be preceeded by 'a'
    let regexes = [/^e[uw]/, /^onc?e\b/, /^uni([^nmd]|mo)/, /^u[bcfhjkqrst][aeiou]/];
    for (let i in regexes) {
        if (l_word.match(regexes[i]))
            return "a";
    }

    // Special capital words (UK, UN)
    if (word.match(/^U[NK][AIEO]/)) {
        return "a";
    }
    else if (word === word.toUpperCase()) {
        if ("aehilmnorsx".indexOf(l_word[0]) >= 0)
            return "an";
        else
            return "a";
    }

    // Basic method of words that begin with a vowel being preceeded by 'an'
    if ("aeiou".indexOf(l_word[0]) >= 0) return "an";

    // Instances where y follwed by specific letters is preceeded by 'an'
    if (l_word.match(/^y(b[lor]|cl[ea]|fere|gg|p[ios]|rou|tt)/)) return "an";

    return "a";
};