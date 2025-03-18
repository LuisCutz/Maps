import React, { useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = 220;
const SPACING = 10;

export default function App() {
  const initialRegion = {
    latitude: 21.1619,
    longitude: -86.8515,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  const [region, setRegion] = useState(initialRegion);
  const [activeMarkerIndex, setActiveMarkerIndex] = useState(0);

  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);

  const pueblosMagicos = [
    {
      id: '1',
      title: 'Valladolid',
      description: 'Ciudad colonial con coloridas calles y hermosos cenotes cercanos.',
      coordinate: {
        latitude: 20.6890,
        longitude: -88.2000,
      },
      image: 'https://images.pexels.com/photos/12256064/pexels-photo-12256064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '2',
      title: 'Izamal',
      description: 'La ciudad amarilla, famosa por su convento franciscano y sitios arqueológicos.',
      coordinate: {
        latitude: 20.9297,
        longitude: -89.0214,
      },
      image: 'https://images.pexels.com/photos/13828557/pexels-photo-13828557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '3',
      title: 'Maní',
      description: 'Pueblo histórico conocido por el auto de fe de 1562 y su excelente gastronomía.',
      coordinate: {
        latitude: 20.3867,
        longitude: -89.3933,
      },
      image: 'https://yucatan.travel/wp-content/uploads/2024/05/Mani%CC%81-D-1920x1080-crop.jpg',
    },
    {
      id: '4',
      title: 'Sisal',
      description: 'Puerto histórico con hermosas playas y rica biodiversidad.',
      coordinate: {
        latitude: 21.1667,
        longitude: -90.0333,
      },
      image: 'https://thediscoverynut.com/wp-content/uploads/2023/04/dji_fly_20230329_133408_488_1681167557967_photo-copy-2.jpg',
    },
  ];

  // Función para navegar al lugar seleccionado
  const navigateToLocation = (index) => {
    const selectedPueblo = pueblosMagicos[index];

    // Animate map to new region
    mapRef.current?.animateToRegion({
      latitude: selectedPueblo.coordinate.latitude,
      longitude: selectedPueblo.coordinate.longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    }, 1000);

    setActiveMarkerIndex(index);

    // Scroll to the selected card
    scrollViewRef.current?.scrollTo({
      x: index * (CARD_WIDTH + SPACING),
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={initialRegion}
        region={region}
        onRegionChangeComplete={(region) => setRegion(region)}
      >
        {pueblosMagicos.map((pueblo, index) => (
          <Marker
            key={pueblo.id}
            coordinate={pueblo.coordinate}
            title={pueblo.title}
            description={pueblo.description}
            pinColor={index === activeMarkerIndex ? '#FF0000' : '#3498db'}
          />
        ))}
      </MapView>

      <View style={styles.cardsContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          snapToInterval={CARD_WIDTH + SPACING}
          snapToAlignment="center"
          contentContainerStyle={styles.scrollViewContent}
          onMomentumScrollEnd={(event) => {
            const index = Math.floor(
              event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING)
            );
            if (index !== activeMarkerIndex) {
              navigateToLocation(index);
            }
          }}
        >
          {pueblosMagicos.map((pueblo, index) => (
            <TouchableOpacity
              key={pueblo.id}
              style={[
                styles.card,
                index === activeMarkerIndex && styles.activeCard
              ]}
              onPress={() => navigateToLocation(index)}
            >
              <Image source={{ uri: pueblo.image }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{pueblo.title}</Text>
                <Text style={styles.cardDescription}>{pueblo.description}</Text>
                <TouchableOpacity
                  style={styles.navigateButton}
                  onPress={() => navigateToLocation(index)}
                >
                  <Text style={styles.navigateButtonText}>Ver en el mapa</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  cardsContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  scrollViewContent: {
    paddingHorizontal: width * 0.1,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: 'white',
    borderRadius: 10,
    marginRight: SPACING,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: '#FF0000',
  },
  cardImage: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  navigateButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  navigateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
