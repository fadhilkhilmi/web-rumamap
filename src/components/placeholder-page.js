import Link from "next/link";
import Footer from "./footer";
import Navbar from "./navbar";

export default function PlaceholderPage({ eyebrow, title, description }) {
  return (
    <div className="site-shell">
      <Navbar />
      <main className="container placeholder-page">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="section-title">{title}</h1>
        <p className="section-description">{description}</p>
        <p className="placeholder-note">
          Halaman ini merupakan placeholder untuk demonstrasi. Informasi
          properti dapat dijelajahi tanpa akun.
        </p>
        <Link className="button button-primary" href="/properties">
          Jelajahi properti
        </Link>
      </main>
      <Footer />
    </div>
  );
}
