import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/dtos/user';

@Component({
  selector: 'app-leader-board',
  templateUrl: './leader-board.component.html',
  styleUrls: ['./leader-board.component.scss']
})
export class LeaderBoardComponent implements OnInit {
  private sort: string;
  private sortKey: string;
  private users: User[];

  constructor(private userService: UserService) { 
  }

  ngOnInit() {
    this.sortScoreClicked();
  }

  sortScoreClicked() {
    this.sort = 'Score';
    this.sortKey = 'score';
    this.fetchData();
  }

  sortPlayedGamesClicked() {
    this.sort = 'Played Games';
    this.sortKey = 'playedGames';
    this.fetchData();
  }

  sortScorePercentageClicked() {
    this.sort = 'Score Percentage';
    this.sortKey = 'scorePercentage';
    this.fetchData();
  }

  fetchData() {
    this.userService.getUsersOrderedBy(this.sortKey)
      .subscribe((fetchedData) => {
        this.users = fetchedData.users;
      });
  }

}
