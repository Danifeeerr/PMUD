let firstCard = -1;
let secondCard = -1;

function initial_cards(n)
{
    let cards = [];

    for (let i = 0; i < n/2; i++)
    {
        cards.push(i+1, i+1);
    }

    return cards.sort(()=>Math.random()-0.5);
}

function revealCards(id)
{
    if (firstCard === -1)
    {
        firstCard = id.querySelector("img");
        firstCard.classList.remove("hidden");

    }
    else if (secondCard === -1 && id.querySelector("img") !== firstCard)
    {
        secondCard = id.querySelector("img");
        secondCard.classList.remove("hidden");
        setTimeout(hideCards, 1000);
    }

}

function hideCards()
{
    firstCard.classList.add("hidden");
    secondCard.classList.add("hidden");
    firstCard = -1;
    secondCard = -1;
}


function setCards() 
{
    const cards = initial_cards(12);
    const images = document.querySelectorAll("#board table img");

    for (let i = 0; i < cards.length; i++) {
        images[i].src = `svgImages/figure${cards[i]}.svg`;
    }
};
