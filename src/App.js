import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import globalData from './data-teleport.json';

const APIKEY = "e3f861e3c4842bb6e2479e930fd8e5b4";

function rand(n) {
  return(Math.floor(Math.random()*n));
}

let n1 = rand(266);
let n2 = rand(266);

class CardBackground extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      bg: null
    }
    this.fetchData()
  }

  fetchData = async() => {
    let photoData = await fetch(globalData._embedded['ua:item'][this.props.index]._links['ua:images'].href)
      .then((res) => res.json())
      .then((data) => data)
    this.setState({
      bg: photoData.photos[0].image.web
    });
  }

  render() {
    if (this.state.bg == null) {
      return(<div class="card card-abs" style={{
        backgroundColor: 'red'
      }}></div>)
    }
    return(
      <div class="card card-abs" style = {{
        backgroundImage: `url('${this.state.bg}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        filter: "sepia(40%) opacity(70%)"
      }}></div>
    )
  }

}

class BoxHotOrCold extends React.Component {
  render() {
    return(
      <span>
      <h3><span class="answer-button answer-hot"><i class="fa-solid fa-temperature-arrow-up"></i> HOTTER</span></h3>
      <h3><span class="answer-button answer-cold"><i class="fa-solid fa-temperature-arrow-down"></i> COLDER</span></h3>
      </span>
    )    
  }
}

class BoxTemperature extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      temp: null
    }
    this.fetchData()
  }

  fetchData = async() => {
    let tempData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${this.props.lat}&lon=${this.props.lon}&appid=${APIKEY}&units=metric`)
          .then((res) => res.json())
          .then((data) => data)
    this.setState({
      temp: tempData.main.temp
    })
    console.log(tempData)
  }

  render() {
    if (this.state.temp == null) {
      return( <h2><span class="temp-display">...</span></h2> )
    }
    return(
      <h2><span class="temp-display">{Math.round(this.state.temp) + '\u00b0C'}</span></h2>
    )
  }
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

    return;
  }

  render() {

    if(this.props.revealed){
      return (
        <div class="card card-rel">
          <CardBackground index={this.props.index}/>
          <div class="card card-abs card-content">
          <h1><span class="city-name">{this.state.fullName}</span></h1>
          <BoxTemperature lat={this.lat} lon={this.lon}/>
          </div>
        </div>
      );
    }

    return (
      <div class="card card-rel">
        <CardBackground index={this.props.index}/>
        <div class="card card-abs card-content">
        <h1><span class="city-name">{this.state.fullName}</span></h1>
        <BoxHotOrCold />
        </div>
      </div>
    );
    
  }

}


function App() {

  console.log("hit");

  return (
      <div class="container">
      <Card index={n1} revealed={true} />
      <Card index={n2} revealed={false} />
      </div>
  );

}

export default App;
