import {  IonList, IonItem, IonLabel, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useState, useEffect } from 'react';

import './TabMissions.css';
import MissionComponent from "../components/MissionComponent";
import EmotionGame from "../components/EmotionGame";

import firebase from "../utils/Firebase";
import {RouteComponentProps} from "react-router";
import TweetGame from "../components/TweetGame";
import AgeGame from "../components/AgeGame";
import SoundGame from "../components/SoundGame";
require("firebase/firestore");
var db = firebase.firestore();

interface MissionDetailPageProps extends RouteComponentProps<{
  id: string;
}> {}

const TabMissions:  React.FC<MissionDetailPageProps> = ({match}) => {
  return (
    <IonPage>

        <IonContent fullscreen>
            {(!match.params.id || match.params.id=="emotion") &&  <EmotionGame cols={7} rows={5} speed={100} db={db}></EmotionGame>}
            {(match.params.id=="age") &&  <AgeGame cols={7} rows={5} speed={100} db={db}></AgeGame>}
            {(match.params.id=="tweet") &&  <TweetGame cols={7} db={db}></TweetGame>}
            {(match.params.id=="sound") &&  <SoundGame cols={7} db={db}></SoundGame>}
        </IonContent>

    </IonPage>
  );
};

export default TabMissions;
