"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { divIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { demoProperties } from "../../data/properties";

const STATUS_LABELS = {
  AVAILABLE: "Tersedia",
  RESERVED: "Dipesan",
  SOLD: "Terjual",
};

const formatPrice = (price) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price);

function MapController({ properties, selectedPropertyId }) {
  const map = useMap();

  useEffect(() => {
    const selectedProperty = properties.find(
      (property) => property.id === selectedPropertyId,
    );

    if (selectedProperty) {
      map.flyTo(
        [selectedProperty.latitude, selectedProperty.longitude],
        Math.max(map.getZoom(), 14),
        { duration: 0.6 },
      );
    }
  }, [map, properties, selectedPropertyId]);

  return null;
}

export default function PropertyMap({
  properties,
  selectedPropertyId,
  onSelectProperty,
  className = "",
  zoom = 12,
}) {
  const markerIcons = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(STATUS_LABELS).map((status) => [
          status,
          divIcon({
            className: `property-marker property-marker-${status.toLowerCase()}`,
            html: '<span class="property-marker-dot"></span>',
            iconSize: [28, 36],
            iconAnchor: [14, 34],
            popupAnchor: [0, -32],
          }),
        ]),
      ),
    [],
  );
  const initialProperty = properties[0] ?? demoProperties[0];
  const initialPosition = [initialProperty.latitude, initialProperty.longitude];

  return (
    <div className={`property-map ${className}`}>
      <MapContainer
        center={initialPosition}
        zoom={zoom}
        scrollWheelZoom
        className="property-map-canvas"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController
          properties={properties}
          selectedPropertyId={selectedPropertyId}
        />
        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]}
            icon={markerIcons[property.availabilityStatus]}
            eventHandlers={{
              click: () => onSelectProperty?.(property.id),
            }}
          >
            <Popup>
              <article className="map-popup">
                <Image
                  src={property.image}
                  alt={property.imageAlt}
                  width={280}
                  height={150}
                  className="map-popup-image"
                />
                <div className="map-popup-content">
                  <span
                    className={`map-popup-status map-popup-status-${property.availabilityStatus.toLowerCase()}`}
                  >
                    {STATUS_LABELS[property.availabilityStatus]}
                  </span>
                  <h3>{property.name}</h3>
                  <p>{formatPrice(property.price)}</p>
                  <span className="map-popup-location">
                    {property.location}
                  </span>
                  <Link href={`/properties/${property.id}`}>
                    Lihat Detail
                  </Link>
                </div>
              </article>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
