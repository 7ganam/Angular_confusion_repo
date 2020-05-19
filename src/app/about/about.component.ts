import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/Leader';
import { LEADERS } from '../shared/Leaders';
import { LeaderService } from '../services/Leader.service';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  Leaders: Leader[];

  constructor(private LeaderService: LeaderService) { }

  ngOnInit() {
     this.LeaderService.getLeaders().subscribe(Leaders => this.Leaders = Leaders);

  }

}
