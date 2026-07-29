/*
===========================================================
app.js

Application entry point.

===========================================================
*/


/*
-----------------------------------------------------------
Global application state
-----------------------------------------------------------
*/

const state = {

    dhatus: [],

    forms: {},

    practiceList: null,

    eligibleDhatus: [],

    currentDhatu: null,

    score: 0

};


/*
-----------------------------------------------------------
Initialise the application.
-----------------------------------------------------------
*/

async function initialise() {

    try {

        await loadData();

        newQuestion();

        registerEventHandlers();

    }
    catch (error) {

        console.error(error);

        alert(error.message);

    }

}


/*
-----------------------------------------------------------
Register all button and control events.
-----------------------------------------------------------
*/

function registerEventHandlers() {

    /*
    ---------------------------------------
    Submit
    ---------------------------------------
    */

    document
        .getElementById("submitButton")
        .addEventListener(
            "click",
            evaluateAnswers
        );


    /*
    ---------------------------------------
    Clear
    ---------------------------------------
    */

    document
        .getElementById("clearButton")
        .addEventListener(
            "click",
            function () {

                clearTable();

                updateScore(0);

            }
        );


    /*
    ---------------------------------------
    New Question
    ---------------------------------------
    */

    document
        .getElementById("nextButton")
        .addEventListener(
            "click",
            newQuestion
        );


    /*
    ---------------------------------------
    Lakara changed

    Keep the same dhatu but clear the table.
    ---------------------------------------
    */

    document
        .getElementById("lakara")
        .addEventListener(
            "change",
            function () {

                clearTable();

                updateScore(0);

            }
        );

}


/*
-----------------------------------------------------------
Start the application once the page is loaded.
-----------------------------------------------------------
*/

window.addEventListener(

    "load",

    initialise

);
