import {screen} from '@testing-library/dom';
import * as React from 'react';
import {renderWithConfig, suppressConsoleLogs} from 'src/react/lib/test-helper';
import {server} from 'src/react/services/mocks/mock-server';
import user from '@testing-library/user-event';
import {OutageChatSupport} from './outage-chat-suppport';
import {environment} from 'src/environments/environment';
import {rest} from 'msw';

const baseUrl = `${environment.variablesBaseUrl}/api/variables`;

beforeAll(() =>
  server.listen({
    onUnhandledRequest: 'error',
  }),
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe(`OutageSupport`, () => {
  it('can edit chat support', async () => {
    server.use(
      rest.get(`${baseUrl}/admin/variables/:id`, (_, res, ctx) => res(ctx.json(MOCK_VARIABLE))),
      rest.put(`${baseUrl}/admin/variables/:id`, (_, res, ctx) =>
        res(ctx.json(MOCK_UPDATE_VARIABLE_RESULT)),
      ),
    );

    renderWithConfig(<OutageChatSupport />);
    expect(await screen.findByText(/Maintenance override: Live chat/)).toBeVisible();
    // response has chat-off-support-on as variable options
    expect(await screen.findByText(/ON/)).toBeVisible();
    user.click(await screen.findByTestId(/edit-chat-button/));
    expect(await screen.findByText(/Edit announcement/)).toBeVisible();

    const chatToggle = (await screen.findByTestId(/chat-toggle/)) as HTMLInputElement;
    expect(chatToggle.checked).toBe(true);
    user.click(chatToggle);
    // to turn off chat outage, chat will back to normal. Display modal
    expect(
      await screen.findByText(/Are you sure you want to turn off live chat maintenance/),
    ).toBeVisible();
    user.click(await screen.findByRole('button', {name: /TURN OFF/}));
    expect(chatToggle.checked).toBe(false);
    user.click(chatToggle);
    // to turn on chat outage, chat will be in maintenance mode. Display dialog
    expect(
      await screen.findByText(/Are you sure you want to turn on Live Chat maintenance/),
    ).toBeVisible();
    user.click(await screen.findByRole('button', {name: /TURN ON/}));
    expect(chatToggle.checked).toBe(true);

    // save button should be disable if not touched
    expect(await screen.findByRole('button', {name: /SAVE CHANGES/})).toBeDisabled();

    user.click(chatToggle);
    user.click(await screen.findByRole('button', {name: /TURN OFF/}));
    user.click(await screen.findByRole('button', {name: /SAVE CHANGES/}));

    expect(await screen.findByText(/OFF/)).toBeVisible();
  });

  it(
    'should indicate error if there is no existing variable',
    suppressConsoleLogs(async () => {
      server.use(
        rest.get(`${baseUrl}/admin/variables/:id`, (_, res, ctx) =>
          res(ctx.status(404), ctx.json({})),
        ),
      );
      renderWithConfig(<OutageChatSupport />);
      expect(await screen.findByText(/Maintenance override: Live chat/)).toBeVisible();
      expect(await screen.findByText(/Variable not created/)).toBeVisible();
    }),
  );
});

const MOCK_VARIABLE = {
  version: 33,
  isArchived: false,
  _id: '611a00ee199d790013cb249d',
  key: 'app_motorist_help_centre_outage_maintenance_chat',
  name: 'Motorist Help Centre Chat Outage Maintenance and Operating Hours',
  description:
    'Variable to enable and disable chat feature on Setel Mobile app and modify operational hours',
  type: 'json',
  tags: [
    {
      key: 'support',
      value: 'support',
    },
  ],
  isToggled: false,
  group: 'app',
  state: 'ready',
  createdBy: '8b99bc77-b89e-4a6f-9e59-b5e47e8cc7b6',
  updatedBy: 'a4fb1ec8-13cc-4280-abb5-2fde814f8742',
  targets: [],
  onVariation: [
    {
      percent: 100,
      variantKey: 'chat-off-support-on',
    },
  ],
  createdAt: 1629094126,
  updatedAt: 1629340115,
  __v: 32,
  variants: {
    'chat-on-support-on': {
      key: 'chat-on-support-on',
      value: {
        description: 'Monday to Sunday, 7:00 am to 11:00 pm',
        isChatEnabled: true,
        isSupportSDKLive: true,
        displayHours: {
          startTime: '7:00 am',
          endTime: '11:00 pm',
        },
        operationalHours: [
          {
            day: 'Monday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Tuesday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Wednesday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Thursday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Friday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Saturday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Sunday',
            startTime: '07:00',
            endTime: '22:59',
          },
        ],
        supportFormMessages: {
          header: {
            en: "We're happy to help",
            ms: "We're happy to help",
            'zh-Hans': "We're happy to help",
            'zh-Hant': "We're happy to help",
          },
          description: {
            en: 'Live chat is open ',
            ms: 'Live chat is open ',
            'zh-Hans': 'Live chat is open ',
            'zh-Hant': 'Live chat is open ',
          },
          subDescription: {
            en: "Please let us know how we can help and we'll respond as soon as we can.",
            ms: "Please let us know how we can help and we'll respond as soon as we can.",
            'zh-Hans': "Please let us know how we can help and we'll respond as soon as we can.",
            'zh-Hant': "Please let us know how we can help and we'll respond as soon as we can.",
          },
          ctaText: {
            en: 'DESCRIBE YOUR ISSUE',
            ms: 'DESCRIBE YOUR ISSUE',
            'zh-Hans': 'DESCRIBE YOUR ISSUE',
            'zh-Hant': 'DESCRIBE YOUR ISSUE',
          },
        },
      },
      description: 'Configuration to be used during normal operation',
    },
    'chat-off-support-on': {
      key: 'chat-off-support-on',
      value: {
        description: 'Monday to Sunday, 7:00 am to 11:00 pm',
        isChatEnabled: false,
        isSupportSDKLive: true,
        displayHours: {
          startTime: '7:00 am',
          endTime: '11:00 pm',
        },
        operationalHours: [
          {
            day: 'Monday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Tuesday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Wednesday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Thursday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Friday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Saturday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Sunday',
            startTime: '07:00',
            endTime: '22:59',
          },
        ],
        supportFormMessages: {
          header: {
            en: 'Our Live chats are down temporarily. We are sorry!',
            ms: 'Our Live chats are down temporarily. We are sorry!',
            'zh-Hans': 'Our Live chats are down temporarily. We are sorry!',
            'zh-Hant': 'Our Live chats are down temporarily. We are sorry!',
          },
          description: {
            en: 'Please let us help you. You may click the below “ describe your issue “ and we will get back to you on this.',
            ms: 'Please let us help you. You may click the below “ describe your issue “ and we will get back to you on this.',
            'zh-Hans':
              'Please let us help you. You may click the below “ describe your issue “ and we will get back to you on this.',
            'zh-Hant':
              'Please let us help you. You may click the below “ describe your issue “ and we will get back to you on this.',
          },
          subDescription: {
            en: 'Our operating hours are from 7 am -11 pm , you may get back to us later or send us your enquiry via;',
            ms: 'Our operating hours are from 7 am -11 pm , you may get back to us later or send us your enquiry via;',
            'zh-Hans':
              'Our operating hours are from 7 am -11 pm , you may get back to us later or send us your enquiry via;',
            'zh-Hant':
              'Our operating hours are from 7 am -11 pm , you may get back to us later or send us your enquiry via;',
          },
          ctaText: {
            en: 'DESCRIBE YOUR ISSUE',
            ms: 'DESCRIBE YOUR ISSUE',
            'zh-Hans': 'DESCRIBE YOUR ISSUE',
            'zh-Hant': 'DESCRIBE YOUR ISSUE',
          },
        },
      },
      description: 'Configuration to be used during Zendesk chat outage/maintenance',
    },
  },
  offVariation: 'chat-off-support-on',
};

const MOCK_UPDATE_VARIABLE_RESULT = {
  version: 34,
  isArchived: false,
  _id: '611a00ee199d790013cb249d',
  key: 'app_motorist_help_centre_outage_maintenance_chat',
  name: 'Motorist Help Centre Chat Outage Maintenance and Operating Hours',
  description:
    'Variable to enable and disable chat feature on Setel Mobile app and modify operational hours',
  type: 'json',
  tags: [
    {
      key: 'support',
      value: 'support',
    },
  ],
  isToggled: false,
  group: 'app',
  state: 'ready',
  createdBy: '8b99bc77-b89e-4a6f-9e59-b5e47e8cc7b6',
  updatedBy: 'a4fb1ec8-13cc-4280-abb5-2fde814f8742',
  targets: [],
  onVariation: [
    {
      percent: 100,
      variantKey: 'chat-on-support-on',
    },
  ],
  createdAt: 1629094126,
  updatedAt: 1629348970,
  __v: 32,
  variants: {
    'chat-on-support-on': {
      key: 'chat-on-support-on',
      value: {
        description: 'Monday to Sunday, 7:00 am to 11:00 pm',
        isChatEnabled: true,
        isSupportSDKLive: true,
        displayHours: {
          startTime: '7:00 am',
          endTime: '11:00 pm',
        },
        operationalHours: [
          {
            day: 'Monday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Tuesday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Wednesday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Thursday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Friday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Saturday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Sunday',
            startTime: '07:00',
            endTime: '22:59',
          },
        ],
        supportFormMessages: {
          header: {
            en: "We're happy to help",
            ms: "We're happy to help",
            'zh-Hans': "We're happy to help",
            'zh-Hant': "We're happy to help",
          },
          description: {
            en: 'Live chat is open ',
            ms: 'Live chat is open ',
            'zh-Hans': 'Live chat is open ',
            'zh-Hant': 'Live chat is open ',
          },
          subDescription: {
            en: "Please let us know how we can help and we'll respond as soon as we can.",
            ms: "Please let us know how we can help and we'll respond as soon as we can.",
            'zh-Hans': "Please let us know how we can help and we'll respond as soon as we can.",
            'zh-Hant': "Please let us know how we can help and we'll respond as soon as we can.",
          },
          ctaText: {
            en: 'DESCRIBE YOUR ISSUE',
            ms: 'DESCRIBE YOUR ISSUE',
            'zh-Hans': 'DESCRIBE YOUR ISSUE',
            'zh-Hant': 'DESCRIBE YOUR ISSUE',
          },
        },
      },
      description: 'Configuration to be used during normal operation',
    },
    'chat-off-support-on': {
      key: 'chat-off-support-on',
      value: {
        description: 'Monday to Sunday, 7:00 am to 11:00 pm',
        isChatEnabled: false,
        isSupportSDKLive: true,
        displayHours: {
          startTime: '7:00 am',
          endTime: '11:00 pm',
        },
        operationalHours: [
          {
            day: 'Monday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Tuesday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Wednesday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Thursday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Friday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Saturday',
            startTime: '07:00',
            endTime: '22:59',
          },
          {
            day: 'Sunday',
            startTime: '07:00',
            endTime: '22:59',
          },
        ],
        supportFormMessages: {
          header: {
            en: 'Our Live chats are down temporarily. We are sorry!',
            ms: 'Our Live chats are down temporarily. We are sorry!',
            'zh-Hans': 'Our Live chats are down temporarily. We are sorry!',
            'zh-Hant': 'Our Live chats are down temporarily. We are sorry!',
          },
          description: {
            en: 'Please let us help you. You may click the below “ describe your issue “ and we will get back to you on this.',
            ms: 'Please let us help you. You may click the below “ describe your issue “ and we will get back to you on this.',
            'zh-Hans':
              'Please let us help you. You may click the below “ describe your issue “ and we will get back to you on this.',
            'zh-Hant':
              'Please let us help you. You may click the below “ describe your issue “ and we will get back to you on this.',
          },
          subDescription: {
            en: 'Our operating hours are from 7 am -11 pm , you may get back to us later or send us your enquiry via;',
            ms: 'Our operating hours are from 7 am -11 pm , you may get back to us later or send us your enquiry via;',
            'zh-Hans':
              'Our operating hours are from 7 am -11 pm , you may get back to us later or send us your enquiry via;',
            'zh-Hant':
              'Our operating hours are from 7 am -11 pm , you may get back to us later or send us your enquiry via;',
          },
          ctaText: {
            en: 'DESCRIBE YOUR ISSUE',
            ms: 'DESCRIBE YOUR ISSUE',
            'zh-Hans': 'DESCRIBE YOUR ISSUE',
            'zh-Hant': 'DESCRIBE YOUR ISSUE',
          },
        },
      },
      description: 'Configuration to be used during Zendesk chat outage/maintenance',
    },
  },
  offVariation: 'chat-on-support-on',
};
