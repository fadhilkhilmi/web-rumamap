import PropertyDetail from "./property-detail";

export default async function PropertyDetailPage({ params }) {
  const { id } = await params;
  return <PropertyDetail propertyId={id} />;
}
