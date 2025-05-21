import React, {Component, useState} from "react";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import './style.scss';

import {GridProps, BoxProps, TweetGamePropsType} from "../../types/types";
import Confetti from "react-confetti";
import { DragDropContainer, DropTarget } from 'react-drag-drop-container';
import ReactTooltip from 'react-tooltip';

const base_folder = "https://github.com/yamizi/LLCEscapeGame/blob/game_sound/client/src/assets/audio/"

class SoundGame extends Component<TweetGamePropsType> {
	state: any;

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
			nbCounts:50,
			success:0,
		}

		console.log(this.state.associationsSounds)

	}

	play = (index) => {
		console.log(index+"--"+ this.state.audios[index].src)
		this.state.audios[index].play()
	  }

	componentDidMount(){

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
		let success = 1
		const keys = Object.keys(associations)
		for (let i=0;i<keys.length;i++){
			if(associations["drop_"+i]!= "sound_"+i || associations["drop_"+i]==""){
				success = 0
			}
		}

		this.setState({"associationsSounds":associations, "count_drops":this.state.count_drops+1, "success":success})

      	e.containerElem.style.visibility = 'hidden';
		if (e.target.id.split("_")[1]==e.dragElem.firstChild.id.split("_")[1]){
			if (e.target.id.split("_")[1]==0 || e.target.id.split("_")[1]==3 || e.target.id.split("_")[1]==5){
				e.target.classList.add("correct")
			}

			e.target.classList.remove("incorrect")
		}
		else{
			e.target.classList.remove("correct")
			e.target.classList.add("incorrect")
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
			<IonGrid>
				{this.state.success==1 &&
				<div>
				<Confetti width={this.state.width} height={this.state.height} />
				<p className="scoreFinal">Congratulations, you have associated all the cards and sounds. The green hearts hint to the secret number!</p>
				</div>
				}
				{this.state.count_drops>this.state.nbCounts && this.state.success==0 &&
				<div>
				<Confetti width={this.state.width} height={this.state.height} />
				<p className="scoreFinal">Too bad, the game is over, have you guessed the code? If not, go back and try again!</p>
				</div>
				}
				<ReactTooltip />
				{this.state.count_drops <= this.state.nbCounts && this.state.success==0 &&
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

		);
	};
}

export default SoundGame;
