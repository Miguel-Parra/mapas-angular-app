import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';


@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .contenedor-mapa {
      width: 100%;
      height: 100%
    }
    @media (min-width: 1000px){
    .row {
      background-color: white;
      border-radius: 5px;
      position: fixed;
      bottom: 50px;
      padding: 10px;
      left: 50px;
      z-index: 900;
      width: 35vw;
    }
  }
  @media (min-width: 600px){
    .row {
      background-color: white;
      border-radius: 5px;
      position: fixed;
      bottom: 50px;
      padding: 10px;
      left: 50px;
      z-index: 900;
      width: 70vw;
    }
    }
    @media (min-width: 0px){
    .row {
      background-color: white;
      border-radius: 5px;
      position: fixed;
      bottom: 50px;
      padding: 10px;
      left: 50px;
      z-index: 900;
      width: 90vw;
    }
    }

    #geocoder {
      background-color: white;
      border-radius: 5px;
      position: fixed;
      top: 50px;
      padding: 10px;
      right: 50px;
      z-index: 9999;
    
}
.mapboxgl-ctrl-geocoder {
min-width: 100%;
}
  
    `
  ]
})

export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef;

  mapa!: mapboxgl.Map;
  zoomLevel: number = 18
  center: [number, number] = [-78.497662, -0.266133]

  constructor() { }

  ngOnDestroy(): void {
    this.mapa.off('zoom', () => { });
    this.mapa.off('zoomend', () => { });
    this.mapa.off('move', () => { });
  }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.center, // starting position [lng, lat]
      zoom: this.zoomLevel, // starting zoom
    });

    const marcador = new mapboxgl.Marker({}).setLngLat(this.center)
    .addTo(this.mapa)

    // const geocoder = new MapboxGeocoder({
    //   accessToken: mapboxgl.accessToken,
    //   types: 'country,region,place,postcode,locality,neighborhood',
    // });

    // this.mapa.addControl(geocoder);
    // geocoder.addTo('#geocoder')


    // Add the control to the map.
    // this.mapa.addControl(
    //   new MapboxGeocoder({
    //     accessToken: mapboxgl.accessToken,
       
    //   })
    // );

      const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
    });

    this.mapa.addControl(geocoder)

    geocoder.on('result', (e) => {
      console.log(e.result.center)
      
      marcador.setLngLat(e.result.center)
      });

    this.mapa.on('zoom', () => {
      this.zoomLevel = this.mapa.getZoom();
    })
    this.mapa.on('zoomend', () => {
      if (this.mapa.getZoom() > 18) {
        this.mapa.zoomTo(18);
      }
    })

    // Movimiento
    this.mapa.on('move', (event) => {
      const target = event.target;
      const { lng, lat } = target.getCenter();
      this.center = [lng, lat]

    }
    )
  }

  zoomIn() {
    this.mapa.zoomIn()
  }

  zoomOut() {
    this.mapa.zoomOut()
  }

  zoomCambio(valorZoom: string) {
    this.mapa.zoomTo(Number(valorZoom))

  }

}
