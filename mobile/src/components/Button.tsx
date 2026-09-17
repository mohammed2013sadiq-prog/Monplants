import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp
} from 'react-native';
import Colors from '../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'earth' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  loading = false,
  style,
  textStyle
}) => {
  const getContainerStyle = (): StyleProp<ViewStyle> => {
    const base: ViewStyle[] = [styles.container];

    // Variant style
    if (variant === 'primary') base.push(styles.primary);
    else if (variant === 'secondary') base.push(styles.secondary);
    else if (variant === 'outline') base.push(styles.outline);
    else if (variant === 'earth') base.push(styles.earth);
    else if (variant === 'danger') base.push(styles.danger);

    // Size style
    if (size === 'sm') base.push(styles.sm);
    else if (size === 'lg') base.push(styles.lg);
    else base.push(styles.md);

    if (disabled || loading) base.push(styles.disabled);

    return [base, style];
  };

  const getTextStyle = (): StyleProp<TextStyle> => {
    const base: TextStyle[] = [styles.text];

    if (variant === 'primary' || variant === 'earth' || variant === 'danger') {
      base.push(styles.textLight);
    } else if (variant === 'secondary') {
      base.push(styles.textSecondary);
    } else if (variant === 'outline') {
      base.push(styles.textOutline);
    }

    if (size === 'sm') base.push(styles.textSm);
    else if (size === 'lg') base.push(styles.textLg);

    return [base, textStyle];
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={getContainerStyle()}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'secondary' ? Colors.primary : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    gap: 8
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  md: {
    paddingVertical: 14,
    paddingHorizontal: 20
  },
  lg: {
    paddingVertical: 18,
    paddingHorizontal: 28
  },
  primary: {
    backgroundColor: Colors.primary
  },
  secondary: {
    backgroundColor: Colors.sandBeige
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary
  },
  earth: {
    backgroundColor: Colors.earthBrown
  },
  danger: {
    backgroundColor: Colors.error
  },
  disabled: {
    opacity: 0.55
  },
  text: {
    fontSize: 16,
    fontWeight: '600'
  },
  textLight: {
    color: '#FFFFFF'
  },
  textSecondary: {
    color: Colors.textPrimary
  },
  textOutline: {
    color: Colors.primary
  },
  textSm: {
    fontSize: 13
  },
  textLg: {
    fontSize: 18
  }
});

export default Button;
