import React, { useState } from "react";
import { Key } from "./Player";

interface FileLoaderProps {
  onChangeFile: (bpm: number, off: number, notes: [Key, number][]) => void;
  writeConsole: (msg: string) => void;
}

const FileLoader: React.FC<FileLoaderProps> = ({
  onChangeFile,
  writeConsole,
}) => {
  const exampleList = [
    "Dango Daikazoku",
    "Determination",
    "Dogsong",
    "Doki Doki Literature Club",
    "Eternal East Wind",
    "Grasswalk",
    "Nagisa",
    "Nuit Silencieuse",
    "Okay Everyone",
    "Once Upon A Time",
    "Orange",
    "Distortion",
    "Haruhikage",
  ];

  const [option, setOption] = useState<"example" | "file">("example");
  const [exampleName, setExampleName] = useState("Doki Doki Literature Club");
  const [filename, setFilename] = useState<File | null>(null);

  const parse = (text: string): [number, number, [Key, number][]] => {
    const lines = text.split("\n");
    let idx = 0;

    while (
      idx < lines.length &&
      (lines[idx].length === 0 || lines[idx][0] === "#")
    ) {
      idx++;
    }

    if (idx === lines.length) {
      throw new Error("Empty file?");
    }

    const configuration = lines[idx].split(/[ ,]+/);
    if (configuration.length !== 2) {
      throw new Error("Missing bpm and off in given file.");
    }

    const bpm = parseFloat(configuration[0]);
    const off = parseInt(configuration[1]);
    const notes: [Key, number][] = [];

    for (let i = idx + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.length === 0 || line[0] === "#") continue;

      const nodeInfo = line.split(/[ ,]+/);
      const pitch = parseInt(nodeInfo[0]);
      const octave = parseInt(nodeInfo[1]);
      const duration = parseInt(nodeInfo[2]);

      notes.push([new Key(pitch, octave), duration]);
    }

    return [bpm, off, notes];
  };

  const load = async () => {
    if (option === "file") {
      if (!filename) {
        writeConsole("No file selected.");
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;

        try {
          const [bpm, off, notes] = parse(text);
          onChangeFile(bpm, off, notes);
          writeConsole("File loaded successfully.");
        } catch (err: unknown) {
          console.error(err);
          if (err instanceof Error) {
            writeConsole(`File load failed: ${err.message}`);
          }
        }
      };

      reader.readAsText(filename, "utf-8");
    } else {
      // Load example
      try {
        const response = await fetch(`./examples/${exampleName}.txt`);
        const data = await response.text();

        const [bpm, off, notes] = parse(data);
        onChangeFile(bpm, off, notes);
        writeConsole(`Example ${exampleName} loaded successfully.`);
      } catch (error) {
        console.error(error);
        writeConsole(`Example load failed: ${(error as Error).message}`);
      }
    }
  };

  return (
    <div className="loader">
      <div>
        <label htmlFor="example">Example</label>
        <input
          type="radio"
          value="example"
          name="example"
          checked={option === "example"}
          onChange={() => setOption("example")}
        />
        <label htmlFor="file">File</label>
        <input
          type="radio"
          value="file"
          name="example"
          checked={option === "file"}
          onChange={() => setOption("file")}
        />
      </div>

      {option === "example" ? (
        <select
          onChange={(e) => setExampleName(e.target.value)}
          value={exampleName}
        >
          {exampleList.map((example) => (
            <option key={example} value={example}>
              {example}
            </option>
          ))}
        </select>
      ) : (
        <div>
          <label htmlFor="fileInput">Choose file:</label>
          <input
            type="file"
            id="fileInput"
            onChange={(e) =>
              setFilename(e.target.files ? e.target.files[0] : null)
            }
          />
        </div>
      )}

      <button onClick={load}>Load</button>
    </div>
  );
};

export default FileLoader;
