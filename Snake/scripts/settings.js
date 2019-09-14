let framesPerSecond = 15;
let showGrid = false;
let inputQueuing = true;

function showDirections() {
  Swal.fire('Use the arrow keys to turn.\n' +
    'The score increases each time you eat a fruit.\n' +
    'Higher FPS = more points\n' +
    'Inefficent Route = less points');
}

async function chooseDifficulty() {
  clearInterval(loop);
  const {value: value} = await Swal.fire({
    title: 'Frames per Second',
    input: 'range',
    inputAttributes: {
      min: 5,
      max: 100,
      step: 5
    },
    inputValue: framesPerSecond
  });
  if (value) {
    framesPerSecond = value;
  }
}

async function changeSettings() {
  function isChecked(setting) {
    return setting ? 'checked' : '';
  }
  const {value: settings} = await Swal.fire({
    title: 'Settings',
    html:
      '<div class="form-check">' +
        '<input class="form-check-input" type="checkbox" ' + isChecked(showGrid) + ' id="inputShowGrid">' +
        '<label class="form-check-label" for="checkbox1">Show Grid</label>' +
      '</div>' +
      '<div class="form-check">' +
        '<input class="form-check-input" type="checkbox" ' + isChecked(inputQueuing) + ' id="inputInputQueuing">' +
        '<label class="form-check-label" for="checkbox2">Input Queuing</label>' +
      '</div>',
    focusConfirm: true,
    preConfirm: () => {
      return {
        showGrid: document.getElementById('inputShowGrid').checked,
        inputQueuing: document.getElementById('inputInputQueuing').checked
      }
    }
  });
  if (settings !== undefined) {
    inputQueuing = settings.inputQueuing;
    showGrid = settings.showGrid;
    renderBackground();
  }
}
