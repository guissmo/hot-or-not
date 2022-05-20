import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react/cjs/react.production.min';

class PlaceCard extends React.Component {

  constructor(props) {
    super(props);
    this.props.updateMe(this.props.index)
    this.state = {
      bg: "amsterdam"
    }
  }

  render() {
    return (
      <div class="card card-rel">
        <div class="card card-abs card-bg-2" style={
          {
            backgroundImage: "url('"+this.state.bg+".jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "sepia(40%) opacity(70%) hue-rotate(0deg)",
          }
        }></div>
        <div class="card card-abs card-content">
        <h1><span class="city-name">{ this.props.place }, { this.props.country }</span></h1>
        <h2><span class="temp-display">{ this.props.temp }&#8451;</span></h2>
        </div>
      </div>
    );
  }
}

async function fetchStuff() {
  let json = await fetch("https://api.openweathermap.org/data/2.5/weather?lat=44.8378&lon=-0.594&appid=e3f861e3c4842bb6e2479e930fd8e5b4&units=metric")
        .then((res) => res.json())
        .then((data) => data)
  alert(json.main.temp)
}

class App extends React.Component {
    
  constructor(props) {
      super(props);
      this.state = {
        card: <PlaceCard place="Paris" country="France" temp="..." index="0" updateMe={this.cardArrayUpdate}></PlaceCard>
      };
  }

  cardArrayUpdate(index, temp) {
    this.setState({
      card: "1"
    })
  }

  render() {

    return (
        <div class="container">
        { this.state.cardArray[0] }
        { this.state.cardArray[1] }
        </div>
    );

  }
}

export default App;
