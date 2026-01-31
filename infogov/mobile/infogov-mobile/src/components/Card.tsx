/**
 * Componente de Card Reutilizável
 */

import React, { ReactNode } from 'react';
import {
  View,
  StyleSheet,
  ViewProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import theme from '../theme';

interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: 'elevated' | 'outlined' | 'flat';
  onPress?: () => void;
}

export default function Card({
  children,
  variant = 'elevated',
  onPress,
  style,
  ...rest
}: CardProps) {
  const cardStyle = [
    styles.card,
    variant === 'elevated' && [styles.elevated, theme.shadows.md],
    variant === 'outlined' && styles.outlined,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        activeOpacity={0.7}
        {...(rest as TouchableOpacityProps)}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={cardStyle} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.paper,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  elevated: {
    // Sombras aplicadas via theme.shadows.md
  },
  outlined: {
    borderWidth: 1,
    borderColor: theme.colors.divider,
  },
});
