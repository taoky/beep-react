import "./App.css";
import FileLoader from "./modules/FileLoader";
import Player from "./modules/Player";
import { Component } from "react";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      bpm: null,
      off: null,
      notes: [],
      counter: 0,
      consoleText: "",
    };
  }

  onChangeFile = (bpm, off, notes) => {
    this.setState({
      bpm: bpm,
      off: off,
      notes: notes,
      counter: this.state.counter + 1,
    });
  };

  writeConsole = (text) => {
    this.setState({
      consoleText: this.state.consoleText + text + "\n",
    });
  };

  render() {
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
            onChangeFile={this.onChangeFile}
            writeConsole={this.writeConsole}
          ></FileLoader>
          <Player
            notes={this.state.notes}
            bpm={this.state.bpm}
            off={this.state.off}
            counter={this.state.counter}
            writeConsole={this.writeConsole}
          ></Player>
          <textarea
            value={this.state.consoleText}
            readOnly
            style={{ width: "80%", height: "50vh" }}
          ></textarea>
          <div>
            <button
              onClick={() => {
                this.setState({
                  consoleText: "",
                });
              }}
            >
              Clear output
            </button>
          </div>
        </main>
      </div>
    );
  }
}
