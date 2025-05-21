import './MapComponent.css';
import React, {Component, useEffect} from 'react';
import {withRouter} from "react-router";
import {IonContent, IonPage} from "@ionic/react";


import { setScene } from '../store/actions/sceneActions';
import {NovelState, Saves, SceneState} from "../store/reducers/reducersTypes";
import {connect} from "react-redux";
import {MapProps} from "../types/types";
import {ReactComponent as LuxembourgMap} from "../assets/images/Cantons_du_Luxembourg.svg";


const east = [0,4,5]
const south = [1,2]
const north = [7,8,9,10,11]
const center = [3,6]

const games = {"south":"age","center":"emotion","north":"tweet","east":"sound"}


class MapComponent extends Component<MapProps> {


    state: any;
    constructor(props: any) {
        super(props);
        this.state = {

        };

    }

    componentDidMount(){
		var districts = document.getElementById("Kantone").getElementsByTagName("path")


        for (const x of east) {
            districts[x].classList.add("east")
            districts[x].classList.add("ai")
        }

        for (const x of north) {
            districts[x].classList.add("north")
            districts[x].classList.add("ai")
        }

        for (const x of south) {
            districts[x].classList.add("south")
            districts[x].classList.add("ai")
        }

        for (const x of center) {
            districts[x].classList.add("center")
            districts[x].classList.add("ai")
        }

	}

    handleClick = (evt) => {
      if (evt.target.nodeName=="DIV"){
          return
      }

      const zone = evt.target.classList[0]
      var districts = document.getElementById("Kantone").getElementsByClassName(zone)

      if (evt.target.classList.length == 1){
          for (const district of districts as any) {
            district.classList.add("ai")
        }
      }
      else{
          for (const district of districts as any) {
            district.classList.remove("ai")
        }
      }

      this.props.setScene(this.props.novel.scenes[zone])
      this.props.history.push("/story")

      //window.location.href="/missions/"+games[zone]

  };

  render() {

      return (

      <IonContent fullscreen>
        <div style={{height: '100vh'}} onClick={this.handleClick}>

            <LuxembourgMap id="svgMap"/>
            <div style={{display: "contents"}}>
                <img style={{marginLeft: "150px"}}  className="start3" src="../../LLCEscapeGame/assets/locations/TRUST_HAPPY.png"  />
            </div>
        </div>

      </IonContent>

    );
  }
}

const mapStateToProps = (state: { novel: NovelState; scene: SceneState,saves: Saves; }) => {
  return { saves: state.saves, novel: state.novel.current, scene: state.scene.current || state.novel.current?.scenes.start };
};

const mapDispatchToProps = {
  setScene,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MapComponent));
