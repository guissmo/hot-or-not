import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import globalData from './data-teleport.json';

function rand(n) {
  return(Math.floor(Math.random()*n));
}

let n1 = rand(266);
let n2 = rand(266);

function PlaceCard(index) {

  let myIndex = index;

  const [temp, setTemp] = useState({
    data: "?"
  });

  const [city, setCity] = useState({
    bg: "paris.jpg"
  });

  function getFullNameFromIndex() {
    return(globalData._embedded['ua:item'][myIndex].full_name);
  }

  function getPhotoHrefFromIndex() {
    return(globalData._embedded['ua:item'][myIndex]._links['ua:images'].href)
  }

  const APIKEY = "e3f861e3c4842bb6e2479e930fd8e5b4";

  async function fetchTemp() {
    // e.preventDefault();
    let json = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=44.8378&lon=-0.594&appid=${APIKEY}&units=metric`)
          .then((res) => res.json())
          .then((data) => data)
    setTemp({
      data: json.main.temp
    });
  }

  async function fetchCity() {
    console.log(getPhotoHrefFromIndex(index));
    let json = await fetch(getPhotoHrefFromIndex())
          .then((res) => res.json())
          .then((data) => data)
    setCity({
      bg: json.photos[0].image.web
    });
    console.log(json)
    console.log(json.photos[0].image.web)
    return;
  }

  let fullName = [ getFullNameFromIndex() ];
  fetchCity();


  return (
    <div class="card card-rel">
        <div class="card card-abs" style = {{
          backgroundImage: `url('${city.bg}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "sepia(40%) opacity(70%)"
        }}></div>
        <div class="card card-abs card-content">
        <h1><span class="city-name">{fullName}</span></h1>
        <h2><span class="temp-display">{temp.data == "?" ? "?" : temp.data + '\u00b0C'} </span></h2>
        {/* <button onClick={fetchTemp}></button> */}
        <button onClick={fetchCity}></button>
        </div>
    </div>
  );
}


function App() {

  // console.log(globalData);
  // console.log(globalData._embedded['ua:item'][rand].full_name);
  // console.log(globalData._embedded['ua:item'][rand]._links['ua:images'].href);

  // let [cardOne, cardTwo] = [PlaceCard(n1), PlaceCard(n2)];

  alert("hi");
  return (
      <div class="container">
        Yo.
      </div>
  );

}

export default App;
