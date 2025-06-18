import React, {Component, useState} from "react";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import './style.scss';

import {GridProps, BoxProps, TweetGamePropsType} from "../../types/types";
import Confetti from "react-confetti";
import { DragDropContainer, DropTarget } from 'react-drag-drop-container';
import ReactTooltip from 'react-tooltip';

const base_folder = "https://raw.githubusercontent.com/Scilliva/ETM/game_sound/client/src/assets/audio/"


interface SoundGameState {
	score: number;
	startDate: number;
	height: number;
	width: number;
	tiles: number[];
	scrambledSounds: number[];
	associationsSounds: { [key: string]: string };
	selectedColumn: number;
	audios: HTMLAudioElement[];
	audios_labels: string[];
	count_drops: number;
	nbCounts: number;
	criticalDrops: number[];
	correctCriticalMatches: Set<number>;
	showInstruction: boolean;
	intervalId?: number;
}

class SoundGame extends Component<TweetGamePropsType, SoundGameState> {
	state: SoundGameState;

	constructor(props: any) {
		super(props);


		let audios = [new Audio(base_folder + "50db_0.mp3?raw=true"), new Audio(base_folder + "50db_1.mp3?raw=true"),
			new Audio(base_folder + "50db_2.mp3?raw=true"), new Audio(base_folder + "35db_0.mp3?raw=true"),
			new Audio(base_folder + "35db_1.mp3?raw=true"), new Audio(base_folder + "20db_0.mp3?raw=true"),
			new Audio(base_folder + "20db_1.mp3?raw=true") ]

		let audios_labels = ["that day the merchant gave the boy permission to build the display",
			"everyone seemed very excited", "plastic surgery has become more popular",
			"the boy looked out at the horizon","later we simply let life proeed in its own direction toward its own fate",
			"now I would drift gently off to dream land",
			"my wife pointed out to me the brightness of the red green and yellow signal light"
		]

		//let audio_backgrounds = ["cards/1.pn"]

		let sounds = Array.from(Array(this.props.cols).keys())
		sounds.sort(() => (Math.random() > .5) ? 1 : -1)
		//sounds = [6,0,4, 2 , 1, 5 , 3]

		let tiles = Array.from(Array(this.props.cols).keys())
		tiles.sort(() => (Math.random() > .5) ? 1 : -1)
		let associations = Object.fromEntries(tiles.map(e=>["drop_"+e,""]))

		console.log("tiles",tiles)
		console.log("sounds",sounds)
		console.log("associations",associations)


		this.state = {
			score : 0,
			startDate:Date.now(),
			height : window.innerHeight,
			width : window.innerWidth,
			tiles:tiles,
			scrambledSounds:sounds,
			associationsSounds:associations,
			selectedColumn:0,
			audios:audios,
			audios_labels:audios_labels,
			count_drops:0,
			nbCounts:10,
			criticalDrops: [0, 3, 5],
  			correctCriticalMatches: new Set<number>(),
			showInstruction: false
		}

		console.log(this.state.associationsSounds)

	}

	play = (index) => {
		console.log(index+"--"+ this.state.audios[index].src)
		this.state.audios[index].play()
	  }

	componentDidMount(){
	}

	toggleMessage = () => {
		this.setState({showInstruction: !this.state.showInstruction})
	}

	populateRow = (row) => {

		return (label, index) =>{
		return <div style={{ display:"inline-block"}}  key={ index } >

			{row == 0 &&
			<DragDropContainer targetKey={"label"} >
				<div className="card" id={"sound_"+this.state.tiles[label]} onClick={evt => this.play(this.state.tiles[label])}
				style={{backgroundImage: "url('"+base_folder+"cards/"+(this.state.tiles[label]+2)+".png?raw=true')"}}
				></div>
			</DragDropContainer>
			}

			{row == 1 &&
			<DropTarget targetKey={"label"} onHit={this.dropped}>
				<div className="card my_target" data-tip={this.state.audios_labels[label]} style={{backgroundImage: "url('"+base_folder+"cards/back.png?raw=true')"}} onDoubleClick={this.clearDrop}  id={"drop_"+label}></div>
			</DropTarget>
			}

				</div>
		}
	}


	dropped = (e) => {

		let associations = this.state.associationsSounds
		if(associations[e.target.id] !=""){
			return
			document.getElementById(associations[e.target.id]).parentElement.parentElement.style.visibility = 'initial';
		}

		associations[e.target.id] = e.dragElem.firstChild.id
		
		let correctCriticalMatches = new Set<number>(this.state.correctCriticalMatches);
		const dropIndex = parseInt(e.target.id.split("_")[1]);
		const soundIndex = parseInt(e.dragElem.firstChild.id.split("_")[1]);

		if (this.state.criticalDrops.includes(dropIndex)) {
			if (dropIndex === soundIndex) {
				correctCriticalMatches.add(dropIndex);
			} else {
				correctCriticalMatches.delete(dropIndex);
			}
		}

		const count_drops = this.state.count_drops + 1;

		this.setState({"associationsSounds":associations, "count_drops": count_drops, "correctCriticalMatches": correctCriticalMatches}, () => {
			if (this.state.correctCriticalMatches.size === this.state.criticalDrops.length ||
				this.state.count_drops > this.state.nbCounts) {
				clearInterval(this.state.intervalId as number);
			}
		});

      	e.containerElem.style.visibility = 'hidden';
		
		if (dropIndex === soundIndex){
			if (this.state.criticalDrops.includes(dropIndex)){
				e.target.classList.add("correct");
			}
			e.target.classList.remove("incorrect");
		}
		else{
			e.target.classList.remove("correct");
			e.target.classList.add("incorrect");
		}


	  console.log(e.dragElem.firstChild.id, e.target.id,this.state.count_drops )
  	}

	  clearDrop = (e) => {
			console.log(e)
		  let associations = this.state.associationsSounds
		  if (associations[e.target.id] != "") {
			  document.getElementById(associations[e.target.id]).parentElement.parentElement.style.visibility = 'initial';
			  e.target.classList.remove("incorrect")
			  e.target.classList.remove("correct")
			  associations[e.target.id] = ""
		  }

		  this.setState({"associationsSounds": associations})
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
					<p>It is a matching game. In the bottom, you have seven cards, each containing a message. To read it, hover over the cards.</p>
					<p>In the top area, you have 7 cards, when you click on them, you will hear a message. </p>
					<p>Move the sound cards to their matching message in the bottom. <b>But beware of the disturbances in the messages.</b></p>
					<p>If a bottom card is red, it means the matching is wrong! And the answers are always green!</p>
					<p>To reset a card already matched up, double click it.</p>
					<p>Click anywhere outside this box to close it.</p>
					</div>
				</div>
				)}
			</div>

			
			<IonGrid>
				{this.state.correctCriticalMatches.size === this.state.criticalDrops.length &&
				<div>
				<Confetti width={this.state.width} height={this.state.height} />
				<p className="scoreFinal">Congratulations, you have associated all the cards and sounds. The green hearts hint to the secret number!</p>
				</div>
				}
				{this.state.count_drops > this.state.nbCounts &&
 				this.state.correctCriticalMatches.size < this.state.criticalDrops.length &&
				<div>
				<p className="scoreFinal">Too bad, the game is over, have you guessed the code? If not, go back and try again!</p>
				</div>
				}
				<ReactTooltip />

				<IonRow>
					<IonCol size="12" style={{ textAlign: "center" }}>
						<div className="click-display">
							Moves used: {this.state.count_drops} / 10
						</div>
					</IonCol>
				</IonRow>


				{this.state.count_drops <= this.state.nbCounts &&
 				this.state.correctCriticalMatches.size < this.state.criticalDrops.length &&
				<IonRow>

					<div className="grid" style={{textAlign: "center", width: (this.state.tiles.length + 1) * 155}}>
						{this.state.tiles.map(this.populateRow(0), this)}
					</div>
				</IonRow>
				}
				{this.state.count_drops<=this.state.nbCounts &&
				<IonRow>
					<div className="grid" style={{ width: (this.state.tiles.length+1) * 155}}>
							{this.state.scrambledSounds.map(this.populateRow(1),this)}
					</div>
			  	</IonRow>
				}
			</IonGrid>
			</>
		);
	};
}

export default SoundGame;
