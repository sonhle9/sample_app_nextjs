import {
  Card,
  classes,
  DataTable,
  DataTableCaption,
  DataTableCell as Td,
  DataTableRow as Tr,
  DataTableRowGroup,
  DropdownSelect,
  Field,
  formatDate,
  Label,
  useFilter,
} from '@setel/portal-ui';
import * as React from 'react';
import {cardReportAccess} from 'src/shared/helpers/pdb.roles.type';
import {HasPermission} from '../../auth/HasPermission';
import {useSnapshotReport} from '../card-reports.queries';
import {optMonths} from '../card-reports.type';

const folderName = 'gift_card_ageing_report';

const AgeingReportList: React.VFC = () => {
  const date = React.useMemo(() => new Date(), []);
  const [year, setYear] = React.useState(date.getFullYear());
  const [month, setMonth] = React.useState(optMonths[date.getMonth()].value);
  const lastDate = React.useMemo(() => new Date(year, Number(month), 0), []);
  const [{values: filters}, {setValue}] = useFilter({
    folderName,
    from: `${year}-${month}-01`,
    to: `${year}-${month}-${lastDate.getDate()}`,
  });

  const {data, isLoading} = useSnapshotReport(filters);

  const optYears = React.useMemo(() => {
    const currentYear = date.getFullYear();
    const years = [];
    let startYear = 2013;
    while (startYear <= currentYear) {
      years.push({
        label: startYear,
        value: startYear,
      });
      startYear++;
    }
    return years.reverse();
  }, []);

  const handleUpdateYear = React.useCallback(
    (value: number) => {
      const lastdate = new Date(value, Number(month), 0);
      setYear(value);
      setValue('from', `${value}-${month}-01`);
      setValue('to', `${value}-${month}-${lastdate.getDate()}`);
    },
    [month],
  );

  const handleUpdateMonth = React.useCallback(
    (value: string) => {
      const lastdate = new Date(year, Number(value), 0);
      setMonth(value);
      setValue('from', `${year}-${value}-01`);
      setValue('to', `${year}-${value}-${lastdate.getDate()}`);
    },
    [year],
  );

  return (
    <HasPermission accessWith={[cardReportAccess.view]}>
      <div className="grid gap-4 pt-6 max-w-6xl mx-auto px-4 sm:px-6 mb-15 relative">
        <div className="flex justify-between">
          <h1 className={classes.h1}>Gift card ageing report</h1>
        </div>
        <Card className="mb-4">
          <div className="grid grid-cols-4 gap-4 p-5">
            <Field>
              <Label>Month</Label>
              <DropdownSelect
                value={month}
                onChangeValue={handleUpdateMonth}
                options={optMonths}
                placeholder="Months"
              />
            </Field>
            <Field>
              <Label>Years</Label>
              <DropdownSelect
                value={year}
                onChangeValue={handleUpdateYear}
                options={optYears}
                placeholder="Years"
              />
            </Field>
          </div>
        </Card>

        <DataTable isLoading={isLoading}>
          <DataTableRowGroup groupType="thead">
            <Tr>
              <Td>Report name</Td>
              <Td>Created on</Td>
              <Td className="w-32 text-right">Actions</Td>
            </Tr>
          </DataTableRowGroup>
          <DataTableRowGroup>
            {data &&
              data.map((dat, i) => (
                <Tr key={i}>
                  <Td>{dat.fileName}</Td>
                  <Td>{formatDate(dat.createdAt)}</Td>
                  <Td className="text-right">
                    <HasPermission accessWith={[cardReportAccess.download]}>
                      <a
                        download
                        className="text-brand-500 font-medium"
                        href={dat.downloadUrl}
                        title="Download Report">
                        DOWNLOAD
                      </a>
                    </HasPermission>
                  </Td>
                </Tr>
              ))}
          </DataTableRowGroup>
          {data && !data?.length && (
            <DataTableCaption>
              <div className="py-5">
                <div className="text-center py-5 text-md">
                  <p className="font-normal">You have no data to be displayed here</p>
                </div>
              </div>
            </DataTableCaption>
          )}
        </DataTable>
      </div>
    </HasPermission>
  );
};

export default AgeingReportList;
