import React, {Component} from "react";
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import './style.scss';

import {GridProps, BoxProps, TweetGamePropsType} from "../../types/types";
import Confetti from "react-confetti";



class SoundGame extends Component<TweetGamePropsType> {
	state: any;

	constructor(props: any) {
		super(props);


		this.state = {
			score : 0,
			startDate:Date.now(),
			height : window.innerHeight,
			width : window.innerWidth,
			tiles:Array.from(Array(this.props.cols).keys()),
			selectedColumn:0
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

	selectBox = (lane:number, index:number) => {
		alert(lane*10+index)
	}

	populate_row = (row) => {

		return (label, index) =>{
		return <div style={{ textAlign: "center"}} className={"box"} key={ index } onClick={() => this.selectBox(row,index)}>
									<span style={{ display: "inline-block", marginTop:60}}>{label}</span>
		</div>
		}
	}

	populate = () =>{

	}

	componentDidMount(){
		this.populate();

	}

	render() {
		return (
			<IonGrid>
				{false && <Confetti width={this.state.width} height={this.state.height} />}
			  <IonRow>
				<IonCol>

					<div className="grid" style={{ width: this.state.tiles.length * 122}}>
							{this.state.tiles.map(this.populate_row(0),this)}
					</div>
					<div className="grid" style={{ width: this.state.tiles.length * 122}}>
							{this.state.tiles.map(this.populate_row(1),this)}
					</div>
				</IonCol>
				<IonCol style={{textAlign: "center"}}>
					<h3>Tweets</h3>

					{this.state.selectedFace &&
						<div>


							{this.state.selectedColumn<this.state.trueAges.length &&
							<p>Scan again to confirm that this person is {this.state.trueAges[this.state.selectedColumn]} years old ;)</p>
							}

							{this.state.selectedColumn==this.state.trueAges.length &&
							<p>Congratulations! You completed the game</p>
							}

						</div>

					}
				</IonCol>
			  </IonRow>
			</IonGrid>


		);
	};
}

export default SoundGame;
