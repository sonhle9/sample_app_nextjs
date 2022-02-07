import {
  Button,
  Card,
  CardContent,
  CardHeading,
  EditIcon,
  formatDate,
  formatMoney,
  MailIcon,
  PlusIcon,
  Skeleton,
} from '@setel/portal-ui';
import * as React from 'react';
import {PageContainer} from 'src/react/components/page-container';
import {ILedgerReport} from '../../../../../../app/ledger/ledger.interface';
import {useReportsDetails} from '../../treasury-reports.queries';
import {TrusteeAddSectionModal} from './trustee-add-section-modal';
import {TrusteeEditPaymentReportModal} from './trustee-edit-payment-report-modal';
import {TrusteeSendEmailModal} from './trustee-send-email-modal';

export interface ITrusteeReportDetailsProps {
  id: string;
}

export const TrusteeReportDetails = (props: ITrusteeReportDetailsProps) => {
  const {data, isLoading} = useReportsDetails(props.id);
  const [sendEmailModal, setSendEmailModal] = React.useState(false);
  const [addSectionModal, setAddSectionModal] = React.useState(false);
  const [editPaymentModal, setEditPaymentModal] = React.useState(false);

  return (
    <PageContainer
      heading={
        data ? (
          `Maybank trustee report details - ${formatDate(data.reportDate, {format: 'd MMM yyyy'})}`
        ) : (
          <Skeleton />
        )
      }
      action={
        data && (
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setSendEmailModal(true)}
              leftIcon={<MailIcon />}
              variant="outline">
              EMAIL REPORT
            </Button>
            <Button
              onClick={() => setAddSectionModal(true)}
              leftIcon={<PlusIcon />}
              variant="primary">
              ADD SECTION
            </Button>
          </div>
        )
      }>
      <div className="grid grid-flow-row auto-rows-max gap-y-8">
        {isLoading ? (
          <>
            <Placeholder />
            <Placeholder />
          </>
        ) : (
          <>
            <Card>
              <CardHeading title="Daily summary report" />
              <CardContent>
                {data && (
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 text-sm">Outstanding e-money liabilities</div>
                    <div className="text-right font-medium text-sm">
                      RM {formatMoney(data.summary.liabilities)}
                    </div>
                    <ul className="col-span-3 list-disc">
                      <li className="ml-10 text-gray-500	text-sm">Total customer prepayments</li>
                    </ul>
                    <div className="text-right text-gray-500 text-sm">
                      RM {formatMoney(data.summary.liabilitiesBreakdown?.customerPrepayments ?? 0)}
                    </div>
                    <ul className="col-span-3 list-disc">
                      <li className="ml-10 text-gray-500 text-sm">Total merchant payables</li>
                    </ul>
                    <div className="text-right text-gray-500 text-sm">
                      RM {formatMoney(data.summary.liabilitiesBreakdown?.merchantPayables ?? 0)}
                    </div>{' '}
                    <div className="col-span-3 text-sm">Setel's equity</div>
                    <div className="text-right font-medium text-sm">
                      RM {formatMoney(data.summary.equity)}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            {data &&
              data.summary.sections?.length > 0 &&
              data.summary.sections.map((section, index) => (
                <SectionCard key={`${section.description}-${index}`} index={index} report={data} />
              ))}
            <Card>
              <CardHeading title="Daily payment report">
                {data && (
                  <Button
                    variant="outline"
                    minWidth="none"
                    leftIcon={<EditIcon />}
                    onClick={() => setEditPaymentModal(true)}>
                    EDIT
                  </Button>
                )}
              </CardHeading>
              <CardContent>
                {data && (
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 text-sm">
                      Total payment amount to merchants / dealers
                    </div>
                    <div className="text-right font-medium text-sm">
                      RM {formatMoney(data.summary.payables)}
                    </div>
                    <div className="col-span-3 text-sm">Total refund amount to users</div>
                    <div className="text-right font-medium text-sm">
                      RM {formatMoney(data.summary.refunds)}
                    </div>
                    {data.summary.extras.length > 0 &&
                      data.summary.extras.map((extra, index) => (
                        <div key={`${extra.description}-${index}`} className="col-span-4">
                          <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-3 text-sm">{extra.description}</div>
                            <div className="text-right font-medium text-sm">
                              RM {formatMoney(extra.amount)}
                            </div>
                          </div>
                        </div>
                      ))}
                    <hr className="col-span-4" />
                    <div className="col-span-3 font-medium text-base">
                      Total withdrawal amount from trust account
                    </div>
                    <div className="text-right font-medium text-base">
                      RM {formatMoney(data.summary.withdrawals)}
                    </div>
                    <hr className="col-span-4" />
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
      {data && (
        <TrusteeSendEmailModal
          visible={sendEmailModal}
          onClose={() => {
            setSendEmailModal(false);
          }}
          reportDate={formatDate(data.reportDate, {format: 'dd/MM/yyyy'})}
          reportId={props.id}
        />
      )}
      {data && addSectionModal && (
        <TrusteeAddSectionModal
          visible={addSectionModal}
          onClose={() => {
            setAddSectionModal(false);
          }}
          reportId={props.id}
          summary={data.summary}
        />
      )}
      {data && editPaymentModal && (
        <TrusteeEditPaymentReportModal
          visible={editPaymentModal}
          onClose={() => {
            setEditPaymentModal(false);
          }}
          reportId={props.id}
          data={data.summary}
        />
      )}
    </PageContainer>
  );
};

const SectionCard = ({index, report}: {index: number; report: ILedgerReport}) => {
  const [showEdit, setShowEdit] = React.useState(false);

  return (
    <>
      {report.summary.sections.length >= index + 1 && (
        <>
          <Card>
            <CardHeading title={report.summary.sections[index].description}>
              <Button
                variant="outline"
                minWidth="none"
                leftIcon={<EditIcon />}
                onClick={() => setShowEdit(true)}>
                EDIT
              </Button>
            </CardHeading>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                {report.summary.sections[index].fields.map((field, idx) => (
                  <div key={`${field.description}-${idx}`} className="col-span-4">
                    <div className="grid grid-cols-4 gap-4">
                      <div className="col-span-3 text-sm">{field.description}</div>
                      <div className="text-right font-medium text-sm">
                        RM {formatMoney(field.amount)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <TrusteeAddSectionModal
            visible={showEdit}
            onClose={() => {
              setShowEdit(false);
            }}
            reportId={report.id}
            summary={report.summary}
            sectionIndex={index}
          />
        </>
      )}
    </>
  );
};

const Placeholder = () => (
  <Card isLoading>
    <CardHeading title="Loading"></CardHeading>
    <CardContent>
      <div>
        <Skeleton width="wide" />
        <Skeleton width="wide" />
      </div>
    </CardContent>
  </Card>
);
