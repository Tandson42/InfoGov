/**
 * Componente de Botão Reutilizável
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacityProps,
} from 'react-native';
import theme from '../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
}

export default function Button({
  title,
  loading = false,
  variant = 'primary',
  size = 'medium',
  disabled,
  style,
  ...rest
}: ButtonProps) {
  const getButtonStyle = () => {
    const styles = [baseStyles.button];

    // Variantes
    if (variant === 'primary') styles.push(baseStyles.primaryButton);
    if (variant === 'secondary') styles.push(baseStyles.secondaryButton);
    if (variant === 'outline') styles.push(baseStyles.outlineButton);
    if (variant === 'danger') styles.push(baseStyles.dangerButton);

    // Tamanhos
    if (size === 'small') styles.push(baseStyles.smallButton);
    if (size === 'large') styles.push(baseStyles.largeButton);

    // Disabled
    if (disabled || loading) styles.push(baseStyles.disabledButton);

    return styles;
  };

  const getTextStyle = () => {
    const styles = [baseStyles.text];

    // Variantes
    if (variant === 'primary') styles.push(baseStyles.primaryText);
    if (variant === 'secondary') styles.push(baseStyles.secondaryText);
    if (variant === 'outline') styles.push(baseStyles.outlineText);
    if (variant === 'danger') styles.push(baseStyles.dangerText);

    // Tamanhos
    if (size === 'small') styles.push(baseStyles.smallText);
    if (size === 'large') styles.push(baseStyles.largeText);

    return styles;
  };

  return (
    <TouchableOpacity
      style={[...getButtonStyle(), style]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' ? theme.colors.primary.main : '#fff'}
        />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const baseStyles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.main,
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary.main,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  dangerButton: {
    backgroundColor: theme.colors.error.main,
  },
  disabledButton: {
    opacity: 0.5,
  },
  smallButton: {
    paddingVertical: theme.spacing.sm,
    minHeight: 36,
  },
  largeButton: {
    paddingVertical: theme.spacing.lg,
    minHeight: 56,
  },
  text: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  outlineText: {
    color: theme.colors.primary.main,
  },
  dangerText: {
    color: '#fff',
  },
  smallText: {
    fontSize: theme.fontSize.sm,
  },
  largeText: {
    fontSize: theme.fontSize.lg,
  },
});
