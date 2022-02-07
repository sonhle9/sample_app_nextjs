import {
  Card,
  Checkbox,
  classes,
  DataTable,
  DataTableCell,
  DataTableRow,
  DataTableRowGroup,
  formatDate,
  Text,
} from '@setel/portal-ui';
import * as React from 'react';
import {DownloadCsvDropdown} from 'src/react/components/download-csv-dropdown';
import {useSetQueryParams} from 'src/react/routing/routing.context';
import {formatNumberToFixedString} from '../../terminal-switch-monthly-card-sales-report/terminal-switch-monthly-card-sales-report.helper';
import {downloadAndCompress} from '../terminal-switch-hourly-tnx-file.helper';
import {useHourlyTransactionFileDetail} from '../terminal-switch-hourly-transaction-file.query';
import {generateHourlyTransactionFile} from '../terminal-switch-hourly-transaction-file.service';

export const TerminalSwitchHourlyTransactionFileDetail = (props: {id: string}) => {
  const {data, isFetching, isError, refetch} = useHourlyTransactionFileDetail(props.id);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const dataHour = data?.hourlyTnxDetail?.hours;

  const [checkedHourlyTransactionFile, setCheckedHourlyTransactionFile] = React.useState<
    Set<string>
  >(new Set());

  const isEmptyHourlyTnxFileDetail = dataHour && dataHour.length === 0;

  const dateTime = new Date(data?.hourlyTnxDetail?.date);

  const year = dateTime.getFullYear();
  const month = dateTime.getMonth() + 1;
  const date = dateTime.getDate();

  const title = `${year}${formatNumberToFixedString(month, 2)}${formatNumberToFixedString(
    date,
    2,
  )}`;

  const setQueryParams = useSetQueryParams();

  React.useEffect(() => {
    if (title) {
      setQueryParams({date: title}, {merge: true});
    }
  }, [title]);

  const onGenerateClick = async (params: Parameters<typeof generateHourlyTransactionFile>[0]) => {
    await generateHourlyTransactionFile(params);
    refetch();
  };

  const onDownload = async () => {
    setIsDownloading(true);
    await downloadAndCompress([...checkedHourlyTransactionFile], 'hourly-transaction-file.zip');
    setIsDownloading(false);
  };

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex justify-between">
          <div className="self-center">
            <h1 className={`${classes.h1}`}>{`${title}`}</h1>
          </div>
          {!isFetching && !isError && (
            <div className="flex flex-wrap items-center space-x-2">
              <DownloadCsvDropdown
                isDownloading={isDownloading}
                disabled={checkedHourlyTransactionFile.size === 0}
                onDownload={onDownload}
                variant="outline"
                emailModalTitle="Send email"
              />
            </div>
          )}
        </div>
        <Card>
          <Card.Content className="p-0">
            <DataTable isLoading={isFetching} striped>
              <DataTableRowGroup groupType="thead">
                <DataTableRow>
                  <DataTableCell className="pl-7">REPORT FILE</DataTableCell>
                  <DataTableCell className="text-right">GENERATED ON</DataTableCell>
                </DataTableRow>
              </DataTableRowGroup>
              <DataTableRowGroup>
                {!isFetching &&
                  !isEmptyHourlyTnxFileDetail &&
                  dataHour.map((item) => {
                    return (
                      <DataTableRow data-testid="hour-file-row" key={item.s3ObjectKey}>
                        <DataTableCell className="pl-7 align-middle content-center">
                          <div className="flex items-center">
                            <Checkbox
                              className={`border-2 ${
                                !item.isGenerated
                                  ? 'border-carbon-100 bg-lightergrey'
                                  : 'border-controlborder'
                              }`}
                              disabled={!item.isGenerated}
                              data-testid="check-item-button"
                              checked={checkedHourlyTransactionFile.has(item.s3ObjectKey)}
                              onChangeValue={() => {
                                if (checkedHourlyTransactionFile.has(item.s3ObjectKey)) {
                                  setCheckedHourlyTransactionFile(
                                    new Set(
                                      [...checkedHourlyTransactionFile].filter(
                                        (key) => key !== item.s3ObjectKey,
                                      ),
                                    ),
                                  );
                                  return;
                                }
                                setCheckedHourlyTransactionFile(
                                  new Set([...checkedHourlyTransactionFile, item.s3ObjectKey]),
                                );
                              }}
                            />
                            <div className="p-2 bd-highlight">{`${title} - ${formatNumberToFixedString(
                              item.hour,
                              2,
                            )}00`}</div>
                          </div>
                        </DataTableCell>

                        <DataTableCell className="text-right align-middle">
                          {item.isGenerated ? (
                            `${formatDate(item.generatedAt, {
                              format: 'd MMMM yyyy, HH:mm:SS',
                            })}`
                          ) : (
                            <Text
                              onClick={() => {
                                onGenerateClick({
                                  year,
                                  month,
                                  date,
                                  hour: item.hour,
                                });
                              }}
                              className={`${classes.label} text-brand-500 cursor-pointer`}>
                              GENERATE
                            </Text>
                          )}
                        </DataTableCell>
                      </DataTableRow>
                    );
                  })}
              </DataTableRowGroup>
            </DataTable>
          </Card.Content>
        </Card>
      </div>
      {isFetching && <div data-testid="loading-temp-component"></div>}
    </>
  );
};
