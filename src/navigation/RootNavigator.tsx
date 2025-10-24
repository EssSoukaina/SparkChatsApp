import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '@clerk/clerk-expo';
import { Home as HomeIcon, MessageCircle, Megaphone, Settings as SettingsIcon, Users as UsersIcon } from 'lucide-react-native';
import { ActivityIndicator, View } from 'react-native';
import { useThemeContext } from '../theme/ThemeProvider';
import { TabBar } from '../components/TabBar';
import { AuthStackParamList, MainTabParamList, MarketingStackParamList, OnboardingStackParamList } from './types';
import { SignUpScreen } from '../features/auth/SignUpScreen';
import { VerifyEmailScreen } from '../features/auth/VerifyEmailScreen';
import { SignInScreen } from '../features/auth/SignInScreen';
import { ForgotPasswordScreen } from '../features/auth/ForgotPasswordScreen';
import { ForgotCodeScreen } from '../features/auth/ForgotCodeScreen';
import { ResetPasswordScreen } from '../features/auth/ResetPasswordScreen';
import { AuthSuccessScreen } from '../features/auth/AuthSuccessScreen';
import { PaywallScreen } from '../features/onboarding/PaywallScreen';
import { QuestionnaireScreen } from '../features/onboarding/QuestionnaireScreen';
import { AccountCreatedScreen } from '../features/onboarding/AccountCreatedScreen';
import { BusinessProfileScreen } from '../features/onboarding/BusinessProfileScreen';
import { useOnboardingStore } from '../stores/onboarding';
import { HomeScreen } from '../features/home/HomeScreen';
import { ContactsScreen } from '../features/contacts/ContactsScreen';
import { ChatsScreen } from '../features/chats/ChatsScreen';
import { MarketingHomeScreen } from '../features/marketing/MarketingHomeScreen';
import { SettingsScreen } from '../features/settings/SettingsScreen';
import { CampaignsScreen } from '../features/marketing/CampaignsScreen';
import { TemplatesScreen } from '../features/marketing/TemplatesScreen';
import { CreateCampaignScreen } from '../features/marketing/CreateCampaignScreen';
import { CampaignReviewScreen } from '../features/marketing/CampaignReviewScreen';
import { CampaignSuccessScreen } from '../features/marketing/CampaignSuccessScreen';
import { TemplateDetailScreen } from '../features/marketing/TemplateDetailScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStack = createNativeStackNavigator<OnboardingStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const MarketingStack = createNativeStackNavigator<MarketingStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="SignIn">
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="ForgotCode" component={ForgotCodeScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <AuthStack.Screen name="AuthSuccess" component={AuthSuccessScreen} />
    </AuthStack.Navigator>
  );
}

function OnboardingNavigator() {
  return (
    <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
      <OnboardingStack.Screen name="Paywall" component={PaywallScreen} />
      <OnboardingStack.Screen name="Questionnaire" component={QuestionnaireScreen} />
      <OnboardingStack.Screen name="AccountCreated" component={AccountCreatedScreen} />
      <OnboardingStack.Screen name="BusinessProfile" component={BusinessProfileScreen} />
    </OnboardingStack.Navigator>
  );
}

function MarketingNavigator() {
  return (
    <MarketingStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="MarketingHome">
      <MarketingStack.Screen name="MarketingHome" component={MarketingHomeScreen} />
      <MarketingStack.Screen name="Campaigns" component={CampaignsScreen} />
      <MarketingStack.Screen name="Templates" component={TemplatesScreen} />
      <MarketingStack.Screen name="TemplateDetail" component={TemplateDetailScreen} />
      <MarketingStack.Screen name="CreateCampaign" component={CreateCampaignScreen} />
      <MarketingStack.Screen name="CampaignReview" component={CampaignReviewScreen} />
      <MarketingStack.Screen name="CampaignSuccess" component={CampaignSuccessScreen} />
    </MarketingStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          tabBarIcon: ({ color }) => <UsersIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          tabBarIcon: ({ color }) => <MessageCircle color={color} />,
        }}
      />
      <Tab.Screen
        name="Marketing"
        component={MarketingNavigator}
        options={{
          tabBarIcon: ({ color }) => <Megaphone color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

export const RootNavigator: React.FC = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { hasSeenPaywall, businessProfile } = useOnboardingStore();
  const { theme } = useThemeContext();

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <AuthNavigator />;
  }

  if (!hasSeenPaywall || !businessProfile) {
    return <OnboardingNavigator />;
  }

  return <MainTabs />;
};
