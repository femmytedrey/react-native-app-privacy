import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

export const UserInactivityProvider = ({
  children,
}: React.PropsWithChildren) => {
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    console.log("appState", appState.current, nextAppState);

    appState.current = nextAppState;
  };
  return <>{children}</>;
};
