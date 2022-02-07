import {
  updateStationBasicDetails,
  UpdateStationBasicDetailsData,
} from 'src/react/services/api-stations.service';
import {ajax} from 'src/react/lib/ajax';
import {StationStatus} from 'src/shared/interfaces/station.interface';
import {environment} from 'src/environments/environment';

describe('api-stations service', () => {
  const baseUrl = `${environment.stationsApiBaseUrl}/api/stations`;

  describe('updateStationBasicDetails', () => {
    it('runs an ajax request and returns the response', async () => {
      const mockedResponse = {
        id: 'RYB0010',
        message: 'Station successfully updated',
      };

      const data: UpdateStationBasicDetailsData = {
        status: StationStatus.ACTIVE,
        vendorType: 'sapura',
      };

      const ajaxPatchSpy = jest.spyOn(ajax, 'patch');
      ajaxPatchSpy.mockResolvedValue(mockedResponse);

      const response = await updateStationBasicDetails(mockedResponse.id, data);

      expect(ajaxPatchSpy).toHaveBeenCalledWith(
        `${baseUrl}/administration/stations/${mockedResponse.id}`,
        data,
      );
      expect(response).toMatchObject(mockedResponse);
    });
  });
});
