import { Redirect, Route, HashRouter as Router } from 'react-router-dom';
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
import {
  mapOutline,
  trophyOutline,
  settingsOutline,
  peopleOutline,
  flagOutline
} from 'ionicons/icons';
import TabMap from './pages/TabMap';
import TabMissions from './pages/TabMissions';
import Tab4 from './pages/Tab4';
import TabStory from './pages/TabStory';
import LanguagePage from "./pages/LanguagePage";
import { initStore } from './store';
import { Provider } from 'react-redux';
import React from 'react';

import { setNovel } from './store/actions/novelActions';
import { setScene } from './store/actions/sceneActions';
import novelData from './data/novel_en.json';
import { NovelType } from './types/types';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

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

const { store } = initStore();
const novel: NovelType = novelData;

if (novel) {
  for (const sceneId of Object.keys(novel.scenes)) {
    const scene = novel.scenes[sceneId];
    if (scene.visible === undefined) {
      novel.scenes[sceneId].visible = 1;
    }
    novel.scenes[sceneId].userId = 0;
  }

  store.dispatch(setNovel(novel));
  store.dispatch(setScene(novel.scenes.start));
}

const App: React.FC = () => (
  <IonApp>
    <Provider store={store}>
      <Router basename="/ETM">
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>

              <Route exact path="/story">
                <TabStory />
              </Route>

              <Route exact path="/map">
                <TabMap />
              </Route>

              <Route exact path="/missions/:id" component={TabMissions} />

              <Route exact path="/lang">
                <LanguagePage />
              </Route>

              <Route exact path="/tab4">
                <Tab4 />
              </Route>

              <Route exact path="/">
                <Redirect to="/lang" />
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
      </Router>
    </Provider>
  </IonApp>
);

export default App;
