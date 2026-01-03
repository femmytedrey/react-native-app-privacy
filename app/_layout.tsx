import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { UserInactivityProvider } from "@/contexts/user-inactivity-provider";
import { useColorScheme } from "@/hooks/use-color-scheme";

// export const unstable_settings = {
//   anchor: "(tabs)",
// };

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <UserInactivityProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="index"
            options={{ title: "Home", headerShown: false }}
          />

          <Stack.Screen
            name="(modal)/overlay"
            options={{
              headerShown: false,
              animation: "fade",
              animationDuration: 200,
            }}
          />

          <Stack.Screen
            name="(modal)/lock"
            options={{
              headerShown: false,
              animation: "fade",
              animationDuration: 200,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </UserInactivityProvider>
  );
}
