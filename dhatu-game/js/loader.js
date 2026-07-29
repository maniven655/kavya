/*
===========================================================
loader.js

Loads all JSON files required by the application.

Files:
    data/dhatu.json
    data/dhatuformskartari.json
    data/practice.json (optional)

===========================================================
*/

async function loadData() {

    const ts = Date.now();

    // -----------------------------------------------------
    // Load dhatu.json
    // -----------------------------------------------------

    const dhatuResponse = await fetch(
        "data/dhatu.json?ts=" + ts,
        {
            cache: "no-store"
        }
    );

    console.log("Loading :", dhatuResponse.url);
    console.log("Status  :", dhatuResponse.status);

    if (!dhatuResponse.ok) {
        throw new Error("Unable to load data/dhatu.json");
    }

    const dhatuJson = await dhatuResponse.json();

    state.dhatus = dhatuJson.data;


    // -----------------------------------------------------
    // Load dhatuformskartari.json
    // -----------------------------------------------------

    const formsResponse = await fetch(
        "data/dhatuformskartari.json?ts=" + ts,
        {
            cache: "no-store"
        }
    );

    console.log("Loading :", formsResponse.url);
    console.log("Status  :", formsResponse.status);

    if (!formsResponse.ok) {
        throw new Error(
            "Unable to load data/dhatuformskartari.json"
        );
    }

    state.forms = await formsResponse.json();

    console.log("======================================");
    console.log("Loaded object for 01.0001");
    console.log(
        JSON.stringify(
            state.forms["01.0001"],
            null,
            2
        )
    );
    console.log(
        "Keys:",
        Object.keys(state.forms["01.0001"])
    );
    console.log("======================================");


    // -----------------------------------------------------
    // Load practice.json (optional)
    // -----------------------------------------------------

    state.practiceList = null;

    try {

        const practiceResponse = await fetch(
            "data/practice.json?ts=" + ts,
            {
                cache: "no-store"
            }
        );

        console.log("Loading :", practiceResponse.url);
        console.log("Status  :", practiceResponse.status);

        if (practiceResponse.ok) {

            state.practiceList =
                await practiceResponse.json();

        }

    }
    catch (error) {

        // practice.json is optional

    }


    // -----------------------------------------------------
    // Build eligible dhatu list
    // -----------------------------------------------------

    if (Array.isArray(state.practiceList)) {

        const practiceSet = new Set(state.practiceList);

        state.eligibleDhatus =
            state.dhatus.filter(d =>
                practiceSet.has(d.baseindex)
            );

        if (state.eligibleDhatus.length === 0) {

            state.eligibleDhatus = state.dhatus;

        }

    }
    else {

        state.eligibleDhatus = state.dhatus;

    }

}
