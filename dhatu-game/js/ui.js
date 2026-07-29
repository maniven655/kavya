/*
===========================================================
ui.js

All user interface functions.

No game logic belongs here.

===========================================================
*/


/*
-----------------------------------------------------------
Display the currently selected dhatu.
-----------------------------------------------------------
*/
function displayDhatu(dhatu) {

    document.getElementById("dhatu").textContent = dhatu.dhatu;

    document.getElementById("artha").textContent = dhatu.artha;

    document.getElementById("gana").textContent =
        getGanaName(dhatu.gana);

    document.getElementById("pada").textContent =
        getPadaName(dhatu.pada);

}


/*
-----------------------------------------------------------
Return the selected lakara key.

Example:
    alat
    alit
-----------------------------------------------------------
*/
function getSelectedLakara() {

    return document.getElementById("lakara").value;

}


/*
-----------------------------------------------------------
Clear all nine input boxes.
-----------------------------------------------------------
*/
function clearInputs() {

    for (let i = 0; i < 9; i++) {

        const box = document.getElementById("c" + i);

        box.value = "";

    }

}


/*
-----------------------------------------------------------
Remove colouring and tooltips.
-----------------------------------------------------------
*/
function clearResultColours() {

    for (let i = 0; i < 9; i++) {

        const box = document.getElementById("c" + i);

        box.classList.remove("correct");
        box.classList.remove("incorrect");

        box.removeAttribute("title");

    }

}


/*
-----------------------------------------------------------
Completely reset the table.
-----------------------------------------------------------
*/
function clearTable() {

    clearInputs();

    clearResultColours();

}


/*
-----------------------------------------------------------
Update score display.
-----------------------------------------------------------
*/
function updateScore(score) {

    document.getElementById("score").textContent =
        score + " / 9";

}


/*
-----------------------------------------------------------
Return all user answers.

Returns:
[
    "...",
    "...",
    ...
]
-----------------------------------------------------------
*/
function getUserAnswers() {

    const answers = [];

    for (let i = 0; i < 9; i++) {

        answers.push(
            document.getElementById("c" + i).value.trim()
        );

    }

    return answers;

}


/*
-----------------------------------------------------------
Mark one answer.

correct = true/false

tooltip = expected answer(s)
-----------------------------------------------------------
*/
function markAnswer(index, correct, tooltip = "") {

    const box = document.getElementById("c" + index);

    box.classList.remove("correct");
    box.classList.remove("incorrect");

    if (correct) {

        box.classList.add("correct");

        box.removeAttribute("title");

    }
    else {

        box.classList.add("incorrect");

        box.title = tooltip;

    }

}


/*
-----------------------------------------------------------
Gana number -> Sanskrit name
-----------------------------------------------------------
*/
function getGanaName(gana) {

    const names = {

        "1": "भ्वादिगणः (१)",
        "2": "अदादिगणः (२)",
        "3": "जुहोत्यादिगणः (३)",
        "4": "दिवादिगणः (४)",
        "5": "स्वादिगणः (५)",
        "6": "तुदादिगणः (६)",
        "7": "रुधादिगणः (७)",
        "8": "तनादिगणः (८)",
        "9": "क्र्यादिगणः (९)",
        "10": "चुरादिगणः (१०)"

    };

    return names[gana] || gana;

}


/*
-----------------------------------------------------------
Pada code -> Sanskrit name
-----------------------------------------------------------
*/
function getPadaName(pada) {

    switch (pada) {

        case "P":
            return "परस्मैपदी";

        case "A":
            return "आत्मनेपदी";

        case "U":
            return "उभयपदी";

        default:
            return pada;

    }

}
