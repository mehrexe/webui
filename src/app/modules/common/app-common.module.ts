import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreComponents } from 'app/core/core-components.module';
import { CommonDirectivesModule } from 'app/directives/common/common-directives.module';
import { AlertsModule } from 'app/modules/alerts/alerts.module';
import { CastModule } from 'app/modules/cast/cast.module';
import { AboutDialogComponent } from 'app/modules/common/dialog/about/about-dialog.component';
import { ConfirmDialogComponent } from 'app/modules/common/dialog/confirm-dialog/confirm-dialog.component';
import { ConsolePanelDialogComponent } from 'app/modules/common/dialog/console-panel/console-panel-dialog.component';
import { DirectoryServicesMonitorComponent } from 'app/modules/common/dialog/directory-services-monitor/directory-services-monitor.component';
import { ErrorDialogComponent } from 'app/modules/common/dialog/error-dialog/error-dialog.component';
import { GeneralDialogComponent } from 'app/modules/common/dialog/general-dialog/general-dialog.component';
import { InfoDialogComponent } from 'app/modules/common/dialog/info-dialog/info-dialog.component';
import { RedirectDialogComponent } from 'app/modules/common/dialog/redirect-dialog/redirect-dialog.component';
import {
  ResilverProgressDialogComponent,
} from 'app/modules/common/dialog/resilver-progress/resilver-progress.component';
import { UpdateDialogComponent } from 'app/modules/common/dialog/update-dialog/update-dialog.component';
import { SearchInputComponent } from 'app/modules/common/search-input/search-input.component';
import { SummaryComponent } from 'app/modules/common/summary/summary.component';
import { EntityModule } from 'app/modules/entity/entity.module';
import { IxDynamicFormModule } from 'app/modules/ix-dynamic-form/ix-dynamic-form.module';
import { IxFormsModule } from 'app/modules/ix-forms/ix-forms.module';
import { IxIconModule } from 'app/modules/ix-icon/ix-icon.module';
import { JobsModule } from 'app/modules/jobs/jobs.module';
import { ConsoleMessagesStore } from 'app/modules/layout/components/console-footer/console-messages.store';
import { LayoutModule } from 'app/modules/layout/layout.module';
import { TestIdModule } from 'app/modules/test-id/test-id.module';
import { TooltipModule } from 'app/modules/tooltip/tooltip.module';
import { LanguageService } from 'app/services';
import { LocaleService } from 'app/services/locale.service';
import { ShowLogsDialogComponent } from './dialog/show-logs-dialog/show-logs-dialog.component';

@NgModule({
  imports: [
    CastModule,
    CommonDirectivesModule,
    CommonModule,
    CoreComponents,
    FlexLayoutModule,
    HttpClientModule,
    IxFormsModule,
    IxDynamicFormModule,
    JobsModule,
    MatBadgeModule,
    MatButtonModule,
    EntityModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    IxIconModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    PortalModule,
    RouterModule,
    ScrollingModule,
    TooltipModule,
    TranslateModule,
    MatSidenavModule,
    AlertsModule,
    LayoutModule,
    TestIdModule,
  ],
  declarations: [
    AboutDialogComponent,
    ConfirmDialogComponent,
    ConsolePanelDialogComponent,
    DirectoryServicesMonitorComponent,
    ErrorDialogComponent,
    GeneralDialogComponent,
    InfoDialogComponent,
    RedirectDialogComponent,
    SearchInputComponent,
    UpdateDialogComponent,
    ResilverProgressDialogComponent,
    ShowLogsDialogComponent,
    SummaryComponent,
  ],
  providers: [
    LanguageService,
    LocaleService,
    ConsoleMessagesStore,
  ],
  exports: [
    SearchInputComponent,
    ShowLogsDialogComponent,
    SummaryComponent,
  ],
})
export class AppCommonModule {}
