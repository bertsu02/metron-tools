$(document).ready(function() {
var moneyList = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
var numCasesOpenedPerRound = {
    1: 6,
    2: 5,
    3: 4,
    4: 3,
    5: 2,
    6: 1,
    7: 1,
    8: 1,
    9: 1,
};

var bankersOfferMeanSD = {
    1: [22.485, 8.385],
    2: [33.685, 11.232],
    3: [44.87, 8.74],
    4: [52.46, 13.5],
    5: [63.745, 14.002],
    6: [72.75, 12.719],
    7: [74.98, 17.622],
    8: [80.92, 17.26],
    9: [78.88, 15.321],
};

var moneyValuesRemaining;
var totalCasesOpened;
var totalCases;
var remainingMoney;
var round;
var casesOpenedThisRound;
var hasPlayerSelectedCase;
var hasSelectedFinalCase;
var offer;
var counterOffer;
var winnings;
var gameState;
var myCase;
var selectedCase;
var percentDiv;

initialize();

function initialize() {
    localStorage.removeItem("winnings");

    createMoneyTable();
    assignVariables();
    assignCaseAmounts();
    createDealButtons();

    selectPlayersCase();
}

function reset() {
    window.location = window.location.href;
}



function createMoneyTable() {
    for (var i = 0; i < 26; i++) {
        var columnId = (i % 2 === 0) ? "#column-one" : "#column-two";
        var amountText = moneyList[i] === 1 ? "1 Coin" : formatNumber(moneyList[i]) + " Coins";
        var divEl = $("<div>").text(amountText).attr({ "data-inplay": "yes", "value": moneyList[i] });
        $(columnId).append(divEl);
    }
}

function updateMoneyTableLabels(useCoins = true) {
    $("#column-one div, #column-two div").each(function () {
        const value = $(this).attr("value");
        const num = parseInt(value);
        const label = useCoins
            ? (num === 1 ? "1 Coin" : formatNumber(num) + " Coins")
            : "$" + formatNumber(num);
        $(this).text(label);
    });
}

$("#coins-btn").click(() => updateMoneyTableLabels(true));
$("#dollars-btn").click(() => updateMoneyTableLabels(false));


function assignVariables() {
    moneyValuesRemaining = moneyList.slice();
    totalCasesOpened = 0;
    totalCases = moneyList.length;
    remainingMoney = calcTotalMoneyAmount();
    round = 0;
    casesOpenedThisRound = 0;
    hasPlayerSelectedCase = false;
    hasSelectedFinalCase = false;
    offer = undefined;
    counterOffer = undefined;
    winnings = undefined;
    gameState = 0;
    myCase = undefined;
    selectedCase = undefined;
}

function assignCaseAmounts() {
    var values = moneyList.slice();
    for (var i = 26; i >= 1; i--) {
        var randNum = Math.floor(Math.random() * values.length);
        var caseValue = values[randNum];

        $("#case-" + i).val(caseValue);

        values.splice(values.indexOf(caseValue), 1);
    }
}

function createDealButtons() {
    var dealEl = $("<button>")
        .attr({ id: "deal-btn", "data-offer": "no" })
        .text("DEAL");
    var noDealEl = $("<button>")
        .attr({ id: "no-deal-btn", "data-offer": "no" })
        .text("NO DEAL");
    $("#bankerInfo").append(dealEl, noDealEl);
}


function selectPlayersCase() {
    displayInstructions();
    $(".case").click(function () {
        if (!hasPlayerSelectedCase) {
        myCase = $(this);
        displayMyCase(myCase);
        displayInfo();
        hasPlayerSelectedCase = true;
        gameState = 1;
        newRound();
        }
    });
}

function displayMyCase(el) {
    $("#your-case").addClass("chosen-case").text($(el).text()).val($(el).val());
    $(el).removeClass("not-clicked").addClass("players-case");
}

function openCase(thisRound) {
    displayInstructions();
    $(".case").click("not-clicked", function () {
        if (
        casesOpenedThisRound < numCasesOpenedPerRound[round] &&
        thisRound === round
        ) {
        selectedCase = $(this);
        removeSelectedCase(selectedCase);
        displayInfo();
        if (casesOpenedThisRound === numCasesOpenedPerRound[round])
            bankersOffer();
        else displayInstructions();
        }
    });
}

function removeSelectedCase(el) {
    totalCasesOpened++;
    casesOpenedThisRound++;
    var amount = parseFloat($(el).val());
    remainingMoney -= amount;
    moneyValuesRemaining.splice(moneyValuesRemaining.indexOf(amount), 1);
    $(el).removeClass("not-clicked").addClass("selected-case");
    strikeOutTable(amount);
    updateStatsTable();
}

function bankersOffer() {
    gameState = 2;

    var ex = calcExpectedValue();
    offer = Math.round(ex); 
    offerDeal(round);
}


function offerDeal(thisRound) {

    displayOffer(offer);
    displayInstructions();
    displayInfo();

    $("#deal-btn").attr("data-offer", "yes");
    $("#no-deal-btn").attr("data-offer", "yes");

    $("#deal-btn").click(function () {
        if (thisRound === round) {
            $("#deal-btn").attr("data-offer", "no");
            $("#no-deal-btn").attr("data-offer", "no");

            removeOffer();
            gameState = 11;
            winnings = offer;
            localStorage.setItem("winnings", winnings);
            $(".save-winnings").css("display", "block");
            displayInfo();
        }
    });

    $("#no-deal-btn").click(function () {
        if (thisRound === round) {
            $("#deal-btn").attr("data-offer", "no");
            $("#no-deal-btn").attr("data-offer", "no");

            removeOffer();
            removeInfo();
            newRound();
        }
    });

    $("#counter-btn").click(function() {
        if (thisRound === round) {
            
        }
    });
}

function selectFinalCase(thisRound) {
    displayInstructions();
    $(".case").click(function () {
        if (thisRound === round && !(hasSelectedFinalCase)) {
            hasSelectedFinalCase = true;
            selectedCase = $(this);
            winnings = parseFloat(selectedCase.val());
            localStorage.setItem("winnings", winnings);
            displayInfo();
        }
    });
}

function newRound() {
    round++;
    casesOpenedThisRound = 0;
    if (round <= 9) {
        gameState = 1;
        openCase(round);
    } else {
        gameState = 10;
        selectFinalCase(round);
    }
}



function updateStatsTable() {
    var ex = calcExpectedValue();
    var ex2 = calcEX2();
    $("#expected-value").text("Expected Value: $" + formatNumber(Math.round(ex)));
    $("#standard-deviation").text(
        "Standard Deviation: $" +
        formatNumber(Math.round(calcStandardDeviation(ex, ex2)))
    );
}


function displayOffer(offer) {
    var offerEl = $("<div>")
        .attr("id", "bankers-offer")
        .text(formatNumber(offer));
    $("#deal-btn").before(offerEl);
    var ratio = offer / calcExpectedValue();
    percentDiv = $("<div>")
        .attr("data-offer-rank", evaluateOffer(ratio))
        .text(Math.round(ratio * 100) + "%");
    $(".stats").append(percentDiv);
}

function removeOffer() {
    $("#bankers-offer").remove();
    $(".stats").empty().text("Percent of Expected");
}

function displayInstructions() {
    var instructEl = $("#instructionsDisplayed");
    switch (gameState) {
        case 0:
        instructEl.text("Select your case");
        break;
        case 1:
        if (numCasesOpenedPerRound[round] - casesOpenedThisRound > 1)
            instructEl.text(
            "Open " +
                (numCasesOpenedPerRound[round] - casesOpenedThisRound) +
                " cases."
            );
        else
            instructEl.text(
            "Open " +
                (numCasesOpenedPerRound[round] - casesOpenedThisRound) +
                " case."
            );
        break;
        case 2:
        instructEl.text("DEAL or NO DEAL?");
        break;
        case 10:
        instructEl.text("Select your Final Case to take Home");
        break;
    }
}

function displayInfo() {

    var infoEl = $("#infoDisplayed");
    switch (gameState) {
        case 0:
            infoEl.text("You chose Case " + myCase.text());
            break;
        case 1:
            infoEl.html("You opened Case " + selectedCase.text() + "<br>Value: " + formatNumber(selectedCase.val()));
            break;
        case 10:
            infoEl.html("Your Final Case is Case " + selectedCase.text() + "<br>Winnings: " + formatNumber(selectedCase.val()));
            break;
        case 11:
            infoEl.html("You made a DEAL with Metron.<br>Winnings: " + formatNumber(winnings));
    }
}

function removeInfo() {
    var infoEl = $("#infoDisplayed");
    infoEl.html("");
}

function strikeOutTable(amount) {
    $("div [value='" + amount + "']").attr("data-inplay", "no");
}

function formatNumber(num) {
    if (num > 1) return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num;
}


function calcExpectedValue() {
    return remainingMoney / (totalCases - totalCasesOpened);
}

function calcEX2() {
    var x2 = 0;
    for (var i = 0; i < moneyValuesRemaining.length; i++)
        x2 += Math.pow(moneyValuesRemaining[i], 2);
    var ex2 = x2 / moneyValuesRemaining.length;
    return ex2;
}

function calcStandardDeviation(ex, ex2) {
    return Math.sqrt(ex2 - Math.pow(ex, 2));
}

function calcMedian(list) {
    var listLength = list.length;
    if (listLength % 2 == 1) return list[Math.floor(listLength / 2)];
    else return (list[listLength / 2] + list[listLength / 2 - 1]) / 2;
}

function calc25thPercentile(list) {
    var listLength = list.length;
    var index = Math.floor((listLength + 1) / 4) - 1;
    var weight = ((listLength + 1) % 4) / 4;
    return list[index] * (1 - weight) + list[index + 1] * weight;
}

function calc75thPercentile(list) {
    var listLength = list.length;
  var index = Math.floor(((listLength + 1) * 3) / 4) - 1;
  var weight = (((listLength + 1) * 3) % 4) / 4;
  return list[index] * (1 - weight) + list[index + 1] * weight;
}

function percentOfExpected(value) {
  return Math.round((value / calcExpectedValue()) * 100);
}

function evaluateOffer(ratio) {
    if (ratio < 0.3) return "awful";
    if (ratio < 0.5) return "poor";
    if (ratio < 0.6) return "bad";
    if (ratio < 0.7) return "mediocre";
    if (ratio < 0.8) return "fair";
    if (ratio < 0.9) return "good";
    if (ratio < 1) return "great";
    else return "excellent";
}

function calcTotalMoneyAmount() {
    var amount = 0;
    for (var i = 0; i < moneyList.length; i++) amount += moneyList[i];
    return amount;
}

function percentile_z(p) {
    var a0 = 2.5066282,
    a1 = -18.6150006,
    a2 = 41.3911977,
    a3 = -25.4410605,
    b1 = -8.4735109,
    b2 = 23.0833674,
    b3 = -21.062241,
    b4 = 3.1308291,
    c0 = -2.7871893,
    c1 = -2.2979648,
    c2 = 4.8501413,
    c3 = 2.3212128,
    d1 = 3.5438892,
    d2 = 1.6370678,
    r,
    z;

    if (p > 0.42) {
        r = Math.sqrt(-Math.log(0.5 - p));
        z = (((c3 * r + c2) * r + c1) * r + c0) / ((d2 * r + d1) * r + 1);
    } else {
        r = p * p;
        z =
        (p * (((a3 * r + a2) * r + a1) * r + a0)) /
        ((((b4 * r + b3) * r + b2) * r + b1) * r + 1);
    }
    return z;
}
});