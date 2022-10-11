import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { View, Text, StyleSheet, Button, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';

const StackScreen = () => {

    const navigation = useNavigation();

    const [patente, setPatente] = useState("");

    const validateNumero = (patente) => {
        var reg = /([A-Z]{3}[0-9]{3})|([A-Z]{2}[0-9]{3}[A-Z]{2})/
        return reg.test(patente);
    }

    const postPatenteOnPress = (patente) => {

        var date = moment()
        .format('YYYY-MM-DD');

        var hour = moment()
        .utcOffset('+00:00')
        .format('HH:mm');

        fetch('http://if012app.fi.mdn.unp.edu.ar:28001/patentes/new', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                "numero": patente          
            }),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data);
        });
    }

    const handleSubmit = () => {
        if (!validateNumero(patente)) {
            console.log("incorrecto");
        } else {
            console.log(patente);
            postPatenteOnPress(patente);
        }
    }

    return(
        <SafeAreaView>
            <View style={styles.title}>
                <Text style={styles.title}>
                Carga manual de patentes
                </Text>
                <SafeAreaView>
                    <TextInput
                        style={styles.input}
                        placeholder="Número de patente"
                        onChangeText={(text) => setPatente(text)}
                        onSubmitEditing={() => {
                            handleSubmit(patente);
                            setPatente("");
                        }}
                        autoCapitalize="characters"
                        maxLength={7}
                        value={patente}
                    />
                </SafeAreaView>
            </View>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({

    title: {
        fontSize: 30,
        color: '#000',
        padding: 12,
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    input: {
        height: 45,
        width: 250,
        marginTop: 120,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        backgroundColor: '#fff'
    },

    button: {
        backgroundColor: 'orange',
        height: 80,
        width: 80,
        marginTop: 180,
        borderWidth: 1,
        padding: 10,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        color: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }

});

export default StackScreen;