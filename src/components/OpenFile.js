import { Component } from "react";

export default class LoadFile extends Component {
  constructor(props) {
    super(props);
    this.state = { filename: null };
  }

  loadFile() {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      try {
        const sheet = this.parseSheet(text);
        this.props.onChangeFile(sheet);
        console.log("Loaded sheet:", sheet);
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(this.state.filename, "utf-8");
  }

  parseSheet(text) {
    const lines = text.split("\n");
    const sheet = { notes: [] };
    for (let line of lines) {
      line = line.trim();
      if (line === "" || line.startsWith("#")) {
        continue;
      }
      if (!sheet.bpm) {
        // eslint-disable-next-line
        const [bpm, offset, ...other] = line.split(/\s+/);
        sheet.bpm = parseFloat(bpm);
        sheet.offset = parseFloat(offset);
        continue;
      }
      const [pitch, octave, tempo] = line.split(/\s+/);
      const level = parseInt(pitch) + parseInt(octave) * 12;
      sheet.notes.push({ level: level, tempo: parseFloat(tempo) });
    }
    return sheet;
  }

  render() {
    return (
      <div className="LoadFile">
        <label htmlFor="file"></label>
        <input type="file" name="file" onChange={(e) => this.setState({ filename: e.target.files[0] })}></input>
        <button onClick={() => this.loadFile()}>Load</button>
      </div>
    );
  }
}
