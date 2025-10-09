function initial_cards(n)
{
    let cards = [];

    for (let i = 0; i < n/2; i++)
    {
        cards.push(i+1, i+1);
    }

    return cards.sort(()=>Math.random()-0.5);
}


function setCards() 
{
    const cards = initial_cards(12);
    const images = document.querySelectorAll("#board table img");

    for (let i = 0; i < cards.length; i++) {
        images[i].src = `svgImages/figure${cards[i]}.svg`;
    }
};
