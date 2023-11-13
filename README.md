# Signals & Systems Group Project

Please git clone the repo to your machine before making changes and create a personal
local branch. Push this local branch here so we can see your changes and merge with 
main when required. 

`git push origin <name of your personal branch>`
# Progress
Finished
- Piano visual can play audio of a given chord & show how it would be played on piano.
- Blending of multiple sine waves of varying frequencies into one for speaker output (could be good to mention in report).
- Chord lookup table.
- Live audio input and FFT of this audio. 
- Threshold for low volume input.
- Calibration sequence for ADC.  

Working on  
- Bandpass filtering for desired frequencies.
- Testing.

To Do    
- Determine chord from frequencies received from the FFT.
- Feed analyzed chord into keyboard visual.
- General code tidying.
# Repo Details
## Code_Base
This is where we'll be throwing our code for the Signals & Systems project.  
It is a local web app written in Javascript and runs on a local host server.  
***
## To run
If you want to run the code, use git clone to clone the repository locally. Open the
repository in VsCode and right click the 'index.html' file and choose 'Open with Live 
Server'. The localhost should open in a new browser window.  

Currently data is written to the console. This can be seen in inspect element on Chrome.

You will also have to fix some stuff with source maps within Chrome.  
Here's how :)
- Navigate to your inspect element window.
- Click the gear icon in the top right.
- Scroll to where you see "Sources"
- Look for "Enable JavaScript source maps" and ensure it is turned off
- Look for "Enable CSS source maps" and ensure it is off
- Serve hot
#### To run using your terminal with PHP
- Ensure you have PHP installed
- If you do, go to the Code_Base directory
- Run `php -S localhost:8000`
- Mosey your way on over to http://localhost:8000
***

