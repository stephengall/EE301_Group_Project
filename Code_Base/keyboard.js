class Keyboard
{
    constructor()
    {

        this.keys = []; 
        this.playing = false;

        this.whiteKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
        this.blackKeys = ['C#', 'D#', 'F#', 'G#', 'A#'];
        
        this.whiteKeyWidth = width * 0.0875;
        this.whiteKeyHeight = height * 0.375;

        this.blackKeyWidth = width * 0.04375;
        this.blackKeyHeight = height * 0.2125;

        this.initKeys();

        //chordTable object contains all chords as well as the notes that make up those chords
        this.chordLookup = new chordTable();

        this.freqLookup = [261, 277, 294, 311, 330, 350, 370, 392, 415, 440, 466, 494];
        this.noteLookup = ["C", "C#", "D", "D#","E", "F", "F#", "G", "G#", "A", "A#", "B"];

    }
    initKeys()
    {
        var leftSide = (width - (this.whiteKeys.length * this.whiteKeyWidth)) / 2;
        
        //used to keep track of each key's note
        var whiteIndex = 0, blackIndex = 0;
        for(var i = 0; i < this.whiteKeys.length; i++)// white keys
        { 

            var tempKey = new Key(leftSide + (i * this.whiteKeyWidth), height / 2, this.whiteKeyWidth, this.whiteKeyHeight, this.whiteKeys[whiteIndex]);
            this.keys.push(tempKey);
            whiteIndex++;
        }
        //shifting the left side reference to account for black keys
        leftSide += (this.whiteKeyWidth - (this.blackKeyWidth / 2));
        for(var i = 0; i < this.whiteKeys.length - 1; i++)// black keys
        { 

            if(i == 2 || i == 6) continue; //ensuring black keys after E and B are not made

            var tempKey = new Key(leftSide + (i * this.whiteKeyWidth), height / 2, this.blackKeyWidth, this.blackKeyHeight, this.blackKeys[blackIndex]);
            this.keys.push(tempKey);
            blackIndex++;
        }
    }
    showKeyboard(){
        var leftSide = (width - (this.whiteKeys.length * this.whiteKeyWidth)) / 2;
        for(var i = 0; i < this.whiteKeys.length; i++){
            //changes colour for keys that are being pressed
            this.keys[i].isPlayed ? fill(245, 158, 65) : noFill();
            stroke(240);
            strokeWeight(4);

            rect(this.keys[i].x, this.keys[i].y, this.keys[i].width, this.keys[i].height);
        }
        leftSide += (this.whiteKeyWidth - (this.blackKeyWidth / 2));
        for(var i = this.whiteKeys.length; i < this.keys.length; i++){

            if(i == 2 || i == 6) continue;
            //changes colour for keys that are being pressed
            this.keys[i].isPlayed ? fill(245, 158, 65) : fill(240);
            noStroke();

            rect(this.keys[i].x, this.keys[i].y, this.keys[i].width, this.keys[i].height);
        }
    }
    checkKeysForPress(x, y){
        for(var i = 0; i < this.keys.length; i++){
            this.keys[i].checkPlayed(x, y)
            if(this.keys[i].isPlayed){
                this.keys[i].playNote(x,y);
            }
        }
    }
    //sets up oscillator objects and synthesises frequencies into a single one
    playChord(chord){

        var audio = new AudioContext();
        //stores oscillator objects for each of the required frequencies
        var oscillators = [];
        //gain is used to reduce clipping of the final signal
        var sigGain = audio.createGain();
        //searching for chord elements in lookup
        var posInLookup = 0;

        for(var i = 0; i < this.chordLookup.length; i++){
            if(this.chordLookup[i][0] == chord){
                posInLookup = i;
                break;
            }
        }
        //scales gain of each note based on number of notes in a chord
        sigGain.gain.value = 1 / (this.chordLookup[posInLookup].length - 1);

        //creating new oscillators, adding them to the array and setting their frequencies
        for(var i = 1; i < this.chordLookup[posInLookup].length; i++){
            var tempOscillator = audio.createOscillator();
            oscillators.push(tempOscillator);

            var freqOfNote = 0;

            for(var j = 0; j < this.noteLookup.length; j++){
                if(this.chordLookup[posInLookup][i] == this.noteLookup[j]){
                    freqOfNote = this.freqLookup[j]; //getting the frequency of each note
                }
            }
            oscillators[i - 1].frequency.value = freqOfNote; //setting an oscillators frequency
            oscillators[i - 1].connect(sigGain); //attaching the oscillator to the Gain node
        }
        sigGain.connect(audio.destination);

        //starting oscillators
        for(var i = 0; i < oscillators.length; i++)
            oscillators[i].start(0);
        
        //adds fade out
        setTimeout(()=>{
            sigGain.gain.exponentialRampToValueAtTime(0.0000001, audio.currentTime + 10)
        }, 1000);
    }
    //takes in chord and plays it on the keyboard visual
    showChord(chord){
        var posInLookup = 0;

        //looking for desired chord in lookup
        for(var i = 0; i < this.chordLookup.length; i++){
            if(this.chordLookup[i][0] == chord){
                posInLookup = i;
                break;
            }
        }
        //looping through chord to find keys that are attached to the desired notes
        //sets these keys to play
        for(var i = 1; i < this.chordLookup[posInLookup].length; i++){
            for(var j = 0; j < this.keys.length; j++){
                if(this.keys[j].note == this.chordLookup[posInLookup][i]){
                    this.keys[j].isPlayed = true;
                }
            }
        }
        //lets got of keys after 1 second
        setTimeout(()=>(this.letGoOfKeys()), 1000);
    }
    //sets all keys to not play
    letGoOfKeys(){
        for(var i = 0; i < this.keys.length; i++)
            this.keys[i].isPlayed = false;
    }
}
