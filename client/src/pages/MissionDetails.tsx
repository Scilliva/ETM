import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import './Tab3.css';
import {RouteComponentProps} from "react-router";

interface MissionDetailPageProps extends RouteComponentProps<{
  id: string;
}> {}

const MissionDetails: React.FC<MissionDetailPageProps> = ({match}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mission Detail</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        Mission {match.params.id}
      </IonContent>
    </IonPage>
  );
};

export default MissionDetails;
