import FileLoader from "./modules/FileLoader";
import type { Note } from "./modules/Player";
import Player from "./modules/Player";
import type { FunctionComponent } from "preact";
import { useRef, useState, useEffect } from "preact/hooks";

const App: FunctionComponent = () => {
  const [bpm, setBpm] = useState<number>(0);
  const [off, setOff] = useState<number>(0);
  const [notes, setNotes] = useState<Note[]>([]);
  const [counter, setCounter] = useState(0);
  const [consoleText, setConsoleText] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onChangeFile = (bpm: number, off: number, notes: Note[]) => {
    setBpm(bpm);
    setOff(off);
    setNotes(notes);
    setCounter(counter + 1);
  };

  const writeConsole = (text: string) => {
    setConsoleText((prev) => prev + text + "\n");
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [consoleText]);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans pb-2">
      <header className="bg-slate-800 text-white py-6 px-4 rounded-b-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2">BeepPlay in Web (PoC)</h1>
        <a
          href="https://github.com/taoky/beep-react"
          className="text-blue-300 hover:underline"
        >
          Source code
        </a>
        <p className="mt-2">
          Original project:{" "}
          <a
            href="https://github.com/iBug/CGadgets/tree/master/BeepPlay"
            className="text-blue-400 hover:underline"
          >
            BeepPlay in Win32 API
          </a>
        </p>
      </header>

      <main className="max-w-3xl mx-auto my-10 px-4 space-y-8">
        <FileLoader onChangeFile={onChangeFile} writeConsole={writeConsole} />
        <Player
          notes={notes}
          bpm={bpm}
          off={off}
          counter={counter}
          writeConsole={writeConsole}
        />

        <div>
          <label className="block text-lg font-medium mb-2">
            Output Console
          </label>
          <textarea
            ref={textareaRef}
            value={consoleText}
            readOnly
            className="w-full h-60 p-4 border border-gray-300 rounded-md font-mono text-sm bg-white shadow-sm"
          />
          <button
            onClick={() => setConsoleText("")}
            className="w-32 mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Clear output
          </button>
        </div>
      </main>
    </div>
  );
};

export default App;
