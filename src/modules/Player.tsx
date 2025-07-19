import React, { useEffect, useRef, useState } from "react";

export class Key {
  p: number;
  o: number;

  constructor(p: number, o: number) {
    this.o = o;
    this.p = p;
  }

  abs(): number {
    return this.o * 12 + this.p;
  }

  plus(i: number): Key {
    const abs = this.abs() + i;
    return new Key(abs % 12, Math.floor(abs / 12));
  }

  toString(): string {
    return `Pitch ${this.p} Octave ${this.o}`;
  }
}

export interface Note {
  0: Key;
  1: number; // duration
}

interface PlayerProps {
  notes: Note[];
  bpm: number;
  counter: number;
  off: number; // offset to shift pitch
  writeConsole: (message: string) => void;
}

const Player: React.FC<PlayerProps> = ({
  notes,
  bpm,
  counter,
  off,
  writeConsole,
}) => {
  const freq_ref = 261.6;
  const key_ref = useRef(new Key(0, 4));
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const noteStack = useRef<Note[] | null>(null);

  const [volume, setVolume] = useState(0.5);
  const [oscillatorType, setOscillatorType] = useState<OscillatorType>("sine");
  const [playing, setPlaying] = useState(false);
  const prevCounterRef = useRef<number>(counter);

  useEffect(() => {
    if (prevCounterRef.current !== counter) {
      pause();
      noteStack.current = null;
      prevCounterRef.current = counter;
    }
  }, [counter]);

  const getDuration = (relativeDuration: number): number =>
    (relativeDuration * 60) / (bpm * 16);

  const pause = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.onended = null;
      oscillatorRef.current.stop();
    }
    setPlaying(false);
  };

  const setGain = (value: number) => {
    const newValue = parseFloat(value.toString());
    setVolume(newValue);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newValue;
    }
  };

  const playNote = (
    frequency: number,
    duration: number,
    callback: () => void
  ) => {
    if (!audioContextRef.current) return;
    const oscillator = audioContextRef.current.createOscillator();
    const gain = gainNodeRef.current!;
    oscillator.type = oscillatorType;
    oscillator.frequency.value = frequency;
    oscillator.connect(gain).connect(audioContextRef.current.destination);
    oscillator.onended = callback;
    oscillator.start(0);
    oscillator.stop(audioContextRef.current.currentTime + duration);
    oscillatorRef.current = oscillator;
  };

  const playMelody = async () => {
    if (!noteStack.current || noteStack.current.length === 0) {
      return;
    }
    let note = noteStack.current.pop()!;
    let key = note[0];
    let duration = getDuration(note[1]);

    while (key.abs() === 0) {
      await new Promise((resolve) => setTimeout(resolve, duration * 1000));
      if (!noteStack.current || noteStack.current.length === 0) return;
      note = noteStack.current.pop()!;
      key = note[0];
      duration = getDuration(note[1]);
    }

    const key_abs = key.plus(off).plus(-key_ref.current.abs()).abs();

    const frequency = freq_ref * Math.pow(2, (1 / 12) * key_abs);
    writeConsole(
      `${note[0]} Note ${note[1]} Frequency ${frequency} Duration ${duration}`
    );

    playNote(frequency, duration, playMelody);
  };

  const createPlay = async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.value = volume;
    }
    if (!noteStack.current || noteStack.current.length === 0) {
      noteStack.current = [...notes].reverse();
    }

    await playMelody();
    setPlaying(true);
  };

  return (
    <div className="player">
      {playing ? (
        <button onClick={pause}>Pause</button>
      ) : (
        <button onClick={createPlay}>Play</button>
      )}
      <label htmlFor="volume">Volume</label>
      <input
        name="volume"
        type="range"
        id="volume"
        value={volume}
        onChange={(e) => setGain(parseFloat(e.target.value))}
        min={0}
        max={1}
        step={0.01}
      />

      <select
        value={oscillatorType}
        onChange={(e) => setOscillatorType(e.target.value as OscillatorType)}
      >
        <option value="square">Square</option>
        <option value="sine">Sine</option>
        <option value="sawtooth">Sawtooth</option>
        <option value="triangle">Triangle</option>
      </select>
    </div>
  );
};

export default Player;
