import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { mapOutline, appsOutline, trophyOutline, settingsOutline, peopleOutline, flagOutline } from 'ionicons/icons';
import TabMap from './pages/TabMap';
import TabMissions from './pages/TabMissions';
import Tab4 from './pages/Tab4';
import TabHome from './pages/TabHome';
import TabStory from './pages/TabStory';
import MissionDetails from './pages/MissionDetails';
import { initStore } from './store';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';
import LanguagePage from "./pages/LanguagePage";

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import {Provider} from "react-redux";
import React from "react";
import { setNovel } from './store/actions/novelActions';
import { setScene } from './store/actions/sceneActions';
import novelData from './data/novel_en.json';

import { NovelType } from './types/types';


const { store } = initStore();
var novel: NovelType = novelData;



if (novel) {
  for (var sceneId of Object.keys(novel.scenes)){
    let scene = novel.scenes[sceneId]
    if (scene.visible == undefined){
      novel.scenes[sceneId].visible = 1
    }
    novel.scenes[sceneId].userId = 0
  }

  store.dispatch(setNovel(novel));
  store.dispatch(setScene(novel.scenes.start))
}

const App: React.FC = () => (
  <IonApp>
    <Provider store={store}>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>

          <Route exact path="/story" >
            <TabStory></TabStory>
          </Route>

          <Route exact path="/LLCEscapeGame/story" >
            <TabStory></TabStory>
          </Route>

          <Route exact path="/LLCEscapeGame/map">
            <TabMap />
          </Route>

          <Route exact path="/map">
            <TabMap />
          </Route>

          <Route exact path="/missions/:id" component={TabMissions}>
          </Route>

          <Route exact path="/LLCEscapeGame/missions/:id" component={TabMissions}>
          </Route>

          <Route path="/lang">
            <LanguagePage />
          </Route>

          <Route path="/tab4">
            <Tab4 />
          </Route>
          <Route exact path="/">
            <Redirect to="/lang" />
          </Route>

          <Route exact path="/LLCEscapeGame">
            <Redirect to="/story" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="tabstory" href="/story">
            <IonIcon icon={peopleOutline} />
            <IonLabel>Story</IonLabel>
          </IonTabButton>

          <IonTabButton tab="tab1" href="/map">
            <IonIcon icon={mapOutline} />
            <IonLabel>Map</IonLabel>
          </IonTabButton>

          <IonTabButton tab="tab_lang" href="/lang">
            <IonIcon icon={flagOutline} />
            <IonLabel>Lang</IonLabel>
          </IonTabButton>



        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
    </Provider>
  </IonApp>
);

export default App;
