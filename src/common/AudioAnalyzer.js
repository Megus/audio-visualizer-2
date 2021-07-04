import * as fs from "fs";
import { FFTR } from "kissfft-js";

import * as utils from "../common/utils";

class AudioAnalyzer {
  constructor(audioPath, fftSize = 8192) {
    this.audioPath = audioPath;
    this.fftSize = fftSize;
    this.fft = new FFTR(fftSize);
    this.fftInArray = new Float32Array(fftSize);
    this.channels = [];
  }

  async loadAudio() {
    const fileData = utils.toArrayBuffer(fs.readFileSync(this.audioPath));

    // Decode mp3 to PCM ArrayBuffer
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await new Promise((resolve, reject) => {
      audioCtx.decodeAudioData(fileData, resolve, reject);
    });

    this.audioBuffer = audioBuffer;
    this.sampleRate = audioBuffer.sampleRate;
    this.audioLength = audioBuffer.length;
    for (let c = 0; c < audioBuffer.numberOfChannels; c += 1) {
      this.channels.push(audioBuffer.getChannelData(c));
    }

    // Create pitch table
    const pitchTable = this.create12TETPitchTable(440);
    this.binTable = [];
    for (let i = 0; i < pitchTable.length; i++) {
      const bin = this.freqToFFTBin(pitchTable[i]);
      this.binTable.push(bin);
    }
  }



  /**
   * Get frequency powers at the specific time to pre-allocated data array.
   * @param timestamp - audio time in seconds
   * @param dataArray - Float32Array with elements count equal to fftSize
   */
  getFrequencyArray(timestamp, dataArray) {
    const fft = this.fft;
    const sampleStart = this.timestampToSample(timestamp) - (this.fftSize / 2);

    let i = 0;
    for (let c = sampleStart; c < sampleStart + this.fftSize; c++) {
      this.fftInArray[i] = this.avgSampleAt(c);
      i++;
    }

    const out = fft.forward(this.fftInArray);

    for (let c = 0; c < this.fftSize / 2; c++) {
      dataArray[c] = Math.sqrt((out[c * 2] * out[c * 2]) +
        (out[(c * 2) + 1] * out[(c * 2) + 1])) / this.fftSize;
    }
  }

  getPitchArray(timestamp) {
    const frequencies = new Float32Array(this.fftSize);
    this.getFrequencyArray(timestamp, frequencies);
    const pitches = [];
    for (let i = 0; i < this.binTable.length; i++) {
      pitches.push(frequencies[this.binTable[i]]);
    }
    return pitches;
  }

  /**
   * Get audio power at the specific time.
   * @param timestamp - audio time in seconds
   * @return audio power
   */
  getPower(timestamp) {
    let power = 0.0;
    let sample = 0;
    const sampleStart = this.timestampToSample(timestamp);
    for (let c = sampleStart; c < sampleStart + this.fftSize; c += 1) {
      sample = this.avgSampleAt(c);
      power += sample * sample;
    }
    return Math.sqrt(power / this.fftSize);
  }

  /**
   * Get samples from the track, converted to mono.
   * @param timestamp - audio time in seconds
   * @param counts - number of samples to get
   * @return Float32Array with samples
   */
  getMonoSamples(timestamp, count) {
    const sampleStart = this.timestampToSample(timestamp);
    const samples = new Float32Array(count);
    for (let c = 0; c < count; c++) {
      samples[c] = this.avgSampleAt(c + sampleStart);
    }
    return samples;
  }


  // Public utility functions

  /**
   * Convert frequency to FFT bin number
   * @param freq — frequency in Herz
   * @return FFT bin number (index in frequency array)
   */
  freqToFFTBin(freq) {
    return Math.floor((freq * this.fftSize) / this.sampleRate);
  }

  /**
   * Convert timestamp to sample number
   * @param timestamp - audio time in seconds
   * @return sample number
   */
  timestampToSample(timestamp) {
    return Math.floor(timestamp * this.sampleRate);
  }

  /**
   * Get average sample value at specific position
   * @param sample number
   * @return Average value
   */
  avgSampleAt(sample) {
    if (sample < 0 || sample >= this.audioLength) {
      return 0.0;
    }
    let value = 0;
    for (let c = 0; c < this.channels.length; c += 1) {
      value += this.channels[c][sample];
    }
    return value / this.channels.length;
  }

  create12TETPitchTable(A4Freq) {
    let table = [];
    for (let c = 0; c < 9 * 12; c++) {
      table.push(0);
    }

    table[4 * 12 + 9] = A4Freq;
    let i = 4 * 12 + 10;
    while (i < 9 * 12) {
      if (i % 12 == 9) {
        table[i] = table[i - 12] * 2;
      } else {
        table[i] = table[i - 1] * Math.pow(2, 1 / 12);
      }
      i++;
    }

    i = 4 * 12 + 8;
    while (i >= 0) {
      if (i % 12 == 2) {
        table[i] = table[i + 12] / 2;
      } else {
        table[i] = table[i + 1] / Math.pow(2, 1 / 12);
      }
      i--;
    }

    return table;
  }
}

export default AudioAnalyzer;