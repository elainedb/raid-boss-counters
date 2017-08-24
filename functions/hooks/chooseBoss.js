'use strict';

const SimpleIntent = require('./shared/simpleIntent');
const froot = require('./shared/_utils').froot;

const INTENT_ID = 'intent.choose_boss';

const ENTITY_POKEMON = 'pokemon';

class ChooseBoss extends SimpleIntent {

    constructor(req) {
        super(INTENT_ID, req);
    }

    trigger(app) {
        this.bossEntity = app.getArgument(ENTITY_POKEMON);
        this.bossUser = this.req.result.resolvedQuery;

        let pSpeech = new Promise((resolve, reject) => {
            froot.child("speech/test/" + this.lang).once("value", function (snapshot) {
                return resolve(snapshot.val());
            });
        });

        let pData = new Promise((resolve, reject) => {
            froot.child("boss/" + this.bossEntity).once("value", function (snapshot) {
                return resolve(snapshot);
            });
        });

        Promise.all([pSpeech, pData]).then(values => {
            this.speech(app, values);
        });
    }

    movesPromise(moves) {
        console.log("in movesPromise");
        let self = this;
        return new Promise((resolve, reject) => {
            let chargeMoves = [];
            if (moves) {
                // TODO NOT OK
                moves.forEach(move => {
                    froot.child(`moves/${move}/${self.lang}`).once("value", function (snapshot) {
                        let locMov = snapshot.val();
                        chargeMoves.push(locMov);
                    });
                });
            }
            resolve(chargeMoves);
        });
    }

    speech(app, values) {
        let self = this;

        let speechText = values[0] ? values[0] : "this is a not localized text:";
        let snapBoss = values[1];

        let supremeRoute = snapBoss.child("counters/supreme");
        let goodRoute = snapBoss.child("counters/good");
        let tankRoute = snapBoss.child("counters/tank");
        let glassRoute = snapBoss.child("counters/glass");

        let counters = [supremeRoute, goodRoute, glassRoute, tankRoute];

        // snap.key = poke key
        let bossData = snapBoss.val();

        if (app.hasSurfaceCapability(app.SurfaceCapabilities.SCREEN_OUTPUT)) {

            let richResponse = app.buildRichResponse()
                .addSimpleResponse(`<speak>${speechText} ${this.bossUser}</speak>`)
                // TODO add Basic Card does not work, why??
                .addBasicCard(
                    app.buildBasicCard(`Picture: ${this.bossEntity}.`)
                        .setTitle(`${this.bossEntity}`)
                        .setImage(bossData.img, "img")
                        .addButton(`Learn more about ${this.bossEntity}`, bossData.link));

            let listResponse = app.buildList('Counters list');

            counters.forEach(level => {
                console.log(level.key);
                let pokeList = level.val();
                console.log(pokeList);
                if (pokeList) {
                    pokeList.forEach(poke => {
                        console.log(poke);

                        // for in sync, can not go get firebase info or promise here, make them sync (get them out)
                        listResponse.addItems(app.buildOptionItem(poke._id)
                            .setTitle(poke._id)
                            // \n does not work in description...
                            .setDescription('level: ' + level.key
                                + '\nquick move:' + poke.quick
                                + '\ncharge move:' + poke.charge)
                            .setImage("", "img"));

                        // TODO review for localization
                        //     Promise.all([movesPromise(poke.quick), movesPromise(poke.charge)]).then(values => {
                        //         console.log(values);
                        //         froot.child(`poke/${poke._id}`).once("value", function (snapshot) {
                        //             let poke = snapshot.val();
                        //             console.log(poke._id);
                        //             listResponse.addItems(app.buildOptionItem(poke.name[self.lang])
                        //                 .setTitle(poke.name[self.lang])
                        //                 .setDescription(`
                        //                 level: ${level.key}\n
                        //                 quick move:${values[0]}\n
                        //                 charge move:${values[1]}`)
                        //                 .setImage(poke.img, "img"));
                        //         });
                        //     });
                    });
                    console.log("end of foreach poke");
                }
            });
            console.log("end of foreach level");

            app.askWithList(richResponse, listResponse);

        } else {
            // TODO redo when phone mode OK
            let msg = "";
            counters.forEach(level => {
                if (level.val()) {
                    msg += `<p>- ${level.key}: `;
                    level.val().forEach(poke => {
                        msg += `<s>${poke}, </s>`;
                    });
                    msg += `</p>`;
                }
            });

            app.ask(`<speak>${speechText} ${this.bossUser} ${msg}</speak>`);
        }
    }
}


module.exports = ChooseBoss;