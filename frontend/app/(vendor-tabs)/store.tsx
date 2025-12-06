import React from 'react';
import { useFocusEffect } from 'expo-router';
import { apiCall } from '../../src/lib/api';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  StatusBar,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCustomRouter } from '../../src/hooks/useCustomRouter';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../src/state/auth';
import { useToastStore } from '../../src/state/toast';
import Section from '../../src/components/common/Section';
import Row from '../../src/components/common/Row';

export default function VendorStoreScreen() {
  const router = useCustomRouter();
  const { user, logout } = useAuthStore();
  const showToast = useToastStore((state) => state.showToast);
  const [vendor, setVendor] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchVendorProfile = React.useCallback(async () => {
    if (user?.role !== 'vendor') return;
    setIsLoading(true);
    try {
      const data = await apiCall('/api/vendors/me');
      if (data && !data.message) {
        setVendor(data);
      } else {
        throw new Error(data.message || 'Failed to fetch store profile');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      fetchVendorProfile();
    }, [fetchVendorProfile])
  );

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
          showToast('You have been logged out successfully.', 'success');
        },
      },
    ]);
  };
  
  const storeItems = [
    { id: 'profile', title: 'Edit Store Profile', icon: <Ionicons name="storefront-outline" size={22} color="#333" />, onPress: () => router.push('/vendor/profile') },
    { id: 'settings', title: 'Settings', icon: <Ionicons name="settings-outline" size={22} color="#333" />, onPress: () => router.push('/vendor/settings') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Store</Text>
        </View>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <View style={styles.profileDetails}>
            <Image
              style={styles.logo}
              source={vendor.logo ? { uri: vendor.logo } : require('../../assets/casa_denim.jpg')}
            />
            <Text style={styles.vendorName}>{vendor.name}</Text>
            <Text style={styles.vendorDescription}>{vendor.description}</Text>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={20} color="#555" />
              <Text style={styles.infoText}>{vendor.phone}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="globe-outline" size={20} color="#555" />
              <Text style={styles.infoText}>{vendor.website}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color="#555" />
              <Text style={styles.infoText}>{`${vendor.address.street}, ${vendor.address.city}, ${vendor.address.state}`}</Text>
            </View>
          </View>
        )}

        <Section header="Manage Store">
          {storeItems.map((item, index) => <Row key={item.id} {...item} isFirst={index === 0} isLast={index === storeItems.length - 1} />)}
        </Section>
        
        <Section>
            <Row title="Logout" onPress={handleLogout} isFirst isLast isDestructive />
        </Section>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 150,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontFamily: 'Zaloga',
    fontSize: 28,
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  profileDetails: { 
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    backgroundColor: '#e0e0e0',
  },
  vendorName: { 
    fontSize: 24, 
    marginBottom: 8,
    fontFamily: 'Zaloga',
  },
  vendorDescription: { 
    fontSize: 16, 
    color: '#666', 
    textAlign: 'center', 
    marginBottom: 24,
    fontFamily: 'Zaloga',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  infoText: { 
    fontSize: 16, 
    marginLeft: 12,
    fontFamily: 'Zaloga',
  },
});
