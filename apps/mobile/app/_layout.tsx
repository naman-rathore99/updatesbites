import { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ClerkProvider, useAuth } from "@clerk/expo";
import * as SecureStore from "expo-secure-store";
import "../global.css";

// Prevent splash screen from hiding immediately
SplashScreen.preventAutoHideAsync();

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

const InitialLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === "(home)";

    if (isSignedIn && !inTabsGroup) {
      router.replace("/(home)/");
    } else if (!isSignedIn) {
      router.replace("/(auth)/sign-in");
    }
    
    // Hide splash screen once auth logic is processed
    SplashScreen.hideAsync();
  }, [isSignedIn, isLoaded, segments]);

  return <Slot />;
};

export default function RootLayout() {
  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || "fallback"}
      tokenCache={tokenCache}
    >
      <InitialLayout />
    </ClerkProvider>
  );
}
