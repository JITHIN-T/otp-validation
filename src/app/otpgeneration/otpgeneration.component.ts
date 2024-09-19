import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';

@Component({
  selector: 'app-otpgeneration',
  standalone: true,
  imports: [NgOtpInputModule, CommonModule, ReactiveFormsModule],
  templateUrl: './otpgeneration.component.html',
  styleUrls: ['./otpgeneration.component.css']
})
export class OtpgenerationComponent {
  otpForm: FormGroup;
  config: any;
  submittedOtp: string | null = null;

  constructor(private fb: FormBuilder) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.config = {
      allowNumbersOnly: true,
      length: 6,
      isPasswordInput: false,
      disableAutoFocus: false,
      placeholder: '',
      inputStyles: {
        'border-radius': '10px',
      },
      inputClass: 'input',
    };
  }

  handleInputChange(otp: string) {
    this.otpForm.get('otp')?.setValue(otp);
  }

  onSubmit() {
    this.otpForm.markAllAsTouched();

    if (this.otpForm.valid) {
      this.submittedOtp = this.otpForm.get('otp')?.value;
      console.log('Entered OTP:', this.submittedOtp);
    } else {
      this.submittedOtp = null;
      console.error('OTP is invalid');
    }
  }

  isOtpEntered(): boolean {
    return !!this.submittedOtp; // Check if the OTP has been entered
  }

  incorrectOtp(): boolean {
    const otpControl = this.otpForm.get('otp');
    return otpControl ? otpControl.invalid && otpControl.touched : false;
  }
}
