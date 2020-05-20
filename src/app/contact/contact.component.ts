import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import { FeedbackService } from '../services/feedback.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations:
   [
      trigger('visibility', [
          state('shown', style({
              transform: 'scale(1.0)',
              opacity: 1
          })),
          state('hidden', style({
              transform: 'scale(0.5)',
              opacity: 0
          })),
          transition('* => *', animate('.5s ease-in-out'))
      ]),
      trigger('visibility2', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('.5s ease-in-out'))
      ])

      
  ]
  
})
export class ContactComponent implements OnInit {
  visibility = 'hidden';
  visibility2='shown';
  show_form: boolean= true;
  show_spiner: boolean= false;
  show_response: boolean= false;
  res_firstname: string;
  res_lastname: string;
  res_telnum: number;
  res_email: string;
  res_agree: boolean;
  res_contacttype: string;
  res_message: string;

  feedbackForm: FormGroup;
  feedback: Feedback;
  contactType = ContactType;
  @ViewChild('fform') feedbackFormDirective;

  validationMessages = {
    'firstname': {
      'required':      'First Name is required.',
      'minlength':     'First Name must be at least 2 characters long.',
      'maxlength':     'FirstName cannot be more than 25 characters long.'
    },
    'lastname': {
      'required':      'Last Name is required.',
      'minlength':     'Last Name must be at least 2 characters long.',
      'maxlength':     'Last Name cannot be more than 25 characters long.'
    },
    'telnum': {
      'required':      'Tel. number is required.',
      'pattern':       'Tel. number must contain only numbers.'
    },
    'email': {
      'required':      'Email is required.',
      'email':         'Email not in valid format.'
    },
  };
  formErrors = {
    'firstname': '',
    'lastname': '',
    'telnum': '',
    'email': ''
  };

  constructor(private feedbackService: FeedbackService,
    @Inject('BaseURL') private BaseURL , private fb: FormBuilder) 
  {
    this.createForm();
  }

  ngOnInit() 
  {

  }

  createForm() {
    this.feedbackForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      lastname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
      telnum: ['', [Validators.required, Validators.pattern] ],
      email: ['', [Validators.required, Validators.email] ],
      agree: false,
      contacttype: 'None',
      message: ''
    });

    this.feedbackForm.valueChanges
    .subscribe(data => this.onValueChanged(data));
    this.onValueChanged(); // (re)set validation messages now

  }

  onSubmit() {
    this.visibility2 = 'hidden';
    setTimeout (() => {   this.show_form = false; this.show_spiner = true;}  , 500);
    
    const c : Feedback=this.feedbackForm.value;
  
    this.feedbackService.postFeedback(c).subscribe(feedback => { this.on_success(feedback); }, errmess => { console.log(errmess); });
    this.feedbackForm.reset({
      firstname: '',
      lastname: '',
      telnum: '',
      email: '',
      agree: false,
      contacttype: 'None',
      message: ''
    });
    this.feedbackFormDirective.resetForm();
  }

  on_success(feedback:Feedback)
  {
    this.res_firstname=feedback.firstname;
    this.res_lastname=feedback.lastname;
    this.res_telnum=feedback.telnum;
    this.res_email=feedback.email;
    this.res_agree=feedback.agree;
    this.res_contacttype=feedback.contacttype;
    this.res_message=feedback.message;

  
    this.show_spiner = false;
    this.show_response = true;
    this.visibility = 'shown';
    setTimeout 
    (
      () => {  
              this.visibility = 'hidden';
              setTimeout (() => { this.show_response = false; this.show_form = true; this.visibility2 = 'shown';}  , 500);
            }, 5000
    );
  }

  onValueChanged(data?: any) {
    if (!this.feedbackForm) { return; }
    const form = this.feedbackForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
}