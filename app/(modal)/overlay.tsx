import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { StyleSheet, View } from "react-native";

const Overlay = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
      }}
    >
      <Entypo name="lock" size={40} color="white" />
    </View>
  );
};

export default Overlay;

const styles = StyleSheet.create({});
