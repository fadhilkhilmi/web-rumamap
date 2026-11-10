import { getDemoUser } from "./users";

export const APPLICATION_TYPES = {
  VISIT: "Kunjungan",
  PURCHASE_INTEREST: "Minat beli",
};

export const APPLICATION_STATUSES = {
  PENDING: "Menunggu",
  CONFIRMED: "Dikonfirmasi",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

export const VERIFICATION_STATUSES = {
  PENDING: "Menunggu verifikasi",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
};

export const AVAILABILITY_STATUSES = {
  AVAILABLE: "Tersedia",
  RESERVED: "Dipesan",
  SOLD: "Terjual",
};

export function applicationForDashboard(application, properties) {
  const property = properties.find((item) => item.id === application.propertyId);
  const buyer = getDemoUser(application.buyerId);
  const seller = getDemoUser(application.sellerId);

  if (!property || !buyer || !seller || property.sellerId !== seller.id) {
    return null;
  }

  return {
    ...application,
    statusCode: application.status,
    property: property.name,
    buyer: buyer.name,
    seller: seller.name,
    agent: seller.name,
    initials: buyer.name
      .split(" ")
      .map((word) => word[0])
      .slice(0, 2)
      .join(""),
    type: APPLICATION_TYPES[application.type] ?? application.type,
    status: APPLICATION_STATUSES[application.status] ?? application.status,
  };
}

export function adminListingForDashboard(property) {
  const owner = getDemoUser(property.sellerId);

  return {
    ...property,
    id: property.id,
    listingId: property.listingCode,
    owner: owner?.name ?? "Penjual tidak ditemukan",
    submitted: property.submitted,
    verificationLabel:
      VERIFICATION_STATUSES[property.verificationStatus] ??
      property.verificationStatus,
    availabilityLabel:
      AVAILABILITY_STATUSES[property.availabilityStatus] ??
      property.availabilityStatus,
  };
}
