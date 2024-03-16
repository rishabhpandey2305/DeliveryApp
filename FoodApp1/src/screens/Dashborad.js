import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInputComponent, Image, InteractionManager } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Transactions from '../tabs/Transactions';
import Items from '../tabs/Items';
import Orders from '../tabs/Orders';
import Notification from '../tabs/Notification';
import Add from '../tabs/Add';

const Dashborad = () => {
    const [selectedTab, setSelectedTab] = useState(0);
    return (
        <View style={styles.container}>
            {selectedTab == 0 ? (<Items />) : selectedTab == 1 ? (<Transactions />) : selectedTab == 2 ? (<Add />) : selectedTab == 3 ? (<Orders />) : (<Notification />)}
            <View style={styles.bottomView}>
                <TouchableOpacity style={styles.bottomTab} onPress={() => { setSelectedTab(0); }}>
                    <Image source={require('../images/items.png')} style={[styles.bottomTabImg, { tintColor: selectedTab == 0 ? 'red' : 'black' }]}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomTab} onPress={() => { setSelectedTab(1); }}>
                    <Image source={require('../images/transaction.png')} style={[styles.bottomTabImg, { tintColor: selectedTab == 1 ? 'red' : 'black' }]}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomTab} onPress={() => { setSelectedTab(2); }}>
                    <Image source={require('../images/add.png')} style={[styles.bottomTabImg, { width: 35, height: 35 }]}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomTab} onPress={() => { setSelectedTab(3); }}>
                    <Image source={require('../images/orders.png')} style={[styles.bottomTabImg, { tintColor: selectedTab == 3 ? 'red' : 'black' }]}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomTab} onPress={() => { setSelectedTab(4); }}>
                    <Image source={require('../images/notification.png')} style={[styles.bottomTabImg, { tintColor: selectedTab == 4 ? 'red' : 'black' }]}></Image>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Dashborad;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomView: {
        width: '100%',
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        backgroundColor: '#fff',
    },
    bottomTab: {
        height: '100%',
        width: '20%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    bottomTabImg: {
        width: 24,
        height: 24,
    }
})