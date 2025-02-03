import React, { useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useThemeColors } from "../theme/ThemeProvider";

const UpdateUserProfileImage = ({ updateProfileImage }) => {
  const colors = useThemeColors();
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpdate = () => {
    Alert.alert("Update Profile Picture", "Choose an option", [
      { text: "Camera", onPress: () => pickImage("camera") },
      { text: "Gallery", onPress: () => pickImage("gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const pickImage = async (mode) => {
    try {
      setIsLoading(true);
      let result;
      if (mode === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Camera permission is required!");
          setIsLoading(false);
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Media library permission is required!"
          );
          setIsLoading(false);
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
        });
      }
      if (result.canceled) {
        setIsLoading(false);
        return;
      }
      const imageUri = result.assets[0].uri;
      await updateProfileImage(imageUri);
    } catch (error) {
      Alert.alert(
        "Error",
        "There was an error picking the image. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleImageUpdate}
      disabled={isLoading}
      accessibilityLabel="Update Profile Image"
      testID="update-profile-image"
      style={styles.buttonContainer}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Text style={[styles.updateText, { color: colors.primary }]}>
          Update Profile Image
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  updateText: {
    fontSize: 14,
    marginLeft: 10,
    textDecorationLine: "underline",
  },
  buttonContainer: {
    justifyContent: "center",
  },
});

export default UpdateUserProfileImage;
