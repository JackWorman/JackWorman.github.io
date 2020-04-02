"use strict";

import {KeyCode} from "./KeyCode.js";
import {userInputs} from "./UserInputs.js";

export const Up = () => { return userInputs[KeyCode.W] || userInputs[KeyCode.UpArrow]; };
export const Down = () => { return userInputs[KeyCode.S] || userInputs[KeyCode.DownArrow]; };
export const Left = () => { return userInputs[KeyCode.A] || userInputs[KeyCode.LeftArrow]; };
export const Right = () => { return userInputs[KeyCode.D] || userInputs[KeyCode.RightArrow]; };
export const Shoot = () => {
  return userInputs[KeyCode.Space] || userInputs['leftMouseDown'] || userInputs['rightMouseDown'];
};
export const CursorPosition = () => { return userInputs[`mousePosition`]; }
