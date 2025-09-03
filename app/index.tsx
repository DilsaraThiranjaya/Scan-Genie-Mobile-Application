import { View, Text, TextInput } from "react-native"
import React from "react"
import { Link } from "expo-router"

// <div> - <View>
// p, h1 - h6 - <Text>
// don't use text without Text tag
// not work vh, dhv use flex : 1
const Index = () => {
  return (
    <View
      style={{
        flex: 1,
        width: "100%"
        // justifyContent: "center",
        // alignItems: "center"
      }}
    >
      <Text
        style={{
          color: "#fff"
        }}
      >
        index
      </Text>
      <Text
        style={{
          color: "#fff",
          fontSize: 23
        }}
      >
        hello
      </Text>
     
      {/* <TextInput /> */}
    </View>
  )
}

export default Index
