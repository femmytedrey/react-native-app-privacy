import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
      <Text style={{ color: "white" }}>Overlay</Text>
    </View>
  );
};

export default Overlay;

const styles = StyleSheet.create({});
