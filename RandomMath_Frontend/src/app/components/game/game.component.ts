import { Component, OnInit } from '@angular/core';
import { Round } from './round';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  private gameForm: FormGroup;

  private successMessage: string;
  private errorMessage: string;

  private round: Round[];
  private currentRoundNumber: number;
  private roundTimer: number;
  private currentRound: Round;
  private score: number;
  private nextRoundTimer: number;
  private roundActive: boolean;
  private roundInterval;
  private nextRoundInterval;
  private roundTimeout;

  constructor(private formBuilder: FormBuilder, private userService: UserService) { 
    this.gameForm = this.formBuilder.group({
      resultInput: ['', []],
    });
    this.round = new Array(10);
    this.score = 0;
    this.initGame();
    this.currentRoundNumber = 0;
    this.currentRound = this.round[this.currentRoundNumber];
  }

  initGame() {
    for (let i = 0; i < 10; i++) {
      this.round[i] = new Round();
    }
  }

  startGame() {
    this.startNextRoundTimer5s();
    this.startNextRoundIn5Seconds();
  }

  startNextRoundTimer5s() {
    this.nextRoundTimer = 5;
    this.nextRoundInterval = setInterval(() => {
      this.nextRoundTimer--;
      if (this.nextRoundTimer === 0 || this.roundActive) {
        clearInterval(this.nextRoundInterval);
      }
    }, 1000);
  }

  startNextRoundTimer2s() {
    this.nextRoundTimer = 2;
    this.nextRoundInterval = setInterval(() => {
      this.nextRoundTimer--;
      if (this.nextRoundTimer === 0 || this.roundActive) {
        clearInterval(this.nextRoundInterval);
      }
    }, 1000);
  }

  startRoundTimer() {
    this.roundTimer = 20;
    this.roundInterval = setInterval(() => {
      this.roundTimer--;
      if (this.roundTimer === 0 || !this.roundActive) {
        clearInterval(this.roundInterval);
      }
    }, 1000);
  }

  startRound() {
    this.gameForm.controls.resultInput.setValue('');
    this.clearMessages();
    this.nextRoundTimer = 0;
    this.roundActive = true;
    this.startRoundTimer();
    this.startRoundTimeout();
  }

  startRoundTimeout() {
    this.roundTimeout = setTimeout(() => {
      this.stopRound();
    }, 20000);
  }

  clearMessages() {
    this.errorMessage = null;
    this.successMessage = null;
  }

  stopRound() {
    if (this.roundTimeout) clearTimeout(this.roundTimeout);
    this.roundActive = false;
    this.checkResult();

    if (this.currentRoundNumber !== 9) {
      this.currentRoundNumber++;
      this.currentRound = this.round[this.currentRoundNumber];
      this.startNextRoundTimer2s();
      this.startNextRoundIn2Seconds();
    } else {
      // end game
      this.successMessage = `Your score was ${this.score}.`;
      this.nextRoundTimer = 0;
      this.initGame();
      this.currentRoundNumber = 0;
      this.currentRound = this.round[this.currentRoundNumber];
      this.userService.postScore(this.score)
        .subscribe((result) => console.log(result));
    }
  }

  startNextRoundIn5Seconds() {
    setTimeout(() => {
      this.startRound();
    }, 5000);
  }

  startNextRoundIn2Seconds() {
    setTimeout(() => {
      this.startRound();
    }, 2000);
  }

  checkResult() {
    const input = parseFloat(this.gameForm.controls.resultInput.value);
    const flooredInput = Math.floor(input * 10) / 10;
    if (flooredInput === this.currentRound.result) {
      this.score++;
      this.successMessage = 'Your answer was correct!';
    } else {
      // show error message
      this.errorMessage = 'Your answer was wrong!';
    }
  }


  ngOnInit() {
  }

}