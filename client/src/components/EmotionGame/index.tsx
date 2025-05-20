import React, { Component} from "react";
import './style.scss';

import {loadModels} from "../../utils/faceApi";
import {createFaLibrary} from "../../utils/icons";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Camera from "../../components/Camera/Camera";
import {EmotionGamePropsType} from "../../types/types";
import Confetti from "react-confetti";

createFaLibrary();
loadModels();

class EmotionGame extends Component<EmotionGamePropsType> {
	state: any;

	constructor(props: any) {
		super(props);

		this.state = {
			score : 0,
			trials:2,
			selectedFace:"",
			selectedColumn:0,
			startDate:Date.now(),
			height : window.innerHeight,
			width : window.innerWidth,
			mode: false
		}

	}

	setMode = (val) =>{
		this.setState({"mode":val})
	}

	setGameScore = (val) =>{
		this.setState({"score":val[0], "trials": val[1]})
	}


	render() {
		return (
			<div className="App">
				{this.state.trials==0 &&

				<div>
					<Confetti width={this.state.width} height={this.state.height} />
					<p className="scoreFinal">Game Over. Your score is {this.state.score}</p>
				</div>
				}
				{this.state.trials>0 &&
					<div>
						<header>
						<div className="App__header">
						  <h1>
							<span>Emotion Detector</span>
						  </h1>
							<p className="score">Your score: {this.state.score}</p>

						</div>
					  </header>
					  <Camera photoMode={this.state.mode} scoreFn={this.setGameScore}/>
					</div>
				}

			</div>
		);
	};
}

export default EmotionGame;
