import React, {Component} from "react";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import './style.scss';

import {GridProps, BoxProps, TweetGamePropsType} from "../../types/types";
import tweets from '../../data/tweets.json';
import Confetti from "react-confetti";

const MAX_TIME = 180;

interface TweetGameState {
	score: number;
	startDate: number;
	height: number;
	width: number;
	tiles: number[]; // assuming this is an array of indices like [0,1,2,...]
	selectedColumn: number;
	selectedTweet: boolean;
	tweetA: string;
	tweetB: string;
	time: number;
	nbClick: number;
	beginTime: number;
	correct: any[]; 
	timer: number;
	intervalId: any; 
	advIndex: number;
	adv: String;
	showInstruction: boolean;
}


class TweetGame extends Component<TweetGamePropsType, TweetGameState> {
	state: any;

	constructor(props: any) {
		super(props);


		this.state = {
			score : 0,
			startDate:Date.now(),
			height : window.innerHeight,
			width : window.innerWidth,
			tiles:Array.from(Array(this.props.cols).keys()),
			selectedColumn:0,
			selectedTweet:false,
			tweetA:"",
			tweetB:"",
			time:0,
			nbClick:0,
			beginTime:new Date().getTime(),
			correct:[],
			timer: MAX_TIME,
			intervalId: null,
			showInstruction: false
		}

		if (this.props.db){
			const doc = this.props.db.collection('llc')
			const observer = doc.where('game', '==', 'TWEET').where('type', '==', 'QR')
			  .onSnapshot(querySnapshot => {
				querySnapshot.docChanges().forEach(change => {

				if (change.type === "added") {
					let params = change.doc.data().params;
					let time = change.doc.data().time*1000;
					console.log(time, this.state.startDate, time > this.state.startDate)
					if (time > this.state.startDate){
						this.selectBox(this.state.selectedColumn, parseInt(params[0]))
					}

				}
			  });
			});
		}


	}
	
	updateTweets = () =>{
		let randomTweetOffensive = Math.floor(Math.random() * tweets.offensive.length)
		let randomTweetAdv = Math.floor(Math.random() * tweets.adversarial.length)

		let tweetOffensive = tweets.offensive[randomTweetOffensive].replaceAll("[","").replaceAll("]","").replaceAll("@user","")
		let tweetAdversarial = tweets.adversarial[randomTweetAdv].replaceAll("[","").replaceAll("]","").replaceAll("@user","")
		if (Math.random()<0.5){
			this.setState({"tweetA":tweetOffensive, "tweetB":tweetAdversarial, "advIndex":1,"adv":tweets.adversarial[randomTweetAdv]})
		}
		else {
			this.setState({"tweetB":tweetOffensive, "tweetA":tweetAdversarial, "advIndex":0,"adv":tweets.adversarial[randomTweetAdv]})
		}

	}

	selectBox = (lane:number, index:number) => {
		if(index!=this.state.selectedColumn){
			return
		}

		if(lane==this.state.advIndex){
			let correct = this.state.correct
			correct.push(this.state.advIndex)
			if(this.state.tiles.length==this.state.selectedColumn+1){
				let time = Math.floor((new Date().getTime() - this.state.beginTime)/1000)
				this.setState({"time":time})
			}

			if (this.state.tiles.length === this.state.selectedColumn + 1) {
				const time = Math.floor((new Date().getTime() - this.state.beginTime) / 1000);
				this.setState({ time }, () => {
					clearInterval(this.state.intervalId); 
				});
			}

			this.setState({"selectedColumn":this.state.selectedColumn+1,"correct":correct})

		}
		this.setState({"nbClick":this.state.nbClick+1})
		this.updateTweets()

	}

	populateRow = (row) => {

		return (label, index) =>{
		return <div style={{ textAlign: "center"}} className={`box ${index==this.state.selectedColumn ? "active" : (index<this.state.selectedColumn ? (this.state.correct[index]==row?"correct":"past"):"")}`} key={ index } >
									<span style={{ display: "inline-block", marginTop:60}}>{label}</span>
		</div>
		}
	}

	populate = () =>{
		this.updateTweets()
	}

	componentDidMount(){
		this.populate();
		
		const intervalId = setInterval(() => {
			this.setState((prevState) => {
				if (prevState.timer > 0) {
					return { timer: prevState.timer - 1 };
				} else {
					clearInterval(this.state.intervalId); // stop when timer hits 0
					return null;
				}
			});
		}, 1000);

		
		this.setState({ intervalId });

	}

	toggleMessage = () => {
		this.setState({showInstruction: !this.state.showInstruction})
	}

	render() {
		return (
			<>
			<div style={{
				position: "absolute" as const,
				top: "10px",
				right: "10px",
				zIndex: 1000
			}}>
				<button
				onClick={this.toggleMessage}
				className="info-button"
				>
				Game Instructions
				</button>

				{this.state.showInstruction && (
				<div className="overlay-message" onClick={this.toggleMessage}>
					<div className="message-box" onClick={(e) => e.stopPropagation()}>
					<h3>Game Instructions</h3>
					<p>You will be shown two tweets, which are both offensive for humans</p>
					<p><b>However, one of them contains a small change that makes it non-offensive for the machine. (a letter, a synonym)</b></p>
					<p>Can you guess which tweet is non-offensive?</p>
					<p>Click anywhere outside this box to close it.</p>
					</div>
				</div>
				)}
			</div>
			<IonGrid>
				{this.state.tiles.length==this.state.selectedColumn &&

				<div>
					{this.state.time<=MAX_TIME && this.state.nbClick<15 &&
					<p className="scoreFinal">Congratulations! You collected all the tweets! The secret code is <strong>31216</strong></p>}

					{this.state.time<=180 && this.state.nbClick<15 &&
					<Confetti width={this.state.width} height={this.state.height} />}

					{this.state.time>180 || this.state.nbClick>=15 &&
					<p className="scoreFinal">Too bad, you took too much time or clicks. The system has been reset. Try again!</p>}
				</div>

				}

				<IonRow>
  					<IonCol size="12" style={{ textAlign: "center" }}>
						<div className="click-display">
							Click used: {this.state.nbClick} / 15
						</div>
					</IonCol>
				</IonRow>

				<IonRow>
  					<IonCol size="12" style={{ textAlign: "center" }}>
						<div className="timer-display">
							Time: 	{String(Math.floor(this.state.timer / 60)).padStart(2, '0')}:
									{String(this.state.timer % 60).padStart(2, '0')}
						</div>
					</IonCol>
				</IonRow>


			  <IonRow>
				<IonCol>

					<div className="grid" style={{ width: this.state.tiles.length * 122}}>
							{this.state.tiles.map(this.populateRow(0),this)}
					</div>
					<div className="grid" style={{ width: this.state.tiles.length * 122}}>
							{this.state.tiles.map(this.populateRow(1),this)}
					</div>

					{this.state.selectedTweet &&

						<div  className="tweet" style={{marginTop:20, marginLeft:50, border:"solid 2px red"}}>
							<p>{this.state.adv}</p>
						</div>
					}

				</IonCol>
				  {this.state.selectedColumn  < this.state.tiles.length &&
				<IonCol style={{textAlign: "center"}}>
					<h3 style={{"marginLeft":0}}>Tweets</h3>


					<div className="tweet" onClick={() => this.selectBox(0,this.state.selectedColumn)}>
						<p>{this.state.tweetA}</p>
					</div>

						<div className="tweet" onClick={() => this.selectBox(1,this.state.selectedColumn)}>
						<p>{this.state.tweetB}</p>
						</div>
				</IonCol>
				  }
			  </IonRow>
			</IonGrid>
			</>
		);
	};
}

export default TweetGame;
