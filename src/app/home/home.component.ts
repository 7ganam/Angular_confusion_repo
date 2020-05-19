import { Component, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Promotion } from '../shared/promotion';
import { PromotionService } from '../services/promotion.service';
import { Leader } from '../shared/Leader';
import { LeaderService } from '../services/Leader.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  dish: Dish;
  promotion: Promotion;
  leader : Leader;
  constructor(private leaderService: LeaderService , private dishservice: DishService,
    private promotionservice: PromotionService) { }

  ngOnInit() {
    this.dishservice.getFeaturedDish().subscribe(dish => this.dish = dish);;
    this.promotionservice.getFeaturedPromotion().subscribe(promotion => this.promotion = promotion);;
    this.leaderService.getFeaturedLeader().subscribe(leader => this.leader = leader);;

  }

}
