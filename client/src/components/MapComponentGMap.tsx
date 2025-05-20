import './MapComponent.css';
import GoogleMapReact from 'google-map-react';
import { Component } from 'react';
import {withRouter} from "react-router";
import {IonFab, IonFabButton, IonIcon, IonFabList} from "@ionic/react";
import {hourglassOutline, locateOutline, ellipsisHorizontalOutline} from "ionicons/icons";
import { logoFacebook, logoTwitter, logoYoutube, logoPwa, logoNpm, logoIonic, logoGithub, logoJavascript, logoAngular, logoVimeo, logoChrome, logoReact } from 'ionicons/icons';

import { Capacitor, Plugins, CallbackID } from "@capacitor/core";
import LocationService from '../utils/Location';

import { setScene } from '../store/actions/sceneActions';
import {NovelState, Saves, SceneState} from "../store/reducers/reducersTypes";
import {connect} from "react-redux";
import {MapProps, MarkerDataType, MarkerType} from "../types/types";

import MarkersServices from "../utils/Markers"
import keys from '../data/keys.json';

const { Geolocation, Toast } = Plugins;

const APIKEY = { key: keys.MAP }
const initialLatLng = {lat: 49.61323222584585,"lng":  6.1379620753422}
const defaultZoom = 16
const url = "https://journals.openedition.org/gallia/docannexe/image/1508/img-9.jpg"
const imageBounds = {
    north: 49.1272,
    south: 49.1078,
    east: 6.1888,
    west: 6.1625,
  };


let userMarker:google.maps.Marker;
let markers:google.maps.Marker[] = [];
let myMap:any;
let romeOverlay:google.maps.GroundOverlay;
let currentOverlay:string = "";
let questMarkers:MarkerDataType;




class MapComponentGMap extends Component<MapProps> {


    state: any;
    watchId: CallbackID = '';
    constructor(props: any) {
        super(props);
        this.state = {
            center: {
                lat: initialLatLng.lat,
                lng: initialLatLng.lng,
            },
            loading: false
        };

    }

    mapClick = (map:any) => {
          // use map and maps objects

            markers[0].setPosition({lat:map.lat,lng:map.lng})

        if (this.props.novel){
            //let scenes = Object.keys(this.props.novel.scenes)
            //let scene = scenes[Math.floor(Math.random() * scenes.length)]

        }
    };

    checkPermissions = async () => {
        const hasPermission = await LocationService.checkGPSPermission();

        if (hasPermission) {
            if (Capacitor.isNative) {
                const canUseGPS = await LocationService.askToTurnOnGPS();
                this.postGPSPermission(canUseGPS);
            }
            else {
                this.postGPSPermission(true);
            }
        }
        else {
            const permission = await LocationService.requestGPSPermission();
            if (permission === 'CAN_REQUEST' || permission === 'GOT_PERMISSION') {
                if (Capacitor.isNative) {
                    const canUseGPS = await LocationService.askToTurnOnGPS();
                    this.postGPSPermission(canUseGPS);
                }
                else {
                    this.postGPSPermission(true);
                }
            }
            else {
                await Toast.show({
                    text: 'User denied location permission'
                })
            }
        }
    }

    postGPSPermission = async (canUseGPS: boolean) => {
        if (canUseGPS) {
            this.watchPosition();
        }
        else {
            await Toast.show({
                text: 'Please turn on GPS to get location'
            })
        }
    }

    watchPosition = async () => {
        try {
            this.setState({
                loading: true
            })
            this.watchId = Geolocation.watchPosition({}, (position, err) => {

                if (err) {
                    return;
                }

                userMarker.setPosition({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    })
                console.log("position found")
                this.setState({
                    center: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    },
                    loading: false

                }, () => {
                    this.clearWatch();
                })
                myMap.setCenter(this.state.center)
            })
        }
        catch (err) { console.log('err', err) }
    }

    clearWatch() {
        if (this.watchId != null) {
            Geolocation.clearWatch({ id: this.watchId });
        }
        this.setState({
            loading: false
        })
    }

    initMarkers = (map:any) => {

      markers.push(new google.maps.Marker({
          position: new google.maps.LatLng(49.62369326053645, 6.148730571629905),
          icon: MarkersServices.getMarkerIcon("info"),
          map: map
        }))

      userMarker = new google.maps.Marker({
          position: new google.maps.LatLng(initialLatLng.lat, initialLatLng.lng),
          icon: MarkersServices.getMarkerIcon("parking"),
          map: map
        });

      questMarkers = MarkersServices.initMarkers(map, this.handleMarkerClic);
      MarkersServices.showMarkers(questMarkers,currentOverlay)

    }

    handleMarkerClic = (gmarker:any) => {

        let marker:MarkerType = MarkersServices.getMarkerByLocation(questMarkers,gmarker.latLng.lat(),gmarker.latLng.lng())
        if (this.props.novel){
            this.props.setScene(this.props.novel.scenes[marker.scene])
            this.props.history.push("/story")
        }


    };

    handleApiLoaded = (map:any, maps:any) => {
      // use map and maps objects

       romeOverlay = new google.maps.GroundOverlay(
        url,
        imageBounds,{opacity:0.0}
      );
      myMap = map

      this.initMarkers(map);
      this.flipOverlay("moderne")

    };


    flipOverlay = (val) => {
        if (val==""){
            if (currentOverlay =="rome"){
                romeOverlay.setMap(null);
                //medievalOverlay.setMap(myMap);
                currentOverlay = "medieval"
              }

              else if (currentOverlay =="medieval"){
                //medievalOverlay.setMap(null);
                currentOverlay = "moderne"
              }
              else{
                romeOverlay.setMap(myMap);
                currentOverlay = "rome"
              }
        }
        else{
            currentOverlay = val
            if (val=="rome"){
                romeOverlay.setMap(myMap);
                //medievalOverlay.setMap(null);
            }
            else if (val=="medival"){
                romeOverlay.setMap(null);
                //medievalOverlay.setMap(myMap);
            }
            else{
                romeOverlay.setMap(null);
                //medievalOverlay.setMap(null);
            }
        }


      MarkersServices.showMarkers(questMarkers,currentOverlay)

    }


    createMapOptions =  (maps:any) => {
        return {
          panControl: false,
          mapTypeControl: false,
          scrollwheel: false,
          zoomControl:false,
          fullscreenControl:false
          //styles: [{ stylers: [{ 'saturation': -100 }, { 'gamma': 0.8 }, { 'lightness': 4 }, { 'visibility': 'on' }] }]
        }
      }

  render() {

      return (
      // Important! Always set the container height explicitly
      <div style={{ height: '100%', width: '100%' }}>
          <GoogleMapReact
          bootstrapURLKeys={APIKEY}
          defaultCenter={this.state.center}
          defaultZoom={defaultZoom}
          onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded(map, maps)}
          onClick={this.mapClick}
          yesIWantToUseGoogleMapApiInternals
          options={this.createMapOptions}
        >

        </GoogleMapReact>

          <IonFab vertical="bottom" horizontal="start" slot="fixed" style={{"marginBottom":'50px'}}>

            <IonFabButton onClick={!this.state.loading && this.checkPermissions} >
                {this.state.loading && <IonIcon icon={ellipsisHorizontalOutline} />}
                {!this.state.loading && <IonIcon icon={locateOutline} />}
              </IonFabButton>

        </IonFab>
      </div>
    );
  }
}

const mapStateToProps = (state: { novel: NovelState; scene: SceneState,saves: Saves; }) => {
  return { saves: state.saves, novel: state.novel.current, scene: state.scene.current || state.novel.current?.scenes.start };
};

const mapDispatchToProps = {
  setScene,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(MapComponentGMap));
