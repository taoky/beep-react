import { Component } from "react";

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gain: 0,
    };
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.sheet = this.props.sheet;
    this.setGain(0.5);
  }

  componentDidUpdate() {
    this.sheet = this.props.sheet;
  }

  playMelody() {
    if (this.oscillator) {
      this.stop();
    }

    this.noteIndex = -1;
    this.playNextNote();
  }

  playNextNote() {
    this.noteIndex++;
    if (this.noteIndex >= this.sheet.notes.length) {
      this.stop();
    } else {
      const note = this.sheet.notes[this.noteIndex];
      this.playNote(
        this.toFrequency(note.level + this.sheet.offset),
        this.toDuration(note.tempo, this.sheet.bpm),
        () => this.playNextNote()
      );
    }
  }

  playNote(frequency, duration, callback) {
    const audioCtx = this.audioContext;
    const oscillator = audioCtx.createOscillator();
    this.oscillator = oscillator;

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    oscillator.connect(this.gainNode).connect(audioCtx.destination);
    oscillator.onended = callback;
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  }

  setGain(gain) {
    this.setState({ gain: gain });
    this.gainNode.gain.value = gain;
  }

  stop() {
    if (!this.oscillator) {
      return;
    }
    this.oscillator.onended = null;
    this.oscillator.stop();
    this.oscillator = null;
  }

  toFrequency(level) {
    if (level === 0) {
      return 0;
    }
    const referenceFrequency = 440; // A4
    const referenceNote = 57; // A4 = 9 + 4 * 12
    const relativeLevel = level - referenceNote;
    const frequency = Math.pow(2, relativeLevel / 12) * referenceFrequency;
    return frequency;
  }

  toDuration(tempo, bpm) {
    return (tempo * 60) / (bpm * 16);
  }

  render() {
    return (
      <div className="player">
        <button onClick={() => this.playMelody()}>Play</button>
        <button onClick={() => this.stop()}>Stop</button>
        <input
          type="range"
          id="volume"
          onChange={(e) => {
            this.setGain(e.target.value);
          }}
          value={this.state.gain}
          min={0}
          max={2}
          step={0.01}
        />
        <textarea />
      </div>
    );
  }
}
