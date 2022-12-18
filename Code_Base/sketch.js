var keyboard, analyzer, clicked, calibrationSound;
//preloading sound file for the analyzer calibration sequence
function preload(){
  calibrationSound = loadSound('assets/1-Ab.mp3');
}
function setup() {
  createCanvas(800, 800);
  keyboard = new Keyboard();
  //above sound file is passed in
  analyzer = new Analyzer(calibrationSound);
  clicked = false;
}

function draw() {
  //checking to see if a specific key has been pressed
  if(mouseIsPressed){
    keyboard.checkKeysForPress(mouseX, mouseY);
  }

  var chord = analyzer.returnChord();
  if(chord.length > 0) console.log(chord);

  var chord = "A7"
//shows and plays chord when mouse is clicked
  var mouseWithinCanvas = (mouseX < width && mouseX > 0 && mouseY < height && mouseY > 0);
  if(!mouseIsPressed && clicked && mouseWithinCanvas){
    keyboard.playChord(chord);
    keyboard.showChord(chord);
  }

  background(51);
  keyboard.showKeyboard();
  clicked = mouseIsPressed;
}
