/*
===========================================================
game.js

Game logic.

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
Return the correct nine forms.
-----------------------------------------------------------
*/
function getCorrectForms() {

    const baseindex = state.currentDhatu.baseindex;

    const lakara = getSelectedLakara();

    const dhatuForms = state.forms[baseindex];

    if (!dhatuForms) {

        throw new Error(
            "No forms found for baseindex " + baseindex
        );

    }

    // Try the selected key first.
    // Example: alat

    let formString = dhatuForms[lakara];

    // If not found, try the alternate key.
    // Example: alat -> plat

    if (!formString) {

        const alternateLakara = "p" + lakara.substring(1);

        formString = dhatuForms[alternateLakara];

    }

    if (!formString) {

        throw new Error(
            "No forms found for lakara " + lakara
        );

    }

    return formString
        .split(";")
        .map(f => normalizeForm(f));

}


/*
-----------------------------------------------------------
Check one answer.
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
Evaluate all answers.
-----------------------------------------------------------
*/
function evaluateAnswers() {

    const userAnswers = getUserAnswers();

    const correctAnswers = getCorrectForms();

    console.log("====================================");
    console.log("Current Dhatu :", state.currentDhatu.dhatu);
    console.log("Base Index    :", state.currentDhatu.baseindex);
    console.log("Lakara        :", getSelectedLakara());
    console.log("Correct Forms :", correctAnswers);

    let score = 0;

    for (let i = 0; i < 9; i++) {

        console.log("------------------------------------");
        console.log("Cell", i);

        console.log(
            "User    :",
            JSON.stringify(userAnswers[i])
        );

        console.log(
            "Correct :",
            JSON.stringify(correctAnswers[i])
        );

        const correct = isCorrect(
            userAnswers[i],
            correctAnswers[i]
        );

        console.log(
            "Match   :",
            correct
        );

        if (correct) {
            score++;
        }

        markAnswer(
            i,
            correct,
            correctAnswers[i]
        );

    }

    console.log("Score :", score);

    state.score = score;

    updateScore(score);

}
