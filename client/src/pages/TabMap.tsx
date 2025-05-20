import { IonContent, IonHeader, IonFooter, IonPage} from '@ionic/react';
import React, { Component, MouseEvent, useState, useEffect } from 'react';

import './TabMap.css';
import {ReactComponent as LuxembourgMap} from '../assets/images/Cantons_du_Luxembourg.svg';
import MapComponent from "../components/MapComponent";


const TabMap: React.FC = (myprops) => {

  return (
    <IonPage>
      <MapComponent></MapComponent>
    </IonPage>
  );
};

export default TabMap;
