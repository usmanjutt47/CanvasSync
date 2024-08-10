import React, { useState } from "react";
import {
  View,
  PanResponder,
  Button,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Svg, { Polyline } from "react-native-svg";

const Whiteboard = () => {
  const [lines, setLines] = useState([]);
  const [currentLine, setCurrentLine] = useState([]);
  const [currentColor, setCurrentColor] = useState("black"); 

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      setCurrentLine([...currentLine, `${locationX},${locationY}`]);
    },
    onPanResponderRelease: () => {
      if (currentLine.length > 0) {
        setLines([...lines, { points: currentLine, color: currentColor }]);
        setCurrentLine([]);
      }
    },
  });


  const clearBoard = () => {
    setLines([]);
  };


  const undoLastAction = () => {
    setLines(lines.slice(0, -1));
  };


  const renderColorButtons = () => {
    const colors = ["black", "red", "blue", "green", "yellow"];

    return colors.map((color) => (
      <TouchableOpacity
        key={color}
        onPress={() => setCurrentColor(color)}
        style={[
          styles.colorButton,
          {
            backgroundColor: color,
            borderColor: color === currentColor ? "gray" : "transparent",
          },
        ]}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.whiteboard} {...panResponder.panHandlers}>
        <Svg style={styles.svg}>
          {lines.map((line, index) => (
            <Polyline
              key={index}
              points={line.points.join(" ")}
              stroke={line.color}
              strokeWidth="3"
              fill="none"
            />
          ))}
          {currentLine.length > 0 && (
            <Polyline
              points={currentLine.join(" ")}
              stroke={currentColor}
              strokeWidth="3"
              fill="none"
            />
          )}
        </Svg>
      </View>
      <View style={styles.controls}>
        {renderColorButtons()}
        <Button title="Undo" onPress={undoLastAction} />
        <Button title="Clear" onPress={clearBoard} />
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  whiteboard: {
    flex: 1,
  },
  svg: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  colorButton: {
    width: width * 0.08,
    height: width * 0.08,
    borderRadius: (width * 0.08) / 2, 
    marginHorizontal: width * 0.02, 
    borderWidth: 2,
  },
  controls: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 1,
  },
});

export default Whiteboard;
