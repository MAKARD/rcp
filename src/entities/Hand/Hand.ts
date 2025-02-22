export abstract class Hand {
    abstract overcomes (): typeof Hand;

    abstract lossesTo (): typeof Hand;

    public checkAgainst (hand: unknown): "won" | "lose" | "draw" {
        if (hand instanceof this.overcomes()) {
            return "won";
        }

        if (hand instanceof this.lossesTo()) {
            return "lose";
        }

        return "draw";
    }

    toString () {
        return this.constructor.name;
    }

    toJSON () {
        return this.constructor.name;
    }
}
