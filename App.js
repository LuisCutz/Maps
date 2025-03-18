import React, { useState, useRef, useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_HEIGHT = 220;
const SPACING = 10;

export default function App() {
  const initialRegion = {
    latitude: 21.0500005,
    longitude: -86.8456237,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  };

  const [activeMarkerIndex, setActiveMarkerIndex] = useState(-1);
  const mapRef = useRef(null);
  const scrollViewRef = useRef(null);

  const pueblosMagicos = [
    {
      id: '1',
      title: 'Valladolid',
      description: 'Ciudad colonial con coloridas calles y hermosos cenotes cercanos.',
      coordinate: { latitude: 20.6890, longitude: -88.2000 },
      image: 'https://images.pexels.com/photos/12256064/pexels-photo-12256064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '2',
      title: 'Izamal',
      description: 'La ciudad amarilla, famosa por su convento franciscano y sitios arqueológicos.',
      coordinate: { latitude: 20.9297, longitude: -89.0214 },
      image: 'https://images.pexels.com/photos/13828557/pexels-photo-13828557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: '3',
      title: 'Maní',
      description: 'Pueblo histórico conocido por el auto de fe de 1562 y su excelente gastronomía.',
      coordinate: { latitude: 20.3867, longitude: -89.3933 },
      image: 'https://yucatan.travel/wp-content/uploads/2024/05/Mani%CC%81-D-1920x1080-crop.jpg',
    },
    {
      id: '4',
      title: 'Sisal',
      description: 'Puerto histórico con hermosas playas y rica biodiversidad.',
      coordinate: { latitude: 21.1667, longitude: -90.0333 },
      image: 'https://thediscoverynut.com/wp-content/uploads/2023/04/dji_fly_20230329_133408_488_1681167557967_photo-copy-2.jpg',
    },
  ];

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(initialRegion, 1000);
    }
  }, []);

  useEffect(() => {
    if (activeMarkerIndex === -1) return;

    const selectedPueblo = pueblosMagicos[activeMarkerIndex];

    mapRef.current?.animateToRegion({
      latitude: selectedPueblo.coordinate.latitude,
      longitude: selectedPueblo.coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }, 1000);

    scrollViewRef.current?.scrollTo({
      x: activeMarkerIndex * (CARD_WIDTH + SPACING),
      animated: true,
    });

  }, [activeMarkerIndex]);

  const handleCardScroll = (index) => {
    if (index !== activeMarkerIndex) {
      setActiveMarkerIndex(index);
    }
  };

  const handleMarkerPress = (index) => {
    setActiveMarkerIndex(index);
  };

  const navigateToCancun = () => {
    setActiveMarkerIndex(-1);
    mapRef.current?.animateToRegion(initialRegion, 1000);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
      >
        <Marker
          key={`ut-marker-${activeMarkerIndex === -1}`}
          coordinate={initialRegion}
          title="UT Cancún"
          description="Universidad Tecnológica de Cancún"
          pinColor={activeMarkerIndex === -1 ? '#FF0000' : '#1E88E5'}
          onPress={navigateToCancun}
        />

        {pueblosMagicos.map((pueblo, index) => (
          <Marker
            key={`${pueblo.id}-${activeMarkerIndex}`}
            coordinate={pueblo.coordinate}
            title={pueblo.title}
            description={pueblo.description}
            pinColor={activeMarkerIndex === index ? '#FF0000' : '#3498db'}
            onPress={() => handleMarkerPress(index)}
          />
        ))}
      </MapView>

      <TouchableOpacity style={styles.cancunButton} onPress={navigateToCancun}>
        <Text style={styles.cancunButtonText}>Volver a UT Cancún</Text>
      </TouchableOpacity>

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
            const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + SPACING));
            handleCardScroll(index);
          }}
        >
          {pueblosMagicos.map((pueblo, index) => (
            <TouchableOpacity
              key={pueblo.id}
              activeOpacity={0.8}
              style={[
                styles.card,
                activeMarkerIndex === index && styles.activeCard
              ]}
              onPress={() => handleCardScroll(index)}
            >
              <Image source={{ uri: pueblo.image }} style={styles.cardImage} resizeMode="cover" />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{pueblo.title}</Text>
                <Text style={styles.cardDescription}>{pueblo.description}</Text>
                <TouchableOpacity
                  style={styles.navigateButton}
                  activeOpacity={0.6}
                  onPress={() => handleCardScroll(index)}
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
  cancunButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#1E88E5',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cancunButtonText: {
    color: 'white',
    fontWeight: 'bold',
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
    borderWidth: 3,
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
