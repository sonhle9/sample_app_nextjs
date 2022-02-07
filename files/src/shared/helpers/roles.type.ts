export const customerRole = {
  menu: 'accounts_customer_access',
  read: 'accounts_customer_view',
  index: 'accounts_customer_listing',
  search: 'accounts_customer_search',
  edit: 'accounts_customer_edit',
  readDevice: 'accounts_device_listing',
  editDevice: 'accounts_device_edit',
  transactions: 'payments_transaction_view_customer',
  wallet: 'payments_wallet_grant_balance_create',
  loyaltyPointsGranting: 'loyalty_service_admin_access',
  budget: 'budgets_view',
  statement: 'budgets_send_custom_statement',
  recordAdjustment: 'customer-ledger-record-adjustment',
  treasury: 'customer-ledger-view-adjustments',
  readCard: 'payments_credit_cards_view',
};

export const adminRole = {
  userMenu: 'ops_administration_user_access',
  userRead: 'ops_administration_user_view',
  userIndex: 'ops_administration_user_listing',
  userSearch: 'ops_administration_user_query',
  userAdd: 'ops_administration_user_add',
  userEdit: 'ops_administration_user_edit',
};

export const adminAccountRole = {
  adminRead: 'admin_account_view',
  adminAdjustAdd: 'admin_account_adjustment_create',
  adminEditPhone: 'accounts_service_admin_edit_phone',
};

export const adminFraudProfile = {
  adminMenu: 'admin_fraud_profile_access',
  adminIndex: 'admin_fraud_profile_listing',
  adminView: 'admin_fraud_profile_view',
  adminSearch: 'admin_fraud_profile_query',
  adminUpdate: 'admin_fraud_profile_update',
};

export const adminBnplPlanConfig = {
  adminView: 'admin_bnpl_plan_view',
  adminCreate: 'admin_bnpl_plan_create',
  adminUpdate: 'admin_bnpl_plan_update',
};

export const adminBnplAccount = {
  adminView: 'admin_bnpl_account_view',
  adminCreate: 'admin_bnpl_account_create',
  adminUpdate: 'admin_bnpl_account_update',
};

export const adminBnplBill = {
  adminView: 'admin_bnpl_bill_view',
  adminCreate: 'admin_bnpl_bill_create',
  adminUpdate: 'admin_bnpl_bill_update',
};

export const adminBnplInstruction = {
  adminView: 'admin_bnpl_instruction_view',
  adminCreate: 'admin_bnpl_instruction_create',
  adminUpdate: 'admin_bnpl_instruction_update',
};

export const adminCircles = {
  adminCircleList: 'admin_circles_listing',
  adminCircleView: 'admin_circles_view',
  adminCircleUpdate: 'admin_circles_update',
  adminCircleViewHistory: 'admin_circles_view_history',
};

export const adminRiskProfile = {
  adminMenu: 'admin_risk_profile_access',
  adminIndex: 'admin_risk_profile_listing',
  adminView: 'admin_risk_profile_view',
  adminSearch: 'admin_risk_profile_query',
  adminCreate: 'admin_risk_profile_create',
  adminBlacklistUpload: 'admin_risk_profile_blacklist_upload',
};

// Will remove later, currently being crossed used by other legacy angular pages
export const loyaltyRole = {
  menu: 'access-loyalty',
  read: 'view-loyalty',
  index: 'query-loyalty',
  search: 'search-loyalty',
};

export const loyaltyRoles = {
  viewLoyaltyCards: 'view_loyalty_service_cards_access',
  editLoyaltyCards: 'edit_loyalty_service_cards_access',
  viewLoyaltyReports: 'view_loyalty_service_reports_access',
  viewLoyaltyMembers: 'view_loyalty_service_members_access',
  editLoyaltyMembers: 'edit_loyalty_service_members_access',
  viewEarningRules: 'view_loyalty_service_earning_rules_access',
  editEarningRules: 'edit_loyalty_service_earning_rules_access',
  viewRedemptionRules: 'view_loyalty_service_redemption_rules_access',
  editRedemptionRules: 'edit_loyalty_service_redemption_rules_access',
  viewLoyaltyCategories: 'view_loyalty_service_categories_access',
  editLoyaltyCategories: 'edit_loyalty_service_categories_access',
  viewPointTransfer: 'view_loyalty_service_point_transfer_access',
  editPointTransfer: 'edit_loyalty_service_point_transfer_access',
  viewPointTransactions: 'view_loyalty_service_point_transactions_access',
  editPointTransactions: 'edit_loyalty_service_point_transactions_access',
  loyaltyMembersAdminAccess: 'loyalty_member_service_admin_access',
  loyaltyAffliateMenuAccess: 'loyalty_affiliate_access',
  viewPointExpiries: 'view_loyalty_service_expiries_access',
  editPointExpiries: 'edit_loyalty_service_expiries_access',
  viewPointAdjustment: 'view_loyalty_service_point_adjustments_access',
  editPointAdjustment: 'edit_loyalty_service_point_adjustments_access',
  // Legacy permissions
  adminAccess: 'loyalty_service_admin_access',
};

export const dashboardRole = {
  menu: 'dashboards_access',
};

export const reportRole = {
  menu: 'access-reports',
};

export const bulkGrantWalletBalanceRole = {
  menu: 'payments_wallet_batch_grant_balance_access',
  read: 'payments_wallet_batch_grant_balance_view',
  add: 'payments_wallet_batch_grant_balance_create',
};

export const prefundingBalanceRole = {
  viewSummary: 'payments_prefunding_balance_view_summary',
  viewUtilisationHistory: 'payments_prefunding_balance_view_utilisation_history',
};

export const vouchersRole = {
  view: 'vouchers_voucher_read',
  void: 'admin_gifts_voucher_void_batch',
};

export const vouchersValidateRole = {
  validate: 'admin_gifts_voucher_validation_code',
};

export const vouchersBatchReportRole = {
  menu: 'admin_gifts_voucher_view_report',
  view: 'admin_gifts_voucher_view_report',
  download: 'admin_gifts_voucher_download_report',
};

export const vouchersBatchRole = {
  view: 'admin_gifts_voucher_view_batch_listing',
  create: 'admin_gifts_voucher_create_batch',
  update: 'admin_gifts_voucher_create_batch',
  download: 'admin_gifts_voucher_download_batch',
  clone: 'admin_gifts_voucher_clone_batch',
};

export const rewardsRole = {
  admin_rewards_campaign_view: 'admin_rewards_campaign_view',
  admin_rewards_campaign_create: 'admin_rewards_campaign_create',
  admin_rewards_campaign_view_customers: 'admin_rewards_campaign_view_customers',
  admin_rewards_campaign_export_customers: 'admin_rewards_campaign_export_customers',
  admin_rewards_campaign_create_rebate: 'admin_rewards_campaign_create_rebate',
  admin_rewards_goal_extend_rebate_end_date: 'admin_rewards_campaign_extend_rebate_end_date',
  admin_rewards_member_assign_referrer_code: 'admin_rewards_referral_assign_referrer_code',
  admin_rewards_regrant: 'admin_rewards_regrant',
};

export const merchantRole = {
  view: 'admin_accounts_merchants_view',
  modifier: 'admin_accounts_merchants_modifier',
  adjust: 'admin_accounts_merchant_record_adjustment',
  bulk: 'admin_merchant_bulk_external_top_up',
};

export const deviceRole = {
  view: 'admin_hardware_devices_view',
  modifier: 'admin_hardware_devices_modifier',
};

export const exceptionsRole = {
  view: 'admin_financial_gateway_exception_view',
};

export const acqurierRole = {
  view: 'admin_financial_gateway_acquirer_view',
};

export const routingRole = {
  view: 'admin_financial_gateway_routing_view',
};

export const reconciliationRole = {
  view: 'admin_financial_gateway_reconciliation_view',
};

export const setelTerminalRoles = {
  devices_view: 'admin_terminal_view',
  inventory_view: 'admin_terminal_inventory_view',
};

export const terminalSwitchRoles = {
  failed_logs_view: 'admin_financial_gateway_terminal_switch_failed_log_view',
  transaction_view: 'admin_financial_gateway_terminal_switch_transaction_view',
  batch_view: 'admin_financial_gateway_terminal_switch_batch_view',
  monthly_card_sales_report_view:
    'admin_financial_gateway_terminal_switch_monthly_card_sales_report_view',
  csv_report_view: 'admin_financial_gateway_terminal_switch_csv_report_view',
  force_close_approval_view: 'terminal_switch_service_batches_read',
  force_close_approval_confirm: 'terminal_switch_service_batches_force_close_confirm',
  force_close_approval_request: 'terminal_switch_service_batches_force_close_request',
  transaction_and_batch_summary_report: 'terminal_switch_service_tx_n_batch_read',
};
export const merchantUserRole = {
  view: 'admin_administration_teams_merchant_users_view',
  modifier: 'admin_administration_teams_merchant_users_modifier',
};

export const ledgerRole = {
  menu: 'admin_ledger_ledger_view',
  read: 'admin_ledger_ledger_view',
  adjust: 'admin_ledger_cashflows_adjustment',
  transfer: 'admin_ledger_account_transfers',
  index: 'admin_ledger_ledger_view',
  finance: 'admin_ledger_ledger_all',
};

export const extVouchersReportRole = {
  menu: 'admin_gifts_voucher_access_external_voucher_report',
  read: 'admin_gifts_voucher_ext__view_external_voucher_report',
};

export const topupRoles = {
  view: 'admin_wallet_topups_view',
  refund: 'admin_wallet_topups_refund',
};

export const transactionRole = {
  view: 'admin_payments_view',
  batch: 'admin_payments_wallet_batch_grant_balance_view',
  reverse: 'admin_payments_transaction_reverse',
};

export const chargesRoles = {
  view: 'admin_payments_charge_view',
  refund: 'admin_payments_charge_refund_modifier',
};

export const refundRoles = {
  view: 'admin_payments_refund_view',
};

export const transferRoles = {
  view: 'admin_payments_transfer_view',
};

export const settlementRoles = {
  view: 'admin_payments_settlement_view',
};

export const topupRefundRoles = {
  view: 'admin_wallet_top_up_refund_view',
};

export const adjustmentRoles = {
  menu: 'payments_adjustment_access',
};

export const feeRoles = {
  menu: 'payments_fee_access',
  listing: 'payments_fee_listing',
  view: 'payments_fee_view',
  query: 'payments_fee_query',
};

export const customerBlacklistRoles = {
  access: 'accounts_customer_blacklist_access',
  view: 'accounts_customer_blacklist_view',
  update: 'accounts_customer_blacklist_update',
  update_service_daily_limitations: 'blacklist_service_daily_limitations',
};

export const retailRoles = {
  fuelOrderView: 'admin_retail_fuel_order_view',
  fuelOrderExport: 'admin_retail_fuel_order_export',
  fuelOrderUpdate: 'admin_retail_fuel_order_update',
  fuelOrderRecoveryView: 'admin_retail_fuel_order_recovery_view',
  fuelOrderRecoveryUpdate: 'admin_retail_fuel_order_recovery_update',
  fuelPriceView: 'admin_retail_fuel_price_view',
  fuelPriceCreate: 'admin_retail_fuel_price_create',
  fuelPriceUpdate: 'admin_retail_fuel_price_update',
  storeOrderView: 'admin_retail_store_order_view',
  storeOrderExport: 'admin_retail_store_order_export',
  storeInCarOrderView: 'admin_retail_store_order_in_car_view',
  storeInCarOrderExport: 'admin_retail_store_order_in_car_export',
  storeInCarOrderCancel: 'admin_retail_store_order_in_car_cancel',
  externalOrderView: 'admin_retail_external_order_view',
  externalOrderUpdate: 'admin_retail_external_order_update',
  stationView: 'admin_retail_station_view',
  stationCreate: 'admin_retail_station_create',
  stationUpdate: 'admin_retail_station_update',
  stationExport: 'admin_retail_station_export',
  storeView: 'admin_retail_store_view',
  storeCreate: 'admin_retail_store_create',
  storeUpdate: 'admin_retail_store_update',
  waitingAreaView: 'admin_retail_stores_waiting_area_view',
  waitingAreaCreate: 'admin_retail_stores_waiting_area_create',
  waitingAreaUpdate: 'admin_retail_stores_waiting_area_update',
};

export const maintenanceRole = {
  maintenanceOutageView: 'admin_maintenance_outage_view',
  maintenanceOutageUpdate: 'admin_maintenance_outage_update',
  maintenanceVersionView: 'admin_maintenance_version_view',
  maintenanceVersionCreate: 'admin_maintenance_version_create',
  maintenanceVersionDelete: 'admin_maintenance_version_delete',
  maintenanceVersionUpdate: 'admin_maintenance_version_update',
};

export const verificationRoles = {
  view: 'admin_verifications_verifications_view',
  update: 'admin_verifications_verifications_update',
  deviceView: 'admin_account_device_view',
  deviceUpdate: 'admin_account_device_update',
  updateJumio: 'verifications_service_jumio_assessment_update',
  viewJumio: 'verifications_service_jumio_assessment_details',
};

export const approverRole = {
  menu: 'admin_workflows_approver_view',
  view: 'admin_workflows_approver_view',
  read: 'admin_workflows_approver_view',
  create: 'admin_workflows_approver_add',
  update: 'admin_workflows_approver_update',
  delete: 'admin_workflows_approver_delete',
};

export const approvalRuleRole = {
  menu: 'admin_workflows_approvalrule_view',
  view: 'admin_workflows_approvalrule_view',
  read: 'admin_workflows_approvalrule_view',
  create: 'admin_workflows_approvalrule_add',
  update: 'admin_workflows_approvalrule_update',
  delete: 'admin_workflows_approvalrule_delete',
};

export const approvalRequestRole = {
  menu: 'admin_workflows_approvalrequest_view',
  view: 'admin_workflows_approvalrequest_view',
  read: 'admin_workflows_approvalrequest_view',
  create: 'admin_workflows_approvalrequest_add',
  update: 'admin_workflows_approvalrequest_update',
};

export const cardRole = {
  menu: 'admin_cards_card_view',
  view: 'admin_cards_card_view',
  read: 'admin_cards_card_view',
  search: 'admin_cards_card_view',
  download: 'admin_cards_card_view',
  create: 'admin_cards_card_add',
  update: 'admin_cards_card_update',
  update_limit: 'admin_cards_card_update',
  transfer: 'admin_giftcards_cardtransfer_add',
  adjustment: 'admin_giftcards_cardadjustment_add',
  bulk_transfer: 'admin_giftcards_import_cardtransfer_add',
  restriction_view: 'admin_cards_restriction_view',
  restriction_update: 'admin_cards_restriction_update',
  bulkcardstatus_update: 'admin_cards_bulkcardstatus_update',
};

export const cardHolderRole = {
  menu: 'admin_cards_cardholder_view',
  view: 'admin_cards_cardholder_view',
  read: 'admin_cards_cardholder_view',
  create: 'admin_cards_cardholder_update',
  update: 'admin_cards_cardholder_update',
};

export const cardGroupRole = {
  menu: 'admin_cards_cardgroups_view',
  view: 'admin_cards_cardgroups_view',
  read: 'admin_cards_cardgroups_view',
  create: 'admin_cards_cardgroups_add',
  update: 'admin_cards_cardgroups_update',
  serviceView: 'cards_service_cardgroups_view',
};
export const cardTransactionRole = {
  menu: 'admin_giftcards_cardtransaction_view',
  view: 'admin_giftcards_cardtransaction_view',
  read: 'admin_giftcards_cardtransaction_view',
  search: 'admin_giftcards_cardtransaction_view',
  download: 'admin_giftcards_cardtransaction_view',
  create: 'admin_giftcards_cardtransaction_add',
  update: 'admin_giftcards_cardtransaction_update',
  release_pre_auth: 'admin_giftcards_release_preauth_hold',
  fleet_tab_view: 'admin_fleet_tab_cardtransaction_view',
};

export const cardRangeRole = {
  menu: 'admin_cards_cardrange_view',
  view: 'admin_cards_cardrange_view',
  read: 'admin_cards_cardrange_view',
  create: 'admin_cards_cardrange_add',
  update: 'admin_cards_cardrange_update',
};

export const cardExpirationRole = {
  menu: 'admin_cards_cardexpiry_view',
  view: 'admin_cards_cardexpiry_view',
  read: 'admin_cards_cardexpiry_view',
  create: 'admin_cards_cardexpiry_add',
  update: 'admin_cards_cardexpiry_update',
};

export const cardReplacementRole = {
  view: 'admin_cards_cardreplacement_view',
  create: 'admin_cards_cardreplacement_add',
};

export const cardPinMailer = {
  view: 'admin_card_pin_mailer_view',
  dowload: 'admin_card_pin_mailer_view',
};

export const experienceAppSettingsRoles = {
  menu: 'admin_experience_global_variables_view',
  manageGlobal: 'admin_experience_global_variables_manage',
  manageAccount: 'admin_experience_account_variables_manage',
};

export const vehicleRole = {
  menu: 'admin_vehicle_vehicle_access',
  index: 'admin_vehicle_vehicle_view',
  read: 'admin_vehicle_vehicle_view',
};

export const dealRole = {
  admin_deals_deal_order_view: 'admin_deals_deal_order_view',
  admin_deals_deal_campaign_view: 'admin_deals_deal_campaign_view',
  admin_deals_deal_order_void: 'admin_deals_deal_order_void',
  admin_deals_deal_campaign_approve: 'admin_deals_deal_campaign_approve',
  admin_deals_deal_catalogue_create: 'admin_deals_deal_catalogue_create',
  admin_deals_deal_catalogue_update: 'admin_deals_deal_catalogue_update',
  admin_deals_deal_catalogue_view: 'admin_deals_deal_catalogue_view',
  admin_deals_deal_tags_create: 'admin_deals_deal_tags_create',
  admin_deals_deal_tags_update: 'admin_deals_deal_tags_update',
  admin_deals_deal_tags_view: 'admin_deals_deal_tags_view',
};

export const onDemandReportConfigAccess = {
  admin_on_demand_report_config_view: 'admin_on_demand_report_config_view',
  admin_on_demand_report_config_update: 'admin_on_demand_report_config_update',
};

export const snapshotReportConfigAccess = {
  read: 'admin_snapshot_report_config_view',
  update: 'admin_snapshot_report_config_update',
};

export const treasuryReportRole = {
  menu: 'admin_reports_treasury_reports_access',
  view: 'admin_reports_treasury_reports_view',
};

export const calendarAdminRole = {
  access: 'admin_calendar_calendar_administration_access',
  operations: 'admin_calendar_calendar_administration_operations',
};

export const customFieldRuleRole = {
  view: 'admin_custom_field_rules_view',
  modify: 'admin_custom_field_rules_modify',
};

export const feePlansRole = {
  view: 'admin_fee_plan_view',
  modify: 'admin_fee_plan_modify',
};

export const feeSettingsRole = {
  view: 'admin_fee_settings_view',
  modify: 'admin_fee_settings_modify',
};

export const rebatePlansRole = {
  view: 'admin_rebate_plan_view',
  modify: 'admin_rebate_plan_modify',
};

export const rebateSettingRole = {
  modify: 'admin_rebate_setting_modify',
};

export const rebateReportRole = {
  view: 'admin_rebate_report_view',
  modify: 'admin_rebate_report_modify',
};

export const collectionTransactionsRole = {
  view: 'admin_collection_transaction_view',
};

export const feesTransactionRole = {
  view: 'admin_fee_transaction_view',
};

export const transactionReportRole = {
  download: 'admin_reports_download',
};

export const attributionRoles = {
  view: 'admin_attribution_attribution_view',
  create: 'admin_attribution_attribution_create',
  update: 'admin_attribution_attribution_update',
};

export const billingPlansRole = {
  modify: 'admin_billing_plan_modify',
  view: 'admin_billing_plan_view',
};

export const billingPukalPaymentRole = {
  modify: 'admin_billing_pukal_payment_modify',
  view: 'admin_billing_pukal_payment_view',
};

export const billingPukalSedutRole = {
  modify: 'admin_billing_pukal_sedut_modify',
  view: 'admin_billing_pukal_sedut_view',
};

export const billingPukalAccountRole = {
  modify: 'admin_billing_pukal_account_modify',
  view: 'admin_billing_pukal_account_view',
};

export const badgeCampaignsRoles = {
  menu: 'admin_gamification_badge_campaigns_access',
  read: 'admin_gamification_badge_campaigns_read',
};

export const badgeRoles = {
  read: 'admin_gamification_badges_read',
  create: 'admin_gamification_badges_create',
};

export const badgeGroupsRoles = {
  read: 'admin_gamification_badge_groups_read',
  create: 'admin_gamification_badge_groups_create',
  update: 'admin_gamification_badge_groups_update',
  delete: 'admin_gamification_badge_groups_delete',
};

export const variablesRoles = {
  view: 'admin_experience_variables_read',
  create: 'admin_experience_variables_create',
  update: 'admin_experience_variables_update',
  delete: 'admin_experience_variables_delete',
};

export const billsAndReloadsRoles = {
  view: 'admin_bills_and_reloads_transactions_view',
};

export const billingSubscriptionsRole = {
  view: 'admin_billing_subscriptions_view',
  modify: 'admin_billing_subscriptions_modify',
};

export const billingInvoicesRole = {
  view: 'admin_billing_invoices_view',
};

export const billingCreditNotesRoles = {
  view: 'admin_billing_credit_notes_view',
};

export const billingStatementSummaryRoles = {
  view: 'admin_billing_statement_summary_view',
};

export const billingReportsRole = {
  view: 'admin_billing_reports_view',
};

export const loyaltyMemberRoles = {
  view: 'admin_fraud_check_exemption_view',
  update: 'admin_fraud_check_exemption_update',
};

export const subsidyMaintenanceRole = {
  view: 'admin_subsidy_maintenance_view',
  modify: 'admin_subsidy_maintenance_modify',
};

export const subsidyRateRole = {
  view: 'admin_subsidy_rate_view',
};

export const subsidyClaimFilesRole = {
  view: 'admin_subsidy_claim_files_view',
};

export const legacyTerminalRoles = {
  view_tid_mid: 'admin_financial_gateway_legacy_terminal_view_tid_mid',
};
