import { Component, OnInit, ViewChild } from '@angular/core';
import { GeneralService } from 'app/general.service';
import { TetrisCoreComponent } from 'ngx-tetris';
import {Hotkey, HotkeysService} from 'angular2-hotkeys';
import { PointsDataService } from 'app/points/points-display/points-display.service';
import { GameStatus } from './game-status.model';
import { IUser } from 'app/entities/user/user.model';

@Component({
  selector: 'jhi-tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.scss']
})
export class TetrisComponent implements OnInit {


  @ViewChild('game')
  private _tetris!: TetrisCoreComponent;

  playing = false;
  commitment = 0;
  linePoints = 0;
  totalPoints = 0;
  user!: IUser;
  status = GameStatus.START;
  reset = false;
  enoughtPoints = true;


  constructor(private generalService: GeneralService, private _hotkeysService: HotkeysService, private pointsDataService: PointsDataService) {
    this._addHotkeys();
   }

  ngOnInit(): void {


    this.totalPoints = 0;
    this.generalService.findPropertyByKey('linePoints_tetris').subscribe(cp => {
      const property = cp.body!;
      this.linePoints = Number(property.value);
    });
    this.generalService.findWidthAuthorities().subscribe(u => {
      this.user = u.body!;

      this.generalService.findPropertyByKey('commitment_tetris').subscribe(cp => {
        const property = cp.body;
        this.commitment = Number(property!.value);

        if(this.user.points < this.commitment) {
          this.enoughtPoints = false;
        }
      });
    });
  }

  startGame(): void {
    this.status = GameStatus.PLAYING;
    this.playing = true;
    if(!this.reset) {
      this.totalPoints = 0;
      this.user.points -= this.commitment;
      this.generalService.updateUserLoggedInAndPoints(this.user.id, this.user.loggedIn, this.user.points).subscribe(() => {
        this.pointsDataService.changePoint(this.user.points);
        this._tetris.actionStart();
      });
    } else {
      this.reset = false;
      this._tetris.actionStart();
    }
  }

  stopGame(): void {
    this.reset = true;
    this.playing = false;
    this.status = GameStatus.PAUSE;
    this._tetris.actionStop();
  }

  resetGame(): void {
    if(this.playing) {
      this.playing = false;
    }
    this.reset = false;
    this.status = GameStatus.START;
    this.user.points += this.totalPoints;
    this.generalService.updateUserLoggedInAndPoints(this.user.id, this.user.loggedIn, this.user.points).subscribe(() => {
      this.pointsDataService.changePoint(this.user.points);
      if(this.user.points < this.commitment) {
        this.enoughtPoints = false;
      }
      this._tetris.actionReset();
    });
  }

  onLineCleared(): void {
    this.totalPoints += this.linePoints;
    this.user.points += this.linePoints;
    this.generalService.updateUserLoggedInAndPoints(this.user.id, this.user.loggedIn, this.user.points).subscribe(() => {
      this.pointsDataService.changePoint(this.user.points);
    });
  }

  public gameOver(): void {
    this.status = GameStatus.GAMEOVER;
    this.user.points += this.totalPoints;
    this.generalService.updateUserLoggedInAndPoints(this.user.id, this.user.loggedIn, this.user.points).subscribe(() => {
      this.pointsDataService.changePoint(this.user.points);
      if(this.user.points < this.commitment) {
        this.enoughtPoints = false;
      }
    });
  }

  private _addHotkeys(): void {
    this._hotkeysService.add(new Hotkey('up', (event: KeyboardEvent): boolean => {
        this._tetris.actionRotate();
        return false; // Prevent bubbling
    }));

    this._hotkeysService.add(new Hotkey('left', (event: KeyboardEvent): boolean => {
        this._tetris.actionLeft();
        return false; // Prevent bubbling
    }));

    this._hotkeysService.add(new Hotkey('down', (event: KeyboardEvent): boolean => {
        this._tetris.actionDown();
        return false; // Prevent bubbling
    }));

    this._hotkeysService.add(new Hotkey('right', (event: KeyboardEvent): boolean => {
        this._tetris.actionRight();
        return false; // Prevent bubbling
    }));
}
}
