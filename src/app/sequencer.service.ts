import { BehaviorSubject, Observable, Subscription } from 'rxjs';

export type ToneIdType = string;

export interface DisplayTone {
    customName?: null | string,
    tooltip?: null | string
}

export type SequenceEvent = {[key: ToneIdType]: DisplayTone | string};

export class SequencerService {

    SEQUENCE_BEAT_DEFAULT = 1000;

    private muted$ = new BehaviorSubject<boolean>(false);

    private playing$ = new BehaviorSubject<boolean>(false);
    private sequenceBeatMs$ = new BehaviorSubject<number>(this.SEQUENCE_BEAT_DEFAULT);
    private displayTones$ = new BehaviorSubject<SequenceEvent>({});

    private sequenceIndex$ = new BehaviorSubject<number>(0);
    private sequence: SequenceEvent[] = [];

    private sequenceIndexSubscription: null | Subscription = null;

    private animationRunning: boolean = false;

    constructor() {
        const self = this;
        this.playing$.subscribe({
            next() {
                if (self.playing$.getValue())
                    self.animateStep();
            }
        });
    }

    getPlayingObservable(): Observable<boolean> {
        return this.playing$;
    }

    getMutedObservable(): Observable<boolean> {
        return this.muted$;
    }

    getDisplayTonesObservable(): Observable<SequenceEvent> {
        return this.displayTones$;
    }

    setTempo(value: number) {
        this.sequenceBeatMs$.next(1000*60/value);
    }

    togglePlaying() {
        this.playing$.next(!this.playing$.getValue());
    }

    isPlaying() {
        return this.playing$.getValue();
    }

    toggleMuted() {
        this.muted$.next(!this.muted$.getValue());
    }

    isMuted() {
        return this.muted$.getValue();
    }

    goToBeginning() {
        if (this.playing$.getValue())
            return;
        this.sequenceIndex$.next(0);
    }

    isAtTheBeginning() {
        return this.sequenceIndex$.getValue() === 0;
    }

    setPreviousStep() {
        if (this.playing$.getValue())
            return;

        const index = this.sequenceIndex$.getValue();
        if (index > 0) {
            this.sequenceIndex$.next(index-1);
        }
    }

    setNextStep() {
        if (this.playing$.getValue())
            return;

        let index = this.sequenceIndex$.getValue();
        if (/* TODO REPEAT */index === this.sequence.length - 1) {
            index = 0;
        }

        if (index < this.sequence.length - 1) {
            this.sequenceIndex$.next(index + 1);
        }
    }

    setSequence(sequence: SequenceEvent[]) {
        this.sequence = sequence;

        if (this.sequenceIndexSubscription) {
            this.sequenceIndexSubscription.unsubscribe();
        }
        this.sequenceIndex$.next(0);

        const self = this;
        this.sequenceIndexSubscription = this.sequenceIndex$.subscribe({
            next() { self.animateStep(); }
        });
    }

    private animateStep() {

        if (this.animationRunning)
            return;

        this.animationRunning = true;

        const event: SequenceEvent = this.sequence[this.sequenceIndex$.getValue()];

        // if the event is empty (no notes playing), and the next is not empty, skip to the next one
        /*if (Object.keys(event).length === 0) {
            if (this.sequenceIndex$.getValue() + 1 < this.sequence.length) {
                if (Object.keys(this.sequence[this.sequenceIndex$.getValue() + 1]).length != 0) {
                    this.animationRunning = false;
                    this.sequenceIndex$.next(this.sequenceIndex$.getValue() + 1);
                    return;
                }
            }
        }*/
        this.displayTones$.next(event);

        if (!this.playing$.getValue()) {
            this.animationRunning = false;
            return;
        }

        const self = this;
        setTimeout(() => {
            this.animationRunning = false;

            let index = self.sequenceIndex$.getValue() + 1;

            if (/* TODO REPEAT */index === self.sequence.length) {
                index = 0;
            }

            if (index < self.sequence.length && self.playing$.getValue())
                self.sequenceIndex$.next(index);

        }, this.sequenceBeatMs$.getValue());
    }
}
