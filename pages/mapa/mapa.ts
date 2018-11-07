import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
//import { ConnectivityService } from '../../providers/connectivity-service';
import { Network } from '@ionic-native/network';
import { Geolocation } from '@ionic-native/geolocation';


declare var google;

@Component({
  selector: 'page-mapa',
  templateUrl: 'mapa.html',
  providers: [Network, Geolocation]
})
export class MapaPage {

  @ViewChild('map') mapElement: ElementRef;

  map: any;
  mapInitialised: boolean = false;
  apiKey: any;
  destino: any;
  loader: any;

  constructor(public navCtrl: NavController,
    public network: Network,
    public geolocation: Geolocation,
    public loadingCtrl: LoadingController
    /*, public connectivityService: ConnectivityService*/) {

    this.apiKey = 'AIzaSyDkUhGVlbcifuP3R_daVeloh0LUJ00QlJk';

  }

  ngAfterViewInit() {
    //this.loadMap();
    this.loadGoogleMaps();
  }

  /*ionViewDidLoad() {
    console.log('ionViewDidLoad MapaPage');
  }*/

  loadGoogleMaps(){
  
    if(typeof google == "undefined" || typeof google.maps == "undefined"){

      this.loader = this.loadingCtrl.create({
        content: 'Aguarde...'
      });

      this.loader.present();
  
      console.log("Google maps JavaScript needs to be loaded.");
  
        //Load the SDK
        window['mapInit'] = () => {
          this.initMap();
        }
  
        let script = document.createElement("script");
        script.id = "googleMaps";
  
        if(this.apiKey){
          script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
        } else {
          script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';       
        }
  
        document.body.appendChild(script);  
  
      } 
        
  }
 
  initMap(){
 
    this.mapInitialised = true;

    this.destino = new google.maps.LatLng(-3.058380, -60.004133);

    this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 12,
            center: this.destino,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

    let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
    });

    let content = "<h4>ESPI - Escola de Serviço Público e Inclusão Socioeducacional</h4>";

    this.addInfoWindow(marker, content); 

    let loader = this.loader;
 
    this.geolocation.getCurrentPosition().then((position) => {
 
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      let marker2 = new google.maps.Marker({
                    map: this.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng
                });

      let content2 = "<h4>Onde estou</h4>";          
 
      this.addInfoWindow(marker2, content2);

      var directionsDisplay = new google.maps.DirectionsRenderer({
          map: this.map
      });
      
      directionsDisplay.setPanel(document.getElementById("directionsPanel"));
 
      var request = {
          destination: this.destino,
          origin: latLng,
          travelMode: google.maps.TravelMode.TRANSIT 
      };
      
      var directionsService = new google.maps.DirectionsService();
      
      directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
          // Display the route on the map.
            directionsDisplay.setDirections(response);
          }

          loader.dismiss();
      });
 
    })
    .catch( error => {
      loader.dismiss();
    });

    
 
  }

  addInfoWindow(marker, content){
 
      let infoWindow = new google.maps.InfoWindow({
          content: content
      });
      
      google.maps.event.addListener(marker, 'click', function(){
          infoWindow.open(this.map, marker);
      });
  
  } 

 
  

}
