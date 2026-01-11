
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../state/auth';
import { useCustomRouter } from '../../hooks/useCustomRouter';

export function VendorHeader({ title }: { title: string }) {
  const { logout } = useAuthStore();
  const router = useCustomRouter();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <View style={styles.header}>
      <View style={styles.brandMark}>
        <Text style={styles.brandInitial}>DR</Text>
      </View>
      <Text style={styles.headerTitle}>{title}</Text>
      <Pressable onPress={handleLogout} style={styles.logoutButton} accessibilityLabel="Logout">
        <Ionicons name="log-out-outline" size={24} color="#0f172a" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    gap: 12,
  },
  brandMark: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#007aff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandInitial: {
    color: '#ffffff',
    fontFamily: 'Zaloga',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    color: '#0f172a',
    letterSpacing: 0.3,
    fontFamily: 'Zaloga',
  },
  logoutButton: {
    padding: 8,
  },
});
