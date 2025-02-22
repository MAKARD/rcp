import * as Local from "./local";
import * as External from "./external";

export type AllLocalEvents = Local.Game.Events & Local.Player.Events;
export type AllExternalEvents = External.Player.Events & External.Game.Events;

export {
    Local,
    External
};
