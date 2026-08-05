import { Suspense } from "react";
import Navbar from "@/components/layout/navbar";
import Hero from "@/app/dashboard/hero";
import Categories from "@/app/dashboard/categories";
import Galeri from "@/app/dashboard/galery";
import Testimoni from "@/app/dashboard/testimoni";
import Footer from "@/components/layout/footer";
import GoogleLoginHandler from "@/components/auth/GoogleLoginHandler";

export default function Home() {
  return (
    <div>
      <Suspense fallback={null}>
        <GoogleLoginHandler />
      </Suspense>
      <Navbar />
      <Hero />
      <Categories />
      <Galeri />
      <Testimoni />
      <Footer />
    </div>
  );
}
