import React from "react";
import { Alert, Text, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

const UpdateUserProfileImage = ({ updateProfileImage }) => {
  const handleImageUpdate = () => {
    Alert.alert("Update Profile Picture", "Choose an option", [
      { text: "Camera", onPress: () => pickImage("camera") },
      { text: "Gallery", onPress: () => pickImage("gallery") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const pickImage = async (mode) => {
    try {
      let result;
      if (mode === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Camera permission is required!");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
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
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          quality: 1,
        });
      }

      if (result.canceled) {
        return;
      }

      const imageUri = result.assets[0].uri;
      updateProfileImage(imageUri);
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert(
        "Error",
        "There was an error picking the image. Please try again."
      );
    }
  };

  return (
    <TouchableOpacity onPress={handleImageUpdate}>
      <Text style={styles.updateText}>Update Profile Image</Text>
    </TouchableOpacity>
  );
};

const styles = {
  updateText: {
    fontSize: 14,
    color: "#007bff",
    marginBottom: 10,
    textDecorationLine: "underline",
  },
};

export default UpdateUserProfileImage;
