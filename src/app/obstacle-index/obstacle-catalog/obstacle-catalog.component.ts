import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";
import { ActivatedRoute } from '@angular/router';
import { ObstaclePopUpComponent } from '../obstacle-pop-up/obstacle-pop-up.component';
import { MatDialog } from '@angular/material';
import { DifficultyMatrixComponent } from '../difficulty-matrix/difficulty-matrix.component';
import { ChallengePopUpComponent } from '../view/challenge-pop-up/challenge-pop-up.component';

@Component({
  selector: 'app-obstacle-catalog',
  templateUrl: './obstacle-catalog.component.html',
  styleUrls: ['./obstacle-catalog.component.css']
})
export class ObstacleCatalogComponent implements OnInit {

  constructor(
    private titleService: Title,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) { }

  public obstacles = [[{name: "atest"}], [{name: "btest"}], 'c']

  ngOnInit() {
    this.titleService.setTitle("Obstacle Index")
    this.route.data.subscribe(data => {
      this.obstacles = data['catalog']
    })
  }

  openObstacle(id, type) {
    if (type === 'obstacle') {
      this.dialog.open(ObstaclePopUpComponent, { width: '400px', data: { id }});
    } else if (type === 'challenge') {
      this.dialog.open(ChallengePopUpComponent, { width: '600px', data: { id }})
    }
  }

  openMatrix() {
    this.dialog.open(DifficultyMatrixComponent)
  }

}
