import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../theme/colors';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

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
  const [selectedType, setSelectedType] = useState(PROBLEM_TYPES[0]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigation.goBack(); // Go back to feed after submit
    }, 1000);
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
        
        <Input 
          label="Bairro ou Rua"
          placeholder="Ex: Av. Paulista"
          value={location}
          onChangeText={setLocation}
        />

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
    marginBottom: 24,
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
  spacer: {
    height: 32,
  }
});
