import { Component } from "react";

// reference: https://stackoverflow.com/questions/39200994/how-to-play-a-specific-frequency-with-javascript

export class Key {
  constructor(p, o) {
    this.o = o
    this.p = p
  }

  abs() {
    return this.o * 12 + this.p
  }

  plus(i) {
    const abs = this.abs() + i
    return new Key(abs % 12, Math.ceil(abs / 12))
  }
}

export default class Player extends Component {
  constructor(props) {
    super(props)
    this.freq_ref = 261.60  // C4 = 261.6 Hz
    this.key_ref = new Key(0, 4)  // C4
    this.state = {
      volume: 0.5,
    }
  }

  async createPlay() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.gainNode = this.audioContext.createGain()
    }
    if (!this.notes || this.notes.length === 0) {
      this.notes = this.props.notes.reverse()
    }

    const playMelody = async () => {
      if (this.notes.length > 0){
        let note = this.notes.pop()
        let key = note[0]
        let duration = note[1] * 60 / (this.props.bpm * 16)
        while (key.abs() === 0) {
          const this_dur = duration
          await new Promise(r => setTimeout(r, this_dur * 1000));
          if (this.notes.length === 0) {
            return
          }
          note = this.notes.pop()
          key = note[0]
          duration = note[1] * 60 / (this.props.bpm * 16)
        }
        console.log(note)
        const key_abs = key.plus(this.props.off).plus(-this.key_ref.abs()).abs()
        console.log(key.plus(this.props.off))
        console.log(key_abs, duration)
        playNote(this.freq_ref * Math.pow(2, (1/12) * key_abs), duration, playMelody);
      }
    }
    const playNote = (frequency, duration, callback) => {
      console.log(frequency, duration)
      this.oscillator = this.audioContext.createOscillator();
      const oscillator = this.oscillator

      oscillator.type = 'square';
      oscillator.frequency.value = frequency; // value in hertz
      oscillator.connect(this.gainNode).connect(this.audioContext.destination);
      oscillator.onended = callback;
      oscillator.start(0);
      oscillator.stop(this.audioContext.currentTime + duration);
    }

    playMelody()
  }

  stop() {
    this.oscillator.onended = undefined
    this.oscillator.stop()
  }

  setGain(value) {
    value = parseFloat(value)
    this.setState({volume: value})
    if (this.gainNode) {
      this.gainNode.gain.value = value
    }
  }

  render() {
    return <div className="player">
        <button onClick={() => this.createPlay()}>Play</button>
        <button onClick={() => this.stop()}>Stop</button>
        <input type="range" id="volume" onChange={(e) => {this.setGain(e.target.value)}} value={this.state.volume} min={0} max={2} step={0.01}></input>
        <textarea></textarea>
    </div>
  }
}
