import { Component } from "react";
import { Key } from './Player'

export default class FileLoader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filename: null
    }
  }

  parse(text) {
    const lines = text.split("\n")
    const configuration = lines[0].split(" ")
    const bpm = parseFloat(configuration[0])
    const off = parseInt(configuration[1])
    const notes = []
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.length === 0 || line[0] === '#') {
        continue
      }
      const nodeInfo = line.split(" ")
      const pitch = parseInt(nodeInfo[0])
      const octave = parseInt(nodeInfo[1])
      const duration = parseInt(nodeInfo[2])
      notes.push([new Key(pitch, octave), duration])
    }
    return [bpm, off, notes]
  }

  load_file = async () => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = e.target.result
      try {
        const file = this.parse(text)
        const bpm = file[0]
        const off = file[1]
        const notes = file[2]
        this.props.onChangeFile(bpm, off, notes)
      } catch (e) {
        console.error(e)
      }
    }
    reader.readAsText(this.state.filename, "utf-8")
  }
  render() {
    return <div className="loader">
      <label htmlFor='file'></label>
      <input type='file' label='file' onChange={e => this.setState({filename: e.target.files[0]})}></input>
      <button onClick={() => this.load_file()}>Load</button>
    </div>
  }
}
