import { View, Text } from "react-native"
import React from "react"
import { Link, Slot } from "expo-router"
import "./../global.css"

const RootLayout = () => {
  return (
    <View style={{ flex: 1, width: "100%" }} className="bg-green-400">
      {/* Outlet - React */}
      <Slot />
      {/* / */}
      {/* /profile */}
      {/* /user */}
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          backgroundColor: "#e74c3c",
          padding: 50,
          justifyContent: "space-evenly"
        }}
      >
        <View style={{ backgroundColor: "#000", padding: 10 }}>
          <Link
            href={"/"}
            style={{
              color: "#fff",
              padding: 10
            }}
          >
            Home
          </Link>
        </View>
        <View
          style={{
            backgroundColor: "#000",
            padding: 10
          }}
        >
          <Link
            href={"/profile"}
            style={{
              color: "#fff",
              padding: 10
            }}
          >
            Profile
          </Link>
        </View>
        <View
          style={{
            backgroundColor: "#000",
            padding: 10
          }}
        >
          <Link
            href={"/user"}
            style={{
              color: "#fff",
              padding: 10
            }}
          >
            User
          </Link>
        </View>
      </View>
    </View>
  )
}

export default RootLayout
