import type { AxiosRequestConfig } from 'axios';
import {
  mockCampaigns,
  mockContacts,
  mockConversations,
  mockNotifications,
  mockOrg,
  mockTemplates,
  mockUser,
  type MockCampaign,
  type MockContact,
  type MockConversation,
  type MockConversationMessage,
  type MockOrg,
  type MockTemplate,
  type MockUser,
} from './data';

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

type StoreState = {
  user: MockUser;
  org: MockOrg;
  contacts: MockContact[];
  templates: MockTemplate[];
  campaigns: MockCampaign[];
  conversations: MockConversation[];
  notifications: typeof mockNotifications;
};

class MockApi {
  private state: StoreState;

  constructor() {
    this.state = {
      user: clone(mockUser),
      org: clone(mockOrg),
      contacts: clone(mockContacts),
      templates: clone(mockTemplates),
      campaigns: clone(mockCampaigns),
      conversations: clone(mockConversations),
      notifications: clone(mockNotifications),
    };
  }

  async handle(method: Method, url: string, config: AxiosRequestConfig) {
    switch (true) {
      case url.startsWith('/auth/signup'):
        return this.signup(config);
      case url.startsWith('/auth/login'):
        return this.login(config);
      case url.startsWith('/auth/verifyEmail'):
        return { success: true };
      case url.startsWith('/auth/forgot'):
        return { success: true };
      case url.startsWith('/auth/reset'):
        return { success: true };
      case url.startsWith('/auth/changeEmail'):
        return this.changeEmail(config);
      case url.startsWith('/auth/me'):
        return { user: this.state.user, org: this.state.org };
      case url.startsWith('/org/update'):
        return this.updateOrg(config);
      case url.startsWith('/org'):
        return { org: this.state.org };
      case url.startsWith('/subscriptions/checkout'):
        return this.checkout();
      case url.startsWith('/subscriptions'):
        return { plan: this.state.user.subscribed ? 'pro' : 'trial', subscribed: this.state.user.subscribed };
      case url.startsWith('/contacts/import'):
        return this.importContacts(config);
      case url.startsWith('/contacts/update'):
        return this.updateContact(config);
      case url.startsWith('/contacts'):
        return this.searchContacts(config);
      case url.startsWith('/templates/'):
        return this.getTemplate(url.split('/').pop() as string);
      case url.startsWith('/templates'):
        return { templates: this.state.templates };
      case url.startsWith('/campaigns/send'):
        return this.sendCampaign(config);
      case url.startsWith('/campaigns/stats'):
        return this.campaignStats(config);
      case url.startsWith('/campaigns/duplicate'):
        return this.duplicateCampaign(config);
      case url.startsWith('/campaigns/export'):
        return { url: 'https://mock.sparkchats.app/export/campaign.csv' };
      case url.startsWith('/campaigns/'):
        return this.getCampaign(url.split('/').pop() as string);
      case url.startsWith('/campaigns'):
        return { campaigns: this.state.campaigns };
      case url.startsWith('/messaging/send'):
        return this.sendMessage(config);
      case url.startsWith('/messaging/conversation'):
        return this.getConversation(url.split('/').pop() as string);
      case url.startsWith('/messaging/list'):
        return { conversations: this.state.conversations };
      case url.startsWith('/notifications/markRead'):
        return this.markNotifications();
      case url.startsWith('/notifications'):
        return { notifications: this.state.notifications };
      default:
        return {};
    }
  }

  private parseBody(config: AxiosRequestConfig) {
    if (!config.data) return {};
    if (typeof config.data === 'string') {
      try {
        return JSON.parse(config.data);
      } catch (error) {
        return {};
      }
    }
    return config.data as Record<string, any>;
  }

  private signup(config: AxiosRequestConfig) {
    const body = this.parseBody(config);
    this.state.user = {
      ...this.state.user,
      name: body.name ?? this.state.user.name,
      email: body.email ?? this.state.user.email,
    };
    return { user: this.state.user };
  }

  private login(config: AxiosRequestConfig) {
    const body = this.parseBody(config);
    if (body.email === this.state.user.email) {
      return { user: this.state.user };
    }
    return { user: this.state.user };
  }

  private changeEmail(config: AxiosRequestConfig) {
    const body = this.parseBody(config);
    this.state.user.email = body.email ?? this.state.user.email;
    return { user: this.state.user };
  }

  private updateOrg(config: AxiosRequestConfig) {
    const body = this.parseBody(config);
    this.state.org = { ...this.state.org, ...body };
    return { org: this.state.org };
  }

  private checkout() {
    this.state.user = { ...this.state.user, role: 'admin', subscribed: true };
    return { plan: 'pro', subscribed: true };
  }

  private searchContacts(config: AxiosRequestConfig) {
    const body = this.parseBody(config);
    const query = (body?.query ?? '').toLowerCase();
    const tags: string[] = body?.tags ?? [];
    const filtered = this.state.contacts.filter((contact) => {
      const matchesQuery = !query || contact.name.toLowerCase().includes(query) || contact.phone.includes(query);
      const matchesTags = tags.length === 0 || tags.some((tag) => contact.tags.includes(tag));
      return matchesQuery && matchesTags;
    });
    return { contacts: filtered };
  }

  private updateContact(config: AxiosRequestConfig) {
    const body = this.parseBody(config);
    const index = this.state.contacts.findIndex((c) => c.id === body.id);
    if (index >= 0) {
      this.state.contacts[index] = { ...this.state.contacts[index], ...body };
    }
    return { contact: this.state.contacts[index] };
  }

  private importContacts(config: AxiosRequestConfig) {
    const body = this.parseBody(config);
    const rows: MockContact[] = body.rows ?? [];
    const existingPhones = new Set(this.state.contacts.map((c) => c.phone));
    const added: MockContact[] = [];
    const skipped: MockContact[] = [];

    rows.forEach((row) => {
      if (existingPhones.has(row.phone)) {
        skipped.push(row);
        return;
      }
      this.state.contacts.push(row);
      added.push(row);
      existingPhones.add(row.phone);
    });

    return {
      added: added.length,
      skipped: skipped.length,
      updated: 0,
      errors: skipped.map((contact) => ({
        contact,
        reason: 'Duplicate phone',
      })),
    };
  }

  private getTemplate(id: string) {
    const template = this.state.templates.find((item) => item.id === id);
    return { template };
  }

  private createCampaign(body: any) {
    const campaign: MockCampaign = {
      id: `c${this.state.campaigns.length + 1}`,
      name: body.name,
      templateId: body.templateId,
      schedule: body.schedule,
      status: body.schedule ? 'pending' : 'sending',
      stats: {
        sent: body.schedule ? 0 : body.selectedContacts.length,
        delivered: body.schedule ? 0 : Math.round(body.selectedContacts.length * 0.95),
        read: body.schedule ? 0 : Math.round(body.selectedContacts.length * 0.7),
        failed: body.schedule ? 0 : Math.round(body.selectedContacts.length * 0.05),
        ctr: body.schedule ? 0 : 0.12,
      },
      timeline: body.schedule
        ? []
        : [
            {
              t: new Date().toISOString(),
              sent: body.selectedContacts.length,
              delivered: Math.round(body.selectedContacts.length * 0.95),
              read: Math.round(body.selectedContacts.length * 0.7),
              failed: Math.round(body.selectedContacts.length * 0.05),
            },
          ],
    };
    this.state.campaigns.unshift(campaign);
    return campaign;
  }

  private sendCampaign(config: AxiosRequestConfig) {
    const body = this.parseBody(config);
    const campaign = this.createCampaign(body);
    return { campaign };
  }

  private getCampaign(id: string) {
    const campaign = this.state.campaigns.find((item) => item.id === id);
    return { campaign };
  }

  private campaignStats(config: AxiosRequestConfig) {
    const body = this.parseBody(config);
    const campaign = this.state.campaigns.find((item) => item.id === body.id);
    if (!campaign) return { campaign: null };
    return { stats: campaign.stats, timeline: campaign.timeline };
  }

  private duplicateCampaign(config: AxiosRequestConfig) {
    const body = this.parseBody(config);
    const campaign = this.state.campaigns.find((item) => item.id === body.id);
    if (!campaign) return { campaign: null };
    const duplicate = {
      ...clone(campaign),
      id: `c${this.state.campaigns.length + 1}`,
      name: `${campaign.name} Copy`,
      status: 'pending' as const,
    };
    this.state.campaigns.unshift(duplicate);
    return { campaign: duplicate };
  }

  private getConversation(id: string) {
    const conversation = this.state.conversations.find((conv) => conv.id === id);
    return { conversation };
  }

  private sendMessage(config: AxiosRequestConfig) {
    const body = this.parseBody(config);
    const conversation = this.state.conversations.find((conv) => conv.id === body.conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    const message: MockConversationMessage = {
      id: `msg-${Date.now()}`,
      authorId: 'u1',
      body: body.body,
      createdAt: new Date().toISOString(),
      status: 'sending',
      mediaUrl: body.mediaUrl,
    };
    conversation.messages.push(message);
    conversation.unread = 0;
    return { message };
  }

  private markNotifications() {
    this.state.notifications = this.state.notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    return { notifications: this.state.notifications };
  }
}

export const mockApi = new MockApi();
