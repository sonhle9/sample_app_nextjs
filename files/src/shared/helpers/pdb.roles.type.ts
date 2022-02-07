export const pdbDashboardAccess = {
  read: 'pdb_dashboards_access',
};

export const onDemandReportConfigAccess = {
  read: 'admin_on_demand_report_config_view',
  update: 'admin_on_demand_report_config_update',
};

export const snapshotReportConfigAccess = {
  read: 'admin_snapshot_report_config_view',
  update: 'admin_snapshot_report_config_update',
};

export const generalLedgerPayoutsAccess = {
  read: 'admin_ledger_general_ledger_payouts_view',
};

export const generalLedgerAccess = {
  read: 'admin_ledger_general_ledger_view',
};

export const treasuryReportAccess = {
  read: 'admin_reports_treasury_reports_view',
};

export const approvalRequestRole = {
  menu: 'admin_workflows_approvalrequest_view',
  view: 'admin_workflows_approvalrequest_view',
  read: 'admin_workflows_approvalrequest_view',
  update: 'admin_workflows_approvalrequest_update',
};

export const approvalRuleRole = {
  menu: 'admin_workflows_approvalrule_view',
  view: 'admin_workflows_approvalrule_view',
  read: 'admin_workflows_approvalrule_view',
  create: 'admin_workflows_approvalrule_add',
  update: 'admin_workflows_approvalrule_update',
  delete: 'admin_workflows_approvalrule_delete',
};

export const approverRole = {
  menu: 'admin_workflows_approver_view',
  view: 'admin_workflows_approver_view',
  read: 'admin_workflows_approver_view',
  create: 'admin_workflows_approver_add',
  update: 'admin_workflows_approver_update',
  delete: 'admin_workflows_approver_delete',
};

export const merchantTrans = {
  view_adjustment: 'admin_merchant_adjustment_view',
  view_topup: 'admin_merchant_top_up_view',
  update_top_up: 'admin_merchant_top_up_update',
  update_adjustment: 'admin_merchant_adjustment_update',
  bulk: 'admin_merchant_bulk_external_top_up',
};

export const cardReportAccess = {
  menu: 'admin_reports_reports_view',
  view: 'admin_reports_reports_view',
  read: 'admin_reports_reports_view',
  download: 'admin_reports_reports_view',
};

export const merchantReportAccess = {
  menu: 'reports_reports_view',
  view: 'reports_reports_view',
  read: 'reports_reports_view',
};

export const gatewayAccess = {
  admin_gateway_legacy_terminals_view: 'admin_gateway_legacy_terminals_view',
};

export const sapPostingRole = {
  menu: 'admin_ledger_sap_posting_access',
  view: 'admin_ledger_sap_posting_view',
  regenerate: 'admin_ledger_sap_posting_regenerate',
};
