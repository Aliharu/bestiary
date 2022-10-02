import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { BeastService } from 'src/app/util/services/beast.service';
import { ObstacleService } from 'src/app/util/services/obstacle.service';
import variables from '../../../../local.js'
import { Router } from '@angular/router';
import mermaid from "mermaid";
import { ToastrService } from 'ngx-toastr';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-challenge-pop-up',
  templateUrl: './challenge-pop-up.component.html',
  styleUrls: ['./challenge-pop-up.component.css']
})
export class ChallengePopUpComponent implements OnInit {
  @ViewChild("mermaid")
  public mermaidDiv;

  @Input() id: Number;
  @Input() beastEntry: boolean;

  constructor(
    public obstacleService: ObstacleService,
    public beastService: BeastService,
    private router: Router,
    private toastr: ToastrService,
    private changeDetector: ChangeDetectorRef,
    private titleService: Title,
    private metaService: Meta
  ) { }

  public challenge: any = {}
  public loggedIn: boolean | string | number = false;
  public loginEndpoint = variables.login

  public viewObstacleId = 0;

  ngOnInit() {
    this.obstacleService.getObstacle(this.id, 'challenge').subscribe(challenge => {
      this.challenge = challenge
      this.titleService.setTitle(this.challenge.name)
      this.metaService.addTag( { name:'description', content: `${this.challenge.name} Skill Challenge`});
      this.metaService.addTag( { name:'image', content: "../../../assets/TWRealFire.png"});
      setTimeout(() => this.initMermaid(this.challenge.flowchart), 500)
    })
    this.beastService.checkLogin().subscribe(result => {
      this.beastService.loggedIn = result
      this.loggedIn = result
    })
  }

  public initMermaid(graphDefinition): void {
    mermaid.initialize({
      theme: "neutral"
    });
    const element: any = this.mermaidDiv.nativeElement;
    mermaid.render("graphDiv", graphDefinition, (svgCode, bindFunctions) => {
      element.innerHTML = svgCode;
      this.setUpEventListeners()
    });
  }

  setUpEventListeners() {
    let nodes = Array.from(document.getElementsByClassName('node'));
    nodes.forEach(node => {
      let label = node.children.item(1).children.item(0).children.item(0).children.item(0).innerHTML
      this.obstacleService.checkIfObstacleIsValid(label).subscribe(result => {
        if (result.id) {
          node.addEventListener('click', this.showPopup(result.id));
        } else {
          node.addEventListener('click', this.showError(label));
        }
      })
    })
  }

  showPopup = (id) => {
    return () => {
      this.viewObstacleId = id
    }
  }

  handleMessage(message) {
    this.toastr.error(message)
  }

  showError = (label) => {
    let handleMessage = this.handleMessage.bind(this);
    return () => {
      this.viewObstacleId = 0
      handleMessage(`"${label}" doesn't currently have a valid Obstacle associated with it`)
    }
  }

  goToEditBinded = this.goToEdit.bind(this)
  
  goToEdit() {
    this.router.navigate([`/obstacle/edit/${this.viewObstacleId}`])
  }
  
  goToEditChallenge() {
    this.router.navigate([`/obstacle/edit/${this.challenge.id},challenge`])
  }
}
