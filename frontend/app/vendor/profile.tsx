import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { useCustomRouter } from '../../src/hooks/useCustomRouter';
import { useAuthStore } from '../../src/state/auth';
import { apiCall } from '../../src/lib/api';

export default function EditStoreProfileScreen() {
  const { user } = useAuthStore();
  const [vendor, setVendor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({});
  const router = useCustomRouter();

  const fetchVendorProfile = useCallback(async () => {
    if (user?.role !== 'vendor') return;
    setIsLoading(true);
    try {
      const data = await apiCall('/api/vendors/me');
      if (data && !data.message) {
        setVendor(data);
        setFormData(data);
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
    useCallback(() => {
      fetchVendorProfile();
    }, [fetchVendorProfile])
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleAddressChange = (field, value) => {
    setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      const updatedVendor = await apiCall('/api/vendors/me', {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      if (updatedVendor && !updatedVendor.message) {
        setVendor(updatedVendor);
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        throw new Error(updatedVendor.message || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !vendor) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={styles.centered} />
      </SafeAreaView>
    );
  }

  if (!vendor) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text>Could not load your store profile.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Store Name</Text>
          <TextInput style={styles.input} value={formData.name} onChangeText={(v) => handleInputChange('name', v)} />
          <Text style={styles.label}>Description</Text>
          <TextInput style={[styles.input, styles.textArea]} value={formData.description} onChangeText={(v) => handleInputChange('description', v)} multiline />
          <Text style={styles.label}>Phone</Text>
          <TextInput style={styles.input} value={formData.phone} onChangeText={(v) => handleInputChange('phone', v)} keyboardType="phone-pad" />
          <Text style={styles.label}>Website</Text>
          <TextInput style={styles.input} value={formData.website} onChangeText={(v) => handleInputChange('website', v)} keyboardType="url" />

          <Text style={styles.subTitle}>Address</Text>
          <TextInput style={styles.input} placeholder="Street" value={formData.address?.street} onChangeText={(v) => handleAddressChange('street', v)} />
          <TextInput style={styles.input} placeholder="City" value={formData.address?.city} onChangeText={(v) => handleAddressChange('city', v)} />
          <TextInput style={styles.input} placeholder="State" value={formData.address?.state} onChangeText={(v) => handleAddressChange('state', v)} />
          <TextInput style={styles.input} placeholder="ZIP Code" value={formData.address?.zipCode} onChangeText={(v) => handleAddressChange('zipCode', v)} />
          <TextInput style={styles.input} placeholder="Country" value={formData.address?.country} onChangeText={(v) => handleAddressChange('country', v)} />

          <Pressable style={styles.saveButton} onPress={handleSaveChanges} disabled={isLoading}>
            {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save Changes</Text>}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  form: { paddingBottom: 50 },
  label: { 
    fontSize: 16, 
    marginBottom: 8, 
    color: '#333',
    fontFamily: 'Zaloga',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  subTitle: {
    fontSize: 20,
    marginTop: 16,
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 16,
    fontFamily: 'Zaloga',
  },
  saveButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: { 
    color: '#fff', 
    fontSize: 18, 
    fontFamily: 'Zaloga',
  },
});