import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';

interface Props {
  header?: string;
  message: string;
  mediaUri?: string;
}

export const PhoneMockPreview: React.FC<Props> = ({ header, message, mediaUri }) => {
  const { theme } = useThemeContext();
  return (
    <View style={[styles.container, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}> 
      <Text style={[styles.header, { color: theme.colors.muted }]}>{header ?? 'SparkChats Sandbox'}</Text>
      {mediaUri ? <Image source={{ uri: mediaUri }} style={styles.media} /> : null}
      <View style={[styles.bubble, { backgroundColor: theme.colors.primary }]}> 
        <Text style={{ color: '#FFFFFF', fontSize: 16 }}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 32,
    padding: 20,
    width: '100%',
    maxWidth: 320,
    alignSelf: 'center',
    gap: 12,
  },
  header: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'flex-end',
  },
  media: {
    height: 160,
    borderRadius: 16,
    width: '100%',
    backgroundColor: '#CBD5F5',
  },
});
