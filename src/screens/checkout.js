import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Appbar } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import { useNavigation } from '@react-navigation/native';

const departamentos = {
  Ahuachapán: [
    "Ahuachapán",
    "Apaneca",
    "Atiquizaya",
    "Concepción de Ataco",
    "El Refugio",
    "Guaymango",
    "Jujutla",
    "San Francisco Menéndez",
    "San Lorenzo",
    "San Pedro Puxtla",
    "Tacuba",
    "Turín",
  ],
  Santa_Ana: [
    "Candelaria de la Frontera",
    "Chalchuapa",
    "Coatepeque",
    "El Congo",
    "El Porvenir",
    "Masahuat",
    "Metapán",
    "San Antonio Pajonal",
    "San Sebastián Salitrillo",
    "Santa Ana",
    "Santa Rosa Guachipilín",
    "Santiago de la Frontera",
    "Texistepeque",
  ],
  Sonsonate: [
    "Acajutla",
    "Armenia",
    "Caluco",
    "Cuisnahuat",
    "Izalco",
    "Juayúa",
    "Nahuizalco",
    "Nahulingo",
    "Salcoatitán",
    "San Antonio del Monte",
    "San Julián",
    "Santa Catarina Masahuat",
    "Santa Isabel Ishuatán",
    "Santo Domingo Guzmán",
    "Sonsonate",
    "Sonzacate",
  ],
  Chalatenango: [
    "Agua Caliente",
    "Arcatao",
    "Azacualpa",
    "Chalatenango",
    "Comalapa",
    "Citalá",
    "Concepción Quezaltepeque",
    "Dulce Nombre de María",
    "El Carrizal",
    "El Paraíso",
    "La Laguna",
    "La Palma",
    "La Reina",
    "Las Vueltas",
    "Nueva Concepción",
    "Nueva Trinidad",
    "Nombre de Jesús",
    "Ojos de Agua",
    "Potonico",
    "San Antonio de la Cruz",
    "San Antonio Los Ranchos",
    "San Fernando",
    "San Francisco Lempa",
    "San Francisco Morazán",
    "San Ignacio",
    "San Isidro Labrador",
    "San José Cancasque",
    "San José Las Flores",
    "San Luis del Carmen",
    "San Miguel de Mercedes",
    "San Rafael",
    "Santa Rita",
    "Tejutla",
  ],
  Cuscatlán: [
    "Candelaria",
    "Cojutepeque",
    "El Carmen",
    "El Rosario",
    "Monte San Juan",
    "Oratorio de Concepción",
    "San Bartolomé Perulapía",
    "San Cristóbal",
    "San José Guayabal",
    "San Pedro Perulapán",
    "San Rafael Cedros",
    "San Ramón",
    "Santa Cruz Analquito",
    "Santa Cruz Michapa",
    "Suchitoto",
    "Tenancingo",
  ],
  San_Salvador: [
    "Aguilares",
    "Apopa",
    "Ayutuxtepeque",
    "Cuscatancingo",
    "Ciudad Delgado",
    "El Paisnal",
    "Guazapa",
    "Ilopango",
    "Mejicanos",
    "Nejapa",
    "Panchimalco",
    "Rosario de Mora",
    "San Marcos",
    "San Martín",
    "San Salvador",
    "Santiago Texacuangos",
    "Santo Tomás",
    "Soyapango",
    "Tonacatepeque",
  ],
  La_Libertad: [
    "Antiguo Cuscatlán",
    "Chiltiupán",
    "Ciudad Arce",
    "Colón",
    "Comasagua",
    "Huizúcar",
    "Jayaque",
    "Jicalapa",
    "La Libertad",
    "Santa Tecla",
    "Nuevo Cuscatlán",
    "San Juan Opico",
    "Quezaltepeque",
    "Sacacoyo",
    "San José Villanueva",
    "San Matías",
    "San Pablo Tacachico",
    "Talnique",
    "Tamanique",
    "Teotepeque",
    "Tepecoyo",
    "Zaragoza",
  ],
  San_Vicente: [
    "Apastepeque",
    "Guadalupe",
    "San Cayetano Istepeque",
    "San Esteban Catarina",
    "San Ildefonso",
    "San Lorenzo",
    "San Sebastián",
    "San Vicente",
    "Santa Clara",
    "Santo Domingo",
    "Tecoluca",
    "Tepetitán",
    "Verapaz",
  ],
  Cabañas: [
    "Cinquera",
    "Dolores",
    "Guacotecti",
    "Ilobasco",
    "Jutiapa",
    "San Isidro",
    "Sensuntepeque",
    "Tejutepeque",
    "Victoria",
  ],
  La_Paz: [
    "Cuyultitán",
    "El Rosario",
    "Jerusalén",
    "Mercedes La Ceiba",
    "Olocuilta",
    "Paraíso de Osorio",
    "San Antonio Masahuat",
    "San Emigdio",
    "San Francisco Chinameca",
    "San Juan Nonualco",
    "San Juan Talpa",
    "San Juan Tepezontes",
    "San Luis Talpa",
    "San Luis La Herradura",
    "San Miguel Tepezontes",
    "San Pedro Masahuat",
    "San Pedro Nonualco",
    "San Rafael Obrajuelo",
    "Santa María Ostuma",
    "Santiago Nonualco",
    "Tapalhuaca",
    "Zacatecoluca",
  ],
  Usulután: [
    "Alegría",
    "Berlín",
    "California",
    "Concepción Batres",
    "El Triunfo",
    "Ereguayquín",
    "Estanzuelas",
    "Jiquilisco",
    "Jucuapa",
    "Jucuarán",
    "Mercedes Umaña",
    "Nueva Granada",
    "Ozatlán",
    "Puerto El Triunfo",
    "San Agustín",
    "San Buenaventura",
    "San Dionisio",
    "San Francisco Javier",
    "Santa Elena",
    "Santa María",
    "Santiago de María",
    "Tecapán",
    "Usulután",
  ],
  San_Miguel: [
    "Carolina",
    "Chapeltique",
    "Chinameca",
    "Chirilagua",
    "Ciudad Barrios",
    "Comacarán",
    "El Tránsito",
    "Lolotique",
    "Moncagua",
    "Nueva Guadalupe",
    "Nuevo Edén de San Juan",
    "Quelepa",
    "San Antonio del Mosco",
    "San Gerardo",
    "San Jorge",
    "San Luis de la Reina",
    "San Miguel",
    "San Rafael Oriente",
    "Sesori",
    "Uluazapa",
  ],
  Morazán: [
    "Arambala",
    "Cacaopera",
    "Chilanga",
    "Corinto",
    "Delicias de Concepción",
    "El Divisadero",
    "El Rosario",
    "Gualococti",
    "Guatajiagua",
    "Joateca",
    "Jocoaitique",
    "Jocoro",
    "Lolotiquillo",
    "Meanguera",
    "Osicala",
    "Perquín",
    "San Carlos",
    "San Fernando",
    "San Francisco Gotera",
    "San Isidro",
    "San Simón",
    "Sensembra",
    "Sociedad",
    "Torola",
    "Yamabal",
    "Yoloaiquín",
  ],
  La_Union: [
    "Anamorós",
    "Bolívar",
    "Concepción de Oriente",
    "Conchagua",
    "El Carmen",
    "El Sauce",
    "Intipucá",
    "La Unión",
    "Lislique",
    "Meanguera del Golfo",
    "Nueva Esparta",
    "Pasaquina",
    "Polorós",
    "San Alejo",
    "San José",
    "Santa Rosa de Lima",
    "Yayantique",
    "Yucuaiquín",
  ],
};


export default function CheckoutScreen() {
  const [telefono, setTelefono] = useState('');
  const [numeroCasa, setNumeroCasa] = useState('');
  const [indicaciones, setIndicaciones] = useState('');
  const [departamento, setDepartamento] = useState(null);
  const [municipio, setMunicipio] = useState(null);
  const navigation = useNavigation();

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#0c133f' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Información del Pedido" color="#fff" />
      </Appbar.Header>

      <ScrollView style={styles.container}>
        <Text style={styles.title}>Detalles de Entrega</Text>

        <TextInput
          label="Número de Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Número de Casa / Apartamento / Piso"
          value={numeroCasa}
          onChangeText={setNumeroCasa}
          style={styles.input}
          mode="outlined"
        />

        <TextInput
          label="Indicaciones para la entrega"
          value={indicaciones}
          onChangeText={setIndicaciones}
          multiline
          numberOfLines={3}
          style={styles.input}
          mode="outlined"
        />

        <Text style={styles.label}>Departamento</Text>
        <RNPickerSelect
          onValueChange={(value) => {
            setDepartamento(value);
            setMunicipio(null);
          }}
          items={Object.keys(departamentos).map((dep) => ({
            label: dep,
            value: dep,
          }))}
          placeholder={{ label: 'Seleccione un departamento...', value: null }}
          style={pickerSelectStyles}
          value={departamento}
        />

        {departamento && (
          <>
            <Text style={styles.label}>Municipio</Text>
            <RNPickerSelect
              onValueChange={(value) => setMunicipio(value)}
              items={departamentos[departamento].map((mun) => ({
                label: mun,
                value: mun,
              }))}
              placeholder={{ label: 'Seleccione un municipio...', value: null }}
              style={pickerSelectStyles}
              value={municipio}
            />
          </>
        )}

        <Button
          mode="contained"
          onPress={() => {
            console.log({
              telefono,
              numeroCasa,
              indicaciones,
              departamento,
              municipio,
            });
          }}
          style={styles.button}
          buttonColor="#0c133f"
        >
          Confirmar Dirección
        </Button>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#0c133f',
  },
  input: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: '#0c133f',
  },
  button: {
    marginTop: 30,
  },
});

const pickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#0c133f',
    borderRadius: 4,
    color: '#000',
    paddingRight: 30,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#0c133f',
    borderRadius: 4,
    color: '#000',
    paddingRight: 30,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
};
