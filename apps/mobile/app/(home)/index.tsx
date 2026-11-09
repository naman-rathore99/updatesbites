import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { useUser, useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const QUICK_ACTIONS = [
  { emoji: "🍱", label: "My Orders", bg: "bg-orange-50", border: "border-orange-100" },
  { emoji: "📍", label: "Track Order", bg: "bg-green-50", border: "border-green-100" },
  { emoji: "⭐", label: "Favourites", bg: "bg-yellow-50", border: "border-yellow-100" },
  { emoji: "🏷️", label: "Offers", bg: "bg-purple-50", border: "border-purple-100" },
];

const FEATURED_CATEGORIES = [
  { emoji: "🍛", label: "Rice Bowls" },
  { emoji: "🥪", label: "Sandwiches" },
  { emoji: "🍔", label: "Burgers" },
  { emoji: "🥗", label: "Healthy" },
  { emoji: "🍜", label: "Noodles" },
];

export default function HomeScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const firstName = user?.firstName || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <StatusBar barStyle="dark-content" backgroundColor="#fafafa" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Top Bar ── */}
        <View className="flex-row items-center justify-between px-5 pt-4 pb-2">
          <View>
            <Text className="text-neutral-400 text-sm font-medium">{greeting} 👋</Text>
            <Text className="text-2xl font-extrabold text-neutral-900">{firstName}</Text>
          </View>
          <TouchableOpacity
            onPress={() => signOut()}
            className="bg-white border border-neutral-100 px-4 py-2 rounded-full shadow-sm"
          >
            <Text className="text-neutral-600 font-bold text-xs">Sign Out</Text>
          </TouchableOpacity>
        </View>

        {/* ── Hero / Banner Card ── */}
        <View className="mx-5 mt-4 mb-6 rounded-3xl bg-orange-600 overflow-hidden" style={{ minHeight: 160 }}>
          <View className="p-6">
            <View className="bg-white/20 self-start px-3 py-1 rounded-full mb-3">
              <Text className="text-white text-xs font-bold uppercase tracking-widest">
                🔥 Today's Special
              </Text>
            </View>
            <Text className="text-white font-extrabold text-2xl leading-tight mb-1">
              Fresh Food,{"\n"}Delivered Fast.
            </Text>
            <Text className="text-white/70 text-xs font-medium mb-5">
              Order in minutes. Track in real-time.
            </Text>
            <TouchableOpacity onPress={() => router.push("/(home)/menu")} className="bg-white self-start px-5 py-3 rounded-xl flex-row items-center gap-2">
              <Text className="text-orange-600 font-extrabold text-sm">Browse Menu</Text>
              <Text className="text-orange-600 font-extrabold">→</Text>
            </TouchableOpacity>
          </View>
          {/* Decorative circles */}
          <View className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <View className="absolute -right-4 -bottom-10 w-32 h-32 rounded-full bg-white/10" />
        </View>

        {/* ── Quick Actions ── */}
        <View className="px-5 mb-6">
          <Text className="text-neutral-900 font-extrabold text-lg mb-3">Quick Actions</Text>
          <View className="flex-row gap-3">
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                className={`flex-1 ${action.bg} border ${action.border} rounded-2xl p-3 items-center gap-1.5`}
              >
                <Text className="text-2xl">{action.emoji}</Text>
                <Text className="text-neutral-700 font-bold text-xs text-center leading-tight">
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Categories ── */}
        <View className="mb-6">
          <View className="px-5 flex-row justify-between items-center mb-3">
            <Text className="text-neutral-900 font-extrabold text-lg">Browse Categories</Text>
            <TouchableOpacity>
              <Text className="text-orange-600 font-bold text-xs">See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="px-5 gap-3"
          >
            {FEATURED_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.label}
                className="bg-white border border-neutral-100 rounded-2xl px-4 py-3 items-center shadow-sm"
                style={{ minWidth: 80 }}
              >
                <Text className="text-3xl mb-1">{cat.emoji}</Text>
                <Text className="text-neutral-800 font-bold text-xs">{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Account Card ── */}
        <View className="mx-5 mb-10">
          <Text className="text-neutral-900 font-extrabold text-lg mb-3">My Account</Text>
          <View className="bg-white border border-neutral-100 rounded-3xl overflow-hidden shadow-sm">
            {/* Avatar row */}
            <View className="p-5 border-b border-neutral-50 flex-row items-center gap-4">
              <View className="w-12 h-12 bg-orange-100 rounded-2xl items-center justify-center">
                <Text className="text-xl">
                  {user?.firstName?.[0]?.toUpperCase() || "U"}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-neutral-900 font-extrabold text-base">
                  {user?.fullName || "—"}
                </Text>
                <Text className="text-neutral-400 text-xs font-medium mt-0.5">
                  {user?.primaryEmailAddress?.emailAddress || "—"}
                </Text>
              </View>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-green-700 font-bold text-xs">Active</Text>
              </View>
            </View>

            {/* Stats row */}
            <View className="flex-row">
              {[
                { label: "Orders", value: "—" },
                { label: "Saved", value: "—" },
                { label: "Points", value: "0" },
              ].map((stat, i, arr) => (
                <View
                  key={stat.label}
                  className={`flex-1 py-4 items-center ${
                    i < arr.length - 1 ? "border-r border-neutral-50" : ""
                  }`}
                >
                  <Text className="text-neutral-900 font-extrabold text-xl">
                    {stat.value}
                  </Text>
                  <Text className="text-neutral-400 text-xs font-medium mt-0.5">
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
