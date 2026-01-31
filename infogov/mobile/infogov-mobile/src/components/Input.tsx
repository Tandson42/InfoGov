/**
 * Componente de Input Reutilizável
 */

import React, { forwardRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

const Input = forwardRef<TextInput, InputProps>(
  ({ label, error, icon, style, ...rest }, ref) => {
    return (
      <View style={styles.container}>
        {label && <Text style={styles.label}>{label}</Text>}

        <View style={[styles.inputContainer, error && styles.inputError]}>
          {icon && (
            <Ionicons
              name={icon}
              size={20}
              color={theme.colors.gray[500]}
              style={styles.icon}
            />
          )}

          <TextInput
            ref={ref}
            style={[styles.input, style]}
            placeholderTextColor={theme.colors.gray[400]}
            {...rest}
          />
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default Input;

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.paper,
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
  },
  inputError: {
    borderColor: theme.colors.error.main,
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.md,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.error.main,
    marginTop: theme.spacing.xs,
  },
});
