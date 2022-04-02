const FIRE_PIXEL_ARRAY = [];
const FIRE_COLORS_PALETTE = [{ "r": 7, "g": 7, "b": 7 }, { "r": 31, "g": 7, "b": 7 }, { "r": 47, "g": 15, "b": 7 }, { "r": 71, "g": 15, "b": 7 }, { "r": 87, "g": 23, "b": 7 }, { "r": 103, "g": 31, "b": 7 }, { "r": 119, "g": 31, "b": 7 }, { "r": 143, "g": 39, "b": 7 }, { "r": 159, "g": 47, "b": 7 }, { "r": 175, "g": 63, "b": 7 }, { "r": 191, "g": 71, "b": 7 }, { "r": 199, "g": 71, "b": 7 }, { "r": 223, "g": 79, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 223, "g": 87, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 95, "b": 7 }, { "r": 215, "g": 103, "b": 15 }, { "r": 207, "g": 111, "b": 15 }, { "r": 207, "g": 119, "b": 15 }, { "r": 207, "g": 127, "b": 15 }, { "r": 207, "g": 135, "b": 23 }, { "r": 199, "g": 135, "b": 23 }, { "r": 199, "g": 143, "b": 23 }, { "r": 199, "g": 151, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 159, "b": 31 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 167, "b": 39 }, { "r": 191, "g": 175, "b": 47 }, { "r": 183, "g": 175, "b": 47 }, { "r": 183, "g": 183, "b": 47 }, { "r": 183, "g": 183, "b": 55 }, { "r": 207, "g": 207, "b": 111 }, { "r": 223, "g": 223, "b": 159 }, { "r": 239, "g": 239, "b": 199 }, { "r": 255, "g": 255, "b": 255 }]

let fireWidth = 45;
let fireHeight = 45;

let debug = false;
let windSide = 1;

function start() {
  createFireDataStructure();
  createFireSource();
  renderFire();

  setInterval(calculateFirePropagation, 100);
  setInterval(updateWindSide, 5000);
}

function createFireDataStructure() {
  for (let i = 0; i < getNumberOfPixels(); i++)
    FIRE_PIXEL_ARRAY[i] = 0;
}

function getNumberOfPixels() {
  return fireHeight * fireWidth;
}

function calculateFirePropagation() {
  for (let column = 0; column < fireWidth; column++)
    for (let row = 0; row < fireHeight; row++) {
      const pixelIndex = getPixelIndex(row, column)

      updateFireIntensityPerPixel(pixelIndex);
    }

  renderFire()
}

function updateFireIntensityPerPixel(currentPixelIndex) {
  let belowPixelIndex = currentPixelIndex + fireWidth;

  if (belowPixelIndex >= getNumberOfPixels())
    return

  let decay = Math.floor(Math.random() * 3);
  let belowPixelFireIntensity = FIRE_PIXEL_ARRAY[belowPixelIndex];
  let fireIntensity = belowPixelFireIntensity - decay;
  let currentPixelFireIntensity = fireIntensity >= 0 ? fireIntensity : 0;

  let currentPixelFireIntensityWithWind;
  switch (windSide) {
    case 0:
      currentPixelFireIntensityWithWind = currentPixelIndex - decay
      break;
    case 1:
      currentPixelFireIntensityWithWind = currentPixelIndex + decay
      break;
    case 2:
      currentPixelFireIntensityWithWind = currentPixelIndex
      break;
    default:
      break;
  }

  FIRE_PIXEL_ARRAY[currentPixelFireIntensityWithWind] = currentPixelFireIntensity;
}

function updateWindSide() {
  if (windSide === 0)
    windSide = 1
  else if (windSide === 1)
    windSide = 2
  else
    windSide = 0
}

function renderFire() {
  let html = '<table cellpadding=0 cellspacing=0>';

  for (let row = 0; row < fireHeight; row++) {
    html += '<tr>';

    for (let column = 0; column < fireWidth; column++) {
      let pixelIndex = getPixelIndex(row, column);
      let fireIntensity = FIRE_PIXEL_ARRAY[pixelIndex];
      let color = FIRE_COLORS_PALETTE[fireIntensity];
      let colorString = `${color.r},${color.g},${color.b}`;

      if (debug) {
        html += '<td>';
        html += `<div class="pixel-index">${pixelIndex}</div>`;
        html += `<div style="color: rgb(${colorString})">${fireIntensity}</div>`;
        html += '</td>';
      } else {
        html += `<td class="pixel" style="background-color: rgb(${colorString})">`;
        html += '</td>';
      }
    }

    html += '</tr>';
  }

  html += '</table>';

  document.querySelector('#fireCanvas').innerHTML = html;
}

function getPixelIndex(row, column) {
  const calculatedRow = fireWidth * row;
  return column + calculatedRow;
}

function createFireSource() {
  for (let column = 0; column < fireWidth; column++) {
    const overflowPixelIndex = getNumberOfPixels();
    const pixelIndex = (overflowPixelIndex - fireWidth) + column;

    FIRE_PIXEL_ARRAY[pixelIndex] = 36
  }
}

function toggleDebugMode() {
  if (debug) {
    fireHeight = 45
    fireWidth = 45
    debug = false
  } else {
    fireHeight = 30
    fireWidth = 15
    debug = true
  }

  createFireDataStructure()
  createFireSource()
}

start()