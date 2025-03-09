interface Player {
    "name": string;
}

interface Status {
    "id": string;
    "players": Array<Player>;
    "spectators": Array<Player>;
}

export async function getGameStatus (gameId: string): Promise<Status> {
    const url = new URL("http://localhost:3005/game/status");

    url.searchParams.set("gameId", gameId);

    const response = await fetch(url, {
        "method": "GET"
    });

    return response.json();
}
