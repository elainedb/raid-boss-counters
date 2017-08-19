'use strict';

const SimpleIntent = require('./shared/simpleIntent');
const froot = require('./shared/_utils').froot;

const INTENT_ID = 'intent.choose_boss';

const ENTITY_POKEMON = 'pokemon';

const ENTITY_TYRANITAR = 'tyranitar';

class ChooseBoss extends SimpleIntent {

    constructor(req) {
        super(INTENT_ID, req);
    }

    trigger(app) {

        this.bossEntity = app.getArgument(ENTITY_POKEMON);
        this.bossUser = this.req.result.resolvedQuery;

        let pSpeech = new Promise((resolve, reject) => {
            const locTestRoute = froot.child("speech/test/" + this.lang);
            locTestRoute.on("value", function (snapshot) {
                return resolve(snapshot.val());
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
                return reject(errorObject);
            });
        });

        let pData = new Promise((resolve, reject) => {
            const bossRoute = froot.child("boss/" + this.bossEntity);
            bossRoute.on("value", function (snapshot) {
                return resolve(snapshot.val());
            }, function (errorObject) {
                console.log("The read failed: " + errorObject.code);
                return reject(errorObject);
            });

        });

        Promise.all([pSpeech, pData]).then(values => {
            this.speech(app, values);
        });
    }

    speech(app, values) {
        let speechText = values[0] ? values[0] : "this is a not localized text:";
        let data = values[1];

        if (data) {
            if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {
                let richResponse = app.buildRichResponse()
                    .addSimpleResponse(`<speak>${speechText} ${this.bossUser}</speak>`)
                    .addBasicCard(
                        app.buildBasicCard(`Picture: ${this.bossEntity}.`)
                            .setImage(data.img, "img")
                            .addButton(`Learn more about ${this.bossEntity}`, data.link))
                    .addSimpleResponse(`<speak>Counters: Supreme: ${data.counters.supreme}, 
                                           Good: ${data.counters.good}, 
                                           Tank: ${data.counters.tank}</speak>`);
                app.tell(richResponse);

            } else {
                app.tell(`<speak>${speechText} ${this.bossUser} -- 
                    Supreme: ${data.counters.supreme},
                    Good: ${data.counters.good},
                    Tank: ${data.counters.tank}
                    </speak>`);
            }
        } else {
            app.tell(`<speak>Sorry no data yet</speak>`);
        }

        //TODO localize everything (poke name, counters info etc) in Firebase
    }
}

module.exports = ChooseBoss;