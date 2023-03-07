import { useEffect, useState } from 'react'
import './App.scss'
import { invoke } from "@tauri-apps/api";
import { Link } from "react-router-dom";

function App() {

  const [selectImage, setSelectImage] = useState()
  const [dataArray, setDataArray] = useState([])
  const [imageFile, setImageFile] = useState("")
  const [height, setHeight] = useState();
  const [width, setWidth] = useState();
  const [name, setName] = useState("");
  const [extension, setExtension] = useState("");
  const [dirPath, setDirPath] = useState("")

  useEffect(() => {
    const setDir = setTimeout(async () => {
      setDirPath((e) => e = "")
    }, 7000);
    if (!dirPath == "") {
      document.getElementById("dirPath").style = "display: block"
    }
    else if (dirPath == "") {
      document.getElementById("dirPath").style = "display: none";
    }
    return () => clearTimeout(setDir);
  }, [dirPath])

  function add() {
    if (height.toString() == "") {
      window.alert("Fill the height!")
    }
    else if (width.toString() == "") {
      window.alert("Fill the width!")
    }
    else if (name == "") {
      window.alert("Fill the name!")
    }
    else {
      const getImage = new FileReader()
      getImage.readAsDataURL(selectImage)
      getImage.onload = () => setImageFile(getImage.result.split(',')[1])
      setDataArray([...dataArray, { id: new Date().getTime(), height: height, name: name, raw_data: imageFile, width: width, extension: extension }])
    }
  }

  function deleteObject(e) {
    const updatedData = [...dataArray].filter(f => f.id !== e)
    setDataArray(updatedData)
  }

  async function send() {
    dataArray.map(async insideData => {
      const data = { height: parseInt(insideData.height), name: insideData.name, raw_data: imageFile, width: parseInt(insideData.width), extension: insideData.extension }
      await invoke("final_resizer_images", { data: data }).then(e => setDirPath(e)).catch(e => window.alert(e))
    })
  }

  return (
    <div className="App">
      <div id='creditPage'>
        <Link to="/credits" id='credits'>Credit</Link>
      </div>
      <h1 id='header'>Image Resizer</h1>
      <span id='dirPath'>Image has been saved to: {!dirPath ? "" : dirPath} directory</span>
      <div id='fileInput'>
        <input type="file" name="" id="" onChange={(e) => setSelectImage(e.target.files.item(0))} />
        {!dataArray.length < 1 && !imageFile == "" && <div onClick={send} id='convert'>Convert Icons</div>}
      </div>
      <div id='inputs'>
        <label htmlFor="">Height</label>
        <input type="text" name="" id="" placeholder='Height in Pixels' onChange={(e) => setHeight(e.target.value)} />
        <label htmlFor="">Width</label>
        <input type="text" name="" id="" placeholder='Width in Pixels' onChange={(e) => setWidth(e.target.value)} />
        <label htmlFor="">Name</label>
        <input type="text" name="" id="" placeholder='File Name: Example' onChange={(e) => setName(e.target.value)} />

        <label htmlFor="">Extension</label>
        <select name="extension" id="extensionSelect" defaultValue=".png" onChange={(e) => setExtension(e.target.value)}>
          <option value=".png">PNG</option>
          <option value=".jpg">JPG</option>
          <option value=".jpeg">JPEG</option>
          <option value=".ico">ICO</option>
        </select>

        <input type="submit" value="Add" id='Add' onClick={add} />
      </div>
      <label htmlFor="">Clear</label>
      <div onClick={() => setDataArray(e => e = [])} id='clear' className='clear'>Clear</div>
      {(dataArray.length < 1) ?
        (<div id='nothing'>Nothing is selected</div>) :
        dataArray?.map((e, index) => (
          <div id='imageDataContainer' key={index}>
            <div id='DataHolder'>
              <div>
                <label htmlFor="">Height</label>
                <span id='height'>{e.height}</span>
              </div>
              <div>
                <label htmlFor="">Width</label>
                <span id='width'>{e.width}</span>
              </div>
              <div>
                <label htmlFor="">Name</label>
                <span id='name'>{e.name}{e.extension}</span>
              </div>
              <span id='delete' onClick={() => deleteObject(e.id)}>Delete</span>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default App
