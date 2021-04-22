import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Alert, Button } from "react-native";
import Constants from "expo-constants";
import TopBar from "./components/TopBar";
import axios from "axios";
import BottomBar from "./components/BottomBar";
import Swipes from "./components/Swipes";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import DetailsScreen1 from "./components/add";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  btn: {
    marginBottom: 50,
  },
  swipes: {
    flex: 1,
    padding: 10,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});

function HomeScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const swipesRef = useRef(null);

  async function fetchUsers() {
    try {
      const { data } = await axios.get(
        "https://khongduocxoaapp.herokuapp.com/getuser"
      );
      setUsers(data.user);
    } catch (error) {
      console.log(error);
      Alert.alert("Error getting users", "", [
        { text: "Retry", onPress: () => fetchUsers() },
      ]);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  function handleLike() {
    console.log("like");
    nextUser();
  }

  function handlePass() {
    console.log("pass");
    nextUser();
  }

  function nextUser() {
    const nextIndex = users.length - 2 === currentIndex ? 0 : currentIndex + 1;
    setCurrentIndex(nextIndex);
  }

  function handleLikePress() {
    swipesRef.current.openLeft();
  }
  function handlePassPress() {
    swipesRef.current.openRight();
  }
  function addUser() {
    navigation.navigate("DetailsScreen");
  }
  return (
    <View style={styles.container}>
      <TopBar />
      <View style={styles.swipes}>
        {users.length > 1 &&
          users.map(
            (u, i) =>
              currentIndex === i && (
                <Swipes
                  key={i}
                  ref={swipesRef}
                  currentIndex={currentIndex}
                  users={users}
                  handleLike={handleLike}
                  handlePass={handlePass}
                ></Swipes>
              )
          )}
      </View>
      <Button
        title="ADD"
        onPress={() => navigation.navigate("DetailsScreen")}
      />
      <BottomBar
        handleLikePress={handleLikePress}
        handlePassPress={handlePassPress}
      />
    </View>
  );
}

const Stack = createStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="DetailsScreen" component={DetailsScreen1} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
