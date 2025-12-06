import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Row = ({ title, icon, onPress, isFirst, isLast, isDestructive = false }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.row, isLast && { borderBottomWidth: 0 }, pressed && styles.rowPressed]}>
    <View style={styles.rowLeft}>
      {icon && <View style={styles.rowIcon}>{icon}</View>}
      <Text style={[styles.rowLabel, isDestructive && styles.destructiveText]}>{title}</Text>
    </View>
    {!isDestructive && <Ionicons name="chevron-forward" size={20} color="#c7c7cc" />}
  </Pressable>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 50,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c6c6c8',
    backgroundColor: '#fff',
  },
  rowPressed: {
    backgroundColor: '#f2f2f7',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  rowLabel: {
    fontFamily: 'Zaloga',
    fontSize: 17,
    color: '#000000',
  },
  destructiveText: {
    color: '#ff3b30',
    textAlign: 'center',
    flex: 1,
  },
});

export default Row;
