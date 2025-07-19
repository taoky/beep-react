import "./App.css";
import FileLoader from "./modules/FileLoader";
import type { Note } from "./modules/Player";
import Player from "./modules/Player";
import React, { useState } from "react";

const App: React.FC = () => {
  const [bpm, setBpm] = useState<number>(0);
  const [off, setOff] = useState<number>(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [counter, setCounter] = useState(0);
  const [consoleText, setConsoleText] = useState("");

  const onChangeFile = (bpm: number, off: number, notes: Note[]) => {
    setBpm(bpm);
    setOff(off);
    setNotes(notes);
    setCounter(counter + 1);
  };

  const writeConsole = (text: string) => {
    setConsoleText((prev) => prev + text + "\n");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>BeepPlay in Web (PoC)</h1>
        <a href="https://github.com/taoky/beep-react">Source code</a>
        <p>
          Original project:{" "}
          <a href="https://github.com/iBug/CGadgets/tree/master/BeepPlay">
            BeepPlay in Win32 API
          </a>
        </p>
      </header>
      <main>
        <FileLoader
          onChangeFile={onChangeFile}
          writeConsole={writeConsole}
        ></FileLoader>
        <Player
          notes={notes}
          bpm={bpm}
          off={off}
          counter={counter}
          writeConsole={writeConsole}
        ></Player>
        <textarea
          value={consoleText}
          readOnly
          style={{ width: "80%", height: "50vh" }}
        ></textarea>
        <div>
          <button
            onClick={() => {
              setConsoleText("");
            }}
          >
            Clear output
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
