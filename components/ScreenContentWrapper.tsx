import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ThemedText } from './ThemedText';

interface ScreenContentWrapperProps {
  children: ReactNode;
  style?: ViewStyle;
}

/**
 * A wrapper component that ensures all text is properly wrapped in a Text component
 * This fixes the error: "Text strings must be rendered within a <Text> component"
 */
export function ScreenContentWrapper({ children, style }: ScreenContentWrapperProps) {
  // Process children to ensure text strings are wrapped in Text components
  const processChildren = (child: ReactNode): ReactNode => {
    // If the child is a string or number, wrap it in ThemedText
    if (typeof child === 'string' || typeof child === 'number') {
      return <ThemedText>{child}</ThemedText>;
    }
    
    // Return other types of children as they are
    return child;
  };

  return (
    <View style={[styles.container, style]}>
      {React.Children.map(children, child => processChildren(child))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 