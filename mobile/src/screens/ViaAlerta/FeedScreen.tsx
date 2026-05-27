import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, Alert, ScrollView, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { reportsService, Report } from '../../services/reports';
import { useAuth } from '../../contexts/AuthContext';
import MapView, { Marker, Callout } from 'react-native-maps';

type RootStackParamList = {
  Home: undefined;
  ViaAlerta: undefined;
  CreateReport: undefined;
};

type FeedScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ViaAlerta'>;

interface Props {
  navigation: FeedScreenNavigationProp;
}

type FilterType = 'TODOS' | 'ACIDENTE' | 'BURACO' | 'SEMAFORO_QUEBRADO' | 'ILUMINACAO_DEFICIENTE' | 'OUTRO';

const FILTERS: { label: string; value: FilterType; icon: string }[] = [
  { label: 'Todos', value: 'TODOS', icon: 'apps' },
  { label: 'Acidentes', value: 'ACIDENTE', icon: 'car-sport' },
  { label: 'Buracos', value: 'BURACO', icon: 'warning' },
  { label: 'Semáforo', value: 'SEMAFORO_QUEBRADO', icon: 'eye-off' },
  { label: 'Iluminação', value: 'ILUMINACAO_DEFICIENTE', icon: 'bulb' },
  { label: 'Outro', value: 'OUTRO', icon: 'alert-circle' },
];

export const FeedScreen: React.FC<Props> = ({ navigation }) => {
  const { role } = useAuth();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedMapReport, setSelectedMapReport] = useState<Report | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('TODOS');
  const [refreshing, setRefreshing] = useState(false);

  const filteredReports = activeFilter === 'TODOS'
    ? reports
    : reports.filter(r => r.type === activeFilter);

  const onRefresh = async () => {
    setRefreshing(true);
    await reportsService.fetchReports();
    setRefreshing(false);
  };

  useEffect(() => {
    // Subscribe to reports updates in real-time
    const unsubscribe = reportsService.subscribe((updatedReports) => {
      setReports(updatedReports);
    });
    return unsubscribe;
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'ACIDENTE': return colors.danger;
      case 'BURACO': return colors.warning;
      case 'SEMAFORO_QUEBRADO': return colors.primary;
      case 'ILUMINACAO_DEFICIENTE': return '#8B5CF6'; // Roxo elegante
      default: return colors.textMuted;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ACIDENTE': return 'car-sport';
      case 'BURACO': return 'warning';
      case 'SEMAFORO_QUEBRADO': return 'eye-off';
      case 'ILUMINACAO_DEFICIENTE': return 'bulb';
      default: return 'alert-circle';
    }
  };

  const getFilterActiveColor = (filter: FilterType): string => {
    if (filter === 'TODOS') return colors.primary;
    return getTypeColor(filter);
  };

  const handleUpvote = (id: string) => {
    reportsService.upvote(id);
  };

  const handleResolved = (id: string) => {
    reportsService.voteResolved(id);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'Excluir Alerta',
      'Tem certeza que deseja apagar este alerta do sistema? Essa ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await reportsService.deleteReport(id);
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível excluir o alerta.');
            }
          }
        }
      ]
    );
  };

  const renderReport = ({ item }: { item: Report }) => (
    <Card style={styles.reportCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.typeBadge, { backgroundColor: getTypeColor(item.type) }]}>
          <Ionicons name={getTypeIcon(item.type) as any} size={14} color="#FFF" style={{ marginRight: 6 }} />
          <Text style={styles.typeText}>{item.type.replace('_', ' ')}</Text>
        </View>
        <View style={styles.iconRow}>
          <Ionicons name="time-outline" size={14} color={colors.textMuted} style={{ marginRight: 4 }} />
          <Text style={styles.timeText}>{item.time}</Text>
          {role === 'ADMIN' && (
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 12 }}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.reportImage} />
      )}

      <Text style={styles.descText}>{item.desc}</Text>

      <View style={[styles.iconRow, { marginBottom: 16 }]}>
        <Ionicons name="location-outline" size={16} color={colors.textMuted} style={{ marginRight: 4 }} />
        <Text style={styles.locationText}>{item.location}</Text>
      </View>

      {/* Community validation tools */}
      <View style={styles.divider} />
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.actionBtn, item.votedByMe && styles.actionBtnActive]} 
          onPress={() => handleUpvote(item.id)}
        >
          <Ionicons 
            name={item.votedByMe ? "thumbs-up" : "thumbs-up-outline"} 
            size={18} 
            color={item.votedByMe ? colors.success : colors.textMuted} 
          />
          <Text style={[styles.actionText, item.votedByMe && { color: colors.success }]}>
            Eu vi isso ({item.upvotes})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionBtn, item.resolvedByMe && styles.actionBtnActiveResolved]} 
          onPress={() => handleResolved(item.id)}
        >
          <Ionicons 
            name={item.resolvedByMe ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={18} 
            color={item.resolvedByMe ? colors.primary : colors.textMuted} 
          />
          <Text style={[styles.actionText, item.resolvedByMe && { color: colors.primary }]}>
            Resolvido ({item.resolvedVotes})
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.navigate('Início' as any)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Início</Text>
          </TouchableOpacity>

          {/* Map vs List View Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity 
              style={[styles.toggleBtn, viewMode === 'list' && styles.toggleBtnActive]}
              onPress={() => setViewMode('list')}
            >
              <Ionicons name="list" size={16} color={viewMode === 'list' ? '#FFF' : colors.textMuted} />
              <Text style={[styles.toggleText, viewMode === 'list' && styles.toggleTextActive]}>Lista</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, viewMode === 'map' && styles.toggleBtnActive]}
              onPress={() => setViewMode('map')}
            >
              <Ionicons name="map" size={16} color={viewMode === 'map' ? '#FFF' : colors.textMuted} />
              <Text style={[styles.toggleText, viewMode === 'map' && styles.toggleTextActive]}>Mapa</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.title}>Feed Via Alerta</Text>
      </View>

      {/* Filter chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTERS.map((f) => {
          const isActive = activeFilter === f.value;
          const activeColor = getFilterActiveColor(f.value);
          return (
            <TouchableOpacity
              key={f.value}
              style={[
                styles.filterChip,
                isActive && { backgroundColor: activeColor, borderColor: activeColor }
              ]}
              onPress={() => setActiveFilter(f.value)}
            >
              <Ionicons 
                name={f.icon as any} 
                size={14} 
                color={isActive ? '#FFF' : colors.textMuted}
                style={{ marginRight: 5 }}
              />
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {viewMode === 'list' ? (
        <FlatList
          data={filteredReports}
          keyExtractor={item => item.id}
          renderItem={renderReport}
          contentContainerStyle={[styles.listContainer, filteredReports.length === 0 && styles.emptyListContainer]}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="map-outline" size={64} color={colors.textMuted} style={{ marginBottom: 16 }} />
              <Text style={styles.emptyStateTitle}>Tudo certo por aqui!</Text>
              <Text style={styles.emptyStateDesc}>
                {activeFilter === 'TODOS'
                  ? 'Nenhum alerta ativo nas últimas 48h.\nSeja o primeiro a reportar um problema!'
                  : `Nenhum alerta de "${FILTERS.find(f => f.value === activeFilter)?.label}" ativo no momento.`
                }
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.mapContainer}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            initialRegion={{
              latitude: -10.9472,
              longitude: -37.0731,
              latitudeDelta: 0.12,
              longitudeDelta: 0.12,
            }}
            userInterfaceStyle="dark"
          >
            {filteredReports.map((report) => (
              <Marker
                key={report.id}
                coordinate={{ latitude: report.latitude, longitude: report.longitude }}
                pinColor={getTypeColor(report.type)}
                onPress={() => setSelectedMapReport(report)}
              >
                <Callout tooltip>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutTitle}>{report.type.replace('_', ' ')}</Text>
                    <Text style={styles.calloutDesc} numberOfLines={2}>{report.desc}</Text>
                    <Text style={styles.calloutLocation}>{report.location}</Text>
                    <Text style={styles.calloutPrompt}>Toque fora para detalhes</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

          {/* Quick detail overlay card when a marker is pressed */}
          {selectedMapReport && (
            <Card style={styles.mapReportOverlay}>
              <TouchableOpacity 
                style={styles.closeOverlayBtn} 
                onPress={() => setSelectedMapReport(null)}
              >
                <Ionicons name="close" size={20} color={colors.textMuted} />
              </TouchableOpacity>
              
              <View style={styles.cardHeader}>
                <View style={[styles.typeBadge, { backgroundColor: getTypeColor(selectedMapReport.type) }]}>
                  <Ionicons name={getTypeIcon(selectedMapReport.type) as any} size={12} color="#FFF" style={{ marginRight: 4 }} />
                  <Text style={styles.typeText}>{selectedMapReport.type.replace('_', ' ')}</Text>
                </View>
                <Text style={styles.timeText}>{selectedMapReport.time}</Text>
              </View>

              {selectedMapReport.imageUrl && (
                <Image source={{ uri: selectedMapReport.imageUrl }} style={styles.overlayImage} />
              )}

              <Text style={styles.descText} numberOfLines={2}>{selectedMapReport.desc}</Text>
              
              <View style={[styles.iconRow, { marginBottom: 12 }]}>
                <Ionicons name="location-outline" size={14} color={colors.textMuted} style={{ marginRight: 4 }} />
                <Text style={styles.locationText}>{selectedMapReport.location}</Text>
              </View>

              <View style={styles.divider} />
              <View style={styles.actionRow}>
                <TouchableOpacity 
                  style={[styles.actionBtn, selectedMapReport.votedByMe && styles.actionBtnActive]} 
                  onPress={() => handleUpvote(selectedMapReport.id)}
                >
                  <Ionicons name="thumbs-up" size={16} color={selectedMapReport.votedByMe ? colors.success : colors.textMuted} />
                  <Text style={[styles.actionText, selectedMapReport.votedByMe && { color: colors.success }]}>
                    ({selectedMapReport.upvotes})
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.actionBtn, selectedMapReport.resolvedByMe && styles.actionBtnActiveResolved]} 
                  onPress={() => handleResolved(selectedMapReport.id)}
                >
                  <Ionicons name="checkmark-circle" size={16} color={selectedMapReport.resolvedByMe ? colors.primary : colors.textMuted} />
                  <Text style={[styles.actionText, selectedMapReport.resolvedByMe && { color: colors.primary }]}>
                    ({selectedMapReport.resolvedVotes})
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        </View>
      )}

      <View style={styles.fabContainer}>
        <Button 
          title="+ Nova Denúncia" 
          onPress={() => navigation.navigate('CreateReport')} 
        />
      </View>
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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 16,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: '#333',
  },
  toggleText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  toggleTextActive: {
    color: '#FFF',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 24,
    paddingBottom: 120, // Space for the FAB
  },
  reportCard: {
    marginBottom: 16,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  timeText: {
    color: colors.textMuted,
    fontSize: 12,
  },
  reportImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  descText: {
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: 12,
    lineHeight: 22,
  },
  locationText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#262626',
    marginVertical: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    width: '48%',
    justifyContent: 'center',
  },
  actionBtnActive: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderColor: colors.success,
  },
  actionBtnActiveResolved: {
    backgroundColor: 'rgba(249, 115, 22, 0.08)',
    borderColor: colors.primary,
  },
  actionText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  mapContainer: {
    flex: 1,
  },
  calloutContainer: {
    width: 220,
    backgroundColor: '#1C1C1E',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  calloutTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  calloutDesc: {
    color: '#AAA',
    fontSize: 12,
    marginBottom: 6,
  },
  calloutLocation: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '500',
  },
  calloutPrompt: {
    color: colors.primary,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: 'bold',
  },
  mapReportOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  closeOverlayBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  overlayImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  filterScrollView: {
    maxHeight: 52,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterChipText: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#FFF',
    fontWeight: '700',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
  emptyStateTitle: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateDesc: {
    color: colors.textMuted,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  fabContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    zIndex: 99,
  }
});
