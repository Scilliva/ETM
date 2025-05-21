import './ExploreContainer.css';
import React, {Component, useEffect} from 'react';
import {withRouter} from "react-router";
import {IonButton, IonCol, IonContent, IonGrid, IonPage, IonRow} from "@ionic/react";


import { setScene } from '../store/actions/sceneActions';
import { setNovel } from '../store/actions/novelActions';
import {NovelState, Saves, SceneState} from "../store/reducers/reducersTypes";
import {connect} from "react-redux";
import {LangProps, NovelType} from "../types/types";

import novelDataFr from '../data/novel_fr.json';
import novelDataEn from '../data/novel_en.json';
import novelData from "../data/novel_en.json";

class LanguageComponent extends Component<LangProps> {


    state: any;
    constructor(props: any) {
        super(props);
        this.state = {

        };

    }

    componentDidMount(){
        //alert("ready")
	}

    handleClick = (lang) => {
    console.log(lang)
    //this.props.setScene(this.props.novel.scenes[zone])
    if (lang=="fr") {
        var novel: NovelType = novelDataFr;

    }
    else{
        var novel: NovelType = novelDataEn;

    }
    for (var sceneId of Object.keys(novel.scenes)){
        let scene = novel.scenes[sceneId]
        if (scene.visible == undefined){
          novel.scenes[sceneId].visible = 1
        }
        novel.scenes[sceneId].userId = 0
      }
    this.props.setNovel(novel)
    this.props.setScene(novel.scenes.start)
    this.props.history.push("/story")

    };

  render() {

      return (

      <IonContent fullscreen >
            <IonGrid className="centeredContainer">
                <IonRow>
                    <p>Set the game language to</p>

                    <IonButton fill="outline" onClick={(evt) => {this.handleClick("fr")}}>
                      Français
                    </IonButton>
                    <IonButton fill="outline" onClick={(evt) => {this.handleClick("en")}}>
                      English
                    </IonButton>
                  </IonRow>
            </IonGrid>
        </IonContent>

    );
  }
}

const langStateToProps = (state: { novel: NovelState; scene: SceneState,saves: Saves; }) => {
  return { saves: state.saves, novel: state.novel.current, scene: state.scene.current || state.novel.current?.scenes.start };
};

const langDispatchToProps = {
  setScene, setNovel
};

export default connect(langStateToProps, langDispatchToProps)(withRouter(LanguageComponent));
