import React, {Component} from "react";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import './style.scss';

import {GridProps, BoxProps, AgeGamePropsType} from "../../types/types";
import faces from '../../data/faces.json';
import Confetti from "react-confetti";

const MAX_TIME = 120; 

interface AgeGameState {
  score: number;
  gridFull: string[][];
  ranFaces: string[][];
  trueAges: string[];
  selectedFace: string;
  selectedColumn: number;
  startDate: number;
  height: number;
  width: number;
  time: number;
  nbClick: number;
  beginTime: number;
  timer: number;
  intervalId: any;
  showInstruction: boolean;
}


function arrayClone(arr) {
	return JSON.parse(JSON.stringify(arr));
}

class Box extends Component<BoxProps> {
	selectBox = () => {
		this.props.selectBox(this.props.row, this.props.col);
	}

	render() {
		return(
			<div className={this.props.boxClass}
				id={this.props.id}
				onClick={this.selectBox}
				 style={{ backgroundImage: `url(${"../../ETM/assets/imgs/"+this.props.face.replace("#","/") || ""})` }}
			/>
		)
	}
}


class Grid extends Component<GridProps> {
	render() {
		const width = (this.props.cols * 122) + 1;
		var boxArr = [];
		var gridBoxClass = "";


		if (this.props.ranFaces){
			for (var j = 0; j < this.props.rows; j++) {
			for (var i = 0; i < this.props.cols; i++) {
				let gridBoxId = i + "_" + j;
				if (this.props.gridFull[j][i]=="C"){
					gridBoxClass = "box on"
				}
				else if (this.props.gridFull[j][i]=="F"){
					gridBoxClass = "box off"
				}
				else if (this.props.gridFull[j][i]=="N"){
					gridBoxClass = "box no"
				}

				if (i !== this.props.selectedColumn){
					gridBoxClass += " inactive-column";
				}

				boxArr.push(
					<Box
						boxClass={gridBoxClass}
						key={gridBoxId}
						id={gridBoxId}
						row={j}
						col={i}
						face={this.props.ranFaces[i][j]}
						selectBox={this.props.selectBox}
					/>
				)
		    }
		}

		}

		return(
			<div className="grid" style={{ width: width}}>
				{boxArr}
			</div>

		)
	}
}

class AgeGame extends Component<AgeGamePropsType, AgeGameState> {
	state: any;

	constructor(props: any) {
		super(props);



		const minAge = 21;
		const maxAge = 60;
		var ages = Array.from(Array(maxAge-minAge).keys()).map(function(val){return val+minAge;});
		var ranAges = {},
			i = this.props.cols*2,
			j = 0;

		while (i--) {
			j = Math.floor(Math.random() * (ages.length));
			ranAges[ages[j]] = [];
			ages.splice(j,1);
		}

		for(i=0;i<faces.length;i++){

			let face_age = faces[i].split("#")[1].split("-")[0];
			let true_age = faces[i].split("#")[0].split("-")[1];
			if (face_age in ranAges) {
				//if (faces[i]!="age-"+29+"#"+29"+-M.jpg")
				if(face_age !=true_age){
					ranAges[face_age].push(faces[i])
				}

			}
		}

		var ranFaces = []
		var trueAges = []

		for (const [key, values] of Object.entries(ranAges)) {
			var vals:any =values;
			if (vals.length>this.props.cols && Object.keys(ranFaces).length<this.props.cols){

				i = this.props.rows - 1;
				let advFaces = []

				while (i--) {
					j = Math.floor(Math.random() * (vals.length));
					if (vals[j] != undefined) {
						advFaces.push(vals[j]);
						vals.splice(j, 1);
					}
				}
				if (Math.random() > 0.5){
					advFaces.push("age-"+key+"#"+key+"-F.jpg");
				}
				else{
					advFaces.push("age-"+key+"#"+key+"-M.jpg");
				}

				trueAges.push(key);
				ranFaces.push(advFaces.sort(() => Math.random() - 0.5));

			}

		}
		this.state = {
			score : 0,
			gridFull: Array(this.props.rows).fill([]).map(() => Array(this.props.cols).fill(false)),
			ranFaces: ranFaces,
			trueAges: trueAges,
			selectedFace:"",
			selectedColumn:0,
			startDate:Date.now(),
			height : window.innerHeight,
			width : window.innerWidth,
			time:0,
			nbClick:0,
			beginTime:new Date().getTime(),
			timer: MAX_TIME,
			intervalId: null,
			showInstruction: false,
		}

		if (this.props.db){
			const doc = this.props.db.collection('llc')
			console.log(doc)
			const observer = doc.where('game', '==', 'AGE').where('type', '==', 'QR')
			  .onSnapshot(querySnapshot => {
				querySnapshot.docChanges().forEach(change => {

				if (change.type === "added") {
					let params = change.doc.data().params;
					let time = change.doc.data().time*1000;
					console.log(time, this.state.startDate, time > this.state.startDate)
					if (time > this.state.startDate){
						this.selectBox(parseInt(params[0]),parseInt(params[1]))
					}

				}
			  });
			});
		}

		//alert("store grid")

	}

	selectBox = (row, col) => {
		let selectedColumn = this.state.selectedColumn

		if (col!=selectedColumn){
			return
		}

		let gridCopy = arrayClone(this.state.gridFull);
		///if (gridCopy[row][col]) {
		//	gridCopy[row][col] = !gridCopy[row][col];
		//}

		let selectedFace = this.state.ranFaces[this.state.selectedColumn][row]
		console.log(selectedFace,this.state.selectedFace, selectedFace!=this.state.selectedFace)

		if (selectedFace != this.state.selectedFace){
			this.setState({
				//gridFull: gridCopy,
				selectedFace : selectedFace
			})
		}

		else{

			let face = selectedFace.split("-")[1].split("#")
			console.log(face)
			if (face[0]!=face[1]){
				gridCopy[row][col] = "N"
			}
			else{
				for (var i=0;i<gridCopy.length;i++){
					if (i!=row){
						gridCopy[i][col] = "N"
					}
				}
				selectedColumn++
			}

			if(this.state.trueAges.length==selectedColumn){
				let time = Math.floor((new Date().getTime() - this.state.beginTime)/1000)
				this.setState({ time }, () => {
					clearInterval(this.state.intervalId);
				});
			}

			this.setState({gridFull:gridCopy,selectedColumn:selectedColumn, "nbClick":this.state.nbClick+1})
		}


	}

	populate = () => {

		let gridCopy = arrayClone(this.state.gridFull);
		for (let j = 0; j < this.props.cols; j++) {
			for (let i = 0; i < this.props.rows; i++) {
				let face = this.state.ranFaces[j][i].split("-")[1].split("#")
				gridCopy[i][j] = face[0]==face[1]?"C":"F";
			}
		}


		this.setState({
			gridFull: gridCopy,

		})
	}


	componentDidMount(){
		this.populate();
		
		const intervalId = setInterval(() => {
			this.setState(prevState => {
			if (prevState.timer > 0) {
				return { timer: prevState.timer - 1 };
			} else {
				clearInterval(this.state.intervalId);
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
		const column = this.state.selectedColumn;
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
					<p>On top of the grid, you have a target age. Your task is to find the face that matches the age.</p>
					<p>You will start from the column on the left, and you can move to the next column if you find the correct face.</p>
					<p>When you click on a face. It appears bigger on the right. It allows you to check if the face is the correct age. Click again on the small image to confirm your choice.</p>
					<p><b>Be careful, images have been altered to try and trick face recognition!</b></p>
					<p>Click anywhere outside this box to close it.</p>
					</div>
				</div>
				)}
			</div>

			<IonGrid>
				{this.state.selectedColumn==this.state.trueAges.length &&
				<div>
					<p className="scoreFinal">You finished the game in {this.state.time}s and {this.state.nbClick} clicks</p>
					{this.state.time<120 && this.state.nbClick<12 &&
					<p className="scoreFinal">Congratulations! You beat my record. The code is <strong>----- ---.. -....</strong></p>}
					{this.state.time<120 && this.state.nbClick<12 &&
					<Confetti width={this.state.width} height={this.state.height} />}
				</div>

				}

				{this.state.selectedColumn != this.state.trueAges.length &&
				<IonRow>
					<IonCol>
						<div>
							<div className="grid" style={{width: this.state.trueAges.length * 122}}>
								{this.state.trueAges.map(function (age, index) {
									return <div style={{textAlign: "center"}} key={index}
												className={`box ${index == column ? "active" : ""}`}>
										<span style={{display: "inline-block", marginTop: 60}}>{age}</span>
									</div>;
								})}
							</div>

							<Grid rows={this.props.rows} cols={this.props.cols} gridFull={this.state.gridFull}
								  selectBox={this.selectBox} ranFaces={this.state.ranFaces} selectedColumn={this.state.selectedColumn}></Grid>
						</div>
					</IonCol>
					<IonCol style={{textAlign: "center"}}>
						<h3>
						Selected Face
						</h3>

						{this.state.selectedFace &&
						<div>
							<div className="box large"
								 style={{backgroundImage: `url(${"../../ETM/assets/imgs/" + this.state.selectedFace.replace("#", "/") || ""})`}}
							/>

							{this.state.selectedColumn < this.state.trueAges.length &&
							<p>Scan again to confirm that this person
								is {this.state.trueAges[this.state.selectedColumn]} years old ;)</p>
							}
							{this.state.selectedColumn != this.state.trueAges.length &&
							<div className="timer-display">
								Time: 	{String(Math.floor(this.state.timer / 60)).padStart(2, '0')}:
										{String(this.state.timer % 60).padStart(2, '0')}
							</div>
							}

							{this.state.selectedColumn != this.state.trueAges.length &&
								<div className="click-display">
									Moves used: {this.state.nbClick} / 12
								</div>
							}

							{this.state.selectedColumn == this.state.trueAges.length &&
							<p>Congratulations! You completed the game</p>
							}

						</div>

						}
					</IonCol>
				</IonRow>
				}
			</IonGrid>

		</>

		);
	};
}

export default AgeGame;
