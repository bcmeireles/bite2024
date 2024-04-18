import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import background from '../../background.svg';

// Import custom marker SVGs

import blueMarkerSvg from './self-marker.svg';
import batteryMarkerSvg from './car-battery.svg';
import glassMarkerSvg from './wine-glass-crack.svg';
import oilMarkerSvg from './bottle-droplet.svg';
import fullMarkerSvg from './bin-recycle.svg';
import trashMarkerSvg from './sack.svg';

import './Map.css';

import Navbar from '../../components/navbar/Navbar';

interface MarkerData {
  lat: number;
  long: number;
  type: string;
  description: string;
}

// Tipos: todos, vidrao, pilha, oleo

interface MarkerInfo {
  position: L.LatLngExpression;
  // color: string;
  type: string;
}

const Map: React.FC = () => {
  const [center, setCenter] = useState<L.LatLngExpression>([0, 0]);
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const [loading, setLoading] = useState(true);

  // Replace this with your actual JSON data
  // const data: MarkerData[] = [
  //   { lat: 38.7299565579169, long: -9.11185498291889, type: 'battery', description: 'Bateria 1' },
  //   { lat: 38.7305586355557, long: -9.11185498291889, type: 'battery', description: 'Bateria 2' },    
  // ];

  const [data, setData] = useState<MarkerData[]>([]);

  const getCurrentLocation = (): Promise<L.LatLngExpression> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve([position.coords.latitude, position.coords.longitude]);
          const response = fetch(`http://localhost:5000/markers?lat=${position.coords.latitude}&long=${position.coords.longitude}&radius=750`)
          .then(response => response.json())
          .then(data => {
            console.log("os dados aqui");
            console.log(data);
            setData(data);
          })
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 50000, maximumAge: 0 }
      );
    });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const currentLocation = await getCurrentLocation();
        console.log('Current location:', currentLocation);
        setCenter(currentLocation);

        const newMarkers = data.map((item) => ({
          position: [item.lat, item.long] as L.LatLngExpression,
          type: item.type.toLowerCase(),
        }));

        // Add a blue marker for the user's current location
        newMarkers.push({
          position: currentLocation,
          type: 'self',
        });

        setMarkers(newMarkers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching location:', error);
        setLoading(false);
      }
    }

    fetchData();
  }, [data.length === 0]);

  const iconOptions = {
    iconSize: [25, 41] as L.PointExpression,
    iconAnchor: [12, 41] as L.PointExpression,
    popupAnchor: [1, -34] as L.PointExpression,
  };

  // Create custom icons using the imported SVGs


  const customBlueIcon = new L.Icon({
    iconUrl: blueMarkerSvg,
    iconSize: iconOptions.iconSize,
    iconAnchor: iconOptions.iconAnchor,
    popupAnchor: iconOptions.popupAnchor,
  });

  const batteryIcon = new L.Icon({
    iconUrl: batteryMarkerSvg,
    iconSize: iconOptions.iconSize,
    iconAnchor: iconOptions.iconAnchor,
    popupAnchor: iconOptions.popupAnchor,
  });

  const oilIcon = new L.Icon({
    iconUrl: oilMarkerSvg,
    iconSize: iconOptions.iconSize,
    iconAnchor: iconOptions.iconAnchor,
    popupAnchor: iconOptions.popupAnchor,
  });

  const glassIcon = new L.Icon({
    iconUrl: glassMarkerSvg,
    iconSize: iconOptions.iconSize,
    iconAnchor: iconOptions.iconAnchor,
    popupAnchor: iconOptions.popupAnchor,
  });

  const fullIcon = new L.Icon({
    iconUrl: fullMarkerSvg,
    iconSize: [37, 61],
    iconAnchor: iconOptions.iconAnchor,
    popupAnchor: iconOptions.popupAnchor,
  });

  const trashIcon = new L.Icon({
    iconUrl: trashMarkerSvg,
    iconSize: iconOptions.iconSize,
    iconAnchor: iconOptions.iconAnchor,
    popupAnchor: iconOptions.popupAnchor,
  });

  if (loading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center px-6 relative">
      <img src={background} alt="Waves" className="absolute bottom-0 left-0 w-full h-full" />
      <div className="z-10 relative">
        <Navbar selected={4} />
        <h1>Loading...</h1>
      </div>
      </div>
    )
  }

  console.log('Center:', center);
  console.log('Markers:', markers);

  return (
    <div>
      <Navbar selected={4}/>
      <div id="map" style={{ height: "calc(100vh - 64px)" }}>
      <MapContainer className="map-container" center={center} zoom={17} scrollWheelZoom={true} preferCanvas={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {<>
        
          console.log("markers:" + markers)
          </>}
        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position} icon={marker.type === 'self' ? customBlueIcon : marker.type === "oil" ? oilIcon : marker.type === "battery" ? batteryIcon : marker.type === "glass" ? glassIcon : marker.type === "trash" ? trashIcon : fullIcon }>
            <Popup>{marker.type === "full" ? "General Waste" : marker.type.charAt(0).toUpperCase() + marker.type.slice(1)}</Popup>
          </Marker>
        ))}
      </MapContainer>
      </div>
    </div>
  );
};

export default Map;
