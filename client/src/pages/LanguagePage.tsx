import {   IonButton, IonIcon, IonGrid, IonRow, IonCol, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { star } from 'ionicons/icons';
import LanguageComponent from "../components/LanguageComponent";

const LanguagePage: React.FC = (myprops) => {
    return (
    <IonPage>
        <LanguageComponent></LanguageComponent>
    </IonPage>
    )
};

export default LanguagePage;