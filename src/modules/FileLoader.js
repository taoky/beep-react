import { Component } from "react";
import { Key } from "./Player";

export default class FileLoader extends Component {
  constructor(props) {
    super(props);
    this.exampleList = [
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
    this.state = {
      filename: null,
      exampleName: "Doki Doki Literature Club",
      option: "example",
    };
  }

  parse(text) {
    const lines = text.split("\n");
    let idx = 0;
    while (idx < lines.length && (lines[idx].length === 0 || lines[idx][0] === "#")) {
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
    const notes = [];
    for (let i = idx + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.length === 0 || line[0] === "#") {
        continue;
      }
      const nodeInfo = line.split(/[ ,]+/);
      const pitch = parseInt(nodeInfo[0]);
      const octave = parseInt(nodeInfo[1]);
      const duration = parseInt(nodeInfo[2]);
      notes.push([new Key(pitch, octave), duration]);
    }
    return [bpm, off, notes];
  }

  load = async () => {
    if (this.state.option === "file") {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target.result;
        try {
          const file = this.parse(text);
          const bpm = file[0];
          const off = file[1];
          const notes = file[2];
          this.props.onChangeFile(bpm, off, notes);
          this.props.writeConsole("File loaded successfully.");
        } catch (e) {
          console.error(e);
          this.props.writeConsole(`File loaded failed: ${e}`);
        }
      };
      reader.readAsText(this.state.filename, "utf-8");
    } else {
      // example
      await fetch(`./examples/${this.state.exampleName}.txt`)
        .then((response) => response.text())
        .then((data) => {
          console.log(data);
          const file = this.parse(data);
          const bpm = file[0];
          const off = file[1];
          const notes = file[2];
          this.props.onChangeFile(bpm, off, notes);
          this.props.writeConsole(
            `Example ${this.state.exampleName} loaded successfully.`
          );
        })
        .catch((error) => {
          console.error(error);
          this.props.writeConsole(`Example loaded failed: ${error}`);
        });
    }
  };
  render() {
    return (
      <div className="loader">
        <div>
          <label htmlFor="example">Example</label>
          <input
            type="radio"
            value="example"
            name="example"
            checked={this.state.option === "example"}
            onChange={(e) => this.setState({ option: e.target.value })}
          ></input>
          <label htmlFor="file">File</label>
          <input
            type="radio"
            value="file"
            name="file"
            checked={this.state.option === "file"}
            onChange={(e) => this.setState({ option: e.target.value })}
          ></input>
        </div>
        {this.state.option === "example" ? (
          <select
            onChange={(e) => this.setState({ exampleName: e.target.value })}
            value={this.state.exampleName}
          >
            {this.exampleList.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <div>
            <label htmlFor="file"></label>
            <input
              type="file"
              label="file"
              onChange={(e) => this.setState({ filename: e.target.files[0] })}
            ></input>
          </div>
        )}

        <button onClick={() => this.load()}>Load</button>
      </div>
    );
  }
}
