import {
  Badge,
  Button,
  Card,
  classes,
  Fieldset,
  DescList,
  EditIcon,
  formatDate,
  SectionHeading,
  Text,
  Tabs,
} from '@setel/portal-ui';
import * as React from 'react';
import {format, setDate} from 'date-fns';
import {useGetBadgeDetailsById} from 'src/react/modules/badge-campaigns/badge-campaigns.queries';
import {useEditContentModal} from './use-edit-content-modal';
import {useEditGeneralInfoModal} from './use-edit-general-info-modal';
import {useOutcomesModal} from './use-outcomes-modal';
import {BadgeStatus} from 'src/react/modules/badge-campaigns/components/badge-status';
import {LOCALE_TABS, UNLOCK_OPTIONS} from 'src/react/modules/badge-campaigns/badge-campaigns.const';
import {useUnlockRequirementsModal} from './use-unlock-requirements-modal';
import {useUpdateBadgeStatusModal} from './use-update-badge-status-modal';
import {EditIconModal} from './edit-icon-modal';
import {IBadgeCategory} from 'src/react/modules/badge-campaigns/badge-campaigns.type';

const targetedOrEnrollmentCategory: IBadgeCategory[] = ['TARGETED', 'ENROLLMENT'];
const getNthDayOfTheMonth = (day: number) => format(setDate(new Date(), day ?? 0), 'do');

type BadgeDetailsProps = {id: string};
export function BadgeDetails({id}: BadgeDetailsProps) {
  const {data: badge, isFetching} = useGetBadgeDetailsById(id);
  const editContentModal = useEditContentModal(badge);
  const editGeneralInfoModal = useEditGeneralInfoModal(badge);
  const outcomesModal = useOutcomesModal(badge);
  const unlockRequirementsModal = useUnlockRequirementsModal(badge);
  const updateBadgeStatusModal = useUpdateBadgeStatusModal(badge);

  return (
    <div className="mx-auto px-24 py-10">
      <SectionHeading title={<Text className={classes.h1}>Badge details</Text>}>
        {(badge?.availabilityStatus === 'DRAFT' || badge?.availabilityStatus === 'INACTIVE') && (
          <Button
            variant="outline"
            className="ml-3"
            onClick={() => updateBadgeStatusModal.open('ARCHIVED')}>
            ARCHIVE
          </Button>
        )}
        {(badge?.availabilityStatus === 'DRAFT' ||
          badge?.availabilityStatus === 'INACTIVE' ||
          badge?.availabilityStatus === 'ARCHIVED') && (
          <Button
            variant="primary"
            className="ml-3"
            onClick={() => updateBadgeStatusModal.open('ACTIVE')}>
            LAUNCH
          </Button>
        )}
        {badge?.availabilityStatus === 'ACTIVE' && (
          <Button
            variant="error"
            className="ml-3"
            onClick={() => updateBadgeStatusModal.open('INACTIVE')}>
            STOP
          </Button>
        )}
      </SectionHeading>

      <Card isLoading={isFetching}>
        <Card.Content>
          {updateBadgeStatusModal.component}
          <DescList>
            <DescList.Item
              label="Status"
              value={<BadgeStatus status={badge?.availabilityStatus} />}
            />
            <DescList.Item
              label="Created on"
              value={badge?.createdAt ? formatDate(badge.createdAt) : '-'}
            />
          </DescList>
        </Card.Content>
      </Card>

      <Card className="mt-10" expandable defaultIsOpen isLoading={isFetching}>
        <Card.Heading title="General">
          <Button
            variant="outline"
            leftIcon={<EditIcon />}
            minWidth="none"
            onClick={editGeneralInfoModal.open}>
            EDIT
          </Button>
        </Card.Heading>
        <Card.Content>
          <DescList>
            <DescList.Item label="Badge label" value={badge?.name} />
            <DescList.Item label="Badge group" value={badge?.group?.name?.en || '-'} />
            <DescList.Item label="Badge category" value={badge?.category} />
            {targetedOrEnrollmentCategory.includes(badge?.category) && (
              <>
                <DescList.Item label="Badge progression" value={badge?.progressionType} />
              </>
            )}
            <DescList.Item
              label="Hide badge from Gallery"
              value={
                <Badge
                  className="tracking-wider font-semibold uppercase"
                  rounded="rounded"
                  color={badge?.hideVirtual ? 'success' : 'grey'}>
                  {badge?.hideVirtual ? 'ACTIVE' : 'INACTIVE'}
                </Badge>
              }
            />
            {targetedOrEnrollmentCategory.includes(badge?.category) && (
              <>
                {(badge?.progressionType === 'Recurring Badge' ||
                  badge?.progressionType === 'Periodic Badge') && (
                  <DescList.Item label="Badge limit" value={badge?.recurringMaxLimit} />
                )}
                {badge?.progressionType === 'Periodic Badge' && (
                  <>
                    <DescList.Item
                      label="Hide previous badges"
                      value={
                        <Badge
                          className="tracking-wider font-semibold uppercase"
                          rounded="rounded"
                          color={badge?.hidePreviousVirtualPeriod ? 'success' : 'grey'}>
                          {badge?.hidePreviousVirtualPeriod ? 'ACTIVE' : 'INACTIVE'}
                        </Badge>
                      }
                    />
                    <DescList.Item
                      label="Badge range"
                      value={badge?.period?.type === 'day' ? 'Custom range' : 'Calendar month'}
                    />
                  </>
                )}
              </>
            )}
            <DescList.Item
              label="Start date"
              value={badge?.startDate ? formatDate(badge.startDate, {formatType: 'dateOnly'}) : '-'}
            />
            {targetedOrEnrollmentCategory.includes(badge?.category) &&
              badge?.progressionType === 'Periodic Badge' &&
              badge?.period?.type === 'day' && (
                <>
                  <DescList.Item
                    label="Start at"
                    value={`${getNthDayOfTheMonth(badge.period.startEvery)} of every month`}
                  />
                  <DescList.Item
                    label="End at"
                    value={`${getNthDayOfTheMonth(badge.period.endEvery)} of every month`}
                  />
                </>
              )}
          </DescList>
        </Card.Content>
        {editGeneralInfoModal.component}
      </Card>

      <Card className="mt-10" expandable defaultIsOpen isLoading={isFetching}>
        <Card.Heading title="Unlock requirement">
          <Button
            variant="outline"
            leftIcon={<EditIcon />}
            minWidth="none"
            onClick={unlockRequirementsModal.open}>
            EDIT
          </Button>
        </Card.Heading>
        <Card.Content>
          <DescList>
            <DescList.Item
              label="Unlock badge by"
              value={
                (badge?.content?.verification?.form &&
                  UNLOCK_OPTIONS.find(({value}) => value === 'MANUAL').label) ||
                (badge?.dependsOnCampaign &&
                  UNLOCK_OPTIONS.find(({value}) => value === 'CAMPAIGN').label) ||
                '-'
              }
            />
            {badge?.category === 'OPT_IN' && (
              <>
                <DescList.Item
                  label="Form title"
                  value={badge?.content?.verification?.form?.title?.en || '-'}
                />
                <DescList.Item
                  label="Input fields"
                  value={
                    badge?.content?.verification?.form?.fields?.length > 0 ? (
                      <ol className="list-decimal list-inside space-y-1">
                        {badge.content.verification.form.fields.map((item, index) => (
                          <li key={index}>{item?.name?.en}</li>
                        ))}
                      </ol>
                    ) : (
                      '-'
                    )
                  }
                />
                <DescList.Item
                  label="Button text"
                  value={badge?.content?.verification?.form?.submitButtonText?.en || '-'}
                />
                <DescList.Item
                  label="On submit text"
                  value={badge?.content?.verification?.form?.onSubmitText?.en || '-'}
                />
                <DescList.Item
                  label="Rejected remarks"
                  value={badge?.content?.verification?.statusMessageMap?.REJECTED?.en || '-'}
                />
                <DescList.Item
                  label="Submitted remarks"
                  value={badge?.content?.verification?.statusMessageMap?.SUBMITTED?.en || '-'}
                />
              </>
            )}
            {targetedOrEnrollmentCategory.includes(badge?.category) && (
              <DescList.Item label="Reward campaign" value={badge?.dependsOnCampaign || '-'} />
            )}
          </DescList>
        </Card.Content>
        {unlockRequirementsModal.component}
      </Card>

      <Card className="mt-10" expandable defaultIsOpen isLoading={isFetching}>
        <Card.Heading title="Outcomes">
          <Button
            variant="outline"
            leftIcon={<EditIcon />}
            minWidth="none"
            onClick={outcomesModal.open}>
            EDIT
          </Button>
        </Card.Heading>
        <Card.Content>
          <DescList>
            <DescList.Item
              label="Outcome for user"
              value={badge?.grantsCampaigns.length > 0 ? 'Grant a perk' : '-'}
            />
            <DescList.Item
              label="Reward campaign ID"
              valueClassName="truncate"
              value={
                badge?.grantsCampaigns.length > 0 ? (
                  <ol className="list-decimal list-inside space-y-1">
                    {badge.grantsCampaigns.map((item, index) => (
                      <li key={index} className="truncate">
                        {item}
                      </li>
                    ))}
                  </ol>
                ) : (
                  '-'
                )
              }
            />
          </DescList>
        </Card.Content>
        {outcomesModal.component}
      </Card>

      <Card className="mt-10" expandable defaultIsOpen isLoading={isFetching}>
        <Card.Heading title="Content">
          <Button
            variant="outline"
            leftIcon={<EditIcon />}
            minWidth="none"
            onClick={editContentModal.open}>
            EDIT
          </Button>
        </Card.Heading>
        <Card.Content>
          <div className="-m-4">
            <Tabs>
              <Tabs.TabList>
                {LOCALE_TABS.map((tab) => (
                  <Tabs.Tab key={tab.key} label={tab.label} />
                ))}
              </Tabs.TabList>
              <div className="py-5 px-4 sm:px-7">
                <Tabs.Panels>
                  {LOCALE_TABS.map(({key: locale}) => (
                    <Tabs.Panel key={locale}>
                      <Fieldset legend="GENERALS">
                        <DescList className="py-3">
                          <DescList.Item
                            label="Badge name"
                            value={badge?.content?.title?.[locale] || '-'}
                          />
                          <DescList.Item
                            label="Campaign description"
                            value={badge?.content?.summary?.[locale] || '-'}
                          />
                          <DescList.Item
                            label="Action title"
                            value={badge?.content?.action?.title?.[locale] || '-'}
                          />
                          <DescList.Item
                            label="URL"
                            value={badge?.content?.action?.webLink || '-'}
                          />
                          <DescList.Item
                            label="Deeplink"
                            value={badge?.content?.action?.link || '-'}
                          />
                        </DescList>
                      </Fieldset>
                      {badge?.category === 'OPT_IN' && (
                        <Fieldset
                          legend="INSTRUCTIONS"
                          className="border-t border-gray-200 mt-2 pt-2">
                          <DescList className="py-3">
                            <DescList.Item
                              label="Header"
                              value={badge?.content?.verification?.sectionTitle?.[locale] || '-'}
                            />
                            <DescList.Item
                              label="Section description"
                              value={badge?.content?.verification?.title?.[locale] || '-'}
                            />
                            <DescList.Item
                              label="Verify/CTA Button"
                              value={badge?.content?.verification?.openButtonText?.[locale] || '-'}
                            />
                          </DescList>
                        </Fieldset>
                      )}
                      <Fieldset legend="BENEFITS" className="border-t border-gray-200 mt-2 pt-2">
                        <DescList className="py-3">
                          {badge?.content?.benefits?.items?.length > 0 ? (
                            <DescList.Item
                              label="Title"
                              value={badge?.content?.benefits?.sectionTitle?.[locale] ?? '-'}
                            />
                          ) : (
                            <DescList.Item label="-" value="" />
                          )}
                          {badge?.content?.benefits?.items?.length > 0 && (
                            <DescList.Item
                              label=""
                              valueClassName="truncate"
                              value={
                                <ol className="list-decimal list-inside">
                                  {badge?.content?.benefits?.items?.map((item, index) => (
                                    <li key={index} className="truncate">
                                      {item?.title?.[locale]}
                                    </li>
                                  ))}
                                </ol>
                              }
                            />
                          )}
                        </DescList>
                      </Fieldset>
                      <Fieldset
                        legend="CAMPAIGN PROGRESS"
                        className="border-t border-gray-200 mt-2 pt-2">
                        <DescList className="py-3">
                          <DescList.Item
                            label="Title"
                            value={badge?.content?.campaignProgress?.sectionTitle?.[locale] ?? '-'}
                          />
                        </DescList>
                      </Fieldset>
                      <Fieldset legend="REWARDS" className="border-t border-gray-200 mt-2 pt-2">
                        <DescList className="py-3">
                          {badge?.content?.rewardInfo?.items?.length > 0 ? (
                            <DescList.Item
                              label="Title"
                              value={badge?.content?.rewardInfo?.sectionTitle?.[locale] ?? '-'}
                            />
                          ) : (
                            <DescList.Item label="-" value="" />
                          )}
                          {badge?.content?.rewardInfo?.items?.length > 0 && (
                            <DescList.Item
                              label=""
                              valueClassName="truncate"
                              value={
                                <ol className="list-decimal list-inside">
                                  {badge?.content?.rewardInfo?.items?.map((item, index) => (
                                    <li key={index} className="truncate">
                                      {item.title?.[locale]}
                                    </li>
                                  ))}
                                </ol>
                              }
                            />
                          )}
                        </DescList>
                      </Fieldset>
                      {badge?.category === 'ENROLLMENT' && (
                        <Fieldset
                          legend="ENROLLMENT"
                          className="border-t border-gray-200 mt-2 pt-2">
                          <DescList className="py-3">
                            <DescList.Item
                              label="Title"
                              value={badge?.content?.badgeEnrollment?.sectionTitle?.[locale] || '-'}
                            />
                            <DescList.Item
                              label="Description"
                              value={badge?.content?.badgeEnrollment?.description?.[locale] || '-'}
                            />
                            <DescList.Item
                              label="Action title"
                              value={
                                badge?.content?.badgeEnrollment?.action?.displayText?.[locale] ||
                                '-'
                              }
                            />
                            <DescList.Item
                              label="URL"
                              value={badge?.content?.badgeEnrollment?.action?.webLink || '-'}
                            />
                            <DescList.Item
                              label="Deeplink"
                              value={badge?.content?.badgeEnrollment?.action?.deepLink || '-'}
                            />
                          </DescList>
                        </Fieldset>
                      )}
                      <Fieldset
                        legend="TERMS &amp; CONDITIONS"
                        className="border-t border-gray-200 mt-2 pt-2">
                        <DescList className="py-3">
                          {badge?.content?.termsAndConditions?.items?.length > 0 ? (
                            <DescList.Item
                              label="Title"
                              value={
                                badge?.content?.termsAndConditions?.sectionTitle?.[locale] ?? '-'
                              }
                            />
                          ) : (
                            <DescList.Item label="-" value="" />
                          )}
                          {badge?.content?.termsAndConditions?.items?.length > 0 && (
                            <DescList.Item
                              label=""
                              valueClassName="truncate"
                              value={
                                <ol className="list-decimal list-inside">
                                  {badge?.content?.termsAndConditions?.items?.map((item, index) => (
                                    <li key={index} className="truncate">
                                      {item.value?.[locale]}
                                    </li>
                                  ))}
                                </ol>
                              }
                            />
                          )}
                        </DescList>
                      </Fieldset>
                    </Tabs.Panel>
                  ))}
                </Tabs.Panels>
              </div>
            </Tabs>
          </div>
        </Card.Content>
        {editContentModal.component}
      </Card>
      <EditIconModal isFetching={isFetching} badge={badge} status="LOCKED" />
      <EditIconModal isFetching={isFetching} badge={badge} status="IN_PROGRESS" />
      <EditIconModal isFetching={isFetching} badge={badge} status="UNLOCKED" />
    </div>
  );
}
