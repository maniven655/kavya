/*
===========================================================
game.js

Game logic.

Supports:
- Parasmaipada only
- Ātmanepada only
- Both Parasmaipada and Ātmanepada

If both paradigms exist, the user's answers must belong
entirely to one paradigm. Mixed paradigms are rejected.

===========================================================
*/


/*
-----------------------------------------------------------
Normalize a Sanskrit form before comparison.
-----------------------------------------------------------
*/
function normalizeForm(text) {

    if (text === null || text === undefined) {
        return "";
    }

    return text
        .normalize("NFC")
        .replace(/\u00A0/g, " ")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .trim();

}


/*
-----------------------------------------------------------
Choose a random dhatu.
-----------------------------------------------------------
*/
function chooseRandomDhatu() {

    const list = state.eligibleDhatus;

    const index = Math.floor(Math.random() * list.length);

    state.currentDhatu = list[index];

}


/*
-----------------------------------------------------------
Start a new question.
-----------------------------------------------------------
*/
function newQuestion() {

    chooseRandomDhatu();

    displayDhatu(state.currentDhatu);

    clearTable();

    updateScore(0);

}


/*
-----------------------------------------------------------
Return available paradigms.

parasmaipada -> a...
ātmanepada   -> p...

-----------------------------------------------------------
*/
function getAvailableParadigms() {

    const baseindex = state.currentDhatu.baseindex;

    const lakara = getSelectedLakara();

    const dhatuForms = state.forms[baseindex];

    if (!dhatuForms) {

        throw new Error(
            "No forms found for baseindex " + baseindex
        );

    }

    const parasmaiKey = "a" + lakara.substring(1);
    const atmaneKey = "p" + lakara.substring(1);

    const result = {};

    if (dhatuForms[parasmaiKey]) {

        result.parasmaipada =
            dhatuForms[parasmaiKey]
                .split(";")
                .map(f => normalizeForm(f));

    }

    if (dhatuForms[atmaneKey]) {

        result.atmanepada =
            dhatuForms[atmaneKey]
                .split(";")
                .map(f => normalizeForm(f));

    }

    if (
        !result.parasmaipada &&
        !result.atmanepada
    ) {

        throw new Error(
            "No forms found for lakara " + lakara
        );

    }

    return result;

}


/*
-----------------------------------------------------------
Check one answer against one paradigm.
-----------------------------------------------------------
*/
function isCorrect(userAnswer, correctAnswer) {

    const user = normalizeForm(userAnswer);

    const accepted = correctAnswer
        .split(",")
        .map(a => normalizeForm(a));

    return accepted.includes(user);

}


/*
-----------------------------------------------------------
Evaluate an entire paradigm.

Returns

{
    score,
    matches
}

-----------------------------------------------------------
*/
function evaluateParadigm(userAnswers, correctAnswers) {

    let score = 0;

    const matches = [];

    for (let i = 0; i < 9; i++) {

        const ok = isCorrect(
            userAnswers[i],
            correctAnswers[i]
        );

        matches.push(ok);

        if (ok) {
            score++;
        }

    }

    return {
        score,
        matches
    };

}
/*
-----------------------------------------------------------
Evaluate all answers.
-----------------------------------------------------------
*/
function evaluateAnswers() {

    const userAnswers = getUserAnswers();

    const paradigms = getAvailableParadigms();

    const hasParasmaipada =
        paradigms.parasmaipada !== undefined;

    const hasAtmanepada =
        paradigms.atmanepada !== undefined;

    let chosen = null;
    let result = null;

    /*
    -------------------------------------------------------
    Only Parasmaipada exists.
    -------------------------------------------------------
    */
    if (
        hasParasmaipada &&
        !hasAtmanepada
    ) {

        chosen = paradigms.parasmaipada;

        result = evaluateParadigm(
            userAnswers,
            chosen
        );

    }

    /*
    -------------------------------------------------------
    Only Ātmanepada exists.
    -------------------------------------------------------
    */
    else if (
        hasAtmanepada &&
        !hasParasmaipada
    ) {

        chosen = paradigms.atmanepada;

        result = evaluateParadigm(
            userAnswers,
            chosen
        );

    }

    /*
    -------------------------------------------------------
    Both paradigms exist.

    User must answer entirely in one paradigm.
    -------------------------------------------------------
    */
    else {

        const parasmai =
            evaluateParadigm(
                userAnswers,
                paradigms.parasmaipada
            );

        const atmane =
            evaluateParadigm(
                userAnswers,
                paradigms.atmanepada
            );

        /*
        Perfect Parasmaipada
        */
        if (parasmai.score === 9) {

            chosen = paradigms.parasmaipada;

            result = parasmai;

        }

        /*
        Perfect Ātmanepada
        */
        else if (atmane.score === 9) {

            chosen = paradigms.atmanepada;

            result = atmane;

        }

        /*
        Mixed paradigm.

        Reject the whole table.
        */
        else {

            chosen = paradigms.parasmaipada;

            result = {

                score: 0,

                matches: new Array(9).fill(false)

            };

        }

    }

    console.log("====================================");
    console.log(
        "Current Dhatu :",
        state.currentDhatu.dhatu
    );
    console.log(
        "Base Index    :",
        state.currentDhatu.baseindex
    );
    console.log(
        "Lakara        :",
        getSelectedLakara()
    );

    for (let i = 0; i < 9; i++) {

        markAnswer(
            i,
            result.matches[i],
            chosen[i]
        );

    }

    state.score = result.score;

    updateScore(result.score);

}
/*
-----------------------------------------------------------
(Optional helper)

If you want tooltips to display BOTH paradigms when both
exist, use this helper instead of passing a single answer
to markAnswer().

Not required for validation; only for better tooltips.
-----------------------------------------------------------
*/
function getTooltipAnswer(index) {

    const paradigms = getAvailableParadigms();

    const p = paradigms.parasmaipada;
    const a = paradigms.atmanepada;

    if (p && a) {

        if (p[index] === a[index]) {
            return p[index];
        }

        return p[index] + "  |  " + a[index];

    }

    if (p) {
        return p[index];
    }

    return a[index];

}
