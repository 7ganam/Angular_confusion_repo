import { Injectable } from '@angular/core';
import { Leader } from '../shared/Leader';
import { LEADERS } from '../shared/Leaders';
@Injectable({
  providedIn: 'root'
})
export class LeaderService {
  getLeaders(): Leader[] 
  {
    return LEADERS;
  }
  getFeaturedLeader(): Leader 
  {
    return LEADERS.filter((Leader) => Leader.featured)[0];
  }
  constructor() { }
}
