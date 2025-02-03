import React, { Fragment, useContext, useEffect } from "react";
import { StatusBar } from "react-native";
import RootNavigator from "./navigation/RootNavigator";
import {
  ThemeProvider,
  useThemeColors,
  ThemeContext,
} from "./theme/ThemeProvider";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_FETCH_TASK = "background-fetch-task";

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    console.log("Background fetch task executed");
    return BackgroundFetch.Result.NewData;
  } catch (error) {
    console.error("Error in background fetch task:", error);
    return BackgroundFetch.Result.Failed;
  }
});

const AppContent = () => {
  const colors = useThemeColors();
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  useEffect(() => {
    const registerBackgroundFetch = async () => {
      try {
        const status = await BackgroundFetch.getStatusAsync();
        if (
          status === BackgroundFetch.Status.Restricted ||
          status === BackgroundFetch.Status.Denied
        ) {
          console.warn("Background fetch is not enabled or restricted");
          return;
        }

        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 15 * 60,
          stopOnTerminate: false,
          startOnBoot: true,
        });
        console.log("Background fetch task registered");
      } catch (error) {
        console.error("Error registering background fetch task:", error);
      }
    };

    registerBackgroundFetch();

    return () => {
      BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    };
  }, []);

  return (
    <Fragment>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      <RootNavigator />
    </Fragment>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
