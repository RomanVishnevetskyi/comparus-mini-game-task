import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription, take } from 'rxjs';

@Component({
  selector: 'app-mini-game',
  templateUrl: './mini-game.component.html',
  styleUrls: ['./mini-game.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiniGameComponent implements OnInit, OnDestroy {

  cells: Array<string> = Array(100).fill('blue');
  playerScore: number = 0;
  computerScore: number = 0;
  reactionTime: number = 1000;
  gameOver: boolean = false;
  winnerMessage: string = '';
  currentYellowCell: number | null = null;
  timerSubscription!: Subscription | null;

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit(): void {
  }

  startGame() {
    this.resetGame();
    this.nextRound();
  }

  resetGame() {
    this.playerScore = 0;
    this.computerScore = 0;
    this.cells.fill('blue');
    this.gameOver = false;
    this.winnerMessage = '';
    this.timerSubscription?.unsubscribe();
    this.cdr.markForCheck()
  }

  nextRound() {
    if (this.gameOver) return;

    this.setRandomYellowCell();

    this.timerSubscription = interval(this.reactionTime).pipe(take(1)).subscribe(
      () => {
        if (this.currentYellowCell !== null) {
          this.cells[this.currentYellowCell] = 'red';
          this.computerScore++;
          this.checkGameOver();
          if (!this.gameOver) this.nextRound();
          this.cdr.markForCheck();
        }
      })
  }

  setRandomYellowCell() {
    this.currentYellowCell = Math.floor(Math.random() * 100);
    this.cells[this.currentYellowCell] = 'yellow';
    this.cdr.markForCheck()
  }

  onCellClick(index: number) {
    if (this.currentYellowCell === index) {
      this.cells[index] = 'green';
      this.playerScore++;
      this.currentYellowCell = null;
      this.timerSubscription?.unsubscribe();
      this.checkGameOver();
      if (!this.gameOver) this.nextRound();
      this.cdr.markForCheck()
    }
  }

  checkGameOver() {
    if (this.playerScore >= 10 || this.computerScore >= 10) {
      this.gameOver = true;
      this.winnerMessage = this.playerScore >= 10 ? 'You win!' : 'Computer win';
    }
  }

  restartGame() {
    this.startGame();
  }

  exitGame() {
    this.resetGame();
  }

  ngOnDestroy() {
    this.timerSubscription?.unsubscribe();
  }
}
