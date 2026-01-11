import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { AddProductForm } from '../../src/components/vendor/AddProductForm';
import { VendorHeader } from '../../src/components/vendor/Header';
import { useCustomRouter } from '../../src/hooks/useCustomRouter';

// Simple wrapper to expose the vendor product creation flow as its own route.
export default function VendorAddProductScreen() {
  const router = useCustomRouter();
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    router.back();
  };

  const handleProductAdded = () => {
    Alert.alert('Product created', 'Your product is now live for shoppers.', [
      { text: 'OK', onPress: () => router.replace('/(vendor-tabs)/products') },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <VendorHeader title="Add Product" onBack={router.back} />
      <AddProductForm
        visible={visible}
        onClose={handleClose}
        onProductAdded={handleProductAdded}
      />
    </View>
  );
}
