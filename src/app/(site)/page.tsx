import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Works } from "@/components/sections/Works";
import { Craft } from "@/components/sections/Craft";
import { Contact } from "@/components/sections/Contact";
import { ProductPitch } from "@/components/sections/ProductPitch";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Works />
      <Craft />
      <Contact />
      <ProductPitch />
    </>
  );
}
