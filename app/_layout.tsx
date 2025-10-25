import { Slot, Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
    return (
        <ClerkProvider tokenCache={tokenCache}>
          <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
                <Slot />
            </Stack>
        </ClerkProvider>
    );
}