import React, { useState, useEffect, useCallback } from 'react';
import { IonContent, IonInput, IonItem } from '@ionic/react';


import { connect } from 'react-redux';
import { ScenePropsType } from '../../types/types';
import SceneTexts from '../SceneTexts';
import SceneButton from '../SceneButton';
import {Saves, SettingsState} from '../../store/reducers/reducersTypes';
import { addSave } from '../../store/actions/savesActions';
import styles from './styles.module.scss';

import CameraService from "../../utils/Camera";
import jsQR from "jsqr";

import ReactDOM from 'react-dom'
import EmotionGame from "../EmotionGame";
import AgeGame from "../AgeGame";
import TweetGame from "../TweetGame";
import SoundGame from "../SoundGame";
import firebase from "../../utils/Firebase";
require("firebase/firestore");
var db = firebase.firestore();

let wordsInterval: number;
let wordsIntervalIndex: number = 0;

function Scene({ scene, nextScene, saves, settings, addSave }: ScenePropsType) {
  const [words, setWords] = useState(['']);
  const [isButtonsVisible, setButtonsVisible] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [characterImage, setCharacterImage] = useState('');
  const { image, texts, buttons, game, character, content } = scene;
  const [answer, setAnswer] = useState<string>('');

  const ref = React.useRef();
  const [height, setHeight] = React.useState("0px");
  const onLoad = () => {
    setHeight(window.document.body.scrollHeight + "px");
  };


   const tackPictureClick = (type: string)=> async () => {

       const image_url = await CameraService.takePicture();
       var image = require('get-image-data')

       image(image_url, function (err, info) {
        var data = info.data
        var height = info.height
        var width = info.width

         const code = jsQR(data, width, height);

        if (code) {
          console.log("Found QR code", code);
          setAnswer(code.data)
          alert("Votre QR code contient "+code.data)
          nextText(code.data)
        }

      })
   }
  const handleClick = (id: string) => () => {
    if(id !=""){

      if (id.startsWith("http")){
        window.open(id, '_blank');
      }
      else if (id.startsWith("/")){
        window.open(id, '_self');
      }
      else{
      clearScene();
      nextScene(id);
      }
    }
  };

  const lazyWords = useCallback(() => {
    const splitedText = texts[textIndex].text.split(' ');

    if (settings.lazyTexts) {
      wordsInterval = window.setInterval(() => {
        setWords((words) => [...words, splitedText[wordsIntervalIndex]]);
        wordsIntervalIndex++;

        if (wordsIntervalIndex >= splitedText.length) {
          clearInterval(wordsInterval);
          if (textIndex === texts.length - 1) {
            setButtonsVisible(true);

            //addSave({ time: Date.now(), name: scene.id+'#'+textIndex, id: scene.id, isAutoSave: false });

          }
        }
      }, 100);
    } else {
      setWords(splitedText);

      if (textIndex === texts.length - 1) {
        setButtonsVisible(true);
      }
    }
  }, [texts, textIndex, settings.lazyTexts]);

  const clearWords = () => {
    clearInterval(wordsInterval);
    wordsIntervalIndex = 0;
    setWords([]);
  };

  const clearScene = () => {
    setButtonsVisible(false);
    setTextIndex(0);
    clearWords();
  };

  const updateBackground = useCallback(() => {
    const newBackground: string | undefined = texts[textIndex].updatedImage;
    const newCharacter: string | undefined = texts[textIndex].updatedCharacter;

    if (newBackground) {
      setBackgroundImage(newBackground);
    }
    if (newCharacter) {
      setCharacterImage(newCharacter);
    }
  }, [textIndex, texts]);

  const prevText = () => {
    if (textIndex - 1 >= 0) {
      setTextIndex((textIndex) => (textIndex -= 1));
    }
  };

  const nextText = (val="") => {
    if (textIndex + 1 < texts.length - 1) {
      setTextIndex((textIndex) => (textIndex += 1));
    } else if (textIndex + 1 === texts.length - 1) {

      if(! game){
        setTextIndex((textIndex) => (textIndex += 1));
        setButtonsVisible(true);
      }
      else if (game.correctAnswer.indexOf('##')){
        const correctAnswers = game.correctAnswer.split("##")
        for (const correct of correctAnswers) {
          if((game && answer!="" && answer==correct) || (game && val!="" && val==correct)){
            setTextIndex((textIndex) => (textIndex += 1));
            setButtonsVisible(true);
            break;
          }

        }
      }
      else{
        if((game && answer!="" && answer==game.correctAnswer) || (game && val!="" && val==game.correctAnswer)){
          setTextIndex((textIndex) => (textIndex += 1));
          setButtonsVisible(true);
        }
      }


    }
  };

  const isLeftArrowActive = () => {
    return textIndex > 0;
  };

  const isRightArrowActive = () => {
    return textIndex < texts.length - 1;
  };

  const autoSave = useCallback(() => {
    addSave({ time: Date.now(), name: 'AutoSave', id: scene.id, isAutoSave: true });
  }, [scene.id, addSave]);

  useEffect(() => {
    setTextIndex(0);
  }, [scene.id]);

  useEffect(() => {
    if (texts[textIndex]) {
      lazyWords();
      autoSave();
      updateBackground();
    }

    return () => {
      clearWords();
      setBackgroundImage('');
    };
  }, [lazyWords, autoSave, updateBackground, texts, textIndex]);

  return (

    <div className={styles.background} style={{ backgroundImage: `url(${backgroundImage || image})` }}>


      {
        (characterImage || character) && content =="youtube" &&
        <iframe style={{ maxHeight: "90vh", height: "90vh", width: "100vw"}} width="1200" height="600" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen
        src={`https://www.youtube.com/embed/${characterImage || character}?autoplay=1`}>
        </iframe>
      }
      {
        (characterImage || character) && content =="iframe" &&
        <iframe style={{ backgroundColor: "white"}} ref={ref} onLoad={onLoad}   width="100%" height={height} scrolling="no" frameBorder="0"
        src={`${characterImage || character}`}>
        </iframe>
      }
      {
        (characterImage || character) && content =="img" &&
            <img src={characterImage || character}  className={styles.character} />
      }



      <div className={styles.content}>
        <div className={styles.buttons}>
          {isButtonsVisible && (textIndex == texts.length - 1) &&
            buttons.map((button) => (
              <SceneButton
                key={`${button.text}${button.redirectId}`}
                handleClick={handleClick(button.redirectId)}
                text={button.text}
              />
            ))}
          {
            game && (textIndex == texts.length - 2) &&
            <div>
            {game.type =="input" && <IonItem>
                    <IonInput placeholder="Votre réponse" onIonChange={e => setAnswer(e.detail.value!)}></IonInput>
                  </IonItem>
            }

            {game.type =="qrcode" &&
                    <SceneButton
                      key={`qrcode_${textIndex}`}
                      handleClick={tackPictureClick("qrcode")}
                      text={"Prendre une photo du QR Code"}
                    />
            }


            {game.type =="activity" &&
                <div>
                   {(game.correctAnswer=="emotion") &&  <EmotionGame cols={7} rows={5} speed={100} db={db}></EmotionGame>}
                    {(game.correctAnswer=="age") &&  <AgeGame cols={7} rows={5} speed={100} db={db}></AgeGame>}
                    {(game.correctAnswer=="tweet") &&  <TweetGame cols={7} db={db}></TweetGame>}
                    {(game.correctAnswer=="sound") &&  <SoundGame cols={7} db={db}></SoundGame>}
                </div>
            }

            </div>


          }
        </div>
        {texts[textIndex]?.nickname && <div className={styles.nickname}>{texts[textIndex].nickname}</div>}
        {texts.length > 0 && (
          <SceneTexts
            isLeftArrowActive={isLeftArrowActive}
            isRightArrowActive={isRightArrowActive}
            words={words}
            prevText={prevText}
            nextText={nextText}
          />
        )}
      </div>
    </div>
  );
}

const mapStateToProps = (state: { saves: Saves;settings: SettingsState }) => {
  return {
    saves: state.saves,
    settings: state.settings,
  };
};

const mapDispatchToProps = {
  addSave,
};

export default connect(mapStateToProps, mapDispatchToProps)(Scene);
