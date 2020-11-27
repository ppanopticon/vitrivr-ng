import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaObject} from '../shared/model/media/media-object.model';
import {ResolverService} from '../core/basics/resolver.service';
import {EventBusService} from '../core/basics/event-bus.service';
import {PreviousRouteService} from '../core/basics/previous-route.service';
import {LookupService} from '../core/lookup/lookup.service';
import {MediaSegment} from '../shared/model/media/media-segment.model';


@Component({
  selector: 'app-objectviewer',
  templateUrl: 'objectviewer.component.html',
})
export class ObjectviewerComponent {
  @ViewChild('audioplayer')
  public audioplayer: any;

  @ViewChild('videoplayer')
  public videoplayer: any;

  @ViewChild('imageviewer')
  public imageviewer: any;

  @Input() mediaobject: MediaObject;

  constructor(private _route: ActivatedRoute,
              private _router: Router,
              private  _eventBusService: EventBusService,
              public _resolver: ResolverService,
              private _historyService: PreviousRouteService,
              private _lookupService: LookupService) {
    console.debug(`initializing objectviewer`)
  }

  /**
   * Triggered whenever someone clicks the 'Back' button. Returns to the last page,
   * i.e. usually the gallery.
   */
  public onBackClick() {
    if (this._historyService.getPreviousRoute()) {
      this._historyService.goToPrevious();
      return
    }
    this._historyService.goToRoot();
  }

  public onPlayClick(segment: MediaSegment) {
    if (this.audioplayer !== undefined) {
      this.audioplayer.nativeElement.currentTime = segment.startabs;
      this.audioplayer.nativeElement.play();
    } else if (this.videoplayer !== undefined) {
      this.videoplayer.nativeElement.currentTime = segment.startabs;
      this.videoplayer.nativeElement.play();
    }
  }
}
