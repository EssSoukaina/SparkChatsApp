export type AuthStackParamList = {
  Splash: undefined;
  SignUp: undefined;
  VerifyEmail: { email: string };
  SignIn: undefined;
  ForgotPassword: undefined;
  ForgotCode: { email: string };
  ResetPassword: { email: string };
  AuthSuccess: { title: string; message: string; ctaLabel?: string; redirectTo?: keyof AuthStackParamList };
};

export type OnboardingStackParamList = {
  Paywall: undefined;
  Questionnaire: undefined;
  AccountCreated: undefined;
  BusinessProfile: undefined;
};

export type MarketingStackParamList = {
  Campaigns: undefined;
  MarketingHome: undefined;
  Templates: undefined;
  TemplateDetail: { id: string };
  CreateCampaign: undefined;
  CampaignReview: { id: string };
  CampaignSuccess: { id: string };
};

export type MainTabParamList = {
  Home: undefined;
  Contacts: undefined;
  Chats: undefined;
  Marketing: undefined;
  Settings: undefined;
};
