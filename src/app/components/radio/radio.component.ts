import {Component, forwardRef, Input} from '@angular/core';
import {TitleCasePipe} from "@angular/common";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

export interface RadioOption {
  id: number,
  name: string,
  value: string | boolean
}

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [
    TitleCasePipe
  ],
  templateUrl: './radio.component.html',
  styleUrl: './radio.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ]
})
export class RadioComponent implements ControlValueAccessor{
  value = '';
  @Input() label: string = '';
  @Input() groupName: string = 'defaultOptionGroupName';
  @Input() options: RadioOption[] = [{
    id: 1,
    name: 'Default',
    value: 'default value'
  }];

  writeValue(value: string): void {
    console.log('writeValue',  value);
    this.value = value;
  }
  onChange(value: any){};
  onTouched(){};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
