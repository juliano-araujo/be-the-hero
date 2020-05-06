import React, { useEffect, useState, useMemo } from 'react';

import {
  Text,
  FlatList,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import api from '../../services/api';
import styles from './styles';
import logoImg from '../../assets/logo.png';

export default function Incident() {
  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const page = useMemo(() => {
    return Math.ceil(incidents.length / 5) + 1;
  }, [incidents]);

  async function loadIncidents() {
    if (loading || incidents.length === total) {
      return;
    }

    setLoading(true);

    const response = await api.get('/incidents', {
      params: { page },
    });

    setIncidents((prevIncidents) => [...prevIncidents, ...response.data]);

    setLoading(false);
  }

  useEffect(() => {
    async function initialLoad() {
      setLoading(true);

      const response = await api.get('/incidents');

      setTotal(Number(response.headers['x-total-count']));
      setIncidents(response.data);

      setLoading(false);
    }

    initialLoad();
  }, []);

  const navigation = useNavigation();

  function navigateToDetail(incident) {
    navigation.navigate('Detail', { incident });
  }

  function ListFooter() {
    if (!loading) {
      return null;
    }

    return <ActivityIndicator size="large" color="#E02041" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logoImg} />
        <Text style={styles.headerText}>
          Total de
          <Text style={styles.headerTextBold}> {total} casos</Text>
        </Text>
      </View>

      <Text style={styles.title}>Bem-Vindo!</Text>
      <Text style={styles.description}>
        Escolha um dos casos abaixo e salve o dia.
      </Text>

      <FlatList
        style={styles.incidentList}
        data={incidents}
        keyExtractor={(incident) => String(incident.id)}
        showsVerticalScrollIndicator={false}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.2}
        ListFooterComponent={ListFooter}
        ListFooterComponentStyle={styles.footer}
        renderItem={({ item: incident }) => (
          <View style={styles.incident}>
            <Text style={styles.incidentProperty}>ONG:</Text>
            <Text style={styles.incidentValue}>{incident.name}</Text>

            <Text style={styles.incidentProperty}>CASO:</Text>
            <Text style={styles.incidentValue}>{incident.title}</Text>

            <Text style={styles.incidentProperty}>VALOR:</Text>
            <Text style={styles.incidentValue}>
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(incident.value)}
            </Text>

            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigateToDetail(incident)}
            >
              <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
              <Feather name="arrow-right" size={16} color="#E02041" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
