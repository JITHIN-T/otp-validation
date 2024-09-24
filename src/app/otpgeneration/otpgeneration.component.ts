import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';

@Component({
  selector: 'app-otpgeneration',
  standalone: true,
  imports: [NgOtpInputModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './otpgeneration.component.html',
  styleUrls: ['./otpgeneration.component.css'],
})
export class OtpgenerationComponent {
  otpForm: FormGroup;
  config: any;
  submittedOtp: string | null = null;

  constructor(
    private fb: FormBuilder,
    private _changeDetectRef: ChangeDetectorRef
  ) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
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

  ngOnInit() {
    // this.otpForm.get('otp')?.setValue('123456');
    // console.log(this.otpForm.value, 'Called');
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
  ngAfterViewInit() {
    if ('OTPCredential' in window) {
      console.log('Web OTP API supported,');
      debugger;

      const ac = new AbortController();
      console.log('DOM LOADED');

      var reqObj = {
        otp: { transport: ['sms'] },
        signal: ac.signal,
      };
      navigator.credentials
        .get(reqObj)
        .then((otp: any) => {
          debugger;
          console.log(otp, 'OTP');
          if (otp) {
            if (otp && otp.code) {
              this.otpForm.get('otp')?.setValue(otp.code);
              this._changeDetectRef.detectChanges();
            }
          }
        })
        .catch((err) => {
          debugger;
          console.log(err);
        });
    } else {
      console.log('Web OTP API not supported, Please enter manually.');
      // alert('Web OTP API not supported, Please enter manually.');
    }
  }
}
