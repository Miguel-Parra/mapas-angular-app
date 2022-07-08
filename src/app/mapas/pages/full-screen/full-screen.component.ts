import { Component, OnInit } from '@angular/core';
import *as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `#mapa {
      width:  100%;
      height: 100%
    }`
  ]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {


    const map = new mapboxgl.Map({
      container: 'mapa', // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-78.497662, -0.266133], // starting position [lng, lat]
      zoom: 17, // starting zoom
    });
    map.on('style.load', () => {
      map.setFog({}); // Set the default atmosphere style
    });
  }

}
