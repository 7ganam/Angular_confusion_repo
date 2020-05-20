import { Component, OnInit, Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/Leader';
import { LeaderService } from '../services/Leader.service';

import { HttpClient } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader : Leader;
  errMess: string;

  constructor(private leaderService: LeaderService , private dishservice: DishService, @Inject('BaseURL') private BaseURL,
    private promotionservice: PromotionService,) { }



  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe(dish => this.dish = dish, errmess => this.errMess = <any>errmess);
    this.promotionservice.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion , errmess => this.errMess = <any>errmess);;
    this.leaderService.getFeaturedLeader().subscribe(leader => this.leader = leader, errmess => this.errMess = <any>errmess);;

  }

}
