import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";

import { detectFaces, drawResults } from "../../utils/faceApi";

import Button from "../Button/Button";
import Gallery from "../Gallery/Gallery";
import Results from "../Results/Results";
import Webcam from "react-webcam";

import "./Camera.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useCountDown from "react-countdown-hook";
import {emotions} from "../../utils/emojis";

const Camera = ({ photoMode, scoreFn }) => {
  const camera = useRef();
  const cameraCanvas = useRef();

  const [photo, setPhoto] = useState(undefined);
  const [showGallery, setShowGallery] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [results, setResults] = useState([]);
  const [score, setScore] = useState(0);
  const [trials, setTrials] = useState(24);


  const initialTime = 10 * 1000; // initial time in milliseconds, defaults to 60000
  const interval = 1000; // interval to change remaining time amount, defaults to 1000

  const [timeLeft, { start, pause, resume, reset }] = useCountDown(initialTime, interval);

  let myscore = 0;
  let nbRetrials = 12;
  let targetId = 0;

  const [targetFace, setTargetFace] = useState(0);


    React.useEffect(() => {
        restartEvent();
        setInterval(restartEvent, initialTime+1000);
      }, []);


    function restartEvent() {

      console.log("restart", nbRetrials)
      targetId = Math.floor(Math.random()*emotions.length)
      setTargetFace(targetId)

      if (nbRetrials>0){
        start();
        nbRetrials = nbRetrials-1
        setTrials(nbRetrials)
      }


    }

  const getFaces = async () => {
    if (camera.current !== null) {
      const faces = await detectFaces(camera.current.video);
      if (camera.current !== null) {
        await drawResults(
            camera.current.video,
            cameraCanvas.current,
            faces,
            "boxLandmarks"
        );
        setResults(faces);
      }

      if (nbRetrials>0){
        if (faces && faces.length > 0) {

          let userFace = faces[0].expressions.asSortedArray()[0].expression
          console.log("--",userFace, emotions[targetId])

          //myscore = myscore+1
          if (userFace == emotions[targetId]) {

            myscore = myscore+5
            console.log("ok", myscore)
          }

      }
      else{
          //console.log("-- no face", results)
      }

      setScore(myscore)
      }
      scoreFn([myscore, nbRetrials])

    }
  };

  const clearOverlay = canvas => {
    if(canvas.current){
      canvas.current
      .getContext("2d")
      .clearRect(0, 0, canvas.width, canvas.height);
    }

  };

  useEffect(() => {
    if (!photoMode && camera !== null) {
      const ticking = setInterval(async () => {
        await getFaces();
      }, 80);
      return () => {
        clearOverlay(cameraCanvas);
        clearInterval(ticking);
      };
    } else {
      return clearOverlay(cameraCanvas);
    }
  }, [photoMode]);

  const toggleGallery = () => setShowGallery(!showGallery);

  const capture = () => {
    const imgSrc = camera.current.getScreenshot();
    const newPhotos = [...photos, imgSrc];
    setPhotos(newPhotos);
    setPhoto(imgSrc);
    setShowGallery(true);
  };

  const resetPhotos = () => {
    setPhoto(undefined);
    setPhotos([]);
    setShowGallery(false);
  };
  const deleteImage = target => {
    const newPhotos = photos.filter(photo => {
      return photo !== target;
    });
    setPhotos(newPhotos);
  };

  return (
    <div className="camera">
      <div className="camera__wrapper">
        <Webcam audio={false} ref={camera} width="100%" height="auto" />
        <canvas
          className={classnames(
            "webcam-overlay",
            photoMode && "webcam-overlay--hidden"
          )}
          ref={cameraCanvas}
        />
        <div>
              <p>
                <span>You have {Math.floor(timeLeft/1000)} seconds to look{" "}</span>
                <span className="targetFace">
              {emotions[targetFace]}
                </span>
              </p>
              <p>You still have {trials} trials before the end of the game</p>

            </div>
      </div>

      {photoMode ? (
        <>
          <div className="camera__button-container">
            {false && photos.length > 0 && (
              <Button onClick={toggleGallery}>
                {showGallery ? "Hide " : "Show "} Gallery
              </Button>
            )}
            <Button onClick={capture} className="camera__button--snap">
              <FontAwesomeIcon icon="camera" size="md" />
            </Button>
            {photos.length > 0 && <Button onClick={resetPhotos}>Reset</Button>}
          </div>

          {photos.length > 0 && (
            <Gallery
              photos={photos}
              selected={photo}
              show={showGallery}
              deleteImage={deleteImage}
            />
          )}
        </>
      ) : (
        <>
          <div className="results__container">
            <Results results={results}/>
          </div>
        </>
      )}
    </div>
  );
};

export default Camera;
