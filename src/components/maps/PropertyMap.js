"use client";

import dynamic from "next/dynamic";

const PropertyMapClient = dynamic(() => import("./property-map-client"), {
  ssr: false,
  loading: () => <div className="property-map-loading">Memuat peta...</div>,
});

export default function PropertyMap(props) {
  return <PropertyMapClient {...props} />;
}
