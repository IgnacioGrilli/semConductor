import React, {useCallback, useRef, useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import Control from './CronometroController';
import {displayTime} from './CronometroUtil';
import moment from "moment";

export default function Cronometro() {

    const [date, setDate] = useState(moment().format("YYYY-MM-DD"));
    const [time, setTime] = useState(0);
    const [isRunning, setRunning] = useState(false);
    const [result, setResult] = useState(0);
    const timer = useRef(null);

    const [id, setId] = useState(null);

    const [patente, setPatente, getPatente] = useState("");
    const actualPatente = useRef();
    actualPatente.current = patente;

    const [patentes, setPatentes] = useState([]);

    moment().format();

    /*  let user= {
         id:1,
         mail: "a@gmail.com",
         saldo: 12300
     } */

    useEffect(() => {
    });

    function getPatentesByUser() {
        fetch("http://if012app.fi.mdn.unp.edu.ar:28001/patentes/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {

                if (patentes.length === 0) {
                    console.log("Success:", data);
                    data.forEach(function (item) {
                        patentes.push(item.numero);
                    });
                    console.log(patentes);
                }
            });
    }

    const createRegistro = async()=> {
//        var date = moment().format("YYYY-MM-DD");
        var horaInicio = moment().format("HH:mm");

        console.log("Id antes de post:", id);
        setRunning((previousState) => !previousState)
        timer.current = setInterval(() => {
            setTime((previousTime) => previousTime + 1);
        }, 10);

        await fetch(
            "http://if012app.fi.mdn.unp.edu.ar:28001/registroPagos/new",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    patente: {
                        numero: "AAA000",
                    },
                    fecha: date,
                    conductor: {
                        id: 2,
                    },
                    horaInicio: horaInicio,
                }),
            }
        )
            .then((response) => response.json())
            .then((data) => {
                console.log("Success POST:", data);
                setId(data.uuid);
                setDate(data.fecha);
                console.log("Fecha de hoy", date);
            });
    }

    const updateRegistro = async() => {

        setRunning((previousState) => !previousState);
        setTime(0);
        clearInterval(timer.current);

        if (!id) return;

        var horaFin = moment().format("HH:mm");
        console.log("Fecha antes de put: ", date);

        fetch(
            `http://if012app.fi.mdn.unp.edu.ar:28001/registroPagos/update/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    patente: {
                        numero: "AAA000",
                    },
                    fecha: date,
                    conductor: {
                        id: 2,
                    },
                    horaFin: horaFin,
                }),
            }
        )
            .then((response) => response.json())
            .then((data) => {
                console.log("Success PUT:", data);
                setDate(data.fecha);
                console.log("Fecha despues de update:", date);
            });
    }
    /*
        const handleButtonPress = useCallback(() => {
        if (!isRunning) {


                createRegistro();

            } else {

                updateRegistro;
            }


            setRunning((previousState) => !previousState);
        }, [isRunning]);
    */

    return (
        <SafeAreaView>
            <View>
                <Text
                    style={styles.timer}
                >
                    {displayTime(time)}
                </Text>
            </View>

            <View
                style={styles.button}
            >
                <Control
                    isRunning={isRunning}
                    handleButtonPress={isRunning ? updateRegistro : createRegistro}
                    // prop={user}
                />
            </View>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({

    timer: {
        fontSize:60,
        marginTop:130,
        alignItems: 'center',
        justifyContent: 'center'
    },

    button: {
        alignItems: 'center',
        justifyContent: 'center'
    },

});