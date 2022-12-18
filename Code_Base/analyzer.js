class Analyzer{
    constructor(calibrationSound){
        this.calibrationSound = calibrationSound;

        //initialising slider that will adjust volume threshold 
        this.slider = createSlider(1, 256, 164, 1);
        this.slider.size(480);
        this.inputThreshold = this.slider.value();

        this.input = new p5.AudioIn(); //creating new audio in
        
        // this.filter = new p5.BandPass(); // initialise band pass object
        // this.input.disconnect();
        // this.input.connect(this.filter);


        //initialising FFT object first parameter is smoothing 0-1, second is number of stored frequencies
        this.fft = new p5.FFT(0.8, 16384);
        //pointing FFT object to new input in
        this.fft.setInput(this.input);
        this.input.start(); //starting this audio in

        //chordTable object contains all chords as well as the notes that make up those chords
        this.chordLookup = new chordTable();

        this.freqLookup = [261, 277, 294, 311, 330, 350, 370, 392, 415, 440, 466, 494];
        this.noteLookup = ['C', 'C#', 'D', 'D#','E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

        /*Ensures browser starts taking input,
          Some browsers will wait for a user interaction before
          starting audio input as a security feature
        */
        getAudioContext().suspend();
        userStartAudio();
        //this is our "magic number" that seems to depend on what hardware it is being run on
        this.ADC_Constant = 1;
        this.calibrated = false;
        this.calculateADCConstant();

    }
    returnChord(){
        var freqSpectrum = this.fft.analyze();
        var noteFrequencies = [];
        var notes = [];

        // filter setup
        // this.filter.freq(300);
        // this.filter.res(450);
        var baseFrequencies = [131, 139, 147, 156, 82, 87, 92, 98, 104, 110, 117, 123];
        //updating threshold with current value of the on screen slider
        this.inputThreshold = this.slider.value();

        //gathering loudest frequencies from the live input
        for(var i = 0; i < freqSpectrum.length; i++)
        {
            if(freqSpectrum[i] < this.inputThreshold) {continue;} // threshold amplitude
            // var adjustedFreq = round(i * this.ADC_Constant); //frequency value is correct once it is multiplied by the constant 
            var adjustedFreq = i * this.ADC_Constant; //frequency value is correct once it is multiplied by the constant 

            //desired frequency range
            if(adjustedFreq > 75 && adjustedFreq < 550)
                noteFrequencies.push(round(adjustedFreq)); 
        }

        //putting notes into the notes array based on the frequencies found above
        
        for(var p = 0; p < noteFrequencies.length; p++)
        {
            // tuning threshold to be a quarter tone above and below the desired note
            var tuningThreshold = (noteFrequencies[p] * pow(2,(0.025))) - noteFrequencies[p];
            for(var i = 0; i < baseFrequencies.length; i++)
            {
                if((noteFrequencies[p]+tuningThreshold)%baseFrequencies[i] <= tuningThreshold ||
                    (noteFrequencies[p]-tuningThreshold)%baseFrequencies[i] <= tuningThreshold){
                    notes.push(this.noteLookup[i]);
                }
            }
        }

        // remove duplicate notes
        // for(var p = 0; p < notes.length-1;p++)
        // {
        //     for(var i = p+1; i < notes.length; i++)
        //     {
        //         if(notes[p] == notes[i])
        //             notes.splice(i,1);
        //     }
        // }
        //will return chords once we get that functionality working
        //currently returning frequencies for debugging
        return noteFrequencies;
    }
    /*
        This is the calibration function. It plays a sound file with a known frequency,
        listens to what frequency the FFT thinks it is and finds the difference as a ratio.
        The frequencies are averaged out and is used to set the new value for the ADC_Constant.
    */
    calculateADCConstant()
    {
        //known frequency of the sound file
        var testFreq = 415.305;
        var testFFT = new p5.FFT(0.8, 16384);
        testFFT.setInput(this.calibrationSound);

        this.calibrationSound.play();
        this.calibrationSound.amp(1);

        //the sampling is done after the sound file has been playing for 1500ms
        setTimeout(()=>{
            //stores an array of magnitudes
            var freqSpectrum = testFFT.analyze();
            //used to store frequencies above a certain volume threshold
            var obtainedFreqs = [];
    
            //if a certain frequency is above a certain threshold, it is added
            for(var i = 0; i < freqSpectrum.length; i++)
                if(freqSpectrum[i] > 164) obtainedFreqs.push(i);            
            
            //averaging array
            var avg = 0;
            for(var i = 0; i < obtainedFreqs.length; i++)
                avg += obtainedFreqs[i];
            
            avg /= obtainedFreqs.length;

            //setting the ADC_Constant as the ratio between what the reading should be, 
            //and the obtained frequency from the FFT
            this.ADC_Constant = testFreq / avg;
            console.log("ADC_Constant = ", this.ADC_Constant);
            this.calibrated = true;
        }, 1500);
    }
}
