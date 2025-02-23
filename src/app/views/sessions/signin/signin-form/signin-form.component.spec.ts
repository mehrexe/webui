import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { AutofillMonitor } from '@angular/cdk/text-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonHarness } from '@angular/material/button/testing';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { of } from 'rxjs';
import { MockWebsocketService2 } from 'app/core/testing/classes/mock-websocket2.service';
import { mockCall, mockWebsocket2 } from 'app/core/testing/utils/mock-websocket.utils';
import { IxFormsModule } from 'app/modules/ix-forms/ix-forms.module';
import { IxFormHarness } from 'app/modules/ix-forms/testing/ix-form.harness';
import { AuthService } from 'app/services/auth/auth.service';
import { SigninFormComponent } from 'app/views/sessions/signin/signin-form/signin-form.component';
import { SigninStore } from 'app/views/sessions/signin/store/signin.store';

describe('SigninFormComponent', () => {
  let spectator: Spectator<SigninFormComponent>;
  let loader: HarnessLoader;
  let form: IxFormHarness;
  const createComponent = createComponentFactory({
    component: SigninFormComponent,
    imports: [
      ReactiveFormsModule,
      IxFormsModule,
    ],
    providers: [
      mockWebsocket2(),
      mockProvider(AuthService, {
        login: jest.fn(() => of(true)),
      }),
      mockWebsocket2([
        mockCall('auth.two_factor_auth', false),
      ]),
      mockProvider(SigninStore, {
        setLoadingState: jest.fn(),
        handleSuccessfulLogin: jest.fn(),
      }),
      mockProvider(AutofillMonitor, {
        monitor: jest.fn(() => of({ isAutofilled: true })),
      }),
    ],
  });

  beforeEach(async () => {
    spectator = createComponent();
    const authServiceMock = spectator.inject(AuthService);
    jest.spyOn(authServiceMock, 'login').mockReturnValue(of(true));

    loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    form = await loader.getHarness(IxFormHarness);
  });

  it('logs user in and calls handleSuccessfulLogin on success', async () => {
    await form.fillForm({
      Username: 'root',
      Password: '12345678',
    });

    const loginButton = await loader.getHarness(MatButtonHarness.with({ text: 'Log In' }));
    await loginButton.click();

    const signinStore = spectator.inject(SigninStore);
    expect(signinStore.setLoadingState).toHaveBeenCalledWith(true);
    expect(spectator.inject(AuthService).login).toHaveBeenCalledWith('root', '12345678');
    expect(signinStore.handleSuccessfulLogin).toHaveBeenCalled();
  });

  it('logs user in with OTP code when two factor auth is set up', async () => {
    const websocketMock = spectator.inject(MockWebsocketService2);
    websocketMock.mockCall('auth.two_factor_auth', true);
    spectator.component.ngOnInit();

    await form.fillForm({
      Username: 'root',
      Password: '12345678',
      'Two-Factor Authentication Code': '212484',
    });

    const loginButton = await loader.getHarness(MatButtonHarness.with({ text: 'Log In' }));
    await loginButton.click();

    expect(spectator.inject(AuthService).login).toHaveBeenCalledWith('root', '12345678', '212484');
    expect(spectator.inject(SigninStore).handleSuccessfulLogin).toHaveBeenCalled();
  });

  it('does not disabled Log In button when form has been autofilled', async () => {
    expect(spectator.inject(AutofillMonitor).monitor).toHaveBeenCalled();

    const loginButton = await loader.getHarness(MatButtonHarness.with({ text: 'Log In' }));
    expect(await loginButton.isDisabled()).toBe(false);
  });
});
