export const demoUsers = [
  {
    id: "USR-1024",
    name: "Arif Setiawan",
    email: "arif.setiawan@demo.test",
    role: "seller",
    joined: "18 Okt 2025",
    status: "Aktif",
  },
  {
    id: "USR-1023",
    name: "Nadia Putri",
    email: "nadia.putri@demo.test",
    role: "buyer",
    joined: "17 Okt 2025",
    status: "Aktif",
  },
  {
    id: "USR-1022",
    name: "PT. Emerald Properti",
    email: "halo@emerald.demo",
    role: "seller",
    joined: "16 Okt 2025",
    status: "Menunggu",
  },
  {
    id: "USR-1018",
    name: "Rizky Mahendra",
    email: "rizky.mahendra@demo.test",
    role: "buyer",
    joined: "13 Okt 2025",
    status: "Aktif",
  },
  {
    id: "USR-1015",
    name: "Maya Lestari",
    email: "maya.lestari@demo.test",
    role: "seller",
    joined: "11 Okt 2025",
    status: "Aktif",
  },
  {
    id: "USR-1012",
    name: "Sarah Anindya",
    email: "sarah.anindya@demo.test",
    role: "buyer",
    joined: "08 Okt 2025",
    status: "Aktif",
  },
  {
    id: "USR-1008",
    name: "Bagas Putra",
    email: "bagas.putra@demo.test",
    role: "seller",
    joined: "02 Okt 2025",
    status: "Aktif",
  },
  {
    id: "USR-1001",
    name: "Dimas Pratama",
    email: "dimas.pratama@demo.test",
    role: "admin",
    joined: "01 Okt 2025",
    status: "Aktif",
  },
];

export function getDemoUser(userId) {
  return demoUsers.find((user) => user.id === userId);
}
