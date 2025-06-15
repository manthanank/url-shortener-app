import { Component, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Contacts } from '../services/contacts';
import { ContactRequest } from '../models/contact.model';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  contactForm: FormGroup;
  isSubmitted = false;
  isSuccess = false;
  isLoading = false;
  errorMessage = '';

  private contacts = inject(Contacts);

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }
  onSubmit() {
    this.isSubmitted = true;

    if (this.contactForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const contactData: ContactRequest = {
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        message: this.contactForm.value.message,
      };

      this.contacts.sendMessage(contactData).subscribe({
        next: (response) => {
          console.log('Contact form submitted successfully:', response);
          this.isSuccess = true;
          this.contactForm.reset();
          this.isSubmitted = false;
          this.isLoading = false;

          // Hide success message after 5 seconds
          setTimeout(() => {
            this.isSuccess = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Error submitting contact form:', error);
          this.isLoading = false;
          this.errorMessage = error?.error?.message || 'Failed to send message. Please try again.';

          // Hide error message after 5 seconds
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        },
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (
      field &&
      field.errors &&
      (field.dirty || field.touched || this.isSubmitted)
    ) {
      if (field.errors['required']) {
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${
          fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
        } must be at least ${minLength} characters`;
      }
    }
    return '';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(
      field &&
      field.errors &&
      (field.dirty || field.touched || this.isSubmitted)
    );
  }
}
