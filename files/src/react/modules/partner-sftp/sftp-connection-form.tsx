import React, {useMemo, useState} from 'react';
import {useFormik} from 'formik';
import {
  SftpTargetType,
  CreateSftpConnectionConfig,
  SftpConnectionConfig,
} from './partner-sftp.type';
import {useCreateConnectionConfig, useUpdateConnectionConfig} from './partner-sftp.queries';
import * as Yup from 'yup';
import {
  Button,
  FieldContainer,
  Modal,
  TextField,
  RadioGroup,
  Radio,
  Alert,
  useTransientState,
} from '@setel/portal-ui';
import {PasswordField} from '../auth/components/password-field';

export const SftpConnectionForm = (props: {
  targetId: string;
  targetType: SftpTargetType;
  onSuccess: (msg?: string) => void;
  onCancel: () => void;
  connection?: SftpConnectionConfig;
}) => {
  const isModeUpdated = useMemo(() => {
    if (props.connection) return true;
    return false;
  }, []);
  const [isActivated, setActivate] = useState<boolean>(props.connection?.isActivated);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isApiError, setApiError] = useTransientState<boolean>(false, 5000);
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('This field is required.'),
    password: Yup.string(),
    host: Yup.string().required('This field is required.'),
    port: Yup.number()
      .required('This field is required.')
      .min(1, 'Invalid port number')
      .max(65535, 'Invalid port number')
      .typeError('Invalid port number'),
    destinationFolder: Yup.string(),
  });
  const {mutate: createConnection, isLoading: isLoadingCreateConnection} =
    useCreateConnectionConfig(props.targetId, props.targetType);
  const {mutate: updateConnection, isLoading: isLoadingUpdateConnection} =
    useUpdateConnectionConfig(props.targetId, props.targetType, props.connection?.id);
  const isLoading = useMemo(() => {
    if (isModeUpdated) return isLoadingUpdateConnection;
    return isLoadingCreateConnection;
  }, []);
  const {handleSubmit, values, handleBlur, setFieldValue, errors, touched, isValid, setErrors} =
    useFormik<CreateSftpConnectionConfig>({
      initialValues: props.connection
        ? {
            targetType: props.targetType,
            targetId: props.targetId,
            host: props.connection.host,
            port: props.connection.port,
            username: props.connection.username,
            password: props.connection.password ?? '',
            destinationFolder: props.connection.destinationFolder ?? '',
          }
        : {
            targetType: props.targetType,
            targetId: props.targetId,
            host: '',
            port: undefined,
            username: '',
            password: '',
            destinationFolder: '',
          },
      validationSchema,
      onSubmit: (payload) => {
        if (isModeUpdated) {
          return updateConnection(
            {...payload, isActivated, port: Number(payload.port)},
            {
              onSuccess: () => props.onSuccess('You have successfully updated SFTP connection.'),
              onError: (error: any) => {
                if (error?.response?.data?.code === 'CONNECTION_EXISTED') {
                  setErrors({
                    username: 'Invalid username. Please use different username',
                    ...(values.password && {
                      password: 'Invalid password. Please use different password',
                    }),
                    host: 'Invalid host address. Please use different host address',
                    port: 'Invalid port number. Please use different port number',
                  });
                } else {
                  setApiError(true);
                }
              },
            },
          );
        }
        createConnection(
          {...payload, port: Number(payload.port)},
          {
            onSuccess: () => props.onSuccess('You have successfully created new SFTP connection.'),
            onError: (error: any) => {
              if (error?.response?.data?.code === 'CONNECTION_EXISTED') {
                setErrors({
                  username: 'Invalid username. Please use different username',
                  ...(values.password && {
                    password: 'Invalid password. Please use different password',
                  }),
                  host: 'Invalid host address. Please use different host address',
                  port: 'Invalid port number. Please use different port number',
                });
              } else {
                setApiError(true);
              }
            },
          },
        );
      },
    });

  return (
    <form onSubmit={handleSubmit}>
      <Modal.Body className="py-7">
        {isApiError && (
          <Alert
            variant="error"
            description="An error occured in your input. Please check your information and try again."
            className="mb-7"
          />
        )}
        <TextField
          className="w-4/5"
          name="username"
          label="Username"
          helpText={touched.username && errors.username ? errors.username : null}
          status={touched.username && errors.username ? 'error' : undefined}
          disabled={isLoading}
          onBlur={handleBlur}
          layout="horizontal-responsive"
          value={values.username}
          placeholder="Enter username"
          onChangeValue={(v) => setFieldValue('username', v)}
          autoComplete="email"
        />
        <FieldContainer label="Password" layout="horizontal-responsive" labelAlign="start">
          <PasswordField
            wrapperInputClassName="w-2/5"
            name="password"
            defaultValue={values.password}
            value={values.password}
            onChangeValue={(v) => setFieldValue('password', v)}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword((o) => !o)}
            status={touched.password && errors.password ? 'error' : undefined}
            errormessage={touched.password && errors.password ? errors.password : null}
            autoComplete="new-password"
            placeholder="Enter password"
            disabled={isLoading}
            onBlur={handleBlur}
          />
        </FieldContainer>
        <TextField
          className="w-2/5"
          name="host"
          label="Host address"
          helpText={touched.host && errors.host ? errors.host : null}
          status={touched.host && errors.host ? 'error' : undefined}
          disabled={isLoading}
          onBlur={handleBlur}
          layout="horizontal"
          value={values.host}
          placeholder="Enter host address"
          onChangeValue={(v) => setFieldValue('host', v)}
          autoComplete="off"
        />
        <TextField
          className="w-2/5"
          name="port"
          label="Port number"
          helpText={touched.port && errors.port ? errors.port : null}
          status={touched.port && errors.port ? 'error' : undefined}
          disabled={isLoading}
          onBlur={handleBlur}
          layout="horizontal-responsive"
          value={values.port}
          placeholder="Enter port number"
          onChangeValue={(v) => setFieldValue('port', v)}
          autoComplete="off"
        />
        <TextField
          className="w-4/5"
          name="destinationFolder"
          label="Folder destination"
          disabled={isLoading}
          onBlur={handleBlur}
          layout="horizontal-responsive"
          value={values.destinationFolder}
          placeholder="Enter folder destination"
          onChangeValue={(v) => setFieldValue('destinationFolder', v)}
          wrapperClass="mb-0"
          autoComplete="off"
        />
        {isModeUpdated && (
          <FieldContainer
            label="Status"
            layout="horizontal-responsive"
            labelAlign="start"
            className="mt-2.5 mb-0">
            <RadioGroup
              name="isActivated"
              value={isActivated.toString()}
              onChangeValue={(value) => {
                const convertedBoolean = value === 'false' ? false : true;
                setActivate(convertedBoolean);
              }}>
              <Radio value="true">Enable</Radio>
              <Radio value="false">Disable</Radio>
            </RadioGroup>
          </FieldContainer>
        )}
      </Modal.Body>
      <Modal.Footer className="text-right rounded-md">
        <Button onClick={props.onCancel} variant="outline" className="mr-2">
          CANCEL
        </Button>
        <Button
          data-testid={'submit-btn'}
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={!isValid || !values.host || !values.port || !values.username}>
          {isModeUpdated ? 'SAVE CHANGES' : 'SAVE'}
        </Button>
      </Modal.Footer>
    </form>
  );
};
