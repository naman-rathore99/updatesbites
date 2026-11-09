import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSignIn } from "@clerk/expo/legacy";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Stitch Design tokens
const C = {
  surface: "#fff8ef",
  primary: "#a43700",
  primaryContainer: "#cd4700",
  surfaceContainerHighest: "#e9e2d3",
  surfaceContainerLow: "#fbf3e4",
  onSurface: "#1e1b13",
  onSurfaceVariant: "#5a4138",
  onPrimary: "#ffffff",
};

const HERO_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuAzKr8fc7oJR_EaxyZTJMHRnGS5Hb0r0MvuU8ugwS2YnlMX6eJW0aCvk5lYvUqyMprGqfVDJOFkkDF__ZEoz6R3nwgJVQu-JqpdfMJLYXxajAHHFFhnByWd-33-h7W0gZ-bwHDKmAIK9lnbm33ZGn8rKolkQSfgVFCnEwIq5UGY4yQNKW2FQtGjvm4hgmbLxNgJLTXo8o1ftsOacfmJu3L2UfI25PNdLRwJUrWptzWxh91AahiWVCx5fiqLwHnAcXewr44ApPgVyQ";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignIn = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const result = await signIn.create({ identifier: email, password });
      await setActive({ session: result.createdSessionId });
      router.replace("/(home)/");
    } catch (err: any) {
      alert(err.errors?.[0]?.message || "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.surface }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* ── Hero image top bleed ── */}
      <ImageBackground
        source={{ uri: HERO_IMAGE }}
        style={{ height: 300, width: "100%" }}
        resizeMode="cover"
      >
        {/* Gradient fade into surface */}
        <LinearGradient
          colors={["transparent", "rgba(255,248,239,0.5)", C.surface]}
          style={{ position: "absolute", inset: 0 }}
          locations={[0, 0.6, 1]}
        />
      </ImageBackground>

      {/* ── Content overlapping hero ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, marginTop: -48 }}
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Heading */}
          <View style={{ marginBottom: 36 }}>
            <Text style={{ fontSize: 48, fontWeight: "900", color: C.onSurface, lineHeight: 52, letterSpacing: -1 }}>
              Welcome{"\n"}
              <Text style={{ fontStyle: "italic", color: C.primary }}>Back</Text>
            </Text>
            <Text style={{ fontSize: 16, color: C.onSurfaceVariant, fontWeight: "300", marginTop: 8 }}>
              Sign in to curate your next sensory journey.
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: 20, marginBottom: 8 }}>
            {/* Email */}
            <View>
              <Text style={{ fontSize: 11, fontWeight: "700", color: C.onSurfaceVariant, textTransform: "uppercase", letterSpacing: 2, marginLeft: 20, marginBottom: 8 }}>
                Email Address
              </Text>
              <View style={{ position: "relative" }}>
                <Text style={{ position: "absolute", left: 20, top: 15, fontSize: 18, zIndex: 1, color: C.onSurfaceVariant }}>✉</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor={C.onSurfaceVariant + "60"}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={{
                    backgroundColor: C.surfaceContainerHighest,
                    borderRadius: 9999,
                    paddingLeft: 52,
                    paddingRight: 24,
                    paddingVertical: 16,
                    fontSize: 16,
                    color: C.onSurface,
                    fontWeight: "500",
                  }}
                />
              </View>
            </View>

            {/* Password */}
            <View>
              <Text style={{ fontSize: 11, fontWeight: "700", color: C.onSurfaceVariant, textTransform: "uppercase", letterSpacing: 2, marginLeft: 20, marginBottom: 8 }}>
                Password
              </Text>
              <View style={{ position: "relative" }}>
                <Text style={{ position: "absolute", left: 20, top: 15, fontSize: 18, zIndex: 1, color: C.onSurfaceVariant }}>🔒</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={C.onSurfaceVariant + "60"}
                  secureTextEntry
                  style={{
                    backgroundColor: C.surfaceContainerHighest,
                    borderRadius: 9999,
                    paddingLeft: 52,
                    paddingRight: 24,
                    paddingVertical: 16,
                    fontSize: 16,
                    color: C.onSurface,
                    fontWeight: "500",
                  }}
                />
              </View>
              {/* Forgot */}
              <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 10, marginRight: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: C.primary }}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CTA button — gradient */}
          <TouchableOpacity
            onPress={onSignIn}
            disabled={loading}
            style={{ marginTop: 24, borderRadius: 9999, overflow: "hidden" }}
          >
            <LinearGradient
              colors={[C.primary, C.primaryContainer]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 16,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 10,
                shadowColor: C.onSurface,
                shadowOpacity: 0.12,
                shadowRadius: 24,
                shadowOffset: { width: 0, height: 12 },
              }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={{ color: C.onPrimary, fontSize: 17, fontWeight: "700" }}>Sign In</Text>
                  <Text style={{ color: C.onPrimary, fontSize: 17 }}>→</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginTop: 36, marginBottom: 20 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: C.surfaceContainerHighest }} />
            <Text style={{ fontSize: 10, color: C.onSurfaceVariant, textTransform: "uppercase", letterSpacing: 2, fontWeight: "700" }}>
              Or continue with
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: C.surfaceContainerHighest }} />
          </View>

          {/* Social buttons */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 40 }}>
            {["G  Google", "  Apple"].map((label) => (
              <TouchableOpacity
                key={label}
                style={{
                  flex: 1,
                  backgroundColor: C.surfaceContainerLow,
                  borderRadius: 9999,
                  paddingVertical: 14,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: C.onSurface, fontWeight: "700", fontSize: 13 }}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Sign up link */}
          <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 }}>
            <Text style={{ color: C.onSurfaceVariant, fontSize: 15 }}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
              <Text style={{ color: C.primary, fontWeight: "700", fontSize: 15 }}> Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
