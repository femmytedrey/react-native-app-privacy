import {
  LOCK_TIMEOUT_MS,
  ROUTES,
  STORAGE_KEY,
} from "@/config/user-inactivity.config";
import { useAuthStore } from "@/store/auth-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

export const UserInactivityProvider = ({
  children,
}: React.PropsWithChildren) => {
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const isAutheticating = useAuthStore.getState().isAuthenticating;

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
      // Cleanup storage on unmount (optional, but good practice)
      AsyncStorage.removeItem(STORAGE_KEY).catch(console.error);
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (__DEV__) {
      console.log(`[AppState] ${appState.current} → ${nextAppState}`);
    }

    switch (nextAppState) {
      case "inactive":
        handleInactive();
        break;

      case "background":
        await handleBackground();
        break;

      case "active":
        await handleActive();
        break;
    }

    appState.current = nextAppState;
  };

  const handleInactive = () => {
    try {
      if (isAutheticating) return;
      router.push(ROUTES.OVERLAY);
    } catch (error) {
      console.error("[Overlay] Failed to show:", error);
    }
  };

  const handleBackground = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, Date.now().toString());
      // if (__DEV__) console.log("[Background] Start time saved");
    } catch (error) {
      console.error("[Background] Failed to save time:", error);
    }
  };

  const handleActive = async () => {
    const wasInBackground = appState.current === "background";

    if (wasInBackground) {
      const shouldLock = await checkShouldLock();

      if (shouldLock) {
        try {
          router.push(ROUTES.LOCK);
          if (__DEV__) console.log("[Lock] Showing lock screen");
          return;
        } catch (error) {
          console.error("[Lock] Failed to show lock screen:", error);
        }
      }
    }

    // Hide overlay
    hideOverlay();
  };

  const checkShouldLock = async (): Promise<boolean> => {
    try {
      const storedTime = await AsyncStorage.getItem(STORAGE_KEY);

      if (!storedTime) {
        return false;
      }

      const startTime = parseInt(storedTime, 10);

      if (isNaN(startTime)) {
        console.error("[Lock] Invalid stored time:", storedTime);
        await AsyncStorage.removeItem(STORAGE_KEY);
        return false;
      }

      const elapsedTime = Date.now() - startTime;
      const shouldLock = elapsedTime > LOCK_TIMEOUT_MS;

      if (__DEV__) {
        console.log(`[Lock] Elapsed: ${elapsedTime}ms, Lock: ${shouldLock}`);
      }

      // Clean up storage
      await AsyncStorage.removeItem(STORAGE_KEY);

      return shouldLock;
    } catch (error) {
      console.error("[Lock] Error checking lock status:", error);
      return false;
    }
  };

  const hideOverlay = () => {
    try {
      if (router.canGoBack()) {
        router.back();
      }
    } catch (error) {
      console.error("[Overlay] Failed to hide:", error);
    }
  };

  return <>{children}</>;
};
