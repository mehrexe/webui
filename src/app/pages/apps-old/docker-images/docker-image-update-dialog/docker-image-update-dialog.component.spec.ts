import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { MockPipe } from 'ng-mocks';
import { BulkListItemComponent } from 'app/core/components/bulk-list-item/bulk-list-item.component';
import { FormatDateTimePipe } from 'app/core/pipes/format-datetime.pipe';
import { MockWebsocketService2 } from 'app/core/testing/classes/mock-websocket2.service';
import { fakeSuccessfulJob } from 'app/core/testing/utils/fake-job.utils';
import { mockCall, mockJob, mockWebsocket2 } from 'app/core/testing/utils/mock-websocket.utils';
import { PullContainerImageResponse } from 'app/interfaces/container-image.interface';
import { CoreBulkQuery, CoreBulkResponse } from 'app/interfaces/core-bulk.interface';
import { IxFormsModule } from 'app/modules/ix-forms/ix-forms.module';
import { AppLoaderModule } from 'app/modules/loader/app-loader.module';
import { DockerImageUpdateDialogComponent } from 'app/pages/apps-old/docker-images/docker-image-update-dialog/docker-image-update-dialog.component';
import { fakeDockerImagesDataSource } from 'app/pages/apps-old/docker-images/test/fake-docker-images';
import { AppLoaderService, DialogService } from 'app/services';
import { WebSocketService2 } from 'app/services/ws2.service';

const mockSuccessBulkResponse = [{
  result: [{ status: 'Status: Image truenas/webui has been updated' }] as PullContainerImageResponse[],
  error: null,
}, {
  result: [{ status: 'Status: Image truenas/middleware has been updated' }] as PullContainerImageResponse[],
  error: null,
}] as CoreBulkResponse<PullContainerImageResponse[]>[];

const mockFailedBulkResponse = [{
  result: null,
  error: 'Something went wrong',
}, {
  result: null,
  error: 'Something went wrong',
}] as CoreBulkResponse[];

describe('DockerImageUpdateDialogComponent', () => {
  let spectator: Spectator<DockerImageUpdateDialogComponent>;
  let loader: HarnessLoader;

  const createComponent = createComponentFactory({
    component: DockerImageUpdateDialogComponent,
    imports: [
      AppLoaderModule,
      ReactiveFormsModule,
      IxFormsModule,
    ],
    declarations: [
      BulkListItemComponent,
      MockPipe(FormatDateTimePipe, jest.fn(() => '2022-31-05 10:52:06')),
    ],
    providers: [
      {
        provide: MAT_DIALOG_DATA,
        useValue: fakeDockerImagesDataSource,
      },
      mockProvider(AppLoaderService),
      mockProvider(MatDialogRef),
      mockProvider(DialogService),
      mockWebsocket2([
        mockJob('core.bulk'),
        mockCall('container.image.pull'),
      ]),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    loader = TestbedHarnessEnvironment.loader(spectator.fixture);
  });

  it('updates selected docker images when form is submitted', async () => {
    const jobArguments: CoreBulkQuery = [
      'container.image.pull',
      [
        [{ from_image: 'truenas/webui', tag: '3.1' }],
        [{ from_image: 'truenas/middleware', tag: '0.1.2' }],
      ],
    ];
    spectator.inject(MockWebsocketService2).mockJob('core.bulk', fakeSuccessfulJob(mockSuccessBulkResponse, jobArguments));

    expect(spectator.fixture.nativeElement).toHaveText('The following 2 docker images will be updated. Are you sure you want to proceed?');

    const updatedButton = await loader.getHarness(MatButtonHarness.with({ text: 'Update' }));
    await updatedButton.click();

    expect(spectator.inject(WebSocketService2).job).toHaveBeenCalledWith('core.bulk', jobArguments);
    expect(spectator.fixture.nativeElement).toHaveText('2 docker images has been updated.');

    const closeButton = await loader.getHarness(MatButtonHarness.with({ text: 'Close' }));
    await closeButton.click();
  });

  it('checks updating failures of docker images when form is submitted', async () => {
    const jobArguments: CoreBulkQuery = [
      'container.image.pull',
      [
        [{ from_image: 'truenas/webui', tag: '3.1' }],
        [{ from_image: 'truenas/middleware', tag: '0.1.2' }],
      ],
    ];
    spectator.inject(MockWebsocketService2).mockJob('core.bulk', fakeSuccessfulJob(mockFailedBulkResponse, jobArguments));

    const updateButton = await loader.getHarness(MatButtonHarness.with({ text: 'Update' }));
    await updateButton.click();

    expect(spectator.inject(WebSocketService2).job).toHaveBeenCalledWith('core.bulk', jobArguments);
    expect(spectator.fixture.nativeElement).toHaveText('Warning: 2 of 2 docker images could not be updated.');

    const closeButton = await loader.getHarness(MatButtonHarness.with({ text: 'Close' }));
    await closeButton.click();
  });
});
