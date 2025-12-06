import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Section = ({ header, children, footer }) => (
  <View style={styles.sectionContainer}>
    {header && <Text style={styles.sectionHeader}>{header.toUpperCase()}</Text>}
    <View style={styles.sectionBody}>
      {children}
    </View>
    {footer && <Text style={styles.sectionFooter}>{footer}</Text>}
  </View>
);

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  sectionHeader: {
    fontFamily: 'Zaloga',
    fontSize: 14,
    color: '#6c757d',
    paddingLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  sectionBody: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionFooter: {
    fontFamily: 'Zaloga',
    fontSize: 13,
    color: '#6c757d',
    paddingHorizontal: 16,
    marginTop: 8,
  },
});

export default Section;
