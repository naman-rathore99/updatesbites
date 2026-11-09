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
import { useSignUp } from "@clerk/expo/legacy";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

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

const HERO_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuBtp-xucYxOqfdnqJJ6pIJhKegAqOobbvXhJevG3m5bmdzE0VGPqq7msqupo8WTUNE_k2g35CP6dfU07hDnNakxN6--NnhkDtt0t6Ahdw0inZSQB5NG7ftfXZH-3k9syrhR8K1T2GH3Ooyh1zCxyJ4rHaVf57nN3v0TRSCngHleo--7J9_2im1Zd_a7ro20A_1pbtaeAl4ZRPUmNvmCGKLOk-coSW_dM1AhwtJBpBZDfyG4CI9hZrg0lHYOK4A07-UPkp3TXd5bAA";

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
}: any) => (
  <View>
    <Text style={{ fontSize: 11, fontWeight: "700", color: C.onSurfaceVariant, textTransform: "uppercase", letterSpacing: 2, marginLeft: 16, marginBottom: 8 }}>
      {label}
    </Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={C.onSurfaceVariant + "60"}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
      style={{
        backgroundColor: C.surfaceContainerHighest,
        borderRadius: 9999,
        paddingHorizontal: 24,
        paddingVertical: 16,
        fontSize: 16,
        color: C.onSurface,
        fontWeight: "500",
      }}
    />
  </View>
);

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const onSignUp = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signUp.create({ firstName, lastName, emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors?.[0]?.message || "Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      await setActive({ session: result.createdSessionId });
      router.replace("/(home)/");
    } catch (err: any) {
      alert(err.errors?.[0]?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // ── OTP Screen ──────────────────────────────────────────────────────────────
  if (pendingVerification) {
    return (
      <View style={{ flex: 1, backgroundColor: C.surface, padding: 24, justifyContent: "center" }}>
        <StatusBar barStyle="dark-content" backgroundColor={C.surface} />
        <View style={{ width: 64, height: 64, backgroundColor: "#e8f5e9", borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 28 }}>
          <Text style={{ fontSize: 30 }}>📧</Text>
        </View>
        <Text style={{ fontSize: 28, fontWeight: "900", color: C.onSurface, marginBottom: 10 }}>Check your email</Text>
        <Text style={{ color: C.onSurfaceVariant, fontSize: 15, lineHeight: 22, marginBottom: 36 }}>
          We sent a 6-digit code to{" "}
          <Text style={{ color: C.primary, fontWeight: "700" }}>{email}</Text>.
        </Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="• • • • • •"
          placeholderTextColor={C.surfaceContainerHighest}
          keyboardType="number-pad"
          maxLength={6}
          style={{
            backgroundColor: C.surfaceContainerHighest,
            borderRadius: 9999,
            paddingVertical: 20,
            paddingHorizontal: 24,
            textAlign: "center",
            fontSize: 32,
            fontWeight: "700",
            letterSpacing: 14,
            color: C.onSurface,
            marginBottom: 20,
          }}
        />
        <TouchableOpacity
          onPress={onVerify}
          disabled={loading || code.length < 6}
          style={{ borderRadius: 9999, overflow: "hidden" }}
        >
          <LinearGradient
            colors={code.length < 6 ? [C.surfaceContainerHighest, C.surfaceContainerHighest] : [C.primary, C.primaryContainer]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ paddingVertical: 16, alignItems: "center" }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: code.length < 6 ? C.onSurfaceVariant : C.onPrimary, fontSize: 16, fontWeight: "700" }}>
                Verify & Continue →
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setPendingVerification(false)} style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ color: C.onSurfaceVariant, fontSize: 14 }}>← Back to sign up</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Sign Up Form ─────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: C.surface }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Hero bleed */}
      <ImageBackground
        source={{ uri: HERO_IMAGE }}
        style={{ height: 260, width: "100%" }}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["transparent", "rgba(255,248,239,0.6)", C.surface]}
          style={{ position: "absolute", inset: 0 }}
          locations={[0, 0.55, 1]}
        />
      </ImageBackground>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, marginTop: -40 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Rounded top card overlapping hero */}
          <View
            style={{
              backgroundColor: C.surface,
              borderTopLeftRadius: 40,
              borderTopRightRadius: 40,
              paddingHorizontal: 24,
              paddingTop: 32,
              paddingBottom: 48,
              shadowColor: C.onSurface,
              shadowOpacity: 0.06,
              shadowRadius: 40,
              shadowOffset: { width: 0, height: -12 },
              elevation: 6,
            }}
          >
            {/* Heading */}
            <View style={{ marginBottom: 32, alignItems: "center" }}>
              <Text style={{ fontSize: 34, fontWeight: "900", color: C.onSurface, textAlign: "center", lineHeight: 38 }}>
                A Seat at Our Table{"\n"}
                <Text style={{ fontStyle: "italic", color: C.primary }}>is Waiting</Text>
              </Text>
              <Text style={{ color: C.onSurfaceVariant, fontSize: 15, marginTop: 10, textAlign: "center" }}>
                Curate your personal culinary journey today.
              </Text>
            </View>

            {/* Form */}
            <View style={{ gap: 16, marginBottom: 28 }}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <InputField label="First Name" value={firstName} onChangeText={setFirstName} placeholder="Julia" />
                </View>
                <View style={{ flex: 1 }}>
                  <InputField label="Last Name" value={lastName} onChangeText={setLastName} placeholder="Child" />
                </View>
              </View>
              <InputField label="Email Address" value={email} onChangeText={setEmail} placeholder="your@email.com" keyboardType="email-address" />
              <InputField label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
            </View>

            {/* Terms */}
            <Text style={{ color: C.onSurfaceVariant, fontSize: 13, lineHeight: 20, paddingHorizontal: 8, marginBottom: 28 }}>
              By creating an account, you accept the{" "}
              <Text style={{ color: C.primary, fontWeight: "700" }}>Terms of Service</Text> and{" "}
              <Text style={{ color: C.primary, fontWeight: "700" }}>Privacy Policy</Text>.
            </Text>

            {/* CTA */}
            <TouchableOpacity
              onPress={onSignUp}
              disabled={loading || !firstName || !email || !password}
              style={{ borderRadius: 9999, overflow: "hidden", marginBottom: 16 }}
            >
              <LinearGradient
                colors={loading || !firstName || !email || !password ? [C.surfaceContainerHighest, C.surfaceContainerHighest] : [C.primary, C.primaryContainer]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ paddingVertical: 17, alignItems: "center" }}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={{ color: !firstName || !email || !password ? C.onSurfaceVariant : C.onPrimary, fontSize: 16, fontWeight: "700" }}>
                    Create Account
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign in link */}
            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 4 }}>
              <Text style={{ color: C.onSurfaceVariant, fontSize: 14 }}>Already have a reservation?</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/sign-in")}>
                <Text style={{ color: C.primary, fontWeight: "700", fontSize: 14 }}> Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
