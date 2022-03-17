import axios from "axios";
import * as THREE from "three";
// import { DXFLoader } from "three-dxf-loader";

import React, { useState } from "react";
import { TextBox } from "./TextBox";

export const Uploader = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [text, setText] = useState("");

  // On file select (from the pop up)
  const onFileChange = (event) => {
    // Update the state
    console.log(event.target.files[0], setSelectedFile);
    setSelectedFile(event.target.files[0]);
  };

  // On file upload (click the upload button)
  const onFileUpload = async () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append("myFile", selectedFile, selectedFile.name);

    // Request made to the backend api
    // Send formData object
    const response = await axios.post("api/uploadfile", formData);
    const responseText = await response.data;
    setText(responseText);
  };

  const getSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // const loader = new DXFLoader();

  const renderer = new THREE.WebGLRenderer({
    antialising: true,
    alpha: false,
    canvas: undefined
  });

  const { width, height } = getSize();

  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
  const scene = new THREE.Scene();
  const ambientLight = new THREE.AmbientLight(0x0000ff, 0.4);
  const geometry = new THREE.BoxBufferGeometry();
  const material = new THREE.MeshLambertMaterial();
  const mesh = new THREE.Mesh(geometry, material);

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  camera.position.z = 5;

  scene.add(ambientLight, mesh);

  const update = () => {
    mesh.rotation.x += Math.sin(0.01);
    mesh.rotation.y += Math.sin(0.001);

    renderer.render(scene, camera);
    requestAnimationFrame(update);
  };

  requestAnimationFrame(update);

  document.getElementById("root").appendChild(renderer.domElement);

  // File content to be displayed after
  // file upload is complete
  const fileData = () => {
    if (selectedFile) {
      return (
        <>
          <div>
            <h2>File Details:</h2>

            <p>File Name: {selectedFile.name}</p>

            <p>File Type: {selectedFile.type}</p>
          </div>
          <div id="app"></div>
        </>
      );
    } else {
      return (
        <>
          <TextBox text={text} />
          <div id="app"></div>
        </>
      );
    }
  };

  return (
    <div>
      <h1>File Upload</h1>
      <div>
        <input type="file" onChange={onFileChange} />
        <button onClick={onFileUpload}>Upload!</button>
      </div>
      {fileData()}
    </div>
  );
};

export default Uploader;
