import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from "@angular/common";

type inputTypes = 'text' | 'password' | 'email';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss'
})
export class InputTextComponent {
  @Input() type: inputTypes = 'text';

  @Input() placeholder: string = '';
  @Input() label: string = '';

  @Input() required: boolean = false;
  @Input() autocomplete: boolean = false;
  @Input() regexpPattern: string = '';

  @Input() disabled: boolean = false;
  @Input() labelDisabled: string = '';
  @Input() placeholderDisabled: string = '';

  @Input() minLength: number = 0;
  @Input() maxLength: number = 99999;

  @Output() inputEvent = new EventEmitter<string>();
  @Output() changeEvent = new EventEmitter<Event>();
  @Output() focusEvent = new EventEmitter<Event>();
  @Output() blurEvent = new EventEmitter<Event>();

  @Input() customComponentClasses: string = 'flex flex-col gap-1';
  @Input() customLabelClasses: string = 'font-semibold';
  @Input() customInputClasses: string = 'border-gray-400 border rounded p-1';

  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.inputEvent.emit(value);
  }
  onChange(event: Event) {
    this.changeEvent.emit(event);
  }
  onFocus(event: Event) {
    this.focusEvent.emit(event);
  }
  onBlur(event: Event) {
    this.blurEvent.emit(event);
  }

  ngOnInit(){
  }
}
