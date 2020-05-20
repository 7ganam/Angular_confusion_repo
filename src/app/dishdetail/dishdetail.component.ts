import { Component, OnInit, Input , Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';

import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Feedback, ContactType } from '../shared/feedback';
import {MatSliderModule} from '@angular/material/slider';
import {formatDate} from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { HttpClientModule } from '@angular/common/http';

import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  animations: [
    trigger('visibility', [
        state('shown', style({
            transform: 'scale(1.0)',
            opacity: 1
        })),
        state('hidden', style({
            transform: 'scale(0.5)',
            opacity: 0
        })),
        transition('* => *', animate('0.5s ease-in-out'))
    ])
  ]
})

export class DishdetailComponent implements OnInit {
  visibility = 'shown';

  dishIds: string[];
  prev: string;
  next: string;


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

   errMess: string;

   dishcopy: Dish;

  // @ViewChild('fform') feedbackFormDirective;

    constructor(private fb: FormBuilder,private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    @Inject('BaseURL') private BaseURL
    ) { this.createForm(); }

    ngOnInit() {
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);

      this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess);
    }


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

    setPrevNext(dishId: string) {
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
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

      this.d = new Date();
      this.ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(this.d);
      this.mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(this.d);
      this.da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(this.d);
      const cc =new Comment();

     cc.rating= this.Form.value.rating;
     cc.author= this.Form.value.author;
     cc.date=this.da.concat( this.mo).concat( this.ye);
     cc.comment=this.Form.value.comment;
     this.comment=cc;
     console.log(this.submitted);

      this.dishcopy.comments.push(this.comment);
      this.dishservice.putDish(this.dishcopy)
        .subscribe(dish => {
          this.dish = dish; this.dishcopy = dish;
        },
        errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });

    }

    goBack(): void {
      this.location.back();
    }

}