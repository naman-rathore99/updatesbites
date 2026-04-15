"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapPickerProps {
  position: { lat: number; lng: number } | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ position, onLocationSelect }: MapPickerProps) {
  const map = useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, 18); // Zoom in deep to house level on click
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, 17, { animate: true }); // Zoom in close for searches
    }
  }, [position, map]);

  return position === null ? null : <Marker position={position} />;
}

export default function MapPicker({
  position,
  onLocationSelect,
}: MapPickerProps) {
  const defaultPosition: [number, number] = [22.7196, 75.8577]; // Default to Indore Center

  return (
    <div className="w-full h-64 rounded-3xl overflow-hidden border-2 border-neutral-100 relative group">
      <MapContainer
        center={position || defaultPosition}
        zoom={13}
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker
          position={position}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>

      {!position && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-[400] flex items-center justify-center p-6 text-center pointer-events-none">
          <p className="text-white text-xs font-bold uppercase tracking-widest leading-relaxed">
            Please search or tap the map <br /> to set your exact house location
          </p>
        </div>
      )}
    </div>
  );
}
