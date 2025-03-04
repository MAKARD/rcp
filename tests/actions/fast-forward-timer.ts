export async function fastForwardTimer (gameId: string) {
    const url = new URL("http://localhost:3005/game/timer/fast-forward");

    url.searchParams.set("gameId", gameId);

    await fetch(url, {
        "method": "PUT"
    });
}
