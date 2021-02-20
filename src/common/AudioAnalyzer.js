import { FFTR } from "kissfft-js";
import * as fs from "fs";

class AudioAnalyzer {
	constructor(audioPath, fftSize = 8192) {
    this.audioPath = audioPath;
		this.fftSize = fftSize;
		this.fft = new FFTR(fftSize);
		this.fftInArray = new Float32Array(fftSize * 2);
		this.channels = [];
	}

  async loadAudio() {
    const fileData = this.toArrayBuffer(fs.readFileSync(this.audioPath));

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
    console.log(this);
  }

  toArrayBuffer(buf) {
    var ab = new ArrayBuffer(buf.length);
    var view = new Uint8Array(ab);
    for (var i = 0; i < buf.length; ++i) {
        view[i] = buf[i];
    }
    return ab;
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
		for (let c = sampleStart; c < sampleStart + this.fftSize; c += 1) {
			this.fftInArray[i] = this.avgSampleAt(c);
			i += 2;
		}

		const out = fft.forward(this.fftInArray);

		for (let c = 0; c < this.fftSize; c += 1) {
			dataArray[c] = Math.sqrt((out[c * 2] * out[c * 2]) +
				(out[(c * 2) + 1] * out[(c * 2) + 1])) / this.fftSize;
		}
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
}

export default AudioAnalyzer;