import { Component } from "react";

// reference: https://stackoverflow.com/questions/39200994/how-to-play-a-specific-frequency-with-javascript

export class Key {
  constructor(p, o) {
    this.o = o;
    this.p = p;
  }

  abs() {
    return this.o * 12 + this.p;
  }

  plus(i) {
    const abs = this.abs() + i;
    return new Key(abs % 12, Math.floor(abs / 12));
  }

  toString() {
    return `Pitch ${this.p} Octave ${this.o}`;
  }
}

export default class Player extends Component {
  constructor(props) {
    super(props);
    this.freq_ref = 261.6; // C4 = 261.6 Hz
    this.key_ref = new Key(0, 4); // C4
    this.state = {
      volume: 0.5,
      consoleText: "",
      oscillatorType: "square",
      playing: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.counter && this.props.counter !== prevProps.counter) {
      // stop!
      this.pause();
      this.notes = null;
    }
  }

  async createPlay() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
    }
    if (!this.notes || this.notes.length === 0) {
      this.notes = this.props.notes.reverse();
    }

    const getDuration = (relativeDuration) =>
      (relativeDuration * 60) / (this.props.bpm * 16);

    const playMelody = async () => {
      if (this.notes.length > 0) {
        let note = this.notes.pop();
        let key = note[0];
        let duration = getDuration(note[1]);
        while (key.abs() === 0) {
          const this_dur = duration;
          await new Promise((r) => setTimeout(r, this_dur * 1000));
          if (!this.notes || this.notes.length === 0) {
            return;
          }
          note = this.notes.pop();
          key = note[0];
          duration = getDuration(note[1]);
        }
        const key_abs = key
          .plus(this.props.off)
          .plus(-this.key_ref.abs())
          .abs();
        const frequency = this.freq_ref * Math.pow(2, (1 / 12) * key_abs);
        this.setState({
          consoleText:
            this.state.consoleText +
            `${note[0]} Note ${note[1]} Frequency ${frequency} Duration ${duration}\n`,
        });
        playNote(frequency, duration, playMelody);
      }
    };
    const playNote = (frequency, duration, callback) => {
      this.oscillator = this.audioContext.createOscillator();
      const oscillator = this.oscillator;

      oscillator.type = this.state.oscillatorType;
      oscillator.frequency.value = frequency; // value in hertz
      oscillator.connect(this.gainNode).connect(this.audioContext.destination);
      oscillator.onended = callback;
      oscillator.start(0);
      oscillator.stop(this.audioContext.currentTime + duration);
    };

    playMelody();
    this.setState({ playing: true });
  }

  pause() {
    this.oscillator.onended = undefined;
    this.oscillator.stop();
    this.setState({ playing: false });
  }

  setGain(value) {
    value = parseFloat(value);
    this.setState({ volume: value });
    if (this.gainNode) {
      this.gainNode.gain.value = value;
    }
  }

  render() {
    return (
      <div className="player">
        {this.state.playing ? (
          <button onClick={() => this.pause()}>Pause</button>
        ) : (
          <button onClick={() => this.createPlay()}>Play</button>
        )}

        <label htmlFor="volume">Volume</label>
        <input
          name="volume"
          type="range"
          id="volume"
          onChange={(e) => {
            this.setGain(e.target.value);
          }}
          value={this.state.volume}
          min={0}
          max={1}
          step={0.01}
        ></input>
        <select
          value={this.state.oscillatorType}
          onChange={(e) => {
            this.setState({ oscillatorType: e.target.value });
          }}
        >
          <option value="square">Square</option>
          <option value="sine">Sine</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="triangle">Triangle</option>
        </select>
        <textarea
          value={this.state.consoleText}
          readOnly
          style={{ width: "80%", height: "50vh" }}
        ></textarea>
      </div>
    );
  }
}
