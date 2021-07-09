import { Component } from "react";
import "./App.scss";
import OpenFile from "./components/OpenFile";
import Player from "./components/Player";

export default class App extends Component {
  state = {
    sheet: null,
  }

  onChangeFile(sheet) {
    this.setState({ sheet: sheet });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        <main>
          <OpenFile onChangeFile={this.onChangeFile.bind(this)} />
          <Player sheet={this.state.sheet} />
        </main>
      </div>
    );
  }
}
