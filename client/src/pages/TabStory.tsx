import React  from 'react';
import {IonSlides, IonSlide, IonContent, IonGrid, IonRow, IonToolbar, IonTitle, IonHeader, IonPage} from '@ionic/react';
import './TabStory.css';

import Novel from '../pages/Novel';

const TabStory: React.FC = () => {
  return (
  <IonPage>
    <IonContent>

          <Novel/>

    </IonContent>
  </IonPage>

  );
};

export default TabStory;
