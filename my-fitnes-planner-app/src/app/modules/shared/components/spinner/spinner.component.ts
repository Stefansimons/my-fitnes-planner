import { Observable } from 'rxjs';
import { OverlayService } from './../../../../material/overlay.service';
import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { SpinnerService } from '../../services/spinner.service';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent implements OnInit {
  // ******************** Spinner with backdrop , material ************
  @Input() color?: string;
  @Input() diameter?: number = 100;
  @Input() strokeWidth?: number;
  @Input() value?: number;
  @Input() backdropEnabled = true;
  @Input() positionGloballyCenter = true;
  @Input() displayProgressSpinner: boolean;

  @ViewChild('progressSpinnerRef')
  private progressSpinnerRef: TemplateRef<any>;
  private progressSpinnerOverlayConfig: OverlayConfig;
  private overlayRef: OverlayRef;

  subsink: SubSink;
  constructor(
    private ss: SpinnerService,
    private vcRef: ViewContainerRef,
    private overlayService: OverlayService
  ) {}

  ngOnInit(): void {
    // Config for Overlay Service
    this.progressSpinnerOverlayConfig = {
      hasBackdrop: this.backdropEnabled,
    };

    if (this.positionGloballyCenter) {
      this.progressSpinnerOverlayConfig['positionStrategy'] =
        this.overlayService.positionGloballyCenter();
    }

    // Create Overlay for progress spinner
    this.overlayRef = this.overlayService.createOverlay(
      this.progressSpinnerOverlayConfig
    );
  }
  ngDoCheck() {
    console.log('ngDoCheck=>progressSpinnerRef=>', this.progressSpinnerRef);

    // Based on status of displayProgressSpinner attach/detach overlay to progress spinner template
    if (this.displayProgressSpinner && !this.overlayRef.hasAttached()) {
      this.overlayService.attachTemplatePortal(
        this.overlayRef,
        this.progressSpinnerRef,
        this.vcRef
      );
    } else if (!this.displayProgressSpinner && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }
  }
  ngOnDestroy(): void {
    console.log('ngOnDestroy');

    // this.ss.getIsDisplay().unsubscribe();
  }
}
