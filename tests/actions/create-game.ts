export async function createGame (gameName: string = "FUCK") {
    const response = await fetch("http://localhost:3005/game/create?gameId=" + gameName, {
        "method": "POST"
    });

    return (await response.json()).id;
}

// TODO: fix naming and import convention
