import Link from "next/link";
import { Rss, Send } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full pt-16 pb-12 mt-auto border-t border-brand-primary/10 bg-brand-neutral">
      <div className="container mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-sm text-brand-secondary font-medium">
        {/* Left Col */}
        <div className="flex flex-col col-span-1 md:col-span-1">
          <Link href="/" className="font-display font-bold text-2xl tracking-tight text-neutral-900 mb-4 group">
            Bites<span className="italic font-normal group-hover:text-brand-primary transition-colors">of</span>Bliss
          </Link>
          <p className="leading-relaxed opacity-80 text-xs pr-4">
            Curating culinary excellence one sensory bite at a time. The table is set for you.
          </p>
        </div>

        {/* Links Col 1 */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-brand-primary uppercase tracking-widest text-[10px] mb-2">Our Philosophy</h4>
          <Link href="/" className="hover:text-brand-primary transition-colors opacity-80">Provenance</Link>
          <Link href="/" className="hover:text-brand-primary transition-colors opacity-80">Sustainability</Link>
        </div>

        {/* Links Col 2 */}
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-brand-primary uppercase tracking-widest text-[10px] mb-2">Details</h4>
          <Link href="/" className="hover:text-brand-primary transition-colors opacity-80">Allergens</Link>
          <Link href="/" className="hover:text-brand-primary transition-colors opacity-80">Privacy</Link>
        </div>

        {/* Right Col */}
        <div className="flex flex-col md:items-end justify-between text-left md:text-right">
           <div className="flex flex-col gap-3 mb-6 md:mb-0 md:items-end">
            <h4 className="font-bold text-brand-primary uppercase tracking-widest text-[10px] mb-2">Follow Our Journey</h4>
            <div className="flex items-center gap-4 text-brand-primary">
              <Link href="/" className="hover:opacity-75 transition-opacity"><Rss className="w-5 h-5" strokeWidth={1.5} /></Link>
              <Link href="/" className="hover:opacity-75 transition-opacity"><Send className="w-5 h-5" strokeWidth={1.5} /></Link>
            </div>
          </div>
          <span className="text-[10px] opacity-60 uppercase tracking-wider">© 2024 BitesofBliss. The Sensory Curator.</span>
        </div>
      </div>
    </footer>
  );
}
