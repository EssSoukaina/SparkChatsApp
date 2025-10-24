import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useThemeContext } from '../theme/ThemeProvider';
import { format } from 'date-fns';

type Props = {
  label: string;
  value: Date;
  mode: 'date' | 'time';
  onChange: (date: Date) => void;
};

export const DateTimePickerField: React.FC<Props> = ({ label, value, mode, onChange }) => {
  const { theme } = useThemeContext();
  const [show, setShow] = React.useState(false);

  const handleChange = (_event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS !== 'ios') {
      setShow(false);
    }
    if (selected) {
      onChange(selected);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: theme.colors.text, fontWeight: '600', marginBottom: 6 }}>{label}</Text>
      <Pressable
        style={[styles.field, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface }]}
        onPress={() => setShow(true)}
      >
        <Text style={{ color: theme.colors.text, fontSize: 16 }}>
          {format(value, mode === 'date' ? 'PPP' : 'p')}
        </Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={value}
          mode={mode}
          onChange={handleChange}
          minimumDate={mode === 'date' ? new Date() : undefined}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  field: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 48,
  },
});
