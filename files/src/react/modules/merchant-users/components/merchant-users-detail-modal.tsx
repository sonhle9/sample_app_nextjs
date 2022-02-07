import * as React from 'react';
import {
  Alert,
  AlertMessages,
  Button,
  Field,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextField,
  DropdownSelect,
  DropdownMultiSelect,
  useDebounce,
  SearchableDropdown,
} from '@setel/portal-ui';
import {useCompanies, useMerchants, useSetMerchantUser} from '../merchant-users.queries';
import {ICompany} from '../../company/companies.type';
import {IUserMerchantDetail} from '../merchant-users.type';
import {AccessLevel} from '../merchant-users.constant';
import {useRouter} from '../../../routing/routing.context';
import {unionBy} from 'lodash';
interface IMerchantUsersDetailModal {
  visible: boolean;
  id?: string;
  onClose?: () => void;
  company?: ICompany;
  merchantUser?: IUserMerchantDetail;
}
const accessLevelOpts = [
  {
    label: 'Company',
    value: AccessLevel.COMPANY,
  },
  {
    label: 'Merchant',
    value: AccessLevel.MERCHANT,
  },
];

export const MerchantUsersDetailModal = (props: IMerchantUsersDetailModal) => {
  const {merchantUser, company} = props;
  const router = useRouter();
  const [apiErrorMsg, setApiErrorMsg] = React.useState<string[]>([]);
  const [searchMerchantInput, setSearchMerchantInput] = React.useState('');
  const debounceMerchants = useDebounce(searchMerchantInput, 500);
  const [searchMerchantUnderInput, setSearchMerchantUnderInput] = React.useState('');
  const debounceMerchantUnderInput = useDebounce(searchMerchantUnderInput, 500);

  const underMerchants: string[] = [];
  const ophanMerchants: string[] = [];
  merchantUser.merchants.under.forEach((item) => {
    underMerchants.push(item.merchantId);
  });
  merchantUser.merchants.orphan.forEach((item) => {
    ophanMerchants.push(item.merchantId);
  });
  const {data: merchantsData} = useMerchants({
    name: debounceMerchants,
    perPage: 50,
  });

  let merchantsDataUnion = unionBy(
    merchantsData?.merchants || [],
    props?.merchantUser.merchants?.orphan || [],
    'id',
  );

  const [accessLevel, setAccessLevel] = React.useState<string>(
    merchantUser?.user?.companyId ? 'company' : 'merchant',
  );
  const [searchKeyWord, setSearchKeyWord] = React.useState('');
  const keyword = useDebounce(searchKeyWord);
  const {data} = useCompanies({
    keyword,
  });
  const companyLevel = merchantUser?.user?.companyId || merchantUser?.merchants.under.length > 0;
  const [companyId, setCompanyId] = React.useState<string>(company ? company._id : '');
  const [merchantUnderIds, setMerchantUnderIds] = React.useState<string[]>(underMerchants);
  const [merchantOrphantIds, setMerchantOrphantIds] = React.useState<string[]>(ophanMerchants);
  const [merchantIds, setMerchantIds] = React.useState<string[]>([]);

  const {data: merchantsUnderData} = useMerchants({
    name: debounceMerchantUnderInput,
    companyId,
    perPage: 50,
  });

  let merchantsUnderDataUnion = unionBy(
    merchantsUnderData?.merchants || [],
    props?.merchantUser.merchants?.under || [],
    'id',
  );
  const merchantUnderCompanyOpts = merchantsUnderDataUnion.map((merchant) => {
    return {
      label: merchant.name,
      value: merchant.id,
    };
  });

  const merchantOrphantOpts = merchantsDataUnion
    .filter((merchant) => {
      return merchant.companyId === '' || !merchant.companyId;
    })
    .map((merchant) => {
      return {
        label: merchant.name,
        value: merchant.id,
      };
    });
  React.useEffect(() => {
    const merchants = [];
    const merchantIdRaws =
      companyId && accessLevel === 'merchant'
        ? [...merchantUnderIds, ...merchantOrphantIds]
        : [...merchantOrphantIds];
    merchantIdRaws.forEach((id) => {
      if (merchants.indexOf(id) === -1) {
        merchants.push(id);
      }
    });
    setMerchantIds(merchants);
  }, [merchantUnderIds, merchantOrphantIds, accessLevel]);

  const {mutate: setMerchantUser} = useSetMerchantUser({
    userId: merchantUser?.user.userId,
    merchantIds: merchantIds,
    ...(accessLevel === 'company' && {companyId: companyId}),
  });

  const onUpdateMerchantUser = async () => {
    setMerchantUser(undefined, {
      onSuccess: (res) => {
        if (res && res.userId) {
          close();
          router.navigateByUrl(`/merchant-users/${res.userId}`);
        }
      },
      onError: (err: any) => {
        const response = err.response && err.response.data;
        if (response && response.statusCode === 400) {
          if (!Array.isArray(response.message)) {
            setApiErrorMsg([response.message]);
          } else if (Array.isArray(response.message) && !!response.message.length) {
            const messageErr = [];
            response.message.forEach((mess) => {
              messageErr.push(...Object.values(mess.constraints));
            });
            setApiErrorMsg(messageErr);
          }
          return;
        }
      },
    });
  };

  const close = () => {
    setApiErrorMsg([]);
    props.onClose();
  };

  const title = !!merchantUser ? 'Edit merchant user details' : 'Create merchant user';

  return (
    <>
      <Modal isOpen={props.visible} onDismiss={close} aria-label={title}>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <Field className="sm:grid sm:grid-cols-3 sm:grap-4 sm:items-start">
            <Label className="pt-2">Name</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <TextField
                value={merchantUser?.user?.name || '-'}
                disabled={true}
                placeholder={`Enter fullname`}
              />
            </div>
          </Field>
          <Field className="sm:grid sm:grid-cols-3 sm:grap-4 sm:items-start">
            <Label className="pt-2">Email</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <TextField
                value={merchantUser?.user?.email || '-'}
                disabled={true}
                placeholder={`Enter email`}
              />
            </div>
          </Field>
          <Field className="sm:grid sm:grid-cols-3 sm:grap-4 sm:items-start">
            <Label className="pt-2">Access level</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <DropdownSelect<string>
                value={accessLevel}
                options={accessLevelOpts}
                onChangeValue={setAccessLevel}
              />
            </div>
          </Field>
          <Field className="sm:grid sm:grid-cols-3 sm:grap-4 sm:items-start pt-4">
            <Label className="pt-2">Company name</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <SearchableDropdown
                onInputValueChange={setSearchKeyWord}
                placeholder="Search company"
                value={companyId}
                onChangeValue={setCompanyId}
                options={
                  keyword !== searchKeyWord
                    ? undefined
                    : data &&
                      data.companies.map((com) => ({
                        label: com.name,
                        value: com._id,
                      }))
                }
                disabled={
                  !!company ||
                  (companyLevel && merchantUser?.merchants.under.length > 0) ||
                  (companyLevel && accessLevel === 'company')
                }
              />
            </div>
          </Field>
          <Field className="sm:grid sm:grid-cols-3 sm:grap-4 sm:items-start pt-4">
            <Label className="pt-2">Merchant (under company)</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <DropdownMultiSelect
                values={merchantUnderIds}
                options={accessLevel !== 'company' && companyId ? merchantUnderCompanyOpts : []}
                onChangeValues={setMerchantUnderIds}
                onInputValueChange={(val) => setSearchMerchantUnderInput(val)}
                disabled={accessLevel === 'company'}
                allowSelectAll={true}
                multiple
              />
            </div>
          </Field>
          <Field className="sm:grid sm:grid-cols-3 sm:grap-4 sm:items-start pt-2">
            <Label className="pt-2">Merchant (orphan)</Label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <DropdownMultiSelect
                values={merchantOrphantIds}
                options={merchantOrphantOpts}
                onChangeValues={setMerchantOrphantIds}
                onInputValueChange={(val) => setSearchMerchantInput(val)}
                allowSelectAll={true}
                multiple
              />
            </div>
          </Field>
          {apiErrorMsg.length > 0 && (
            <div className="p-2">
              <Alert variant="error" description="Something is wrong">
                <AlertMessages messages={apiErrorMsg} />
              </Alert>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <div className="flex items-center justify-end">
            <Button variant="outline" onClick={close}>
              CANCEL
            </Button>
            <div style={{width: 12}} />
            <Button variant="primary" onClick={onUpdateMerchantUser}>
              SAVE
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};
