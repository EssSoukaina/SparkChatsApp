import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { useThemeContext } from '../theme/ThemeProvider';

type Props = {
  visible: boolean;
  title: string;
  description: string;
  primaryAction?: { label: string; onPress: () => void };
  secondaryAction?: { label: string; onPress: () => void };
  onDismiss: () => void;
};

export const ModalSheet: React.FC<Props> = ({
  visible,
  title,
  description,
  primaryAction,
  secondaryAction,
  onDismiss,
}) => {
  const { theme } = useThemeContext();
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onDismiss}>
      <Pressable style={styles.backdrop} onPress={onDismiss}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.colors.surface }]} onPress={(e) => e.stopPropagation()}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 16 }}>{description}</Text>
          <View style={styles.actions}>
            {secondaryAction ? <Button title={secondaryAction.label} variant="outline" onPress={secondaryAction.onPress} /> : null}
            {primaryAction ? <Button title={primaryAction.label} onPress={primaryAction.onPress} /> : null}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
});
