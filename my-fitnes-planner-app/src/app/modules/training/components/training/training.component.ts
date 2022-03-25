import { SpinnerService } from './../../../shared/services/spinner.service';
import { map } from 'rxjs/operators';
import { TrainingService } from './../../services/training.service';
import { Training } from './../../models/training.model';
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  ElementRef,
  Input,
} from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit {
  @Input() name: string;
  @ViewChild('mymodalcontent', { read: TemplateRef })
  modalTemplate: TemplateRef<any>;

  modalOptions: NgbModalOptions; // NGB POPUP MODAL OPTIONS

  modalRef: any;

  title: string;

  training: Training;
  constructor(
    private ts: TrainingService,
    private modalService: NgbModal,
    private ss: SpinnerService
  ) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop',
    };
  }

  ngOnInit(): void {}
  /**
   *  NOTE: SETTER SET VALUE
   * @param training
   */
  editTraining(training: Training) {
    // open modal and pass training
    this.training = training;
    this.ss.show();
    // NOTE: TIMEOUT IN ORDER TO COMPONENT PASSED TO MODAL BODY BE READ(NGONINIT HOOK)
    setTimeout(() => {
      this.ts.editTraining(training);
      this.ss.hide();
    }, 200);
    this.open(this.modalTemplate, true);
  }
  /**
   * Child (@OUTPUT) - Parent - Child(@INPUT)
   */
  newItemAdded(e: boolean) {
    // this.isNewItem = e;
  }
  /**
   *
   * @param content
   */
  open(content: any, isEdit: boolean) {
    this.title = isEdit
      ? `Training: ${this.training.typeOfTraining}`
      : 'Novi training';

    this.modalService.open(content, this.modalOptions).result.then(
      (result) => {
        //   this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
  }
}
