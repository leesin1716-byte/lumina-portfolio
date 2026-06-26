import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Preloader } from "@/components/ui/Preloader";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Navbar } from "@/components/ui/Navbar";
import { SideNav } from "@/components/ui/SideNav";
import { BackToTop } from "@/components/ui/BackToTop";
import { Footer } from "@/components/sections/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-fg focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-bg"
      >
        본문으로 건너뛰기
      </a>
      <Preloader />
      <ScrollProgress />
      <SmoothScroll>
        <Navbar />
        <SideNav />
        <main id="home">{children}</main>
        <Footer />
        <BackToTop />
      </SmoothScroll>
    </>
  );
}
