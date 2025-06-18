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
			mode: false,
			showInstruction : false
		}

	}

	setMode = (val) =>{
		this.setState({"mode":val})
	}

	setGameScore = (val) =>{
		this.setState({"score":val[0], "trials": val[1]})
	}

	toggleMessage = () =>{
		this.setState({showInstruction:!this.state.showInstruction})
	}

	render() {
		return (
			<div className="App">
				{this.state.trials==0 &&

				<div>
					<p className="scoreFinal">Your score is {this.state.score}</p>

					{this.state.score>=1000 &&
					<p className="scoreFinal">Congratulations! You mastered all the Emotions! The secret code is <strong>JOY</strong></p>}

					{this.state.score>=1000 &&
					<Confetti width={this.state.width} height={this.state.height} />}

					{this.state.score<1000 &&
					<p className="scoreFinal">Too bad, Your score is good, but not enough. Try again!</p>}

				</div>
				}
				{this.state.trials>0 &&
					<div>

					  <Camera photoMode={this.state.mode} scoreFn={this.setGameScore}/>
						<header>
						<div className="App__header">
						  <h1>
							<span>Can you beat 1000 points?</span>
						  </h1>
							<p className="score">Your score: {this.state.score}</p>

						</div>
					  </header>
					</div>
				}

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
						<p>Do an emotion with your face, six times. It can be sad, happy, neutral, surprised. I will give points if you do it well.</p>
						<p>Each emotion will last 10 seconds. The longer your emotion matches the target, the more points you get.</p>
						<p>You need to beat 1000 points</p>
						<p><b>Make sure you allowed camera access!</b></p>
						<p>Click anywhere outside this box to close it.</p>
						</div>
					</div>
					)}
				</div>

			</div>
		);
	};
}

export default EmotionGame;
