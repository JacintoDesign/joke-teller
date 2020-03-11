

function getJokes() {
    fetch('https://sv443.net/jokeapi/v2/joke/Programming')
    .then(res => res.json())
    .then(data => {
        //console.log(data);
        if (data.setup) {
            console.log(data.setup);
            console.log(data.delivery);
        } else {
            console.log(data.joke);
        }

    });
}

getJokes();