import {Component, input, Input, OnInit, signal} from '@angular/core';
import {CommonModule, DatePipe} from "@angular/common";
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    DatePipe,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  contactForm: FormGroup;
  contactPersonsData = input([]);

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      contactPersons: this.fb.array([])
    });
  }

  ngOnInit() {
    this.setContactPersons(this.contactPersonsData());
  }

  get contactPersons(): FormArray {
    return this.contactForm.get('contactPersons') as FormArray;
  }

  setContactPersons(contactPersonsData: any[]): void {
    this.contactPersons.clear();
    contactPersonsData.forEach(person => {
      this.contactPersons.push(this.createContactPerson(person));
    });
  }

  createContactPerson(data: any = {}): FormGroup {
    return this.fb.group({
      name: [data.name || '', Validators.required],
      email: [data.email || '', [Validators.required, Validators.email]],
      phone: [data.phone || ''],
      position: [data.position || '']
    });
  }

  addContactPerson(): void {
    this.contactPersons.push(this.createContactPerson());
  }

  removeContactPerson(index: number): void {
    this.contactPersons.removeAt(index);
  }
}
