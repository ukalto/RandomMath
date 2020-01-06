import { Component, OnInit } from '@angular/core';
import { Round } from './round';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  private gameForm: FormGroup;


  private round: Round[];
  private currentRoundNumber: number;
  private roundTimer: number;
  private currentRound: Round;
  private score: number;
  private nextRoundTimer: number;
  private roundActive: boolean;
  private roundTimeoutObj;

  constructor(private formBuilder: FormBuilder) { 
    this.gameForm = this.formBuilder.group({
      result: ['', []],
    });
    this.round = new Array(10);
    this.currentRoundNumber = 0;
    this.score = 0;
    this.initGame();
  }

  initGame() {
    for (let i = 0; i < 10; i++) {
      this.round[i] = new Round();
    }
  }

  startGame() {
    this.currentRound = this.round[this.currentRoundNumber];
    this.nextRoundTimer = 6;
    this.startNextRoundTimer();
    setTimeout(() => {
      // start next round in 5 seconds
      this.roundTimer = 16;
      this.startRoundTimer();
      this.roundActive = true;

      this.roundTimeoutObj = setTimeout(() => this.stopRound(), 150000);
    },5000);
  }

  nextRound() {
    this.stopRound();
    this.currentRound = this.round[this.currentRoundNumber];
    this.nextRoundTimer = 6;
    this.startNextRoundTimer();
    setTimeout(() => {
      // start next round in 5 seconds
      this.roundTimer = 16;
      this.startRoundTimer();
      this.roundActive = true;

      this.roundTimeoutObj = setTimeout(() => this.stopRound(), 150000);
    },5000);
  }

  stopRound() {
    this.roundActive = false;
    if (this.roundTimeoutObj) clearTimeout(this.roundTimeoutObj);
    const input = parseFloat(this.gameForm.controls.resultInput.value);
    const flooredInput = Math.floor(input * 10) / 10;
    if (flooredInput === this.currentRound.result) {
      this.score++;
      // show successMessage
    } else {
      // show error message
    }
    if (this.currentRoundNumber !== 9) { 
      this.currentRoundNumber++;
      this.nextRound();
    } else {
      // show last round message and score..
    }
  }

  startNextRoundTimer() {
    setInterval(() => {
      this.nextRoundTimer--;
      if (this.nextRoundTimer > 0 && !this.roundActive) {
        this.startNextRoundTimer();
      }
    }, 1000);
  }

  startRoundTimer() {
    setInterval(() => {
      this.roundTimer--;
      if (this.roundTimer > 0 && this.roundActive) {
        this.startRoundTimer();
      }
    }, 1000);
  }


  ngOnInit() {
  }

}
