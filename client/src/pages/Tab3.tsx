import {   IonButton, IonIcon, IonGrid, IonRow, IonCol, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { star } from 'ionicons/icons';
import './Tab3.css';

const Tab3: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Succès</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>
          <IonRow>
            <IonCol >
                <IonButton>
                  <IonIcon slot="icon-only" icon={star} />
                </IonButton>
            </IonCol>
            <IonCol>
                <IonButton fill="outline">
                  <IonIcon slot="icon-only" icon={star} />
                </IonButton>
            </IonCol>
              <IonCol>
                <IonButton>
                  <IonIcon slot="icon-only" icon={star} />
                </IonButton>
            </IonCol>
              <IonCol>
                <IonButton >
                  <IonIcon slot="icon-only" icon={star} />
                </IonButton>
            </IonCol>
              <IonCol>
                <IonButton>
                  <IonIcon slot="start" icon={star} />
                  Left Icon
                </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
