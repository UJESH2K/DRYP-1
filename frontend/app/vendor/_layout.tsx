import { Stack } from 'expo-router';
import React from 'react';

export default function VendorStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="profile" options={{ headerShown: true, title: 'Edit Store Profile' }} />
      <Stack.Screen name="settings" options={{ headerShown: true, title: 'Settings' }} />
    </Stack>
  );
}
