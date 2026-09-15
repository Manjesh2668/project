/* =========================================================
   WHAT IF? — FUTURE SIMULATOR
   COMPLETE SCRIPT
   ========================================================= */

let chart = null;


/* =========================================================
   MONEY FORMAT
   ========================================================= */

function formatMoney(value) {

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(value);

}


/* =========================================================
   FUTURE VALUE CALCULATION
   ========================================================= */

function futureValue(
    initial,
    monthly,
    annualRate,
    years
) {

    const months = years * 12;

    const monthlyRate =
        annualRate / 100 / 12;


    if (monthlyRate === 0) {

        return (
            initial +
            monthly * months
        );

    }


    return (
        initial *
        Math.pow(
            1 + monthlyRate,
            months
        )

        +

        monthly *
        (
            Math.pow(
                1 + monthlyRate,
                months
            ) - 1
        )
        /
        monthlyRate
    );
}


/* =========================================================
   GET INPUTS
   ========================================================= */

function getInputs() {

    const initialElement =
        document.getElementById("initial");

    const monthlyElement =
        document.getElementById("monthly");

    const returnElement =
        document.getElementById("returnRate");

    const yearsElement =
        document.getElementById("years");


    return {

        initial:
            Number(initialElement.value),

        monthly:
            Number(monthlyElement.value),

        returnRate:
            Number(returnElement.value),

        years:
            Number(yearsElement.value)

    };
}


/* =========================================================
   UPDATE SLIDER LABELS
   ========================================================= */

function updateLabels() {

    const data = getInputs();


    const initialValue =
        document.getElementById(
            "initialValue"
        );

    const monthlyValue =
        document.getElementById(
            "monthlyValue"
        );

    const returnValue =
        document.getElementById(
            "returnValue"
        );

    const yearsValue =
        document.getElementById(
            "yearsValue"
        );


    if (initialValue) {

        initialValue.textContent =
            formatMoney(data.initial);

    }


    if (monthlyValue) {

        monthlyValue.textContent =
            formatMoney(data.monthly);

    }


    if (returnValue) {

        returnValue.textContent =
            data.returnRate + "%";

    }


    if (yearsValue) {

        yearsValue.textContent =
            data.years +
            (
                data.years === 1
                    ? " year"
                    : " years"
            );

    }


    updateSliderBackgrounds();
}


/* =========================================================
   SLIDER BACKGROUNDS
   ========================================================= */

function updateSliderBackgrounds() {

    const sliders =
        document.querySelectorAll(
            'input[type="range"]'
        );


    sliders.forEach(slider => {

        const min =
            Number(slider.min);

        const max =
            Number(slider.max);

        const value =
            Number(slider.value);


        const percent =
            ((value - min) /
                (max - min)) * 100;


        slider.style.background =
            `linear-gradient(
                90deg,
                #9b8cff 0%,
                #9b8cff ${percent}%,
                #262936 ${percent}%,
                #262936 100%
            )`;

    });
}


/* =========================================================
   CALCULATE SIMULATION
   ========================================================= */

function calculateSimulation() {

    const {
        initial,
        monthly,
        returnRate,
        years
    } = getInputs();


    const conservativeRate =
        Math.max(
            returnRate - 3,
            0
        );


    const optimisticRate =
        returnRate + 3;


    const conservative =
        futureValue(
            initial,
            monthly,
            conservativeRate,
            years
        );


    const expected =
        futureValue(
            initial,
            monthly,
            returnRate,
            years
        );


    const optimistic =
        futureValue(
            initial,
            monthly,
            optimisticRate,
            years
        );


    const contribution =
        initial +
        monthly *
        years *
        12;


    const growth =
        expected -
        contribution;


    return {

        conservative,
        expected,
        optimistic,
        contribution,
        growth

    };
}


/* =========================================================
   UPDATE RESULTS
   ========================================================= */

function updateResults() {

    const data =
        calculateSimulation();


    const expectedValue =
        document.getElementById(
            "expectedValue"
        );

    const contributionValue =
        document.getElementById(
            "contributionValue"
        );

    const growthValue =
        document.getElementById(
            "growthValue"
        );

    const conservativeValue =
        document.getElementById(
            "conservativeValue"
        );

    const expectedFuture =
        document.getElementById(
            "expectedFuture"
        );

    const optimisticValue =
        document.getElementById(
            "optimisticValue"
        );


    if (expectedValue) {

        expectedValue.textContent =
            formatMoney(data.expected);

    }


    if (contributionValue) {

        contributionValue.textContent =
            formatMoney(data.contribution);

    }


    if (growthValue) {

        growthValue.textContent =
            formatMoney(data.growth);

    }


    if (conservativeValue) {

        conservativeValue.textContent =
            formatMoney(data.conservative);

    }


    if (expectedFuture) {

        expectedFuture.textContent =
            formatMoney(data.expected);

    }


    if (optimisticValue) {

        optimisticValue.textContent =
            formatMoney(data.optimistic);

    }


    updateInsight();

    updateImpact();

    updateChart();
}


/* =========================================================
   UPDATE CHART
   ========================================================= */

function updateChart() {

    const chartCanvas =
        document.getElementById(
            "futureChart"
        );


    if (!chartCanvas) {

        return;

    }


    if (
        typeof Chart ===
        "undefined"
    ) {

        console.warn(
            "Chart.js is not loaded."
        );

        return;

    }


    const {
        initial,
        monthly,
        returnRate,
        years
    } = getInputs();


    const conservativeRate =
        Math.max(
            returnRate - 3,
            0
        );


    const optimisticRate =
        returnRate + 3;


    const labels = [];

    const conservativeData = [];

    const expectedData = [];

    const optimisticData = [];


    for (
        let year = 0;
        year <= years;
        year++
    ) {

        labels.push(
            "Year " + year
        );


        conservativeData.push(
            futureValue(
                initial,
                monthly,
                conservativeRate,
                year
            )
        );


        expectedData.push(
            futureValue(
                initial,
                monthly,
                returnRate,
                year
            )
        );


        optimisticData.push(
            futureValue(
                initial,
                monthly,
                optimisticRate,
                year
            )
        );

    }


    const ctx =
        chartCanvas.getContext(
            "2d"
        );


    if (chart) {

        chart.destroy();

    }


    chart =
        new Chart(
            ctx,
            {

                type: "line",

                data: {

                    labels,

                    datasets: [

                        {
                            label:
                                "Conservative",

                            data:
                                conservativeData,

                            borderColor:
                                "#69a8ff",

                            backgroundColor:
                                "rgba(105,168,255,.05)",

                            borderWidth: 2,

                            pointRadius: 0,

                            tension: .4
                        },


                        {
                            label:
                                "Expected",

                            data:
                                expectedData,

                            borderColor:
                                "#9b8cff",

                            backgroundColor:
                                "rgba(155,140,255,.08)",

                            borderWidth: 3,

                            pointRadius: 0,

                            tension: .4
                        },


                        {
                            label:
                                "Optimistic",

                            data:
                                optimisticData,

                            borderColor:
                                "#55e6a5",

                            backgroundColor:
                                "rgba(85,230,165,.05)",

                            borderWidth: 2,

                            pointRadius: 0,

                            tension: .4
                        }

                    ]

                },


                options: {

                    responsive: true,

                    maintainAspectRatio: false,


                    interaction: {

                        intersect: false,

                        mode: "index"

                    },


                    plugins: {

                        legend: {

                            display: false

                        },


                        tooltip: {

                            backgroundColor:
                                "#11131b",

                            borderColor:
                                "rgba(255,255,255,.1)",

                            borderWidth: 1,

                            titleColor:
                                "#fff",

                            bodyColor:
                                "#b5bac7",


                            callbacks: {

                                label:
                                    function(context) {

                                        return (
                                            context.dataset.label +
                                            ": " +
                                            formatMoney(
                                                context.raw
                                            )
                                        );

                                    }

                            }

                        }

                    },


                    scales: {

                        x: {

                            grid: {

                                display: false

                            },


                            ticks: {

                                color:
                                    "#666b7a",

                                font: {

                                    size: 9

                                }

                            }

                        },


                        y: {

                            grid: {

                                color:
                                    "rgba(255,255,255,.05)"

                            },


                            ticks: {

                                color:
                                    "#666b7a",

                                font: {

                                    size: 9

                                },


                                callback:
                                    function(value) {

                                        if (
                                            value >=
                                            1000000
                                        ) {

                                            return (
                                                "₹" +
                                                (
                                                    value /
                                                    1000000
                                                ).toFixed(1) +
                                                "M"
                                            );

                                        }


                                        if (
                                            value >=
                                            1000
                                        ) {

                                            return (
                                                "₹" +
                                                (
                                                    value /
                                                    1000
                                                ).toFixed(0) +
                                                "K"
                                            );

                                        }


                                        return (
                                            "₹" +
                                            value
                                        );

                                    }

                            }

                        }

                    }

                }

            }
        );
}


/* =========================================================
   INSIGHT ENGINE
   ========================================================= */

function updateInsight() {

    const data =
        getInputs();


    const title =
        document.getElementById(
            "insightTitle"
        );

    const text =
        document.getElementById(
            "insightText"
        );


    if (
        !title ||
        !text
    ) {

        return;

    }


    if (
        data.years >= 20
    ) {

        title.textContent =
            "Time is your strongest multiplier.";


        text.textContent =
            "Your long time horizon allows compounding to become the dominant force behind the projected outcome. Even small assumption changes can create very different futures.";

    }


    else if (
        data.monthly >= 30000
    ) {

        title.textContent =
            "Your contribution is driving the outcome.";


        text.textContent =
            "Increasing the amount you contribute each month has a powerful effect on the future value of this scenario.";

    }


    else if (
        data.returnRate >= 14
    ) {

        title.textContent =
            "Your result is highly sensitive to growth.";


        text.textContent =
            "A higher growth assumption significantly increases the range between conservative and optimistic futures.";

    }


    else {

        title.textContent =
            "Your future is shaped by three major levers.";


        text.textContent =
            "Contribution, time horizon, and growth rate work together. Change any one of them and your future trajectory can shift.";

    }
}


/* =========================================================
   IMPACT ANALYSIS
   ========================================================= */

function updateImpact() {

    const data =
        getInputs();


    let time = 35;

    let contribution = 40;

    let growth = 25;


    if (
        data.years >= 20
    ) {

        time = 50;

        contribution = 30;

        growth = 20;

    }


    if (
        data.monthly >= 30000
    ) {

        contribution = 50;

        time = 30;

        growth = 20;

    }


    if (
        data.returnRate >= 14
    ) {

        growth = 40;

        contribution = 35;

        time = 25;

    }


    const timeImpact =
        document.getElementById(
            "timeImpact"
        );

    const contributionImpact =
        document.getElementById(
            "contributionImpact"
        );

    const growthImpact =
        document.getElementById(
            "growthImpact"
        );


    const timePercent =
        document.getElementById(
            "timePercent"
        );

    const contributionPercent =
        document.getElementById(
            "contributionPercent"
        );

    const growthPercent =
        document.getElementById(
            "growthPercent"
        );


    if (timeImpact) {

        timeImpact.style.width =
            time + "%";

    }


    if (contributionImpact) {

        contributionImpact.style.width =
            contribution + "%";

    }


    if (growthImpact) {

        growthImpact.style.width =
            growth + "%";

    }


    if (timePercent) {

        timePercent.textContent =
            time + "%";

    }


    if (contributionPercent) {

        contributionPercent.textContent =
            contribution + "%";

    }


    if (growthPercent) {

        growthPercent.textContent =
            growth + "%";

    }
}


/* =========================================================
   MAIN SIMULATOR UPDATE
   ========================================================= */

function updateSimulator() {

    updateLabels();

    updateResults();

}


/* =========================================================
   RUN SIMULATION
   ========================================================= */

function runSimulation() {

    updateResults();


    const button =
        document.querySelector(
            ".simulate-btn"
        );


    if (!button) {

        return;

    }


    button.innerHTML =
        "<span>Future explored ✓</span><span>→</span>";


    button.style.transform =
        "translateY(-2px)";


    setTimeout(() => {

        button.innerHTML =
            "<span>Explore Future</span><span>→</span>";

        button.style.transform =
            "";

    }, 1800);
}


/* =========================================================
   RESET SIMULATOR
   ========================================================= */

function resetSimulator() {

    const initial =
        document.getElementById(
            "initial"
        );

    const monthly =
        document.getElementById(
            "monthly"
        );

    const returnRate =
        document.getElementById(
            "returnRate"
        );

    const years =
        document.getElementById(
            "years"
        );


    if (initial) {

        initial.value =
            100000;

    }


    if (monthly) {

        monthly.value =
            10000;

    }


    if (returnRate) {

        returnRate.value =
            10;

    }


    if (years) {

        years.value =
            10;

    }


    updateSimulator();


    scrollToSection(
        getSimulatorSection()
    );
}


/* =========================================================
   FIND SECTIONS
   ========================================================= */

function getSimulatorSection() {

    return (
        document.querySelector(
            ".workspace"
        ) ||
        document.querySelector(
            ".control-panel"
        )
    );
}


function getScenariosSection() {

    return (
        document.querySelector(
            ".future-grid"
        ) ||
        document.querySelector(
            ".future-card"
        )
    );
}


function getInsightsSection() {

    return (
        document.querySelector(
            ".insights-grid"
        ) ||
        document.querySelector(
            ".insight-card"
        )
    );
}


/* =========================================================
   SMOOTH SCROLL
   ========================================================= */

function scrollToSection(section) {

    if (!section) {

        return;

    }


    section.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });
}


/* =========================================================
   SIDEBAR NAVIGATION
   ========================================================= */

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    if (
        !navItems ||
        navItems.length === 0
    ) {

        console.warn(
            "Navigation buttons not found."
        );

        return;

    }


    navItems.forEach(
        (item, index) => {

            item.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();


                    /* Remove active state */

                    navItems.forEach(
                        nav => {

                            nav.classList.remove(
                                "active"
                            );

                        }
                    );


                    /* Activate clicked item */

                    item.classList.add(
                        "active"
                    );


                    /* ---------------------------------
                       SIMULATOR
                       --------------------------------- */

                    if (index === 0) {

                        const section =
                            getSimulatorSection();

                        scrollToSection(
                            section
                        );

                    }


                    /* ---------------------------------
                       SCENARIOS
                       --------------------------------- */

                    else if (index === 1) {

                        const section =
                            getScenariosSection();

                        scrollToSection(
                            section
                        );

                    }


                    /* ---------------------------------
                       INSIGHTS
                       --------------------------------- */

                    else if (index === 2) {

                        const section =
                            getInsightsSection();

                        scrollToSection(
                            section
                        );


                        /*
                         * Small visual highlight
                         * so user knows the click worked.
                         */

                        if (section) {

                            section.animate(

                                [
                                    {
                                        transform:
                                            "translateY(8px)",
                                        opacity: 0.65
                                    },

                                    {
                                        transform:
                                            "translateY(0)",
                                        opacity: 1
                                    }

                                ],

                                {

                                    duration: 450,

                                    easing:
                                        "ease-out"

                                }

                            );

                        }

                    }

                }
            );

        }
    );
}


/* =========================================================
   SLIDER EVENTS
   ========================================================= */

function setupSliders() {

    const sliders =
        document.querySelectorAll(
            'input[type="range"]'
        );


    sliders.forEach(
        slider => {

            slider.addEventListener(
                "input",
                function() {

                    updateSimulator();

                }
            );


            slider.addEventListener(
                "change",
                function() {

                    updateSimulator();

                }
            );

        }
    );
}


/* =========================================================
   RESET BUTTON
   ========================================================= */

function setupResetButton() {

    const resetButton =
        document.querySelector(
            ".reset-btn"
        );


    if (!resetButton) {

        return;

    }


    resetButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            resetSimulator();

        }
    );
}


/* =========================================================
   SIMULATE BUTTON
   ========================================================= */

function setupSimulationButton() {

    const button =
        document.querySelector(
            ".simulate-btn"
        );


    if (!button) {

        return;

    }


    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            runSimulation();

        }
    );
}


/* =========================================================
   KEYBOARD SUPPORT
   ========================================================= */

function setupKeyboardNavigation() {

    document.addEventListener(
        "keydown",
        function(event) {

            /*
             * Press "1" = Simulator
             * Press "2" = Scenarios
             * Press "3" = Insights
             */

            if (
                event.key === "1"
            ) {

                const nav =
                    document.querySelectorAll(
                        ".nav-item"
                    );

                if (nav[0]) {

                    nav[0].click();

                }

            }


            if (
                event.key === "2"
            ) {

                const nav =
                    document.querySelectorAll(
                        ".nav-item"
                    );

                if (nav[1]) {

                    nav[1].click();

                }

            }


            if (
                event.key === "3"
            ) {

                const nav =
                    document.querySelectorAll(
                        ".nav-item"
                    );

                if (nav[2]) {

                    nav[2].click();

                }

            }

        }
    );
}


/* =========================================================
   START APPLICATION
   ========================================================= */

window.addEventListener(
    "DOMContentLoaded",
    function() {

        console.log(
            "WHAT IF? Future Simulator started."
        );


        setupNavigation();

        setupSliders();

        setupResetButton();

        setupSimulationButton();

        setupKeyboardNavigation();

        updateSimulator();

    }
);