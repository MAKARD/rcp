export async function createGame () {
    const response = await fetch("http://localhost:3005/game/create", {
        "method": "POST"
    });

    return (await response.json()).id;
}
