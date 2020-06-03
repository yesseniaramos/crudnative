import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {
  TextInput,
  Headline,
  Button,
  Paragraph,
  Dialog,
  Portal,
} from 'react-native-paper';
import globalStyles from '../styles/global';
import Axios from 'axios';

const NuevoCliente = ({navigation, route}) => {
  const {guardarConsultarAPI} = route.params;

  // campo formulario

  const [nombre, guardarNombre] = useState('');
  const [telefono, guardarTelefono] = useState('');
  const [correo, guardarCorreo] = useState('');
  const [empresa, guardarEmpresa] = useState('');
  const [alerta, guardarAlerta] = useState(false);

  // detectar si estamos editando o no a un cliente

  useEffect(() => {
    if(route.params.cliente){
      const { nombre, telefono, empresa, correo } = route.params.cliente;
      guardarNombre(nombre);
      guardarTelefono(telefono);
      guardarCorreo(correo);
      guardarEmpresa(empresa);
    } else{

    }
  },[]);

  const leerNombre = text => {
    console.log('...escribiendo');
  };

  const guardarCliente = async () => {
    console.log('Guardando cliente');
    // validar
    if (
      (nombre.trim() === '' || telefono.trim() === '',
      correo.trim() === '' || empresa.trim() === '')
    ) {
      guardarAlerta(true);
      return;
    }
    console.log('guardando');

    // generar el cliente
    const cliente = {nombre, telefono, correo, empresa};

    

    if(route.params.cliente) {
      // Actualizar Cliente
      const { id } = route.params.cliente;
      cliente.id = id;
      const url = `http://localhost:3000/clientes/${id}`;
      try {
        await Axios.put(url, cliente)
      } catch(error) {
        console.log(error);
        
      }
    }else{
      // Guardar el cliente en la API
      // para android
      if (Platform === 'ios') {
        await Axios.post('http://localhost:3000/clientes', cliente)
          .then(function(response) {
            // handle success
          })
          .catch(function(error) {
            // handle error
            console.log(error);
          })
          .then(function() {
            // always executed
          });
      } else {
        // para android emulador poner la ip 10.0.2.2, si es con dispositivo físico,
        // correr el siguente comando apuntando el puerto y poner la url de localhost de la API adb reverse tcp:3000 tcp:3000
        await Axios.post('http://localhost:3000/clientes', cliente)
          .then(function(response) {
            // handle success
          })
          .catch(function(error) {
            // handle error
            console.log(error);
          }).then(function() {
            // always executed
          });
      }
    }

    //redireccionar
    navigation.navigate('Inicio');

    // Limpiar el from (opcional)

    guardarNombre('');
    guardarTelefono('');
    guardarCorreo('');
    guardarEmpresa('');

    // cambiar a true oara obtener el nuevo cliente

    guardarConsultarAPI(true);
  };

  return (
    <View style={globalStyles.contenedor}>
      <Headline style={globalStyles.titulo}>Añadir Nuevo Cliente</Headline>
      <TextInput
        label="Nombre"
        placeholder="Juan"
        onChangeText={texto => guardarNombre(texto)}
        value={nombre}
        style={styles.input}
      />
      <TextInput
        label="Teléfono"
        placeholder="632378"
        onChangeText={texto => guardarTelefono(texto)}
        value={telefono}
        style={styles.input}
      />
      <TextInput
        label="Correo"
        placeholder="juan@juan.com"
        onChangeText={texto => guardarCorreo(texto)}
        value={correo}
        style={styles.input}
      />
      <TextInput
        label="Empresa"
        placeholder="Compañía"
        onChangeText={texto => guardarEmpresa(texto)}
        value={empresa}
        style={styles.input}
      />

      <Button
        icon="pencil-circle"
        mode="outlined"
        onPress={() => guardarCliente()}>
        Guardar Cliente
      </Button>

      <Portal>
        <Dialog visible={alerta} onDismiss={() => guardarAlerta(false)}>
          <Dialog.Title>Error</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Todos los campos son obligatorios</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => guardarAlerta(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
});

export default NuevoCliente;
