import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Button,
  Modal,
  View,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
const UselessTextInput = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number_phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("t");
  const [images, setImages] = useState("");
  const [position, setPosition] = useState("position");
  const [modal, setModal] = useState(false);
  const [enableshift, setenableShift] = useState(false);
  const sumbitdata = () => {
    fetch("https://khongduocxoaapp.herokuapp.com/add1", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        number_phone,
        username,
        password,
        images,
        position,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
      });
  };
  const pickFromGallery = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!data.cancelled) {
        let newfile = {
          uri: data.uri,
          type: `test/${data.uri.split(".")[1]}`,
          name: `test.${data.uri.split(".")[1]}`,
        };
        handleUpload(newfile);
      }
    } else {
      Alert.alert("you need to give up permission to work");
    }
  };
  const pickFromCamera = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });
      if (!data.cancelled) {
        let newfile = {
          uri: data.uri,
          type: `test/${data.uri.split(".")[1]}`,
          name: `test.${data.uri.split(".")[1]}`,
        };
        handleUpload(newfile);
      }
    } else {
      Alert.alert("you need to give up permission to work");
    }
  };

  const handleUpload = (images) => {
    const data = new FormData();
    data.append("file", images);
    data.append("upload_preset", "userapp");
    data.append("cloud_name", "fpt12d");

    fetch("https://api.cloudinary.com/v1_1/fpt12d/image/upload/", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setImages(data.url);
        setModal(false);
      })
      .catch((err) => {
        Alert.alert("error while uploading");
      });
  };

  return (
    <SafeAreaView>
      <TextInput
        lable="name"
        style={styles.input}
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <TextInput
        lable="email"
        style={styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <TextInput
        lable="number_phone"
        style={styles.input}
        onChangeText={(text) => setPhone(text)}
        value={number_phone}
      />
      <TextInput
        lable="username"
        style={styles.input}
        onChangeText={(text) => setUsername(text)}
        value={username}
      />
      <TextInput
        lable="password"
        style={styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <Button
        style={styles.inputStyle}
        icon={images == "" ? "upload" : "check"}
        mode="contained"
        theme={theme}
        onPress={() => setModal(true)}
        title="img"
      />
      <Button title="Login" onPress={() => sumbitdata()} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          setModal(false);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.modalButtonView}>
            <Button
              icon="camera"
              theme={theme}
              mode="contained"
              onPress={() => pickFromCamera()}
              title="Camera"
            />

            <Button
              icon="image-area"
              mode="contained"
              theme={theme}
              onPress={() => pickFromGallery()}
              title="gallery"
            />
          </View>
          <Button theme={theme} onPress={() => setModal(false)} title="Cand" />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  modalView: {
    position: "absolute",
    bottom: 2,
    width: "100%",
    backgroundColor: "white",
  },
  modalButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
const theme = {
  colors: {
    primary: "#006aff",
  },
};

export default UselessTextInput;
