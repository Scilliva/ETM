import React from 'react';
import { IonSlides, IonSlide, IonContent, IonGrid, IonRow } from '@ionic/react';
import './TabHome.css';


// Optional parameters to pass to the swiper instance.
// See http://idangero.us/swiper/api/ for valid options.
const slideOpts = {
  initialSlide: 0,
  speed: 400
};

const TabHome: React.FC = () => {
  return (
    <IonContent>
       <IonGrid>
      <IonRow>
         <div style={{"height":"480px", "overflow":"hidden"}}>
        <video autoPlay={true} style={{"height":"512px"}} loop={true}>
          <source src={"assets/stclement.mp4"} type="video/mp4"/>
        </video>
        </div>
      </IonRow>

      <IonRow>
         <IonSlides pager={true} options={slideOpts}>
      <IonSlide>
        <h1>Slide 1</h1>
      </IonSlide>
      <IonSlide>
        <h1>Slide 2</h1>
      </IonSlide>
      <IonSlide>
      </IonSlide>
    </IonSlides>
      </IonRow>
   </IonGrid>

  </IonContent>
  );
};

export default TabHome;
