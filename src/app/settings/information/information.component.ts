import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ResultSetInfoService} from '../../core/queries/result-set-info.service';
import {Preference, Tag} from '../../shared/model/misc/tag.model';
import {CaptionWithCount} from '../../shared/model/misc/caption-with-count.model';
import {QueryService} from '../../core/queries/query.service';
import {filter, map} from 'rxjs/operators';
import {Options, TagCloud, Word} from 'd3-tagcloud';
import {ThemePalette} from '@angular/material/core';
import {FormControl} from '@angular/forms';
import {EventBusService} from '../../core/basics/event-bus.service';
import {InteractionEvent} from '../../shared/model/events/interaction-event.model';
import {ContextKey, InteractionEventComponent} from '../../shared/model/events/interaction-event-component.model';
import {InteractionEventType} from '../../shared/model/events/interaction-event-type.model';


@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css'],
})
/**
 * Component that displays information about the result set
 */
export class InformationComponent implements OnInit {

  /** config for score histogram */
  public title = 'Score distribution';
  public type = 'ColumnChart';
  public columnNames = ['score', 'number of occurrences'];
  public options = {
    legend: 'none',
    vAxis: {title: 'occurences', scaleType: 'log'},
    hAxis: {title: 'score'},
  };
  public width = 295;
  public height = 200;


  /** The current configuration as observable. */
  /** Local reference to the subscription to the QueryService. */
  public tagOccurrence: Tag[];
  public captionOccurrence: CaptionWithCount[];

  /** arrays to store the scores in, used to create the histogram*/
  public scores: number[] = [];
  public dataScores = [];
  public dataScoresReduced = [];


  /** Tag that is chosen to be added to the query*/
  public newTagForQuery: Tag;

  Preference = Preference;

  public tagCloud: TagCloud;
  @ViewChild('cloud') cloud: ElementRef;

  /** number of related tags to be shown in query refinement tab */
  @Input() public numberOfRelatedTagsShown: number;
  /** number of terms used in captions to be shown in query refinement tab */
  @Input() public numberOfCaptionTermsShown: number;

  color: ThemePalette = 'accent';
  checked = false;
  listTrue: boolean;

  toggle = new FormControl('', []);

  constructor(private _resultSetInfoService: ResultSetInfoService, private _queryService: QueryService, private _eventBusService: EventBusService) {
  }

  /**
   * Lifecycle Hook (onInit): Subscribes to the QueryService observable.
   */
  public ngOnInit(): void {
    this.toggle.valueChanges.subscribe(newToggleValue => {
      this.listTrue = newToggleValue;
    });

    this.resultSetInfoService.currentNewTagForQuery.subscribe(message => this.newTagForQuery = message);
    this.resultSetInfoService.currentTopTagsArray.subscribe(message => {
      this.tagOccurrence = message;
    });
    this.resultSetInfoService.currentCaption.subscribe(message => {
      if (!message) {
        return;
      }
      this.captionOccurrence = message;
      if (!this.tagCloud) {
        this.tagCloud = new TagCloud(this.cloud.nativeElement);
        const options: Options = {
          orientation: 'single' //  default is 'right angled','single','right angled','multiple'
        };
        this.tagCloud.setOptions(options);
      }
      if (this.tagCloud) {
        this.tagCloud._emptyDOM();
        this.tagCloud.setData(this.captionToWord(this.captionOccurrence));
        this.tagCloud.resize();
      }
    });

    this.queryService.observable.pipe(
      filter(msg => {
        return ['STARTED'].indexOf(msg) > -1;
      })
    ).subscribe(() => {
      this.tagOccurrence = [];
      this.captionOccurrence = [];
      this.scores = [];
      this.dataScores = [];
      this.dataScoresReduced = [];
    });

    this.queryService.observable.pipe(
      filter(msg => {
        return ['ENDED'].indexOf(msg) > -1;

      })
    ).subscribe(() => {
      this.queryService.results.segmentsAsObservable.pipe(
        map(segments => segments.filter(segment => segment.score >= 0.9))
      ).subscribe(scores => {
        this.scores[9] = scores.length;
      });
      this.queryService.results.segmentsAsObservable.pipe(
        map(segments => segments.filter(segment => segment.score >= 0.8 && segment.score < 0.9))
      ).subscribe(scores => {
        this.scores[8] = scores.length;
      });
      this.queryService.results.segmentsAsObservable.pipe(
        map(segments => segments.filter(segment => segment.score >= 0.7 && segment.score < 0.8))
      ).subscribe(scores => {
        this.scores[7] = scores.length;
      });
      this.queryService.results.segmentsAsObservable.pipe(
        map(segments => segments.filter(segment => segment.score >= 0.6 && segment.score < 0.7))
      ).subscribe(scores => {
        this.scores[6] = scores.length;
      });
      this.queryService.results.segmentsAsObservable.pipe(
        map(segments => segments.filter(segment => segment.score >= 0.5 && segment.score < 0.6))
      ).subscribe(scores => {
        this.scores[5] = scores.length;
      });
      this.queryService.results.segmentsAsObservable.pipe(
        map(segments => segments.filter(segment => segment.score >= 0.4 && segment.score < 0.5))
      ).subscribe(scores => {
        this.scores[4] = scores.length;
      });
      this.queryService.results.segmentsAsObservable.pipe(
        map(segments => segments.filter(segment => segment.score >= 0.3 && segment.score < 0.4))
      ).subscribe(scores => {
        this.scores[3] = scores.length;
      });
      this.queryService.results.segmentsAsObservable.pipe(
        map(segments => segments.filter(segment => segment.score >= 0.2 && segment.score < 0.3))
      ).subscribe(scores => {
        this.scores[2] = scores.length;
      });
      this.queryService.results.segmentsAsObservable.pipe(
        map(segments => segments.filter(segment => segment.score >= 0.1 && segment.score < 0.2))
      ).subscribe(scores => {
        this.scores[1] = scores.length;
      });
      this.queryService.results.segmentsAsObservable.pipe(
        map(segments => segments.filter(segment => segment.score >= 0.0 && segment.score < 0.1))
      ).subscribe(scores => {
        this.scores[0] = scores.length;
      });
      for (let i = 0; i < this.scores.length; i++) {
        const scoreArr = [];
        const zeroPointOne = +0.1.toPrecision(1);
        const score = +(i / 10).toPrecision(1);
        const result = (zeroPointOne + score).toPrecision(1);
        scoreArr.push(result.toString(), this.scores[i]);
        this.dataScoresReduced.push(scoreArr);
      }
      this.dataScores = Object.assign([], this.dataScoresReduced);
    });

    /** default is 10, can be adjusted in UI */
    this.numberOfRelatedTagsShown = 10;
    /** default is 25, currently not adjusted in UI because there is no space for more terms */
    this.numberOfCaptionTermsShown = 25;


  }

  /** called to transform a Caption object into a Word object, so it can be used in the word cloud */
  captionToWord(captionTerms: CaptionWithCount[]): Word[] {
    const words = [] as Array<Word>;
    for (let i = 0; i < Math.min(25, captionTerms.length); i++) {
      const word = {} as Word;
      word.text = captionTerms[i].caption;
      word.value = captionTerms[i].occurrence;
      words.push(word);
    }
    return words;
  }


  get queryService(): QueryService {
    return this._queryService;
  }

  get resultSetInfoService(): ResultSetInfoService {
    return this._resultSetInfoService;
  }

  /** called to add a related tag to query */
  onPreferenceChange(preference: Preference, tag: Tag) {
    const context: Map<ContextKey, any> = new Map();
    context.set('i:tagid', tag.id)
    context.set('i:tagcount', tag.count)
    this._eventBusService.publish(new InteractionEvent(new InteractionEventComponent(InteractionEventType.ADD_TAG_FROM_RESULT_INFO, context)))
    tag.preference = preference;
    this.resultSetInfoService.changeTagForQuery(tag);
  }

  getPreference(tag: Tag) {
    return tag.preference;
  }

  ifPreferenceExists(tag: Tag) {
    return tag.preference != null;
  }

  changeNumberOfTagsShown() {
    return this.numberOfRelatedTagsShown;
  }


}


