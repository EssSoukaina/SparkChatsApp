import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OnboardingStackParamList } from '../../navigation/types';
import { Radio } from '../../components/Radio';
import { Button } from '../../components/Button';
import { useThemeContext } from '../../theme/ThemeProvider';
import { useOnboardingStore } from '../../stores/onboarding';

export type QuestionnaireScreenProps = NativeStackScreenProps<OnboardingStackParamList, 'Questionnaire'>;

const steps = [
  {
    key: 'goal',
    title: 'What brings you to SparkChats?',
    options: ['Promote offers', 'Send updates', 'Automate support'],
  },
  {
    key: 'audienceSize',
    title: 'How many contacts do you plan to message?',
    options: ['Under 500', '500 - 5,000', '5,000+'],
  },
  {
    key: 'channelExperience',
    title: 'Experience with WhatsApp marketing?',
    options: ['Getting started', 'Growing steadily', 'Scaling campaigns'],
  },
] as const;

type StepKey = (typeof steps)[number]['key'];

export const QuestionnaireScreen: React.FC<QuestionnaireScreenProps> = ({ navigation }) => {
  const { theme } = useThemeContext();
  const update = useOnboardingStore((state) => state.updateQuestionnaire);
  const questionnaire = useOnboardingStore((state) => state.questionnaire);
  const [stepIndex, setStepIndex] = React.useState(0);
  const step = steps[stepIndex];
  const currentValue = questionnaire[step.key as StepKey] ?? '';

  const handleNext = () => {
    if (stepIndex === steps.length - 1) {
      navigation.navigate('AccountCreated');
    } else {
      setStepIndex((index) => index + 1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <Text style={[styles.progress, { color: theme.colors.muted }]}>Step {stepIndex + 1} of {steps.length}</Text>
      <Text style={[styles.title, { color: theme.colors.text }]}>{step.title}</Text>
      <View style={styles.options}>
        {step.options.map((option) => (
          <Radio
            key={option}
            label={option}
            selected={currentValue === option}
            onPress={() => update({ [step.key]: option })}
          />
        ))}
      </View>
      <Button title={stepIndex === steps.length - 1 ? 'Finish' : 'Next'} onPress={handleNext} disabled={!currentValue} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 24,
    justifyContent: 'center',
  },
  progress: {
    textAlign: 'center',
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  options: {
    gap: 16,
  },
});
