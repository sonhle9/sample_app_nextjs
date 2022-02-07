import {
  Button,
  Checkbox,
  DropdownSelect,
  FieldContainer,
  Fieldset,
  IconButton,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  MultiInput,
  PlusIcon,
  SearchableNestedDropdown,
  TextareaField,
  TextField,
  titleCase,
  TrashIcon,
  ZoomInIcon,
} from '@setel/portal-ui';
import * as React from 'react';
import {
  OnDemandReportCategory,
  OnDemandReportMappingType,
} from 'src/react/services/api-reports.enum';
import {
  IOnDemandReportConfig,
  OnDemandReportData,
  ReportDestination,
} from 'src/react/services/api-reports.type';
import {
  useCreateOnDemandReportConfig,
  useUpdateOnDemandReportConfig,
} from '../on-demand-reports.queries';
import {OnDemandReportDataPreview} from './on-demand-report-data-preview';
import {CURRENT_ENTERPRISE} from 'src/shared/const/enterprise.const';
import {ReportIcons} from '../on-demand-reports.enums';

interface OnDemandReportsFormProps {
  onSuccess: (result: IOnDemandReportConfig) => void;
  onCancel: () => void;
  currentOnDemandReportConfig?: IOnDemandReportConfig;
}

export const OnDemandReportsForm = ({
  onSuccess,
  onCancel,
  currentOnDemandReportConfig,
}: OnDemandReportsFormProps) => {
  const [reportName, setReportName] = React.useState(
    currentOnDemandReportConfig ? currentOnDemandReportConfig.reportName : '',
  );
  const [reportDescription, setReportDescription] = React.useState(
    currentOnDemandReportConfig ? currentOnDemandReportConfig.reportDescription : '',
  );
  const [url, setUrl] = React.useState(
    currentOnDemandReportConfig ? currentOnDemandReportConfig.url : '',
  );
  const [category, setCategory] = React.useState(
    currentOnDemandReportConfig
      ? currentOnDemandReportConfig.category
      : (OnDemandReportCategory.NONE as string),
  );
  const [permissions, setPermissions] = React.useState(
    currentOnDemandReportConfig ? currentOnDemandReportConfig.permissions : [],
  );
  const [reportMappingList, setReportMappingList] = React.useState(
    currentOnDemandReportConfig
      ? hydrateExistingReportMappings()
      : [
          {
            reportId: '',
            mappingType: OnDemandReportMappingType.DEFAULT,
            exportOnly: false,
            prefilter: '{}',
            isValidPrefilter: true,
          },
        ],
  );
  const [reportDestination, setReportDestination] = React.useState(
    currentOnDemandReportConfig
      ? currentOnDemandReportConfig.destination
      : ReportDestination.WEB_ADMIN,
  );

  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const {mutate: create, isLoading: isCreating} = useCreateOnDemandReportConfig();
  const {mutate: update, isLoading: isUpdating} = useUpdateOnDemandReportConfig(
    currentOnDemandReportConfig ? currentOnDemandReportConfig.id : null,
  );

  const [icon, setIcon] = React.useState(
    currentOnDemandReportConfig ? currentOnDemandReportConfig.icon : '',
  );

  const isLoading = isCreating || isUpdating;

  function hydrateExistingReportMappings() {
    const existingReportMappings = currentOnDemandReportConfig.reportMappings;
    return existingReportMappings.map((reportMapping) => ({
      isValidPrefilter: true,
      prefilter: JSON.stringify(reportMapping.prefilter),
      exportOnly: reportMapping.exportOnly || false,
      reportId: reportMapping.reportId,
      mappingType: reportMapping.mappingType,
    }));
  }

  const handleChange = (index: number, property: string, value: string) => {
    const newReportMappingList = [...reportMappingList];
    newReportMappingList[index][property] = value;
    setReportMappingList(newReportMappingList);
  };

  const handleAddReport = () =>
    setReportMappingList(
      reportMappingList.concat({
        reportId: '',
        prefilter: '{}',
        exportOnly: false,
        isValidPrefilter: true,
        mappingType: OnDemandReportMappingType.DEFAULT,
      }),
    );

  const validateJSON = () => {
    let result = true;

    const validatedList = [...reportMappingList];

    validatedList.forEach((reportMap, index) => {
      try {
        JSON.parse(reportMap.prefilter);
        validatedList[index].isValidPrefilter = true;
      } catch (_) {
        validatedList[index].isValidPrefilter = false;
        result = false;
      }
    });

    setReportMappingList(validatedList);

    return result;
  };

  const trimmedUrl = url.trim();
  const isUrlValid = validateUrl(trimmedUrl);

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        setIsSubmitted(true);
        const isValid = validateJSON() && isUrlValid;
        if (isValid) {
          const onDemandConfigData: OnDemandReportData = {
            reportName: reportName.trim(),
            reportDescription: reportDescription.trim(),
            reportMappings: reportMappingList.map((rpt) => ({
              reportId: rpt.reportId.trim(),
              prefilter: JSON.parse(rpt.prefilter),
              mappingType: rpt.mappingType,
              exportOnly: rpt.exportOnly,
            })),
            category,
            permissions,
            url: trimmedUrl,
            destination: reportDestination,
            icon,
          };

          const operation = currentOnDemandReportConfig ? update : create;

          operation(onDemandConfigData, {onSuccess});
        }
      }}>
      <ModalBody>
        <TextField
          required
          label="Report name"
          value={reportName}
          onChangeValue={setReportName}
          layout="horizontal-responsive"
        />
        <TextareaField
          label="Report description"
          required
          name="report description"
          value={reportDescription}
          onChangeValue={setReportDescription}
          layout="horizontal-responsive"
        />
        <FieldContainer label="Portal" layout="horizontal-responsive">
          <DropdownSelect<ReportDestination>
            value={reportDestination}
            onChangeValue={setReportDestination}
            options={DESTINATIONS as any}
          />
        </FieldContainer>
        <TextField
          required
          label="URL"
          placeholder="my-report"
          value={url}
          onChangeValue={setUrl}
          layout="horizontal-responsive"
          status={isSubmitted && !isUrlValid ? 'error' : undefined}
          helpText={
            isSubmitted && !isUrlValid ? 'Alphanumerical character and _, - only' : undefined
          }
        />
        <FieldContainer label="Category" layout="horizontal-responsive">
          <DropdownSelect<string>
            value={category}
            onChangeValue={setCategory}
            options={CATEGORIES}
          />
        </FieldContainer>
        <FieldContainer label="Permissions" layout="horizontal-responsive">
          <MultiInput values={permissions} onChangeValues={setPermissions} includeDraft />
        </FieldContainer>
        <IconReport icon={icon} onChangeValue={setIcon} />
        <Fieldset legend="Reports mapping" className="mt-8">
          {reportMappingList.map((reportMap, index) => (
            <ReportMap
              key={index}
              disableRemove={reportMappingList.length === 1}
              onChange={(field, value) => handleChange(index, field, value)}
              reportId={reportMap.reportId}
              exportOnly={reportMap.exportOnly}
              mappingType={reportMap.mappingType}
              prefilter={reportMap.prefilter}
              isValidPrefilter={reportMap.isValidPrefilter}
              onRemove={() => setReportMappingList(reportMappingList.filter((_, i) => i !== index))}
            />
          ))}
          <Button variant="primary" leftIcon={<PlusIcon />} onClick={handleAddReport}>
            Add report
          </Button>
        </Fieldset>
      </ModalBody>
      <ModalFooter className="text-right space-x-2">
        <Button onClick={onCancel} variant="outline">
          CANCEL
        </Button>
        <Button isLoading={isLoading} type="submit" variant="primary">
          SAVE
        </Button>
      </ModalFooter>
    </form>
  );
};

type ReportMapProps = {
  reportId: string;
  prefilter: string;
  mappingType: OnDemandReportMappingType;
  onChange: (field: string, value: any) => void;
  exportOnly: boolean;
  isValidPrefilter: boolean;
  disableRemove: boolean;
  onRemove: () => void;
};

const ReportMap = (props: ReportMapProps) => {
  const [showPreview, setShowPreview] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    props.onChange(e.target.name, e.target.value);
  };
  return (
    <div className="flex flex-row items-start gap-4 mb-6">
      <div className="grid lg:grid-cols-2 gap-4 items-start flex-grow">
        <TextField
          required
          name="reportId"
          placeholder="Report ID"
          value={props.reportId}
          onChange={handleInputChange}
          label="Report ID"
        />
        <FieldContainer label="Type">
          <DropdownSelect
            value={props.mappingType}
            onChangeValue={(newValue) => props.onChange('mappingType', newValue)}
            options={MAPPING_TYPES}
          />
        </FieldContainer>
        <TextareaField
          label="Filter"
          required
          name="prefilter"
          status={!props.isValidPrefilter ? 'error' : null}
          helpText={!props.isValidPrefilter ? 'Invalid JSON format' : null}
          placeholder="Prefilter"
          value={props.prefilter}
          onChange={handleInputChange}
          wrapperClass="lg:col-span-2"
        />
        <Checkbox
          checked={props.exportOnly}
          onChangeValue={(newValue) => props.onChange('exportOnly', newValue)}
          label="Export Only"
        />
      </div>
      <div className="pt-5">
        <IconButton
          onClick={() => setShowPreview(true)}
          disabled={!props.isValidPrefilter || !props.reportId}
          className="text-gray-500">
          <span className="sr-only">Preview</span>
          <ZoomInIcon className="w-5 h-5" />
        </IconButton>
        <IconButton
          disabled={props.disableRemove}
          onClick={props.onRemove}
          className="text-error-500">
          <span className="sr-only">Remove</span>
          <TrashIcon className="w-5 h-5" />
        </IconButton>
      </div>
      <Modal
        isOpen={showPreview}
        aria-label="Preview Report"
        onDismiss={() => setShowPreview(false)}>
        <ModalHeader>Preview {props.reportId}</ModalHeader>
        <ModalBody>
          {showPreview && (
            <OnDemandReportDataPreview
              reportId={props.reportId}
              params={parseSafely(props.prefilter)}
            />
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};

const validateUrl = (url: string) => encodeURIComponent(url) === url;

const parseSafely = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return {};
  }
};

type IconReportProps = {
  icon: string;
  onChangeValue: (field: string, value: any) => void;
};

const IconReport = (props: IconReportProps) => {
  if (CURRENT_ENTERPRISE.name !== 'pdb') {
    return <></>;
  }

  return (
    <FieldContainer label="Icon" layout="horizontal-responsive">
      <SearchableNestedDropdown
        options={REPORT_ICONS}
        value={props.icon}
        onChangeValue={props.onChangeValue}
      />
    </FieldContainer>
  );
};

const CATEGORIES = Object.keys(OnDemandReportCategory).map((key) => ({
  label: titleCase(key),
  value: key,
}));

const MAPPING_TYPES = Object.keys(OnDemandReportMappingType).map((key) => ({
  label: titleCase(key),
  value: key,
}));

const DESTINATIONS = Object.values(ReportDestination).map((value) => ({
  label: titleCase(value.replace(/-/g, '_'), {hasUnderscore: true}),
  value,
}));

const REPORT_ICONS = [
  {
    value: ReportIcons.reward.value,
    label: ReportIcons.reward.label,
    icon: <img src="../../../../assets/images/icons/reward_select_box.svg" alt="reward" />,
  },
  {
    value: ReportIcons.membership.value,
    label: ReportIcons.membership.label,
    icon: <img src="../../../../assets/images/icons/membership_select_box.svg" alt="membership" />,
  },
  {
    value: ReportIcons.vehicle.value,
    label: ReportIcons.vehicle.label,
    icon: <img src="../../../../assets/images/icons/vehicle_select_box.svg" alt="vehicle" />,
  },
];
