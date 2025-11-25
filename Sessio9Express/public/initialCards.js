let $firstCard = null;
let $secondCard = null;
let movementsDone = 0;
let timer = 0;
let timerInterval = null;

const initial_cards = n => new Array(n / 2).fill(0).map((_, i) => [i + 1, i + 1]).flat().sort(() => Math.random() - 0.5);


function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        $("#timer").text(timer);
    }, 1000);
}

function revealCards($cell) {
    const $img = $cell.find("img");
    if (!$img.hasClass("hidden")) return;

    if (timer === 0 && !timerInterval) {
        startTimer();
    }

    if ($firstCard === null) {
        $firstCard = $img;
        $firstCard.removeClass("hidden");
    } else if ($secondCard === null && !$img.is($firstCard)) {
        $secondCard = $img;
        $secondCard.removeClass("hidden");

        movementsDone++;
        $("#movementsDone").text(movementsDone);

        if ($firstCard.attr("src") === $secondCard.attr("src")) {
            $firstCard = null;
            $secondCard = null;
            checkWin();
        } else {
            setTimeout(hideCards, 1000);
        }
    }
}

function hideCards() {
    $firstCard.addClass("hidden");
    $secondCard.addClass("hidden");
    $firstCard = null;
    $secondCard = null;
}

function checkWin() {
    if ($("#board img.hidden").length === 0) {
        clearInterval(timerInterval);
    }
}

function setCards(numCards) {
    $("#board").removeClass("hidden");
    const cards = initial_cards(numCards);
    const $table = $("#board table");
    $table.empty();

    const cols = 4;
    let row;

    for (let i = 0; i < numCards; i++) {
        if (i % cols === 0) {
            row = $("<tr></tr>");
            $table.append(row);
        }

        const $cell = $(`
            <td>
                <img src="svgImages/figure${cards[i]}.svg" class="hidden">
            </td>
        `);


        $cell.on("click", function () {
            revealCards($(this));
        });

        row.append($cell);
    }

    movementsDone = 0;
    timer = 0;
    $firstCard = null;
    $secondCard = null;
    clearInterval(timerInterval);
    $("#movementsDone").text(movementsDone);
    $("#timer").text(timer);
}

$(document).ready(function () {

    const numCards = parseInt($("#difficultySelect").val());
    $("#board").addClass("hidden");
    
    $("#resetGame").on("click", function () {
        const numCards = parseInt($("#difficultySelect").val());
        $("#resetGame").text("Reiniciar");
        setCards(numCards);
        timerInterval = null;
    });
});
