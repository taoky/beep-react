import './App.css';
import FileLoader from './modules/FileLoader'
import Player from './modules/Player'
import { Component } from "react"

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null,
      bpm: null,
      off: null,
      notes: [],
      counter: 0
    }
  }

  onChangeFile = (bpm, off, notes) => {
    this.setState({bpm: bpm, off: off, notes: notes, counter: this.state.counter + 1})
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>BeepPlay in Web (PoC)</h1>
          <a href="https://github.com/taoky/beep-react">Source code</a>
          <p>Original project: <a href='https://github.com/iBug/CGadgets/tree/master/BeepPlay'>BeepPlay in Win32 API</a></p>
        </header>
        <main>
          <FileLoader onChangeFile={this.onChangeFile}></FileLoader>
          <Player notes={this.state.notes} bpm={this.state.bpm} off={this.state.off} counter={this.state.counter}></Player>
        </main>
      </div>
    );
  }
}
