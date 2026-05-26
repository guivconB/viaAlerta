import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { reportsService } from '../../services/reports';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

type RootStackParamList = {
  ViaAlerta: undefined;
  CreateReport: undefined;
};

type CreateReportScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreateReport'>;

interface Props {
  navigation: CreateReportScreenNavigationProp;
}

const PROBLEM_TYPES = [
  'BURACO', 'SEMAFORO_QUEBRADO', 'ILUMINACAO_DEFICIENTE', 'ACIDENTE', 'OUTRO'
];

export const CreateReportScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedType, setSelectedType] = useState<any>(PROBLEM_TYPES[0]);
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState<number>(-10.9472); // Default Aracaju SE
  const [longitude, setLongitude] = useState<number>(-37.0731); // Default Aracaju SE
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  const [gpsLoading, setGpsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Proactively get location on mount
    fetchCurrentLocation();
  }, []);

  const fetchCurrentLocation = async () => {
    setGpsLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // Graceful fallback for simulator/denied permissions
        setLocationName('Av. Santos Dumont, Atalaia - Aracaju SE');
        setLatitude(-10.9788);
        setLongitude(-37.0494);
        setGpsLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);

      // Reverse geocode to get street name
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });

      if (address && address.length > 0) {
        const addr = address[0];
        const formattedAddress = `${addr.street || 'Rua sem nome'}${addr.streetNumber ? `, ${addr.streetNumber}` : ''} - ${addr.district || addr.subregion || ''}`;
        setLocationName(formattedAddress);
      } else {
        setLocationName(`Lat: ${location.coords.latitude.toFixed(4)}, Lng: ${location.coords.longitude.toFixed(4)}`);
      }
    } catch (error) {
      console.warn('GPS error, using fallback Aracaju coordinates', error);
      setLocationName('Av. Santos Dumont, Atalaia - Aracaju SE');
      setLatitude(-10.9788);
      setLongitude(-37.0494);
    } finally {
      setGpsLoading(false);
    }
  };

  const handlePickImage = async (useCamera: boolean) => {
    try {
      const permissionResult = useCamera 
        ? await ImagePicker.requestCameraPermissionsAsync() 
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permissão Necessária', 'Precisamos de acesso para anexar a foto da denúncia.');
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9],
            quality: 0.8,
          });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image selection failed', error);
      Alert.alert('Erro', 'Não foi possível capturar ou abrir a imagem.');
    }
  };

  const handleSubmit = () => {
    if (!description.trim()) {
      Alert.alert('Aviso', 'Por favor, insira uma descrição curta do problema.');
      return;
    }

    setLoading(true);
    
    // Call the shared reports service to add the report reactively
    reportsService.addReport({
      type: selectedType,
      desc: description,
      location: locationName || 'Localização aproximada',
      latitude,
      longitude,
      imageUrl: imageUri || undefined,
    });

    setTimeout(() => {
      setLoading(false);
      navigation.goBack();
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nova Denúncia</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.label}>Tipo de Problema</Text>
        <View style={styles.typeContainer}>
          {PROBLEM_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeChip,
                selectedType === type && styles.typeChipSelected
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={[
                styles.typeChipText,
                selectedType === type && styles.typeChipTextSelected
              ]}>
                {type.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input 
          label="Descrição Curta"
          placeholder="Ex: Buraco gigante na via"
          value={description}
          onChangeText={setDescription}
          maxLength={150}
        />
        
        {/* GPS location pre-filled segment */}
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View style={styles.locationTitleRow}>
              <Ionicons name="location" size={18} color={colors.primary} />
              <Text style={styles.locationLabel}>Localização Automática (GPS)</Text>
            </View>
            <TouchableOpacity onPress={fetchCurrentLocation} disabled={gpsLoading}>
              <Ionicons 
                name="refresh-circle" 
                size={24} 
                color={gpsLoading ? colors.textMuted : colors.primary} 
              />
            </TouchableOpacity>
          </View>

          {gpsLoading ? (
            <View style={styles.gpsSpinnerContainer}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.gpsLoadingText}>Obtendo sua posição exata...</Text>
            </View>
          ) : (
            <View>
              <Input 
                label="Endereço Capturado"
                placeholder="Carregando..."
                value={locationName}
                onChangeText={setLocationName}
                style={{ marginBottom: 4 }}
              />
              <Text style={styles.coordText}>
                Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </Text>
            </View>
          )}
        </View>

        {/* Media / Photo Attachment section */}
        <Text style={styles.label}>Anexar Evidência Visual</Text>
        {imageUri ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity 
              style={styles.removeImageBtn} 
              onPress={() => setImageUri(null)}
            >
              <Ionicons name="trash" size={18} color="#FFF" />
              <Text style={styles.removeText}>Remover Foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.mediaButtonsRow}>
            <TouchableOpacity 
              style={styles.mediaBtn} 
              onPress={() => handlePickImage(true)}
            >
              <Ionicons name="camera" size={24} color={colors.primary} />
              <Text style={styles.mediaBtnText}>Tirar Foto</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.mediaBtn} 
              onPress={() => handlePickImage(false)}
            >
              <Ionicons name="images" size={24} color={colors.primary} />
              <Text style={styles.mediaBtnText}>Galeria</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.spacer} />

        <Button 
          title="Publicar Alerta" 
          onPress={handleSubmit} 
          loading={loading}
          variant="danger"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    padding: 24,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  typeChip: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  typeChipSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
  },
  typeChipText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  typeChipTextSelected: {
    color: colors.primary,
  },
  locationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  coordText: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  gpsSpinnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  gpsLoadingText: {
    color: colors.textMuted,
    marginLeft: 8,
    fontSize: 14,
  },
  mediaButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  mediaBtn: {
    width: '48%',
    backgroundColor: '#1E1E1E',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 8,
  },
  imagePreviewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  imagePreview: {
    width: '100%',
    height: 180,
  },
  removeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.danger,
    paddingVertical: 12,
  },
  removeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 8,
  },
  spacer: {
    height: 16,
  }
});
