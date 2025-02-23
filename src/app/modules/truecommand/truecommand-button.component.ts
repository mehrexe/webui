import {
  Component, Inject, OnInit,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TrueCommandStatus } from 'app/enums/true-command-status.enum';
import { WINDOW } from 'app/helpers/window.helper';
import helptext from 'app/helptext/topbar';
import { TrueCommandConfig } from 'app/interfaces/true-command-config.interface';
import { EntityUtils } from 'app/modules/entity/utils';
import { AppLoaderService } from 'app/modules/loader/app-loader.service';
import { TruecommandConnectModalComponent, TruecommandSignupModalState } from 'app/modules/truecommand/components/truecommand-connect-modal/truecommand-connect-modal.component';
import {
  TruecommandSignupModalComponent,
} from 'app/modules/truecommand/components/truecommand-signup-modal/truecommand-signup-modal.component';
import { TruecommandStatusModalComponent } from 'app/modules/truecommand/components/truecommand-status-modal/truecommand-status-modal.component';
import { DialogService } from 'app/services/dialog.service';
import { WebSocketService2 } from 'app/services/ws2.service';

@UntilDestroy()
@Component({
  selector: 'ix-truecommand-button',
  styleUrls: ['./truecommand-button.component.scss'],
  templateUrl: './truecommand-button.component.html',
})
export class TruecommandButtonComponent implements OnInit {
  readonly TrueCommandStatus = TrueCommandStatus;
  tooltips = helptext.mat_tooltips;

  tcStatus: TrueCommandConfig;

  private tcConnected = false;
  private isTcStatusOpened = false;
  private tcStatusDialogRef: MatDialogRef<TruecommandStatusModalComponent>;

  get tcsStatusMatBadge(): string {
    if (this.tcStatus.status === TrueCommandStatus.Connected) {
      return 'check';
    }

    if (this.tcStatus.status === TrueCommandStatus.Failed) {
      return 'priority_high';
    }

    return '';
  }

  constructor(
    private ws: WebSocketService2,
    private dialogService: DialogService,
    private dialog: MatDialog,
    private loader: AppLoaderService,
    @Inject(WINDOW) private window: Window,
  ) {}

  ngOnInit(): void {
    this.ws.call('truecommand.config').pipe(untilDestroyed(this)).subscribe((config) => {
      this.tcStatus = config;
      this.tcConnected = !!config.api_key;
    });
    this.ws.subscribe('truecommand.config').pipe(untilDestroyed(this)).subscribe((event) => {
      this.tcStatus = event.fields;
      this.tcConnected = !!event.fields.api_key;
      if (this.isTcStatusOpened && this.tcStatusDialogRef) {
        this.tcStatusDialogRef.componentInstance.update(this.tcStatus);
      }
    });
  }

  handleUpdate(): void {
    this.dialog
      .open(TruecommandConnectModalComponent, {
        maxWidth: '420px',
        minWidth: '350px',
        data: {
          isConnected: this.tcConnected,
          config: this.tcStatus,
        } as TruecommandSignupModalState,
      })
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((dialogResult) => {
        if (dialogResult?.deregistered) {
          this.tcStatusDialogRef.close(true);
        }
      });
  }

  handleClick(): void {
    if (this.tcConnected) {
      this.openStatusDialog();
    } else {
      this.openSignupDialog();
    }
  }

  stopTrueCommandConnecting(): void {
    this.dialogService.generalDialog({
      title: helptext.stopTCConnectingDialog.title,
      icon: helptext.stopTCConnectingDialog.icon,
      message: helptext.stopTCConnectingDialog.message,
      confirmBtnMsg: helptext.stopTCConnectingDialog.confirmBtnMsg,
    }).pipe(untilDestroyed(this)).subscribe((confirmed) => {
      if (confirmed) {
        this.loader.open();
        this.ws.call('truecommand.update', [{ enabled: false }]).pipe(untilDestroyed(this)).subscribe({
          next: () => {
            this.loader.close();
          },
          error: (err) => {
            this.loader.close();
            new EntityUtils().handleWsError(this, err, this.dialogService);
          },
        });
      }
    });
  }

  private openSignupDialog(): void {
    this.dialog.open(TruecommandSignupModalComponent)
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((shouldConnect) => {
        if (!shouldConnect) {
          return;
        }

        this.handleUpdate();
      });
  }

  private openStatusDialog(): void {
    const data = {
      parent: this,
      data: this.tcStatus,
    };
    if (this.isTcStatusOpened) {
      this.tcStatusDialogRef.close(true);
    } else {
      this.isTcStatusOpened = true;
      this.tcStatusDialogRef = this.dialog.open(TruecommandStatusModalComponent, {
        width: '400px',
        hasBackdrop: true,
        position: {
          top: '48px',
          right: '0px',
        },
        data,
      });
    }

    this.tcStatusDialogRef.afterClosed().pipe(untilDestroyed(this)).subscribe(
      () => {
        this.isTcStatusOpened = false;
      },
    );
  }
}
