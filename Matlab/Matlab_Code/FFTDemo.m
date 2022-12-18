clc;
close all;
clear all;
%fs = sampling freq in Hz
%sample is y samples long. stereo so doubles
%[y,fs] = audioread('1-Ab.mp3');
%info = audioinfo('1-Ab.mp3')
%[y,fs] = audioread('2-Ab-C-Dyad.mp3');
[y,fs] = audioread('4-Ab-Major-Triad.mp3');
%[y,fs] = audioread('C3vH.wav');
sound(y,fs);
y = y(:,1); %reducing too one chanel
plot(y);
y_res = resample(y,20000,fs); %resample to reduce data size
%sound(y);
%%
%time domain
%t = 0 to y/fs, spaced evenly via y steps
t = linspace(0,length(y)/fs,length(y));
figure
plot(t,y);
title('Time Domain');
xlabel('time');
ylabel('amplitude');
%%
y_fft = fft(y); %dft
n = length(y);
f = (0:n-1)*(fs/n); % freq range
power = abs(y_fft).^2/n; %power of dft
[pks,locs] = findpeaks(power, f, MinPeakHeight=16.35);

plot(f,power);
hold on;
peaks = plot(locs, pks, 'hexagram', 'MarkerSize',10, 'Color','r');
legend('Individual Notes', 'Peaks');
for i = 1:length(pks)
        datatip(peaks,locs(i), pks(i))
end
    
title('Note Freq Spectrum');
xlim([0, 1500]);
xlabel('Freq.');
ylabel('Power');

%%
figure;
findpeaks(power, f, MinPeakHeight=16.35);
xlim([0, 3000]);
%%
figure
%signal, window size, no. of overlap, 
%resolution on freq axis, sampling freq
%resolution (960/2)+1 = 481 freqs available on freq axis
spek = spectrogram(y, 4000, 15, 960, fs);
spectrogram(y, 4000, 15, 960, fs);
title('Chord Spectral Analysis');