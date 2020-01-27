"use strict";

const CANVAS_TEMPLATE = document.getElementById(`canvas-circle-template`);
const CONTEXT_TEMPLATE = CANVAS_TEMPLATE.getContext(`2d`);

CANVAS_TEMPLATE.height = CANVAS_TEMPLATE.width = 1500;
const INCHES_PER_PIXEL = 652/1500;

CONTEXT_TEMPLATE.beginPath();
CONTEXT_TEMPLATE.arc(0, 0, 1500, 0, Math.PI/2, false);
CONTEXT_TEMPLATE.stroke();

// for (let i = 0; i < ) {
//
// }

// Make a tree animation, showing use growing together...
//
// I want to write these out and mail these reasons to Alexis. And mail each one whenever I come up with a new one...
//
// Why I love Alexis Sovanna Brown:
// Reason One: You loved me a lot. It feels good to be loved that much; to be cared for that much. I don't believe there
//             is anyone else who will love me as much as you have.
// Reason Two: I want to be a better person. More well rounded, caring, and loving. I believe you help me. You are a
//             positive force in my life for good.
// Reason Three: You are gorgeous. Exspecially when you are being confident. You are glowing right now. Your skin looks
//               so soft and clear.
// Reason Four: You are incredibly smart and talented. Contrary to what i say when i'm angry. ive never meant any of it.
//              i hate that i have hurt your self image.
// Reason Five: You are incredibly passionate and fun.
