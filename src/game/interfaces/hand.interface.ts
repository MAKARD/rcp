export interface Hand {
    checkAgainst(hand: Hand): "win" | "lose" | "draw";

    toString(): string;
}
