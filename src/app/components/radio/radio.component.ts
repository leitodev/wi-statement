import {Component, forwardRef, Input} from '@angular/core';
import {TitleCasePipe} from "@angular/common";
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR} from "@angular/forms";

export interface RadioOption {
  id: number,
  name: string,
  value: string | boolean
}

@Component({
  selector: 'app-radio',
  standalone: true,
  imports: [
    TitleCasePipe,
    FormsModule
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
    this.value = value;
  }
  onChange(value: any){
    this.onChangeCallback(value);
  };
  onTouched(){};

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private onChangeCallback(value: any) {

  }
}
