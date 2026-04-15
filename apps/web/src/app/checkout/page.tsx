"use client";

import {
  Navigation,
  CreditCard,
  Apple,
  BadgeDollarSign,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  MapPin,
  Search,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@bites/store";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const DynamicMapPicker = dynamic(() => import("../../components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-64 rounded-3xl bg-neutral-100 animate-pulse border border-neutral-200 flex items-center justify-center text-neutral-400 font-medium text-sm">
      Initializing map...
    </div>
  ),
});

const GST_RATE = 0.05;
const DELIVERY_FEE = 40;

export default function Checkout() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  // --- State Management ---
  const [addressInput, setAddressInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [houseDetails, setHouseDetails] = useState({
    number: "",
    landmark: "",
  });
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);

  // --- Search Logic ---
  const handleAddressSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!addressInput.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressInput)}&addressdetails=1&limit=1`,
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const result = data[0];
        // Alert if the result is too vague (just a city/state)
        if (
          result.addresstype === "city" ||
          result.addresstype === "state" ||
          result.type === "administrative"
        ) {
          alert(
            "Indore is a big place! Please add your colony, street, or a nearby landmark to find your house.",
          );
        }

        setSelectedLocation({
          lat: parseFloat(result.lat),
          lng: parseFloat(result.lon),
        });
        setIsLocationConfirmed(true);
      } else {
        alert(
          "We couldn't find that location. Please try adding a pincode or colony name.",
        );
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSelectedLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocationConfirmed(true);
        setIsSearching(false);
      },
      () => {
        alert("Permission denied. Please search manually.");
        setIsSearching(false);
      },
    );
  };

  // --- Cart Data ---
  const items = useCartStore((state: any) => state.items || []);
  const removeItem = useCartStore((state: any) => state.removeItem);
  const updateQuantity = useCartStore((state: any) => state.updateQuantity);

  const subtotal = items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );
  const gst = subtotal * GST_RATE;
  const deliveryFee = items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + gst + deliveryFee;

  // Validation: Must have items, a pin on the map, and a house number
  const canPlaceOrder =
    items.length > 0 &&
    selectedLocation !== null &&
    houseDetails.number.trim().length > 0;

  if (!isMounted) return null;

  if (items.length === 0) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-6 py-24 text-center">
        <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary mb-6 animate-pulse">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-display font-extrabold text-4xl text-neutral-900 mb-2">
          Empty Cart
        </h1>
        <Link
          href="/"
          className="mt-6 px-8 py-4 bg-brand-primary text-white text-xs font-bold tracking-widest rounded-full uppercase"
        >
          Explore Menu
        </Link>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col container mx-auto px-6 lg:px-12 my-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-brand-secondary hover:text-brand-primary mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
      </Link>

      <div className="mb-12">
        <h1 className="font-display font-extrabold text-5xl md:text-6xl text-neutral-900 tracking-tight leading-none">
          Review & Pay
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        <div className="flex-1 flex flex-col gap-12">
          {/* Section: Delivery Address & Map */}
          <section className="flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <h3 className="font-display font-bold text-2xl text-neutral-900">
                Delivery Location
              </h3>
              <button
                onClick={handleUseCurrentLocation}
                className="text-[10px] font-bold text-brand-primary uppercase flex items-center gap-1.5"
              >
                <Navigation className="w-3 h-3" /> Snap to My GPS
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <form onSubmit={handleAddressSearch} className="relative">
                <input
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder="Search colony, street or landmark..."
                  className="w-full bg-white border border-neutral-200 rounded-2xl pl-5 pr-32 py-4 text-sm font-medium focus:ring-2 focus:ring-brand-primary/20 outline-none"
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="absolute right-2 top-2 bottom-2 bg-brand-primary text-white text-[10px] font-bold px-5 rounded-xl flex items-center gap-2"
                >
                  {isSearching ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Search className="w-3 h-3" />
                  )}
                  FIND
                </button>
              </form>

              <DynamicMapPicker
                position={selectedLocation}
                onLocationSelect={(lat, lng) => {
                  setSelectedLocation({ lat, lng });
                  setIsLocationConfirmed(true);
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase text-neutral-400 ml-1">
                    House / Flat / Floor No.*
                  </label>
                  <input
                    type="text"
                    value={houseDetails.number}
                    onChange={(e) =>
                      setHouseDetails({
                        ...houseDetails,
                        number: e.target.value,
                      })
                    }
                    placeholder="e.g. 402, Krishna Heights"
                    className="bg-white border border-neutral-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-brand-primary"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold uppercase text-neutral-400 ml-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={houseDetails.landmark}
                    onChange={(e) =>
                      setHouseDetails({
                        ...houseDetails,
                        landmark: e.target.value,
                      })
                    }
                    placeholder="e.g. Near Apollo Hospital"
                    className="bg-white border border-neutral-200 rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-brand-primary"
                  />
                </div>
              </div>

              {isLocationConfirmed && selectedLocation && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-100 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-wider">
                      Pin Confirmed
                    </span>
                    <span className="text-[10px] text-green-600">
                      Our rider will use this exact GPS coordinate.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Section: Payment Method */}
          <section className="flex flex-col gap-6">
            <h3 className="font-display font-bold text-2xl text-neutral-900">
              Payment Method
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button className="flex flex-col items-center justify-center gap-2 bg-white border-2 border-brand-primary rounded-2xl py-5 shadow-sm">
                <CreditCard className="w-5 h-5 text-brand-primary" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-brand-primary">
                  Card / UPI
                </span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 bg-neutral-50 border border-neutral-100 rounded-2xl py-5 opacity-60 pointer-events-none">
                <Apple className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  Apple Pay
                </span>
              </button>
              <button className="flex flex-col items-center justify-center gap-2 bg-neutral-50 border border-neutral-100 rounded-2xl py-5 opacity-60 pointer-events-none">
                <BadgeDollarSign className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase tracking-widest">
                  G-Pay
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* Right Sidebar: Summary */}
        <div className="w-full lg:w-[380px] shrink-0">
          <div className="bg-white rounded-[40px] p-8 shadow-soft border border-neutral-50 sticky top-24">
            <h3 className="font-display font-bold text-xl text-neutral-900 mb-6 border-b border-neutral-50 pb-4">
              Order Summary
            </h3>

            <div className="flex flex-col gap-5 mb-8 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
              {items.map((item: any) => (
                <div key={item.productId} className="flex gap-4 items-center">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-neutral-100 shrink-0">
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="font-bold text-xs text-neutral-900 mb-1">
                      {item.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-neutral-50 rounded-full p-0.5 border border-neutral-100">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm"
                        >
                          <Minus className="w-2.5 h-2.5" />
                        </button>
                        <span className="text-[10px] font-bold w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-sm"
                        >
                          <Plus className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-neutral-300 hover:text-red-500 ml-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <span className="font-bold text-xs text-brand-secondary">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 text-xs font-bold text-neutral-400 mb-6 pt-6 border-t border-neutral-50">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-neutral-900">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-neutral-900">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between font-extrabold text-neutral-900">
                <span>Total</span>
                <span className="text-brand-primary text-xl">
                  ₹{total.toFixed(0)}
                </span>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-4">
              <button
                disabled={!canPlaceOrder}
                className={`
      w-full py-5 rounded-2xl font-display font-extrabold text-lg tracking-tight transition-all duration-300
      ${
        canPlaceOrder
          ? "bg-brand-primary text-white shadow-[0_12px_24px_-10px_rgba(230,81,0,0.5)] hover:bg-orange-600 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
          : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
      }
    `}
              >
                Complete Order • ₹{total.toFixed(0)}
              </button>

              {!canPlaceOrder && items.length > 0 && (
                <div className="flex items-center justify-center gap-2 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    {!selectedLocation
                      ? "Set your delivery pin"
                      : "Enter house details"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
