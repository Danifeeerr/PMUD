const random = limit => Math.floor(Math.random() * limit);

function initial_cards(n)
{
    let cards = [];

    for (let i = 0; i < n/2; i++)
    {
        cards.push(i+1, i+1);
    }

    return cards.sort(()=>Math.random()-0.5);
}


console.log(initial_cards(12));

