import * as React from 'react';
import {CompanyTypeCodes} from '../../../../shared/enums/company.enum';
import {useRouter} from '../../../routing/routing.context';
import {useCompanyDetails} from '../companies.queries';
import {CompanyGeneralDetails} from './company-general-details';
import {SmartpayCompanyDetails} from './smartpay-company-details';

interface ICompanyDetailsProps {
  id: string;
}

export const CompanyDetails = (props: ICompanyDetailsProps) => {
  const router = useRouter();
  const {data: company, isError: isCompanyError} = useCompanyDetails(props.id);

  React.useEffect(() => {
    if (isCompanyError) {
      router.navigateByUrl('companies');
      return;
    }
  }, [isCompanyError]);

  return (
    <>
      {company && company.companyType?.code === CompanyTypeCodes.SMARTPAY && (
        <SmartpayCompanyDetails id={props.id} company={company} />
      )}
      {company && company.companyType?.code !== CompanyTypeCodes.SMARTPAY && (
        <CompanyGeneralDetails id={props.id} company={company} />
      )}
    </>
  );
};
