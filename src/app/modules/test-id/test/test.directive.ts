import {
  Directive, ElementRef, HostBinding, Input,
} from '@angular/core';
import { kebabCase } from 'lodash';
import { assertUnreachable } from 'app/helpers/assert-unreachable.utils';

/**
 * Adds test attribute to the element for the benefit of Release Engineering.
 * Prefer not to use test attributes in our unit tests.
 *
 * Usage:
 * Add some description to [ixTest]. Both string and array of strings are supported.
 * Do NOT add element type, in most cases it'll be added automatically.
 *
 * Examples:
 * <button ixTest="reset-settings">Reset Settings</button>
 * <input [ixTest]="formControl.name">
 * <mat-option [ixTest]="[formControl.name, option.label]"></mat-option>
 */
@Directive({
  selector: '[ixTest]',
})
export class TestDirective {
  @Input('ixTest') description: number | string | (string | number)[];

  constructor(
    private elementRef: ElementRef<HTMLElement>,
  ) {}

  get normalizedDescription(): string[] {
    const description = Array.isArray(this.description) ? this.description : [this.description];

    return description.map((part) => kebabCase(String(part)));
  }

  @HostBinding('attr.data-test')
  get attribute(): string {
    return [
      this.getElementType(),
      ...this.normalizedDescription,
    ]
      .filter((part) => part)
      .join('-');
  }

  private getElementType(): string {
    const tagName = this.elementRef.nativeElement.tagName.toLowerCase();

    switch (tagName) {
      case 'tr':
        return 'row';
      case 'mat-slide-toggle':
        return 'toggle';
      case 'mat-checkbox':
      case 'mat-option':
      case 'mat-select':
      case 'mat-radio-group':
      case 'mat-radio-button':
      case 'mat-icon':
        return tagName.replace('mat-', '');
      case 'input':
      case 'button':
      case 'select':
      case 'textarea':
        return tagName;
      case 'a':
        return 'link';
      default:
        assertUnreachable(tagName as never);
    }
  }
}
