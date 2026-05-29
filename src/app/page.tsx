import Navbar from "@/components/layout/navbar";
import Hero from "@/app/dashboard/hero";
import Categories from "@/app/dashboard/categories";
import Galeri from "@/app/dashboard/galery";
import Testimoni from "@/app/dashboard/testimoni";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Categories />
      <Galeri />
      <Testimoni />
      <Footer />
    </div>
  );
}
