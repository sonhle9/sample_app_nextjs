export const loyaltyReports = {
  'point-redemptions': {
    title: 'Loyalty point redemptions report',
    description: 'This folder contains report for LMS016',
    iconClassName: 'bg-warning-500',
    reports: [
      {
        label: 'LMS016 - Redemption transaction report (All)',
        value: 'loyalty_points_redemption_report',
      },
      {
        label: 'LMS090 - Redemption transaction report (Setel)',
        value: 'loyalty_setel_redemption_reports',
      },
    ],
  },
  'point-balance': {
    title: 'Loyalty point balance report',
    description: 'This folder contain report for LMS017',
    iconClassName: 'bg-info-500',
    reports: [{label: 'LMS017 (All)', value: 'loyalty_points_balance_report'}],
  },
  'point-earnings': {
    title: 'Loyalty point earnings report',
    description: 'This folder contains report for LMS025',
    iconClassName: 'bg-error-500',
    reports: [{label: 'LMS025 (All)', value: 'loyalty_points_earnings_report'}],
  },
  member: {
    title: 'Loyalty member report',
    description: 'This folder contain report for LMS029',
    iconClassName: 'bg-blue-200',
    reports: [{label: 'LMS029 (All)', value: 'loyalty_member_report'}],
  },
  axxess: {
    title: 'Loyalty AXXESS Programme report',
    description: 'This folder contain report for LMS060',
    iconClassName: 'bg-lemon-500',
    reports: [{label: 'LMS060 (All)', value: 'loyalty_axxess_programme_report'}],
  },
  channel: {
    title: 'Loyalty channel report',
    description: 'This folder contains report for LMS077 and LMS078',
    iconClassName: 'bg-blue-500',
    disabled: true,
    reports: [
      {label: 'LMS077', value: 'LMS077'},
      {label: 'LMS078', value: 'LMS078'},
    ],
  },
  'monthly-summary': {
    title: 'Loyalty program monthly summary',
    description: 'This folder contain report for LMS087',
    iconClassName: 'bg-purple-200',
    reports: [{label: 'LMS087 (All)', value: 'loyalty_program_monthly_summary'}],
  },
  'daily-summary': {
    title: 'Loyalty program daily summary',
    description: 'This folder contain report for LMS088',
    iconClassName: 'bg-purple-200',
    reports: [{label: 'LMS088 (All)', value: 'loyalty_program_daily_summary'}],
  },
  'daily-account-summary': {
    title: 'Loyalty daily account balance summary',
    description: 'This folder contain report for LMS097',
    iconClassName: 'bg-purple-200',
    disabled: true,
    reports: [{label: 'LMS077 (All)', value: 'loyalty_program_daily_summary_report'}],
  },
  volume: {
    title: 'Loyalty volume report',
    disabled: true,
    description: 'This folder contain report for LMS098',
    iconClassName: 'bg-success-500',
    report: [{label: 'LMS077', value: 'LMS098'}],
  },
};
