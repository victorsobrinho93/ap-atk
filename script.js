// const calculateButton = document.getElementById("calc-btn");

// calculateButton.addEventListener("click", () => calculateAnomalyDamage());

function validateDataInput() {
    if (
        [
            state.selectedCharacter,
            state.selectedEngine,
            attackInput.value,
            anomalyInput.value,
        ].every((e) => e !== "")
    ) {
        calculateAnomalyDamage();
    }
}

const results = document.getElementById("results");
const engineForm = document.getElementById("engine-form");

const engine = document.getElementById("w-engine");

engine.addEventListener("change", () => {
    engineSettings.refresh();
    state.selectedEngine = engine.value;
    engineSettings.render();
    if (engine.value) {
        state.baseEngineAttack = engineData[engine.value].baseAtk;
        calculateEnginePassiveIncrease();
    }
    validateDataInput();
});

function createElementSet(textContent, htmlFor) {
    const labelElement = document.createElement("label");
    labelElement.textContent = textContent;
    labelElement.htmlFor = htmlFor;
    labelElement.classList.add("es-component");

    const selectElement = document.createElement("select");
    selectElement.id = htmlFor;
    selectElement.name = htmlFor;
    selectElement.classList.add("es-component");

    return { label: labelElement, select: selectElement };
}

function renderEngineRating() {
    const { select } = createElementSet("R", "engine-r");

    for (let i = 1; i <= 5; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${i}-Star${i > 1 ? "s" : ""}`;
        select.appendChild(option);
    }

    state.engineSelectedRating = 1;

    select.addEventListener("change", () => {
        state.engineSelectedRating = +select.value;
    });

    // engineForm.appendChild(label);
    engineForm.appendChild(select);
}

function renderEngineStacks(maximumStacks) {
    const { label, select } = createElementSet("Stacks", "engine-s");

    for (let i = 0; i <= maximumStacks; i++) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = `${i} stack${i !== 1 ? "s" : ""}`;
        if (i === Math.ceil(maximumStacks / 2)) {
            option.setAttribute("selected", "selected");
            state.enginePassiveMultiplier = i;
        }
        select.appendChild(option);
    }

    select.addEventListener("change", () => {
        state.enginePassiveMultiplier = +select.value;
    });

    // engineForm.appendChild(label);
    engineForm.appendChild(select);
}

function renderPassiveUptime() {
    const { select } = createElementSet("Uptime", "engine-s");
    for (let i = 0; i <= 100; i += 25) {
        const option = document.createElement("option");
        option.value = i / 100;
        option.textContent = `${i}% uptime`;
        if (i === 50) {
            option.setAttribute("selected", "selected");
            state.enginePassiveMultiplier = i / 100;
        }
        select.appendChild(option);
    }

    select.addEventListener("change", () => {
        state.enginePassiveMultiplier = +select.value;
    });

    // engineForm.appendChild(label);
    engineForm.appendChild(select);
}

//* Check
function calculateEnginePassiveIncrease() {
    const { atkValuePerStack: atk, anomalyValuePerStack: anomaly } =
        engineData[state.selectedEngine];

    const {
        selectedEngine: engine,
        engineSelectedRating: rating,
        enginePassiveMultiplier: multiplier,
    } = state;

    state.engineAttackIncrease =
        engine === "fusion" ? atk[rating] : atk ? atk[rating] * multiplier : 0;
    state.engineAnomalyIncrease = anomaly ? anomaly[rating] * multiplier : 0;
}

const engineSettings = {
    render() {
        if (
            !state.selectedEngine ||
            engineData[state.selectedEngine].stacks === null
        ) {
            state.engineAttackIncrease = 0;
            state.engineAnomalyIncrease = 0;
            return false;
        }

        const engineStacks = engineData[state.selectedEngine].stacks;
        renderEngineRating();
        if (engineStacks === 1) {
            renderPassiveUptime();
        } else {
            renderEngineStacks(engineStacks);
        }

        document.querySelectorAll(".es-component").forEach((element) => {
            element.addEventListener("change", () =>
                // calculateEnginePassiveIncrease()
                calculateAnomalyDamage()
            );
        });
    },
    refresh() {
        const settingsElements = document.querySelectorAll(".es-component");
        settingsElements.forEach((e) => e.remove());
    },
};

const attackInput = document.getElementById("attack");
attackInput.addEventListener("input", () => {
    state.attackInput = +attackInput.value;
    state.calculate();
});

const anomalyInput = document.getElementById("anomaly");
anomalyInput.addEventListener("input", () => {
    state.anomalyProficiency = +anomalyInput.value;
});

document
    .querySelectorAll(".data-input")
    .forEach((e) => e.addEventListener("input", () => validateDataInput()));

//todo: This whole function needs a rework. It is not working right...
function calculateAnomalyDamage() {
    if (!(+attackInput.value >= state.baseAttack && +anomalyInput.value >= 118))
        return false;

    const result = document.getElementById("result");
    const stats = document.getElementById("stat-count");
    let _attack = calculateTotalAttack(0);
    let _anomaly = calculateTotalAnomaly();

    stats.innerHTML = `Estimated Combat Stats - <b>ATK</b>: ${_attack.toFixed(
        0
    )} <b>AP</b>: ${_anomaly}`;

    const { proc, multiplier, color } =
        anomaly[characterData[state.selectedCharacter].element];
    result.setAttribute("style", `color:${color}`);
    result.textContent = `Base ${proc} ${
        proc === "Assault" ? "DMG" : "DPS"
    }: ${((multiplier * _attack * _anomaly) / 100).toFixed(0)}`;

    const st = document.getElementById("substat-table");
    st.innerHTML = "";
    st.appendChild(generateSubstatTable());
}

function generateSubstatTable() {
    const table = document.createElement("table");
    table.innerHTML = `
        <tr><th colspan="6">Anomaly Damage Increase</th></tr>
        <tr>
            <th>Stat</th>
            <th>-</th>
            <th>+1</th>
            <th>+2</th>
            <th>+3</th>
            <th>+4</th>
        </tr>
    `;
    const attackRow = document.createElement("tr");
    attackRow.appendChild(
        Object.assign(document.createElement("th"), { textContent: "ATK" })
    );

    for (let i = 1; i <= 5; i++) {
        const td = document.createElement("td");
        td.textContent = `${calculateAttackIncrease(i * 3)}%`;
        attackRow.appendChild(td);
    }

    const anomalyRow = document.createElement("tr");
    anomalyRow.appendChild(
        Object.assign(document.createElement("th"), { textContent: "AP" })
    );

    for (let i = 1; i <= 5; i++) {
        const td = document.createElement("td");
        td.textContent = `${calculateAnomalyIncrease(i)}%`;
        anomalyRow.appendChild(td);
    }

    table.appendChild(attackRow);
    table.appendChild(anomalyRow);

    return table;
}

function calculateTotalAttack(substatValue = 0) {
    state.calculate();
    calculateEnginePassiveIncrease();
    let attack =
        state.baseAttack *
            (1 + (state.attackIncreasePercentage + substatValue) / 100) *
            (1 + state.engineAttackIncrease / 100) +
        state.attackBuffIncrease;
    if (state.selectedCharacter === "jane") {
        const ap = calculateTotalAnomaly();
        if (ap > 120) {
            let increase = (ap - 120) * 2;
            increase > 600 ? (attack += 600) : (attack += increase);
        }
    }
    return attack;
}

function calculateAttackIncrease(substatValue) {
    const baseAttack = calculateTotalAttack(0);
    const newValue = calculateTotalAttack(substatValue);

    return (((newValue - baseAttack) / baseAttack) * 100).toFixed(2);
}

function calculateTotalAnomaly() {
    return (
        state.anomalyProficiency +
        state.anomalyBuffIncrease +
        state.engineAnomalyIncrease
    );
}

function calculateAnomalyIncrease(substatValue) {
    return (((9 * substatValue) / calculateTotalAnomaly()) * 100).toFixed(2);
}

window.onload = () => {
    document.querySelectorAll("form, input").forEach((f) => {
        try {
            f.reset();
        } catch {
            f.value = "";
        }
    });
};

// document
//     .getElementById("reset-btn")
//     .addEventListener("click", () => window.location.reload());

let activeCharBtn = null;

document.querySelectorAll(".character-btn").forEach((button) => {
    button.addEventListener("click", () => {
        if (activeCharBtn) {
            activeCharBtn.classList.remove("selected");
        }
        button.classList.add("selected");
        state.selectedCharacter = button.id;
        state.baseCharacterAttack = characterData[button.id].baseAttack;
        activeCharBtn = button;
        validateDataInput();
    });
});

document.querySelectorAll(".team-btn").forEach((button) => {
    button.addEventListener("click", () => {
        if (button.classList.contains("selected")) {
            button.classList.remove("selected");
        } else {
            button.classList.add("selected");
        }
        state.calculateBuffs();
        calculateAnomalyDamage();
    });
});
