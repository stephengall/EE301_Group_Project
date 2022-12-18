class Key{
    constructor(x, y, width, height, note){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.note = note;

        this.isPlayed = false;
        this.playing = 60;
    }
    playNote(){
        var freqLookup = [261, 277, 294, 311, 330, 350, 370, 392, 415, 440, 466, 494];
        var noteLookup = ['C', 'C#', 'D', 'D#','E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        for(var p = 0; p < noteLookup.length; p++)
        {
            if(noteLookup[p] == this.note)
            {
                var osc = new p5.Oscillator(freqLookup[p]);
                osc.start();
                osc.stop(1);
            }
        }
    }
    checkPlayed(x, y){
        if((x > this.x && x < (this.x + this.width)) && (y > this.y && y < (this.y + this.height))){
            this.isPlayed = true;
            return true;
        }
        this.isPlayed = false;
        return false;
    }
}