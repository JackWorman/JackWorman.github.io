"use strict";

import {userInputs} from "./UserInputs.js";
import {KeyCodes} from "./KeyCodes.js";

export const Up = () => { return userInputs[KeyCodes.W] || userInputs[KeyCodes.UpArrow]; };
export const Down = () => { return userInputs[KeyCodes.S] || userInputs[KeyCodes.DownArrow]; };
export const Left = () => { return userInputs[KeyCodes.A] || userInputs[KeyCodes.LeftArrow]; };
export const Right = () => { return userInputs[KeyCodes.D] || userInputs[KeyCodes.RightArrow]; };
export const Shoot = () => {
  return userInputs[KeyCodes.Space] || userInputs['leftMouseDown'] || userInputs['rightMouseDown'];
};
export const CursorPosition = () => { return userInputs[`mousePosition`]; }
