'use strict';

const MILLISECONDS_PER_SECOND = 1000;
const FRAMES_PER_SECOND = 60;

function render() {
  i = i + 1;
  postMessage(i);
  setTimeout('render()', MILLISECONDS_PER_SECOND / FRAMES_PER_SECOND);
}();
