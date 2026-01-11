import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  Button,
  View,
  Pressable,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../state/auth';
import { apiCall } from '../../lib/api';

const Checkbox = ({ label, value, onValueChange }) => (
  <Pressable style={formStyles.checkboxContainer} onPress={() => onValueChange(!value)}>
    <View style={[formStyles.checkbox, value && formStyles.checkboxChecked]}>
      {value && <Ionicons name="checkmark" size={16} color="white" />}
    </View>
    <Text>{label}</Text>
  </Pressable>
);

export const AddProductForm = ({ visible, onClose, onProductAdded }) => {
    const [product, setProduct] = useState({
      name: '',
      description: '',
      brand: '',
      category: '',
      tags: '',
      basePrice: '',
    });
    
    const [variants, setVariants] = useState([{ color: '', sizes: '', stock: {}, images: [], price: '' }]);
    const [isUploading, setIsUploading] = useState(false);
    const { token } = useAuthStore();
  
    const addVariant = () => {
      setVariants(prev => [...prev, { color: '', sizes: '', stock: {}, images: [], price: '' }]);
    };
  
    const handleVariantImagePick = async (variantIndex) => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 1,
      });
  
      if (!result.canceled) {
        setIsUploading(true);
        const uploadedUrls = [];
        for (const asset of result.assets) {
          const formData = new FormData();
          const uriParts = asset.uri.split('.');
          const fileType = uriParts[uriParts.length - 1];
  
          formData.append('image', {
            uri: asset.uri,
            name: `photo.${fileType}`,
            type: `image/${fileType}`,
          });
  
          try {
            const res = await apiCall('/api/upload', {
              method: 'POST',
              body: formData,
              headers: { 
                'Content-Type': 'multipart/form-data',
              },
            });
            if (res.url) {
              uploadedUrls.push(res.url);
            } else {
              Alert.alert('Upload Failed', res.message || 'Could not upload image.');
            }
          } catch (error) {
            Alert.alert('Upload Error', 'An error occurred while uploading.');
          }
        }
        const newVariants = [...variants];
        newVariants[variantIndex].images.push(...uploadedUrls);
        setVariants(newVariants);
        setIsUploading(false);
      }
    };
  
    const handleVariantChange = (index, field, value) => {
      const newVariants = [...variants];
      newVariants[index][field] = value;
      if (field === 'sizes') {
        const sizesArray = value.split(',').map(s => s.trim()).filter(Boolean);
        const newStock = {};
        sizesArray.forEach(size => {
          newStock[size] = newVariants[index].stock[size] || '0';
        });
        newVariants[index].stock = newStock;
      }
      setVariants(newVariants);
    };
    
    const handleStockChange = (variantIndex, size, value) => {
      const newVariants = [...variants];
      newVariants[variantIndex].stock[size] = value;
      setVariants(newVariants);
    };
  
    const handleSubmit = async () => {
      if (variants.length === 0 || variants.some(v => !v.color || !v.sizes)) {
        Alert.alert('Error', 'Please add at least one variant with a color and sizes.');
        return;
      }
  
      const allVariantImages = variants.flatMap(v => v.images);
  
      let productData = {
        ...product,
        basePrice: parseFloat(product.basePrice),
        tags: product.tags.split(',').map(t => t.trim()),
        images: allVariantImages,
        options: [],
        variants: [],
      };
      
      if (productData.sku === '') {
        delete productData.sku;
      }
  
      const allColors = variants.map(v => v.color).filter(Boolean);
      const allSizes = [...new Set(variants.flatMap(v => v.sizes.split(',').map(s => s.trim()).filter(Boolean)))];
      
      if (allColors.length > 0) {
        productData.options.push({ name: 'Color', values: allColors });
      }
      if (allSizes.length > 0) {
        productData.options.push({ name: 'Size', values: allSizes });
      }
  
      variants.forEach(variant => {
        const sizes = variant.sizes.split(',').map(s => s.trim()).filter(Boolean);
        sizes.forEach(size => {
          const newVariant = {
            options: { Color: variant.color, Size: size },
            stock: parseInt(variant.stock[size] || '0', 10),
            price: parseFloat(variant.price || product.basePrice),
            images: variant.images,
          };
          productData.variants.push(newVariant);
        });
      });
  
      const result = await apiCall('/api/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
  
      if (result && !result.message) {
        onProductAdded(result);
        onClose();
      } else {
        Alert.alert('Error', result.message || 'Failed to create product.');
      }
    };
  
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <SafeAreaView style={formStyles.container}>
          <ScrollView contentContainerStyle={formStyles.content}>
            <Text style={formStyles.title}>Add New Product</Text>
            <Text style={formStyles.subcopy}>Images and variants sync instantly to the shopper feed.</Text>

            <View style={formStyles.card}>
              <Text style={formStyles.sectionTitle}>Basics</Text>
              <TextInput style={formStyles.input} placeholder="Product Name" onChangeText={v => setProduct({...product, name: v})} />
              <TextInput style={[formStyles.input, formStyles.multiline]} placeholder="Description" onChangeText={v => setProduct({...product, description: v})} multiline />
              <TextInput style={formStyles.input} placeholder="Brand" onChangeText={v => setProduct({...product, brand: v})} />
              <TextInput style={formStyles.input} placeholder="Category" onChangeText={v => setProduct({...product, category: v})} />
              <TextInput style={formStyles.input} placeholder="Tags (comma-separated)" onChangeText={v => setProduct({...product, tags: v})} />
              <TextInput style={formStyles.input} placeholder="Base Price" onChangeText={v => setProduct({...product, basePrice: v})} keyboardType="numeric" />
            </View>

            <View style={formStyles.card}>
              <Text style={formStyles.sectionTitle}>Product Variants</Text>
              {variants.map((variant, index) => (
                <View key={index} style={formStyles.variantGroup}>
                  <View style={formStyles.variantHeader}>
                    <Text style={formStyles.subtitle}>Color Variant {index + 1}</Text>
                    {variants.length > 1 && (
                      <Pressable onPress={() => setVariants(prev => prev.filter((_, i) => i !== index))}>
                        <Text style={formStyles.removeLink}>Remove</Text>
                      </Pressable>
                    )}
                  </View>
                  <TextInput style={formStyles.input} placeholder="Color Name (e.g., Red)" value={variant.color} onChangeText={v => handleVariantChange(index, 'color', v)} />
                  <TextInput style={formStyles.input} placeholder="Sizes (comma-separated, e.g., S,M,L)" value={variant.sizes} onChangeText={v => handleVariantChange(index, 'sizes', v)} />
                  <TextInput style={formStyles.input} placeholder="Variant Price (e.g., 599.99)" value={variant.price} onChangeText={v => handleVariantChange(index, 'price', v)} keyboardType="numeric" />
                  
                  <Text style={formStyles.stockTitle}>Stock for each size</Text>
                  {variant.sizes.split(',').map(s => s.trim()).filter(Boolean).map(size => (
                    <View key={size} style={formStyles.stockInputContainer}>
                      <Text style={formStyles.stockLabel}>{size}</Text>
                      <TextInput style={formStyles.stockInput} placeholder="0" value={variant.stock[size] || ''} onChangeText={v => handleStockChange(index, size, v)} keyboardType="numeric" />
                    </View>
                  ))}

                  <Text style={formStyles.subtitle}>Variant Images</Text>
                  <View style={formStyles.imagePreviewContainer}>
                    {variant.images.map((uri, imgIndex) => <Image key={imgIndex} source={{ uri }} style={formStyles.imagePreview} />)}
                  </View>
                  <Pressable style={formStyles.secondaryButton} onPress={() => handleVariantImagePick(index)}>
                    <Text style={formStyles.secondaryButtonText}>{isUploading ? 'Uploading…' : 'Add Variant Images'}</Text>
                  </Pressable>
                </View>
              ))}
              <Pressable style={formStyles.ghostButton} onPress={addVariant}>
                <Text style={formStyles.ghostButtonText}>Add Another Color</Text>
              </Pressable>
            </View>

            <View style={formStyles.actions}>
              <Pressable style={formStyles.primaryButton} onPress={handleSubmit}>
                <Text style={formStyles.primaryButtonText}>Save Product</Text>
              </Pressable>
              <Pressable style={formStyles.linkButton} onPress={onClose}>
                <Text style={formStyles.linkButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const formStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f6fb' },
    content: { padding: 16, paddingBottom: 40 },
    title: { fontSize: 24, fontFamily: 'Zaloga', color: '#0f172a', marginBottom: 6 },
    subcopy: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 10 },
    subtitle: { fontSize: 15, fontWeight: '700', color: '#0f172a', marginTop: 8, marginBottom: 8 },
    card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#e5e7eb' },
    input: { borderWidth: 1, borderColor: '#e5e7eb', padding: 12, borderRadius: 12, marginBottom: 10, backgroundColor: '#ffffff' },
    multiline: { minHeight: 80, textAlignVertical: 'top' },
    variantGroup: { borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 14, padding: 12, marginBottom: 12, backgroundColor: '#f9fafb' },
    variantHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    removeLink: { color: '#ef4444', fontWeight: '600', fontSize: 13 },
    stockTitle: { fontSize: 14, fontWeight: '600', color: '#0f172a', marginTop: 6, marginBottom: 8 },
    stockInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 10 },
    stockLabel: { width: 40, fontWeight: '600', color: '#0f172a' },
    stockInput: { flex: 1, borderWidth: 1, borderColor: '#e5e7eb', padding: 10, borderRadius: 10, backgroundColor: '#fff' },
    imagePreviewContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10, gap: 8 },
    imagePreview: { width: 74, height: 74, borderRadius: 10 },
    secondaryButton: { marginTop: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', backgroundColor: '#fff', alignItems: 'center' },
    secondaryButtonText: { color: '#0f172a', fontWeight: '700' },
    ghostButton: { paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center', marginTop: 6 },
    ghostButtonText: { color: '#007aff', fontWeight: '700' },
    actions: { gap: 10, marginTop: 10 },
    primaryButton: { backgroundColor: '#007aff', paddingVertical: 14, borderRadius: 14, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, shadowOffset: { width: 0, height: 4 } },
    primaryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    linkButton: { alignItems: 'center', paddingVertical: 8 },
    linkButtonText: { color: '#6b7280', fontWeight: '600' },
  });
