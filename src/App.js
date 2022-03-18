import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import globalData from './data-teleport.json';

const APIKEY = "e3f861e3c4842bb6e2479e930fd8e5b4";

function rand(n) {
  return(Math.floor(Math.random()*n));
}

let n1 = rand(266);
let n2 = rand(266);

// class CardBackground extends React.Component {

//   constructor(props){
//     super(props);
//     this.state = {
//       bg: null
//     }
//     this.fetchData()
//   }

//   fetchData = async() => {
//     let photoData = await fetch(globalData._embedded['ua:item'][this.props.index]._links['ua:images'].href)
//       .then((res) => res.json())
//       .then((data) => data)
//     this.setState({
//       bg: photoData.photos[0].image.web
//     });
//   }

//   render() {
//     if (this.state.bg == null) {
//       return(<div class="card card-abs" style={{
//         backgroundColor: 'red'
//       }}></div>)
//     }
//     return(
//       <div class="card card-abs" style = {{
//         backgroundImage: `url('${this.state.bg}')`,
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         filter: "sepia(40%) opacity(70%)"
//       }}></div>
//     )
//   }

// }

class BoxHotOrCold extends React.Component {
  render() {
    return(
      <span>
      <h3><span class="answer-button answer-hot" onClick={()=>this.props.submitAnswer(1)}><i class="fa-solid fa-temperature-arrow-up"></i> HOTTER</span></h3>
      <h3><span class="answer-button answer-cold" onClick={()=>this.props.submitAnswer(-1)}><i class="fa-solid fa-temperature-arrow-down"></i> COLDER</span></h3>
      {/* <h3><span class="answer-button answer-hot" onClick={()=>this.props.triggerAnswer(1)}><i class="fa-solid fa-temperature-arrow-up"></i> HOTTER</span></h3> */}
      {/* <h3><span class="answer-button answer-cold" onClick={()=>this.props.triggerAnswer(-1)}><i class="fa-solid fa-temperature-arrow-down"></i> COLDER</span></h3> */}
      </span>
    )    
  }
}

class BoxTemperature extends React.Component {
  render() {
    return(
      <h2><span class="temp-display">{this.props.temperature} {'\u00b0C'}</span></h2>
    );
  }
}

class BoxSuspense extends React.Component {

  constructor(props){
    super(props);
    this.randomizer = null;
    this.speed = 50;
    this.state = {
      display: 0
    }
    this.startRandomizer(300)
  }

  startRandomizer(tim) {
    this.suspenseTime = tim;
    this.randomizer = setInterval(this.randomState.bind(this), this.speed);
  }

  randomState() {
    let randomN = Math.floor(Math.random()*100);
    this.setState({
      display: randomN
    })
    this.suspenseTime -= this.speed;
    console.log(this.suspenseTime);
    console.log(this.suspenseTime < 0);
    if(this.suspenseTime < 0){
      clearInterval(this.randomizer);
      this.setState({
        display: Math.round(this.props.temperature)
      })
    }
  }

  render() {
    return(
      <span>
      <h2><span class="temp-display">{this.state.display} {'\u00b0C'}</span></h2>
      <button onClick={this.props.nextRound}>NEXT ROUND</button>
      </span>
    );
  }

}

class Card extends React.Component {

  constructor(props){
    super(props)
  }

  render() {
    return (
      <div class="card card-rel">
        <div class="card card-abs" style = {{
          backgroundImage: `url('${this.props.photo}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "sepia(40%) opacity(70%)"
        }}></div>
        <div class="card card-abs card-content">
        <h1><span class="city-name">{this.props.fullName}</span></h1>
        {this.props.box}
        </div>
      </div>
    );
  }
}


class App extends React.Component {

  constructor(props) {
    super(props);
    this.newGame()
  }

  newGame = () => {

    this.state = {
      round: 0,
      readyBlocks: 0,
      waitingForAnswer: true,
      score: 0
    }

    this.blocks = []

    this.newQuestion()
    this.newQuestion()
    this.newQuestion()

  }

  clickedAnswer = (arg) => {
    this.setState({
      waitingForAnswer: false
    })
    const leftBlock = this.blocks[this.state.round-2]
    const rightBlock = this.blocks[this.state.round-1]

    let correct = false;

    if(leftBlock.temp - rightBlock.temp >= 0 && arg == -1){
      correct = true;
    }

    if(rightBlock.temp - leftBlock.temp <= 0 && arg == 1){
      correct = true;
    }

    if(correct){
      this.setState({
        score: this.state.score + 1
      })
    }
    
  }

  newQuestion = async () => {
    const n = Math.floor(Math.random()*266);
    const fullName = globalData._embedded['ua:item'][n].full_name;
    
    const latlon = globalData._embedded['ua:item'][n].bounding_box.latlon;
    const lat = (latlon['north'] + latlon['south'])/2;
    const lon = (latlon['east'] + latlon['west'])/2;

    const tempData = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=metric`)
          .then((res) => res.json())
          .then((data) => data)
    const temp = Math.round(tempData.main.temp);

    const photoData = await fetch(globalData._embedded['ua:item'][n]._links['ua:images'].href)
      .then((res) => res.json())
      .then((data) => data)
    const photo = photoData.photos[0].image.web

    this.blocks.push({
      n: n,
      fullName: fullName,
      lat: lat,
      lon: lon,
      temp: temp,
      photo: photo
    })

    this.setState({
      readyBlocks: this.blocks.length
    })

    if( this.state.readyBlocks >= 2 && this.state.round < 2) this.advanceRound()

  }

  advanceRound = async (e) => {
    this.newQuestion()
    this.setState({
      round: this.state.round + 1,
      waitingForAnswer: true
    })
  }

  render() {

    const displayMe = [];

    if(this.readyBlocks < 2) return (null);
    
    for(let i = Math.max(0, this.state.round-2); i < this.state.round; i++){
      
      if(this.blocks[i] === undefined) return (null);

      let lastCard = (i === this.state.round-1)
      let box = null;
      if (!lastCard) {
        box = <BoxTemperature key={i+3000} temperature={this.blocks[i].temp} />
      }else{
        if(this.state.waitingForAnswer){
          box = <BoxHotOrCold key={i+2000} submitAnswer={this.clickedAnswer} />
        }else{
          box = <BoxSuspense key={i+1000} temperature={this.blocks[i].temp} nextRound={this.advanceRound} />
        }
      }
      displayMe.push(
      <Card key={i}
            fullName={this.blocks[i].fullName}
            photo={this.blocks[i].photo}
            box={box}
      />);
    }

    return(
      <div class="container">
        { displayMe }
        <button onClick={this.advanceRound.bind(this)}>HAHA</button>
        <button onClick={this.newQuestion}>HEHE</button>
        <button onClick={this.newGame}>RESTART</button>
        {this.blocks.length} {this.state.readyBlocks} {this.state.round} {this.state.score} 
      </div>
    );
  }
}

export default App;
