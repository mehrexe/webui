import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  QueryList,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  TemplateRef,
} from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatSort, Sort } from '@angular/material/sort';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EmptyType } from 'app/enums/empty-type.enum';
import { Group } from 'app/interfaces/group.interface';
import { IxDetailRowDirective } from 'app/modules/ix-tables/directives/ix-detail-row.directive';
import { EmptyService } from 'app/modules/ix-tables/services/empty.service';
import { GroupFormComponent } from 'app/pages/account/groups/group-form/group-form.component';
import { groupPageEntered, groupRemoved } from 'app/pages/account/groups/store/group.actions';
import { selectGroupState, selectGroupsTotal, selectGroups } from 'app/pages/account/groups/store/group.selectors';
import { IxSlideInService } from 'app/services/ix-slide-in.service';
import { LayoutService } from 'app/services/layout.service';
import { AppState } from 'app/store';
import { builtinGroupsToggled } from 'app/store/preferences/preferences.actions';
import { waitForPreferences } from 'app/store/preferences/preferences.selectors';

@UntilDestroy()
@Component({
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('pageHeader') pageHeader: TemplateRef<unknown>;

  displayedColumns: string[] = ['group', 'gid', 'builtin', 'sudo_commands', 'smb', 'actions'];
  dataSource = new MatTableDataSource<Group>([]);
  defaultSort: Sort = { active: 'gid', direction: 'asc' };
  expandedRow: Group;
  @ViewChildren(IxDetailRowDirective) private detailRows: QueryList<IxDetailRowDirective>;
  hideBuiltinGroups = true;

  readonly EmptyType = EmptyType;
  isLoading$ = this.store$.select(selectGroupState).pipe(map((state) => state.isLoading));
  emptyType$: Observable<EmptyType> = combineLatest([
    this.isLoading$,
    this.store$.select(selectGroupsTotal).pipe(map((total) => total === 0)),
    this.store$.select(selectGroupState).pipe(map((state) => state.error)),
  ]).pipe(
    switchMap(([isLoading, isNoData, isError]) => {
      if (isLoading) {
        return of(EmptyType.Loading);
      }
      if (isError) {
        return of(EmptyType.Errors);
      }
      if (isNoData) {
        return of(EmptyType.NoPageData);
      }
      return of(EmptyType.NoSearchResults);
    }),
  );

  get emptyConfigService(): EmptyService {
    return this.emptyService;
  }

  constructor(
    private slideIn: IxSlideInService,
    private cdr: ChangeDetectorRef,
    private store$: Store<AppState>,
    private layoutService: LayoutService,
    private emptyService: EmptyService,
  ) { }

  ngOnInit(): void {
    this.store$.dispatch(groupPageEntered());
    this.getPreferences();
    this.getGroups();
  }

  ngAfterViewInit(): void {
    this.layoutService.pageHeaderUpdater$.next(this.pageHeader);
  }

  getPreferences(): void {
    this.store$.pipe(
      waitForPreferences,
      untilDestroyed(this),
    ).subscribe((preferences) => {
      this.hideBuiltinGroups = preferences.hideBuiltinGroups;
      this.cdr.markForCheck();
    });
  }

  getGroups(): void {
    this.store$.pipe(
      select(selectGroups),
      untilDestroyed(this),
    ).subscribe({
      next: (groups) => {
        this.createDataSource(groups);
        this.cdr.markForCheck();
      },
      error: () => {
        this.createDataSource();
        this.cdr.markForCheck();
      },
    });
  }

  createDataSource(groups: Group[] = []): void {
    this.dataSource = new MatTableDataSource(groups);
    setTimeout(() => {
      // TODO: Figure out how to avoid setTimeout to make it work on first loading
      this.dataSource.sort = this.sort;
      this.cdr.markForCheck();
    }, 0);
  }

  toggleBuiltins(): void {
    this.store$.dispatch(builtinGroupsToggled());
  }

  doAdd(): void {
    this.slideIn.open(GroupFormComponent).setupForm();
  }

  onToggle(row: Group): void {
    this.expandedRow = this.expandedRow === row ? null : row;
    this.toggleDetailRows();
    this.cdr.markForCheck();
  }

  toggleDetailRows(): void {
    this.detailRows.forEach((row) => {
      if (row.expanded && row.ixDetailRow !== this.expandedRow) {
        row.close();
      } else if (!row.expanded && row.ixDetailRow === this.expandedRow) {
        row.open();
      }
    });
  }

  onSearch(query: string): void {
    this.dataSource.filter = query;
  }

  handleDeletedGroup(id: number): void {
    this.store$.dispatch(groupRemoved({ id }));
  }
}
