import { Phone, MessageSquare, Star, Navigation, Clock, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function OrderTracking({ params }: { params: { id: string } }) {
  return (
    <main className="flex-1 flex flex-col container mx-auto px-6 lg:px-12 my-12">
      <div className="mb-12">
        <h4 className="text-[10px] font-bold tracking-widest text-brand-primary uppercase mb-2">Order No. #{params.id || '218'}</h4>
        <h1 className="font-display font-extrabold text-5xl md:text-6xl text-neutral-900 tracking-tight leading-none">
          Arriving in <span className="text-brand-primary italic">15 mins</span>
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        {/* Left: Tracking & Driver */}
        <div className="flex-1 flex flex-col gap-10">
          
          {/* Progress Timeline */}
          <div className="bg-white rounded-3xl p-8 shadow-soft border border-brand-primary/5">
            <div className="relative flex items-center justify-between w-full">
              {/* Timeline Line */}
              <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-100 -translate-y-1/2 z-0"></div>
              <div className="absolute top-1/2 left-0 w-[50%] h-1 bg-brand-primary -translate-y-1/2 z-0"></div>

              {/* Step 1: Prep */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-md ring-4 ring-white">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-900">Prepping</span>
                  <span className="block text-[10px] text-neutral-400">12:45 PM</span>
                </div>
              </div>

              {/* Step 2: Transit */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-md ring-4 ring-white">
                  <Navigation className="w-4 h-4" />
                </div>
                <div className="text-center relative left-2">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-brand-primary">In Transit</span>
                  <span className="block text-[10px] text-neutral-500">1:12 PM</span>
                </div>
              </div>

              {/* Step 3: Arrived */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center shadow-inner ring-4 ring-white">
                  <Clock className="w-4 h-4 text-neutral-400" />
                </div>
                <div className="text-center">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400">Arrived</span>
                  <span className="block text-[10px] text-neutral-400">--:--</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Map & Driver Card */}
          <div className="relative w-full h-[400px] rounded-[32px] overflow-hidden shadow-soft bg-[#E5E9E2]">
            {/* Minimalist Grid Pattern for map representation */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#37474F 1px, transparent 1px), linear-gradient(90deg, #37474F 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            {/* Animated Pin */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="bg-brand-secondary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg mb-2 relative left-8">
                Marco is nearby
              </div>
              <div className="relative flex items-center justify-center">
                <div className="absolute w-16 h-16 bg-brand-primary/20 rounded-full animate-ping"></div>
                <div className="w-5 h-5 bg-black rounded-full shadow-md z-10 flex items-center justify-center border-2 border-white"></div>
              </div>
            </div>

            {/* Home Pin */}
            <div className="absolute top-1/4 right-1/4 flex flex-col items-center opacity-60">
               <div className="w-4 h-4 bg-brand-secondary rounded-full shadow-md z-10 border-2 border-white"></div>
            </div>

            {/* Connecting Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 stroke-brand-secondary" strokeWidth="3" strokeDasharray="6 6">
              <path d="M 50% 50% L 75% 25%" />
            </svg>

            {/* Driver Profile Floating Card */}
            <div className="absolute bottom-6 left-6 right-6 lg:left-8 lg:right-8 bg-white/95 backdrop-blur-md p-4 lg:p-6 rounded-[24px] shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-neutral-200 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                  <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop" alt="Driver" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1">Your Driver</span>
                  <span className="font-bold text-lg text-neutral-900 leading-none">Marco V.</span>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-brand-primary text-brand-primary" />
                    <span className="text-xs font-bold text-neutral-700">4.9 <span className="text-neutral-400 font-normal">Rating</span></span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors">
                  <MessageSquare className="w-5 h-5 text-neutral-700" />
                </button>
                <button className="w-12 h-12 rounded-full bg-brand-secondary text-white flex items-center justify-center shadow-md hover:bg-black transition-colors">
                  <Phone className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right: Receipt & Rating */}
        <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-8">
          
          {/* Order Summary Form */}
          <div className="bg-white rounded-[32px] p-8 shadow-soft border border-brand-primary/5">
            <h3 className="font-display font-bold text-2xl text-neutral-900 mb-6 border-b border-neutral-100 pb-4">Your Blissful Box</h3>
            
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop" alt="Wild Tuna Bowl" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900">Wild Tuna Bowl</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Qty 1</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-brand-secondary">$24.00</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
                    <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100&h=100&fit=crop" alt="Harvest Grain" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-neutral-900">Harvest Grain</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Qty 1</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-brand-secondary">$19.00</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-neutral-100">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Total Paid</span>
              <span className="font-sans font-bold text-2xl text-brand-primary">$47.65</span>
            </div>
            
            <a href="/checkout" className="block text-center mt-6 text-[10px] font-bold text-brand-secondary uppercase tracking-widest border border-brand-secondary/20 rounded-full py-3 hover:bg-neutral-50 transition-colors">
              View Receipt
            </a>
          </div>

          {/* Rate Meal Card */}
          <div className="bg-[#EFE9DB] rounded-[32px] p-8 shadow-sm flex flex-col items-center text-center">
             <h3 className="font-display font-bold text-2xl text-neutral-900 mb-2">Rate Your Meal</h3>
             <p className="text-xs text-neutral-500 font-medium mb-6">Tell us about your experience once the food has been delivered.</p>
             
             <div className="flex items-center gap-2 mb-8">
               {[1,2,3,4,5].map(i => (
                 <Star key={i} className="w-8 h-8 text-[#C7913A]/30 fill-[#C7913A]/10 hover:fill-[#C7913A] cursor-pointer transition-colors" />
               ))}
             </div>

             <button className="w-full py-4 bg-white/50 text-[#C7913A] text-[10px] font-bold tracking-widest uppercase rounded-full border border-[#C7913A]/20 hover:bg-white transition-colors">
              Submit Rating
            </button>
          </div>

          <button className="w-full py-4 text-[10px] font-bold tracking-widest text-brand-secondary uppercase hover:text-brand-primary transition-colors">
            Need Help With Order?
          </button>

        </div>
      </div>
    </main>
  );
}
