import GoogleMapReact from 'google-map-react';
import { MarkerType,MarkerDataType } from '../types/types';

import markersData from '../data/markers.json';


const MarkersServices = {

    getMarkerByLocation:(markers:MarkerDataType, lat:number,lng:number) =>{
        let m:MarkerType;
        for (let ms in markers.markers) {
            m = markers.markers[ms];
            if (m.lat == lat && m.lng == lng) {
                return m
            }
        }
    },
    getMarkerIcon : (icon:string) =>{
        const iconBase ="https://developers.google.com/maps/documentation/javascript/examples/full/images/";
        const icons: Record<string, { icon: string }> = {
            parking: {
              icon: iconBase + "parking_lot_maps.png",
            },
            library: {
              icon: iconBase + "library_maps.png",
            },
            info: {
              icon: iconBase + "info-i_maps.png",
            },
          };

        return icons[icon].icon;
    },


    initMarkers : (map:any, clicFunction:Function):MarkerDataType => {


        const iconBase ="https://developers.google.com/maps/documentation/javascript/examples/full/images/";
        const icons: Record<string, { icon: string }> = {
            optional: {
              icon: iconBase + "library_maps.png",
            },
            main: {
              icon: iconBase + "beachflag.png",
            },
          };

        let markers:MarkerDataType = markersData;
        let marker:google.maps.Marker;
        let lat:number, lng:number;
        let m:MarkerType;

        for (let ms in markers.markers) {
            m = markers.markers[ms];
            lat = m.lat;
            lng = m.lng;

            marker = new google.maps.Marker({
              position: new google.maps.LatLng(lat, lng),
              icon: icons[m.type].icon,
              map: map,
              label:{text: m.label.substring(0,4)+"\r\n", color: "black", fontSize: '14px', fontWeight:"bold",
                  className:"markerLabels"},


            });
            marker.addListener("click", clicFunction)
            m.gmarker = marker;

        }

        return markers;
    },

    showMarkers : (markers:MarkerDataType, time:string, scenes?:string[]) => {
        console.log("show markers "+time)
        console.log(markers)
        let m:MarkerType;
        for (m of markers.markers){
            if (m.time == time){
                 m.gmarker.setVisible(true)
            }
            else{
                m.gmarker.setVisible(false)
            }
        }
    }

}

export default MarkersServices;
