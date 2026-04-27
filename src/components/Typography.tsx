import { ReactNode } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

import { colors, typography } from '@/theme';

type TypographyVariant = 'display' | 'mono' | 'label';
type TypographySize = keyof typeof typography.size;

interface TypographyProps extends TextProps {
  variant: TypographyVariant;
  size?: TypographySize;
  color?: string;
  className?: string;
  children: ReactNode;
}

const fontByVariant: Record<TypographyVariant, string> = {
  display: typography.fontFamily.display,
  mono: typography.fontFamily.mono,
  label: typography.fontFamily.label,
};

export function Typography({
  variant,
  size = 'base',
  color = colors.textPrimary,
  className,
  children,
  style,
  ...rest
}: TypographyProps) {
  return (
    <Text
      className={className}
      style={[
        styles.base,
        {
          color,
          fontFamily: fontByVariant[variant],
          fontSize: typography.size[size],
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
