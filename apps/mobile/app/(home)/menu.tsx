import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Types ───────────────────────────────────────────────────────────────────
type MenuItem = {
  id: string;
  title: string;
  description: string;
  price: string;
  badge: string;
  imageUrl: string;
  layout: "large" | "compact";
};

// ─── Data (matches Stitch design) ────────────────────────────────────────────
const CATEGORIES = ["All Pairings", "Signature Bowls", "Burgers", "Desserts"];

const MENU_ITEMS: MenuItem[] = [
  {
    id: "1",
    title: "Miso Glazed Salmon Bowl",
    description:
      "Wild-caught salmon, ancient grain quinoa base, pickled radishes, and a rich umami miso glaze. Served with seasonal micro-greens.",
    price: "$16.00",
    badge: "Signature",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKEFB5AP5lGv7FuD0ze9ymyfFDXkRR8YxyrvOk-UUfT2ZzTIz66dFNyInylc8LhjOUTcYI2hHswJevvWP1dxfGoPB5ask11VekKC9ERh0NKAec4uKbXQtBX3QJ9DFfi9D4zfGgd4jknbWhbNVI3T8OJKZnB3kvUJ6GGkR_Q01uNMBhsEJXBjUTfNuqpoYi8RCvgMS7LXGQrfWDgHX7yoouX0Hemh8hRt5wwhlEtkc9C_YMvF2SA8RxX0ww3tTsMnE6hhbSH19Q5g",
    layout: "large",
  },
  {
    id: "2",
    title: "Truffle Brie Burger",
    description:
      "Wagyu patty, double cream brie, wild mushroom duxelles, truffle aioli.",
    price: "$22.00",
    badge: "Burgers",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLpaslkOQ3siPX183TaUCOcbCwfLE9gueBCemHV2BIRc1Yln1RSLcFdHxtr5fexpAWKpGhfqyf5Sj7ujk5gHYGwnDxQJwNTZFa_0sth4Fl4e8KpN5xwWGsa0xewTiMKaZvXqTJxTUoLuBXaEkkur1p0cotG4sWjVfXrjixGzdrDIQbxc6gflcU48hEsliub8GnFuF59q-7jQK73h-E4V1rulyKLglHhZNg6VIo4-l9c8xp5wMh8BTB2Qj6OTdQQw6235DPTO0kvA",
    layout: "compact",
  },
  {
    id: "3",
    title: "Midnight Lava Cake",
    description:
      "70% Valrhona dark chocolate, warm liquid center, Madagascar vanilla bean gelato finished with a sprinkle of sea salt.",
    price: "$12.00",
    badge: "Dessert",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBCb94l1GZ5bI3S8db--WJUCYC91sIAxiHQiy23bMNMlS8-BoJI_NV6S44sggSGkQ47jH7doGD-JzwmRb2OoGIrGrQYoo_j76ZMO_MtizYLmGyFartwuW1IrqRSsGmC2bZY5RrmUCwK7gr1rz0s9PWHyLvWy0IZRq11Wl77b35GuSkAvVV_HhA3BItQNOq37YuaIoC9CA8D-bDuGVJJdK-nrKlYGPNbAGiio_Eqi_wzBalhgIUgoHNoGmccRmbRnMNkmMao3B3rfw",
    layout: "large",
  },
];

// ─── Large Editorial Card ─────────────────────────────────────────────────────
function LargeCard({ item }: { item: MenuItem }) {
  return (
    <View className="bg-[#fbf3e4] rounded-2xl overflow-hidden mb-6">
      <View className="h-56 relative">
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
        {/* Price badge */}
        <View className="absolute top-3 right-3 bg-white/80 px-3 py-1.5 rounded-full">
          <Text className="text-[#1e1b13] font-bold text-sm">{item.price}</Text>
        </View>
      </View>
      {/* Floating content card */}
      <View
        className="bg-white rounded-2xl -mt-6 mx-2 px-5 py-5 z-10"
        style={{
          shadowColor: "#1e1b13",
          shadowOpacity: 0.06,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 8 },
          elevation: 4,
        }}
      >
        <Text className="text-[#1e1b13] text-2xl font-bold mb-2 leading-tight">
          {item.title}
        </Text>
        <Text className="text-[#5a4138] text-sm leading-relaxed mb-5">
          {item.description}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-[#a43700] text-xs font-bold uppercase tracking-widest">
            {item.badge}
          </Text>
          <TouchableOpacity
            className="bg-[#a43700] w-12 h-12 rounded-full items-center justify-center"
            style={{
              shadowColor: "#a43700",
              shadowOpacity: 0.3,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            }}
          >
            <Text className="text-white text-2xl font-light">+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Compact Horizontal Card ──────────────────────────────────────────────────
function CompactCard({ item }: { item: MenuItem }) {
  return (
    <View className="bg-[#fbf3e4] rounded-2xl flex-row items-center p-3 mb-6 overflow-hidden">
      {/* Thumbnail */}
      <View
        className="w-32 h-36 rounded-xl overflow-hidden"
        style={{
          shadowColor: "#1e1b13",
          shadowOpacity: 0.08,
          shadowRadius: 12,
          shadowOffset: { width: 4, height: 0 },
          elevation: 4,
        }}
      >
        <Image
          source={{ uri: item.imageUrl }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      {/* Info */}
      <View className="flex-1 pl-4 py-2">
        <Text className="text-[#1e1b13] text-xl font-bold leading-tight mb-2">
          {item.title}
        </Text>
        <Text
          className="text-[#5a4138] text-xs leading-relaxed mb-4"
          numberOfLines={2}
        >
          {item.description}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className="text-[#1e1b13] font-bold text-base">
            {item.price}
          </Text>
          <TouchableOpacity className="bg-[#d1e2ec] px-5 py-2 rounded-full">
            <Text className="text-[#0d1e25] text-xs font-bold">View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function MenuCatalogScreen() {
  const [activeCategory, setActiveCategory] = useState("All Pairings");
  const [search, setSearch] = useState("");

  const filtered = MENU_ITEMS.filter(
    (item) =>
      (activeCategory === "All Pairings" ||
        item.badge === activeCategory ||
        item.badge.includes(activeCategory.replace("s", ""))) &&
      item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1 bg-[#fff8ef]">
      <StatusBar barStyle="dark-content" backgroundColor="#fff8ef" />

      {/* ── Top App Bar ── */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <TouchableOpacity className="p-1">
          <Text className="text-[#a43700] text-2xl">☰</Text>
        </TouchableOpacity>
        <Text
          className="text-2xl font-bold text-[#a43700]"
          style={{ fontStyle: "italic" }}
        >
          BitesofBliss
        </Text>
        <View className="w-9 h-9 rounded-full overflow-hidden bg-[#e9e2d3]">
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6IjAYpkPsUTuhrGCdIrToNdhhowrQNfiA0qwhaG6hf_4P1f4j5KXBKNamgBlAiw7z_qkKbAIYCmyAqqK6Jlooct56wN21JqGlxuguKaBc-3b_B2sqoekqeEHeuGl16mpDy0Vv5NvUivlLpje5UKkq_lekad26Z0uLz3K8FNAMOQglBFSml5_R-qSRKq4rSCwGMOpkstHJhZ5WB9-fCxjL1zEGFSEl_IC9bf3rGGyU16AS5ZfqZcxYlCuQxJZrA2srr1FMgCoZQg",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-2 pb-32">

          {/* ── Header ── */}
          <View className="mb-5">
            <Text className="text-4xl font-bold text-[#1e1b13] tracking-tight mb-1">
              Curated for you.
            </Text>
            <Text className="text-sm text-[#5a4138]">
              Discover our seasonal culinary selections.
            </Text>
          </View>

          {/* ── Search Bar ── */}
          <View className="flex-row items-center bg-[#e9e2d3] rounded-full px-5 py-3 mb-6">
            <Text className="text-[#5a4138] mr-2 text-base">🔍</Text>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search our kitchen..."
              placeholderTextColor="#8f7066"
              className="flex-1 text-[#1e1b13] text-sm"
            />
          </View>

          {/* ── Category Chips ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-3 pb-2 mb-5"
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full ${
                  activeCategory === cat
                    ? "bg-[#a66600]"
                    : "bg-[#fbf3e4]"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    activeCategory === cat ? "text-white" : "text-[#1e1b13]"
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── Menu Items ── */}
          {filtered.map((item) =>
            item.layout === "large" ? (
              <LargeCard key={item.id} item={item} />
            ) : (
              <CompactCard key={item.id} item={item} />
            )
          )}
        </View>
      </ScrollView>

      {/* ── Bottom Nav Bar ── */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-[#fff1e6]/95 flex-row justify-around items-center px-4 pt-3 pb-8"
        style={{
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          shadowColor: "#000",
          shadowOpacity: 0.06,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -6 },
          elevation: 10,
        }}
      >
        {/* Menu – active */}
        <TouchableOpacity className="bg-[#7c2d00] flex-row items-center px-5 py-2 rounded-full gap-2">
          <Text className="text-white text-lg">🍽</Text>
          <Text className="text-white text-[10px] font-bold uppercase tracking-widest">
            Menu
          </Text>
        </TouchableOpacity>

        {[
          { icon: "🔍", label: "Search" },
          { icon: "🛒", label: "Basket" },
          { icon: "👤", label: "Profile" },
        ].map((nav) => (
          <TouchableOpacity key={nav.label} className="items-center opacity-50">
            <Text className="text-xl">{nav.icon}</Text>
            <Text className="text-[#5a4138] text-[10px] font-bold uppercase tracking-widest mt-1">
              {nav.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}
