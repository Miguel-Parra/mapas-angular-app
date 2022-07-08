import { ThisReceiver } from '@angular/compiler';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface marcadorColor {
  color: string;
  marcador?: mapboxgl.Marker,
  centro?: [number, number]
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
    .contenedor-mapa {
      width: 100%;
      height: 100%
    }
    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9900;
    }
    li {
      cursor: pointer;
    }
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapa') divMapa!: ElementRef;

  mapa!: mapboxgl.Map;
  zoomLevel: number = 18
  center: [number, number] = [-78.497662, -0.266133]

  // arreglo de maracadores
  marcadores: marcadorColor[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.center, // starting position [lng, lat]
      zoom: this.zoomLevel, // starting zoom
    });
    this.leerLocalStorage();
  }

  ngOnDestroy(): void {
    this.mapa.off('dragend', () => { })
  }

  agregarMarcador() {
    const color = "#xxxxxx".replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const nuevoMarcador = new mapboxgl.Marker({
      draggable: true,
      color: color
    })
      .setLngLat(this.center)
      .addTo(this.mapa)

    this.marcadores.push({ color, marcador: nuevoMarcador });
    this.guardarMarcadoresLocalStorage();
    nuevoMarcador.on('dragend', () => {
      this.guardarMarcadoresLocalStorage();
    })
  }

  irMarcador(marcador: mapboxgl.Marker) {
    const LngLatArr: marcadorColor[] = [];
    const coordenadas = marcador.getLngLat();
    this.mapa.flyTo({ center: coordenadas, zoom: 18 })

  }

  guardarMarcadoresLocalStorage() {
    const LngLatArr: marcadorColor[] = [];
    this.marcadores.forEach((marcador) => {
      const color = marcador.color;
      const { lng, lat } = marcador.marcador!.getLngLat();
      LngLatArr.push({
        color: color, centro: [lng, lat]
      })
    })
    localStorage.setItem('marcadores', JSON.stringify(LngLatArr))
  }

  leerLocalStorage() {
    if (!localStorage.getItem('marcadores')) return;
    const LngLatArr: marcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!)

    LngLatArr.forEach(m => {
      const newMarcador = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      }).setLngLat(m.centro!)
        .addTo(this.mapa)
      this.marcadores.push({ color: m.color, marcador: newMarcador });

      newMarcador.on('dragend', () => {
        this.guardarMarcadoresLocalStorage();
      })
    })
  }

  borrarMarcador(indice: number) {
    this.marcadores[indice].marcador?.remove();
    this.marcadores.splice(indice, 1);
    this.guardarMarcadoresLocalStorage();
   }
}
