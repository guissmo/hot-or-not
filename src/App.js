import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import globalData from './data-teleport.json';

const APIKEY = "e3f861e3c4842bb6e2479e930fd8e5b4";

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
    console.log("entered")
    return(globalData._embedded['ua:item'][myIndex].full_name);
  }

  function getPhotoHrefFromIndex() {
    return(globalData._embedded['ua:item'][myIndex]._links['ua:images'].href)
  }

  async function fetchTemp() {
    // e.preventDefault();
    let json = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=44.8378&lon=-0.594&appid=${APIKEY}&units=metric`)
          .then((res) => res.json())
          .then((data) => data)
    setTemp({
      data: json.main.temp
    });
  }

  async function fetchCity(e) {
    e.preventDefault()
    alert("yo")
    console.log(getPhotoHrefFromIndex(index));
    let json = await fetch(getPhotoHrefFromIndex())
          .then((res) => res.json())
          .then((data) => data)
    setCity({
      bg: json.photos[0].image.web
    });
    // console.log(json)
    console.log("hello", json.photos[0].image.web)
    return;
  }

  // let fullName = [ getFullNameFromIndex() ];
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
        <h1><span class="city-name">{"aa"}</span></h1>
        <h2><span class="temp-display">{temp.data == "?" ? "?" : temp.data + '\u00b0C'} </span></h2>
        {/* <button onClick={fetchTemp}></button> */}
        <button onClick={fetchCity}></button>
        </div>
    </div>
  );
}

class Card extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fullName: globalData._embedded['ua:item'][this.props.index].full_name,
      bg: "amsterdam.jpg",
      temp: 0,
    }
    this.latlon = globalData._embedded['ua:item'][this.props.index].bounding_box.latlon;
    console.log(this.latlon);
    this.lat = (this.latlon['north'] + this.latlon['south'])/2;
    this.lon = (this.latlon['east'] + this.latlon['west'])/2;
    console.log(this.lat, this.lon)
    this.fetchData();
  }

  async fetchData() {
    let photoData = await fetch(globalData._embedded['ua:item'][this.props.index]._links['ua:images'].href)
          .then((res) => res.json())
          .then((data) => data)
    let tempData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=44.8378&lon=-0.594&appid=${APIKEY}&units=metric`)
          .then((res) => res.json())
          .then((data) => data)
    this.setState({
      bg: photoData.photos[0].image.web,
      temp: tempData.main.temp
    })
    return;
  }

  render() {
    return (
      <div class="card card-rel">
        <div class="card card-abs" style = {{
          backgroundImage: `url('${this.state.bg}')`,
          backgroundSize: "cover",
          backgroundPosition: "left",
          filter: "sepia(40%) opacity(70%)"
        }}></div>
        <div class="card card-abs card-content">
        <h1><span class="city-name">{this.state.fullName}</span></h1>
        <h2><span class="temp-display">{this.state.temp}</span></h2>
        {/* {temp.data == "?" ? "?" : temp.data + '\u00b0C'} */}
        {/* <button onClick={fetchTemp}></button> */}
        {/* <button onClick={fetchCity}></button> */}
        </div>
      </div>
    );
  }

}


function App() {

  // console.log(globalData);
  // console.log(globalData._embedded['ua:item'][rand].full_name);
  // console.log(globalData._embedded['ua:item'][rand]._links['ua:images'].href);

  // let [cardOne, cardTwo] = [PlaceCard(n1), PlaceCard(n2)];

  console.log("hit");

  return (
      <div class="container">
      <Card index={n1} />
      </div>
  );

}

export default App;
