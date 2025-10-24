import { addMinutes } from 'date-fns';

export type MockUser = {
  id: string;
  name: string;
  email: string;
  language: 'en' | 'fr' | 'ar';
  role: 'user' | 'admin';
  subscribed: boolean;
};

export type MockOrg = {
  id: string;
  name: string;
  businessPhone: string;
  category: string;
  wabaStatus: 'pending' | 'active' | 'disconnected';
};

export type MockContact = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tags: string[];
};

export type MockTemplate = {
  id: string;
  name: string;
  type: 'MARKETING' | 'UTILITY';
  language: string;
  variables: string[];
  mediaType?: 'image' | 'video' | 'text';
};

export type MockCampaign = {
  id: string;
  name: string;
  templateId: string;
  schedule: string;
  status: 'pending' | 'sending' | 'done' | 'failed';
  stats: {
    sent: number;
    delivered: number;
    read: number;
    failed: number;
    ctr: number;
  };
  timeline: Array<{
    t: string;
    sent: number;
    delivered: number;
    read: number;
    failed: number;
  }>;
};

export type MockConversationMessage = {
  id: string;
  authorId: string;
  body: string;
  mediaUrl?: string;
  createdAt: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
};

export type MockConversation = {
  id: string;
  name: string;
  type: 'direct' | 'group';
  participantIds: string[];
  messages: MockConversationMessage[];
  unread: number;
};

const baseTimeline = Array.from({ length: 6 }).map((_, index) => {
  const baseTime = new Date('2025-06-01T10:00:00Z');
  const time = addMinutes(baseTime, index * 15);
  const sent = 500 + index * 280;
  return {
    t: time.toISOString(),
    sent,
    delivered: Math.round(sent * 0.95),
    read: Math.round(sent * 0.66),
    failed: Math.round(sent * 0.05),
  };
});

export const mockUser: MockUser = {
  id: 'u1',
  name: 'Soukaina',
  email: 'soukaina@demo.io',
  language: 'en',
  role: 'user',
  subscribed: false,
};

export const mockOrg: MockOrg = {
  id: 'org1',
  name: 'Green Studio',
  businessPhone: '+212600000000',
  category: 'Retail',
  wabaStatus: 'pending',
};

const contactTags = ['VIP', 'New', 'Loyal'] as const;

export const mockContacts: MockContact[] = Array.from({ length: 60 }).map((_, index) => ({
  id: `contact-${index + 1}`,
  name: `Contact ${index + 1}`,
  phone: `+21260${(index + 1).toString().padStart(7, '0')}`,
  email: index % 3 === 0 ? `contact${index + 1}@demo.io` : undefined,
  tags: [contactTags[index % contactTags.length]],
}));

export const mockTemplates: MockTemplate[] = [
  {
    id: 't1',
    name: 'Limited Time Offer',
    type: 'MARKETING',
    language: 'en',
    variables: ['{{name}}', '{{discount}}'],
    mediaType: 'image',
  },
  {
    id: 't2',
    name: 'Order Update',
    type: 'UTILITY',
    language: 'en',
    variables: ['{{name}}', '{{orderId}}'],
  },
];

export const mockCampaigns: MockCampaign[] = [
  {
    id: 'c1',
    name: 'Spring Sale 2025',
    templateId: 't1',
    schedule: '2025-06-01T10:00:00Z',
    status: 'done',
    stats: {
      sent: 2200,
      delivered: 2100,
      read: 1480,
      failed: 100,
      ctr: 0.11,
    },
    timeline: baseTimeline,
  },
];

export const mockConversations: MockConversation[] = [
  {
    id: 'conv-1',
    name: 'Amal Benali',
    type: 'direct',
    participantIds: ['contact-1'],
    unread: 0,
    messages: [
      {
        id: 'msg-1',
        authorId: 'contact-1',
        body: 'Hi! Is the Spring sale still available?',
        createdAt: new Date().toISOString(),
        status: 'read',
      },
      {
        id: 'msg-2',
        authorId: 'u1',
        body: 'Hello Amal! Yes, it is available until Friday.',
        createdAt: new Date().toISOString(),
        status: 'read',
      },
    ],
  },
  {
    id: 'conv-2',
    name: 'VIP Sale Circle',
    type: 'group',
    participantIds: ['contact-2', 'contact-3', 'contact-4'],
    unread: 3,
    messages: [
      {
        id: 'msg-3',
        authorId: 'contact-2',
        body: 'Can we get early access tomorrow?',
        createdAt: new Date().toISOString(),
        status: 'delivered',
      },
    ],
  },
];

export const mockNotifications = [
  {
    id: 'n1',
    type: 'campaign',
    title: 'Campaign delivered',
    body: 'Spring Sale 2025 reached 2,100 customers.',
    read: false,
    createdAt: new Date().toISOString(),
  },
];
