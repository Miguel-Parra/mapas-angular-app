import { AfterViewInit, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'

@Component({
  selector: 'app-mini-mapa',
  templateUrl: './mini-mapa.component.html',
  styles: [
    `
    div{
      width: 100%;
      height: 150px;
      margin: 0px;
    }
    `
  ]
})
export class MiniMapaComponent implements AfterViewInit {

  @Input('coordenadas') coordenadas: [number, number] = [0, 0]
  @ViewChild('mapa') divMapa!: ElementRef;

  constructor() { }

  ngAfterViewInit(): void {

    const map = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.coordenadas, // starting position [lng, lat]
      zoom: 14.5, // starting zoom
      interactive: false
    });
    map.on('style.load', () => {
      map.setFog({}); // Set the default atmosphere style
    });

    new mapboxgl.Marker({})
    .setLngLat(this.coordenadas)
    .addTo(map)
    
    
  }

}
