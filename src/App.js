import React from 'react';
import globalData from './data-teleport.json';
import APIKEY from './apikey.json';

class BoxHotOrCold extends React.Component {
  render() {
    return(
      <span className="answer-buttons-wrapper">
      <span className="answer-button-wrapper"><span className="answer-button answer-hot" onClick={()=>{this.props.submitAnswer(1)}}><i class="fa-solid fa-temperature-arrow-up"></i> HOTTER</span></span>
      <span className="answer-button-wrapper"><span className="answer-button answer-cold" onClick={()=>{this.props.submitAnswer(-1)}}><i class="fa-solid fa-temperature-arrow-down"></i> COLDER</span></span>
      </span>
    )    
  }
}

class BoxTemperature extends React.Component {
  render() {
    return(
      <span class="temp-display-wrapper"><span class="temp-display">{this.props.temperature} {'\u00b0C'}</span></span>
    );
  }
}

class BoxSuspense extends React.Component {

  constructor(props){
    super(props);
    this.randomizer = null;
    this.speed = 50;
    this.state = {
      display: 0,
      suspensing: true
    };
    this.props.suspensingTrue()
    this.startRandomizer(Math.floor(Math.random()*200)+150)
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
    // console.log(this.suspenseTime);
    // console.log(this.suspenseTime < 0);
    if(this.suspenseTime < 0){
      clearInterval(this.randomizer);
      this.setState({
        display: Math.round(this.props.temperature)
      })
      setTimeout(()=>this.setState({
        suspensing: false
      }), 200)
      setTimeout(this.props.suspensingFalse, 200);
    }
  }

  render() {
    return(
      <span>
      <h2><span class="temp-display">{this.state.display}{'\u00b0C'}</span></h2>
      { this.state.suspensing ? "" : <span className="next-round-button" onClick={this.props.nextRound}>NEXT ROUND</span>}
      </span>
    );
  }

}

class Card extends React.Component {

  render() {
    return (
      <div class="card card-rel">
        <div class="card card-abs" style = {{
          backgroundImage: `url('${this.props.photo}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "sepia(40%) opacity(70%)"
        }}></div>
        <div className="card card-abs card-content">
        <span class="city-name">{this.props.fullName}</span>
        {this.props.box}
        </div>
      </div>
    );
  }
}

class Overlay extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      shareMessage: 'SHARE'
    }
  }
  
  render() {
    return (
      <div>
      <div className="overlay"></div>
      <div className="overlay-text">
      <h2 className="end-game">SCORE: {this.props.score}</h2>
      <p>I am looking for a job.</p>
      <p>
      <a href="https://guissmo.com" target="_blank" rel="noreferrer">Website</a> |
      <a href="https://github.com/guissmo" target="_blank" rel="noreferrer">Github</a> |
      <a href="https://linkedin.com/in/guissmo" target="_blank" rel="noreferrer">LinkedIn</a> |
      <a href="mailto:jared@guissmo.com" target="_blank" rel="noreferrer">Email</a>
      </p>
      <p>&nbsp;</p>
      <span className="end-game-buttons-wrapper">
      <span className="end-game-button " onClick={()=>this.props.shareGame(this)}>{this.state.shareMessage}</span>
      <span className="end-game-button" onClick={this.props.newGame}>NEW GAME</span>
      </span>
      </div>
      </div>
    );
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      round: 0,
      readyBlocks: 0,
      gameEnd: false,
      waitingForAnswer: true,
      score: 0
    };
    this.newGame()
  }

  newGame = () => {

    this.blocks = []

    this.setState({
      round: 0,
      readyBlocks: 0,
      gameEnd: false,
      waitingForAnswer: true,
      score: 0,
      suspensing: false,
      currAnswer: 0
    });

    this.newQuestion()
    this.newQuestion()
    this.newQuestion()

  }

  shareGame = (btn) => {
    
    let ret = "";
    ret += `Hot or Not:\nCan you decide which of the two is hotter?\n`;  
    ret += `I got ${this.state.score} points!\n`
    ret += `https://hotornot.guissmo.com`;
    navigator.clipboard.writeText(ret);
    btn.setState({
      shareMessage: "COPIED!"
    });
    console.log(btn.state)

  }

  suspensingTrue = () => {
    this.setState({
      suspensing: true
    })
  }

  suspensingFalse = () => {
    this.setState({
      suspensing: false
    })
  }

  clickedAnswer = (arg) => {

    console.log("clickkkkkkkkkkkkkkkk")

    this.setState({
      waitingForAnswer: false,
      currAnswer: arg
    })
    const leftBlock = this.blocks[this.state.round-2]
    const rightBlock = this.blocks[this.state.round-1]

    let correct = false;

    console.log(leftBlock.temp, rightBlock.temp)
    console.log(leftBlock.temp - rightBlock.temp)

    if( (leftBlock.temp - rightBlock.temp) * arg <= 0){
      correct = true;
    }

    if(correct){
      this.setState({
        score: this.state.score + 1
      })
    }else{
      this.setState({
        waitingForAnswer: false,
        gameEnd: true
      });
    }

    return;
    
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

    if( this.state === null ) return ;
    if( this.state.readyBlocks >= 2 && this.state.round < 2) this.advanceRound()

  }

  advanceRound = async (e) => {
    this.newQuestion()
    this.setState({
      round: this.state.round + 1,
      waitingForAnswer: true,
      gameEnd: false
    })
  }

  render() {

    const displayMe = [];

    // if(this.readyBlocks < 2) return (null);

    // if(this.state === null) {
    //   return("Loading... 1");
    // }
    if(this.state.round < 2 || this.state.readyBlocks < 2){
      this.newQuestion();
      return("Loading... ");
    }
    
    for(let i = this.state.round-2; i < this.state.round; i++){
      
      if(this.blocks[i] === undefined) {
        this.newQuestion();
        return("Loading... 2");
      }

      let lastCard = (i === this.state.round-1)
      let box = null;
      if (!lastCard) {
        box = <BoxTemperature key={i+3000} temperature={this.blocks[i].temp} />
      }else{
        if(this.state.waitingForAnswer){
          box = <BoxHotOrCold key={i+2000} submitAnswer={this.clickedAnswer.bind(this)} />
        }else{
          box = <BoxSuspense key={i+1000} temperature={this.blocks[i].temp} nextRound={this.advanceRound} suspensingTrue={this.suspensingTrue.bind(this)} suspensingFalse={this.suspensingFalse.bind(this)} myAnswer={this.currAnswer} />
        }
      }
      displayMe.push(
      <Card key={i}
            fullName={this.blocks[i].fullName}
            photo={this.blocks[i].photo}
            box={box}
      />);
    }

    let gameEndBox = "";
    if (this.state.gameEnd && !this.state.suspensing) {
      gameEndBox = <Overlay score={this.state.score} message="Game over!" newGame={this.newGame.bind(this)} shareGame={this.shareGame} />
    }

    console.log(displayMe, this.state)

    return(
      <span className="app-span">
        { displayMe }
        { gameEndBox }
        {/* <button onClick={this.advanceRound.bind(this)}>HAHA</button> */}
        {/* <button onClick={this.newQuestion}>HEHE</button> */}
        {/* <button onClick={this.newGame}>RESTART</button> */}
        {/* {this.blocks.length} {this.state.readyBlocks} {this.state.round} {this.state.score}  */}
      </span>
    );
  }
}

export default App;
