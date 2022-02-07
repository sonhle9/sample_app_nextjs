import * as React from 'react';
import {useAdminUserDetails} from '../admin-users.queries';
import {useRouter} from '../../../routing/routing.context';
import {Button, classes, EditIcon, Field, Label} from '@setel/portal-ui';
import moment from 'moment';
import {AdminUserDetailsModal} from './admin-user-details-modal';

interface AdminUserDetailsProps {
  id: string;
}

export const AdminUserDetails = (props: AdminUserDetailsProps) => {
  const [visibleModal, setVisibleModal] = React.useState(false);
  const {data: adminUser, isError: isAdminUserError} = useAdminUserDetails(props.id);
  const router = useRouter();

  React.useEffect(() => {
    if (isAdminUserError) {
      router.navigateByUrl('/admin-users').then();
      return;
    }
  }, [adminUser, isAdminUserError]);

  return (
    <>
      <div className="grid gap-4 pt-4 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between">
          <h1 className={classes.h1}>User details</h1>
        </div>
        <div className="card">
          <div className="px-4 md:px-6 lg:px-8 text-darkgrey border-b border-gray-200 text-xl font-medium leading-7 pt-5 py-4 flex justify-between">
            <div className="flex items-center">{adminUser?.fullName}</div>
            <Button variant="outline" leftIcon={<EditIcon />} onClick={() => setVisibleModal(true)}>
              EDIT DETAILS
            </Button>
          </div>
          <div className="card-body">
            <Field className="sm:grid sm:grid-cols-5 sm:grap-4 sm:items-start">
              <Label className="pt-2">Email</Label>
              <span className="mt-1 sm:mt-0 sm:col-span-4">{adminUser?.email}</span>
            </Field>
            <Field className="sm:grid sm:grid-cols-5 sm:grap-4 sm:items-start">
              <Label className="pt-2">Access</Label>
              <span key={adminUser?.email} className="mt-1 sm:mt-0 sm:col-span-4">
                {adminUser?.accessNames}
              </span>
            </Field>
            <Field className="sm:grid sm:grid-cols-5 sm:grap-4 sm:items-start">
              <Label className="pt-2">Created on</Label>
              <span className="mt-1 sm:mt-0 sm:col-span-4" style={{paddingTop: '5px'}}>
                {moment(adminUser?.createdAt).format('DD MMMM YYYY')}
              </span>
            </Field>
          </div>
        </div>
      </div>
      {visibleModal && (
        <AdminUserDetailsModal
          visible={visibleModal}
          onClose={() => setVisibleModal(false)}
          adminUser={adminUser}
        />
      )}
    </>
  );
};
