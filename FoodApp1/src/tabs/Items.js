import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { useIsFocused, useNavigation } from '@react-navigation/native';

const Items = () => {
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [items, setItems] = useState([]);

    useEffect(() => {
        getItems();
    }, [isFocused]);

    const getItems = () => {
        firestore()
            .collection('items')
            .get()
            .then(querySnapshot => {
                let tempData = [];
                querySnapshot.forEach(documentSnapshot => {
                    tempData.push({
                        id: documentSnapshot.id,
                        data: documentSnapshot.data(),
                    });
                });
                setItems(tempData);
            })
            .catch(error => {
                console.error('Error getting items: ', error);
            });
    };

    const deleteItem = docId => {
        firestore()
            .collection('items')
            .doc(docId)
            .delete()
            .then(() => {
                console.log('Item deleted!');
                getItems();
            })
            .catch(error => {
                console.error('Error deleting item: ', error);
            });
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Items</Text>
            </View>
            <FlatList
                data={items}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemView}>
                        <Image
                            source={{ uri: item.data.imageUrl }}
                            style={styles.itemImage}
                        />
                        <View style={styles.nameView}>
                            <Text style={styles.nameText}>{item.data.name}</Text>
                            <Text style={styles.descText}>{item.data.description}</Text>
                            <View style={styles.priceView}>
                                <Text style={styles.priceText}>
                                    {item.data.discountPrice + ' Rs'}
                                </Text>
                                <Text style={styles.discountText}>
                                    {item.data.price + ' Rs'}
                                </Text>
                            </View>
                        </View>
                        <View style={{ margin: 10 }}>
                            <TouchableOpacity
                                onPress={() => {
                                    navigation.navigate('EditItem', {
                                        data: item.data,
                                        id: item.id,
                                    });
                                }}>
                                <Image
                                    source={require('../images/edit.png')}
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    deleteItem(item.id);
                                }}>
                                <Image
                                    source={require('../images/delete.png')}
                                    style={[styles.icon, { marginTop: 20 }]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
};

export default Items;

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
    itemView: {
        flexDirection: 'row',
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#fff',
        elevation: 4,
        marginTop: 10,
        borderRadius: 10,
        height: 100,
        marginBottom: 10,
    },
    itemImage: {
        width: 90,
        height: 90,
        borderRadius: 10,
        margin: 5,
    },
    nameView: {
        width: '53%',
        margin: 10,
    },
    priceView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    descText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    priceText: {
        fontSize: 18,
        color: 'green',
        fontWeight: '700',
    },
    discountText: {
        fontSize: 17,
        fontWeight: '600',
        textDecorationLine: 'line-through',
        marginLeft: 5,
        color: '#999999',
    },
    icon: {
        width: 24,
        height: 24,
    },
});
