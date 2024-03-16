import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PermissionsAndroid, Image, ScrollView, TextInput, Modal } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const Add = () => {
    const [imageData, setImageData] = useState(null);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [discountPrice, setDiscountPrice] = useState('');
    const [description, setDescription] = useState('');
    const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Cool Photo App Camera Permission',
                    message:
                        'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('You can use the camera');
                openGallery();
            } else {
                console.log('Camera permission denied');
            }
        } catch (err) {
            console.warn(err);
        }
    };

    const openGallery = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' });
        if (!result.didCancel) {
            console.log(result);
            setImageData(result);
        }
    };

    const uploadImage = async () => {
        if (!name || !price || !description) {
            setModalVisible(true); // Show modal if any field is empty
            return;
        }

        const fileName = imageData.assets[0].fileName;
        const reference = storage().ref(fileName);
        const pathToFile = imageData.assets[0].uri;

        try {
            await reference.putFile(pathToFile);
            const url = await reference.getDownloadURL();
            console.log('Image uploaded:', url);
            uploadItem(url);
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    const uploadItem = async (imageUrl) => {
        try {
            await firestore().collection('items').add({
                name,
                price,
                discountPrice,
                description,
                imageUrl,
            });
            console.log('Item added successfully!');
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Add Items</Text>
                </View>
                {imageData && (
                    <Image source={{ uri: imageData.assets[0].uri }} style={styles.imageStyle} />
                )}
                <TextInput
                    placeholder="Enter Item Name"
                    placeholderTextColor={'#999999'}
                    style={styles.inputStyle}
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    placeholder="Enter Item Price"
                    placeholderTextColor={'#999999'}
                    style={styles.inputStyle}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                />
                <TextInput
                    placeholder="Enter Item Discount Price"
                    placeholderTextColor={'#999999'}
                    style={styles.inputStyle}
                    value={discountPrice}
                    onChangeText={setDiscountPrice}
                    keyboardType="numeric"
                />
                <TextInput
                    placeholder="Enter Item Description"
                    placeholderTextColor={'#999999'}
                    style={styles.inputStyle}
                    value={description}
                    onChangeText={setDescription}
                />
                <TouchableOpacity style={styles.pickBtn} onPress={requestCameraPermission}>
                    <Text style={{ color: '#999999' }}>Pick Image From Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadBtn} onPress={uploadImage}>
                    <Text style={{ color: '#fff', alignSelf: 'center' }}>Upload Item</Text>
                </TouchableOpacity>

                {/* Modal for displaying error message */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Please fill in all fields</Text>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.buttonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    );
};

export default Add;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 60,
        width: '100%',
        backgroundColor: '#fff',
        elevation: 5,
        paddingLeft: 20,
        justifyContent: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    inputStyle: {
        width: '90%',
        height: 50,
        borderRadius: 10,
        borderWidth: 0.5,
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 30,
        alignSelf: 'center',
        color: '#000',
    },
    pickBtn: {
        width: '90%',
        height: 50,
        borderWidth: 0.5,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    uploadBtn: {
        backgroundColor: '#5246f2',
        width: '90%',
        height: 50,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 20,
        justifyContent: 'center',
        marginBottom: 70,
    },
    imageStyle: {
        width: '90%',
        height: 200,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 20,
    },
    // Modal styles
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#2196F3',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        color: '#000',
    },
});

