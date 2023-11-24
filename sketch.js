let img1, img2, img3, img4;
let video;
let brightColor;
let t = 1;
let diameterMultipliers = [2, 1]; // Adjust these values as needed
let currentColorRGB = [255, 247, 207];
let nextColorRGB = [238, 130, 116];
let colortime = 0;
let RRGGBB = [0, 0, 0];

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create a video capture object
  video = createCapture(VIDEO);
  video.position(-500, -100);
  video.size(640, 480);
  video.hide();

  // Initialize brightColor
  brightColor = color(255, 255, 255);

  img1 = loadImage("1.png");
  background(0);
}

function draw() {
  //color Change
  colortime = colortime + 1;
  if (colortime < 40) {
    RRGGBB[0] = map(colortime, 0, 40, currentColorRGB[0], nextColorRGB[0]);
    RRGGBB[1] = map(colortime, 0, 40, currentColorRGB[1], nextColorRGB[1]);
    RRGGBB[2] = map(colortime, 0, 40, currentColorRGB[2], nextColorRGB[2]);
    brightColor = color(RRGGBB[0], RRGGBB[1], RRGGBB[2]);
  } else if (colortime == 200) {
    colortime = 0;
    if (currentColorRGB[0] == 255) {
      currentColorRGB = [238, 130, 116];
      nextColorRGB = [24, 100, 42];
    } else if (currentColorRGB[0] == 24) {
      currentColorRGB = [255, 247, 207];
      nextColorRGB = [238, 130, 116];
    } else if (currentColorRGB[0] == 238) {
      currentColorRGB = [24, 100, 42];
      nextColorRGB = [255, 247, 207];
    }
  }

  t = t + 0.01;
  diameterMultipliers[0] = -abs(2 * cos(t - 1)) - 0.7;
  let stepSize = 5; // Set a fixed step size

  video.loadPixels();
  for (let x = 0; x < video.width; x += stepSize) {
    for (let y = 0; y < video.height; y += stepSize) {
      let i = (y * video.width + x) * 4;

      let r = video.pixels[i];
      let g = video.pixels[i + 1];
      let b = video.pixels[i + 2];
      let a = video.pixels[i + 3];

      let luma = 0.299 * r + 0.587 * g + 0.114 * b;

      // Map the luminance value to a range between 0 and 1
      let brightnessNormalized = map(luma, 0, 255, 0, 1);

      // Interpolate between darkColor and brightColor based on brightness
      let interpolatedColor = lerpColor(
        color(r, g, b),
        brightColor,
        brightnessNormalized
      );

      // Map the brightnessNormalized value to a range between 1 and 2
      let diameterMultiplier = map(
        brightnessNormalized,
        0,
        1,
        diameterMultipliers[0],
        diameterMultipliers[1]
      );

      fill(interpolatedColor);
      noStroke();
      ellipse(
        map(x, 0, video.width, 0, width),
        map(y, 0, video.height, 0, height),
        stepSize * diameterMultiplier,
        stepSize * diameterMultiplier
      );
    }
  }
  image(img1, 0, -5, windowWidth, windowHeight + 10);
}
