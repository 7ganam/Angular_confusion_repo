import { Component, OnInit, Input } from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import {MatSliderModule} from '@angular/material/slider';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {
  Form: FormGroup;
  comment: Comment;
  submitted : boolean;
  dish: Dish;
  new_author : string;
  new_comment:string;
  new_rating:string;

  d = new Date();
   ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.d);
   mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(this.d);
   da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.d);

  // @ViewChild('fform') feedbackFormDirective;

  constructor(private fb: FormBuilder,private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location)
     { this.createForm(); }




    createForm() 
    {
      this.Form = this.fb.group
      ({
        author: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(25)] ],
        rating: ['', [Validators.required, Validators.pattern] ],
        comment: ['', Validators.required ]
      });
  
      this.Form.valueChanges
      .subscribe(data => this.onValueChanged(data));
      this.onValueChanged(); // (re)set validation messages now
  
    }


    onValueChanged(data?: any) {
      if (!this.Form) { return; }
      const form = this.Form;
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
    formErrors = {
      'author': '',
      'rating': '',
      'comment': ''
    };
  
    validationMessages = {
      'author': {
        'required':      'First Name is required.',
        'minlength':     'First Name must be at least 2 characters long.',
        'maxlength':     'FirstName cannot be more than 25 characters long.'
      },
      'rating': {
        'required':      'Last Name is required.',
        'pattern':     'Last Name must be at least 2 characters long.',
      },
      'comment': {
      'required':      'Tel. number is required.'
      },

    };

    onSubmit() {
      this.new_author = this.Form.value.author;
      this.new_rating = this.Form.value.rating;
      this.new_comment=this.Form.value.comment;
      this.submitted =true;
      console.log(this.submitted);
    }

  ngOnInit() {

    const id = this.route.snapshot.params['id'];
    this.dishservice.getDish(id).subscribe(dish => this.dish = dish);;
  }

  goBack(): void {
    this.location.back();
  }

}