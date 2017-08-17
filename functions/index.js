'use strict';

process.env.DEBUG = 'actions-on-google:error';
const App = require('actions-on-google').ApiAiApp;
const functions = require('firebase-functions');

require('./hooks/shared/object.ext');

// const Welcome = require('./hooks/welcome');
const ChooseBoss = require('./hooks/chooseBoss');

exports.raidcounters = functions.https.onRequest((request, response) => {

    const app = new App({request, response});
    console.log('### index : Request headers: ' + JSON.stringify(request.headers));
    console.log('### index : Request body: ' + JSON.stringify(request.body));

    let actionMap = new Map();
    [
        new ChooseBoss()
    ].forEach(i => i.register(actionMap));

    app.handleRequest(actionMap);
});
