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
    private repeat$ = new BehaviorSubject<boolean>(false);

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
        if (this.sequenceIndex$.getValue() === -1) {
            this.sequenceIndex$.next(0);
        }
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

    toggleRepeat() {
        this.repeat$.next(!this.repeat$.getValue());
    }

    isRepeat() {
        return this.repeat$.getValue();
    }

    goToBeginning() {
        if (this.playing$.getValue())
            return;
        this.sequenceIndex$.next(-1);
    }

    isAtTheBeginning() {
        return this.sequenceIndex$.getValue() === -1 || this.sequenceIndex$.getValue() === 0;
    }

    isAtTheEnd() {
        return this.sequenceIndex$.getValue() === this.sequence.length - 1;
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
        if (this.repeat$.getValue() && index === this.sequence.length - 1) {
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
        this.sequenceIndex$.next(-1);

        const self = this;
        this.sequenceIndexSubscription = this.sequenceIndex$.subscribe({
            next() { self.animateStep(); }
        });
    }

    private animateStep() {

        if (this.animationRunning)
            return;

        if (this.sequence.length === 0)
            return;

        if (this.sequenceIndex$.getValue() === -1) {
            this.displayTones$.next({});
            return;
        }

        this.animationRunning = true;

        const event: SequenceEvent = this.sequence[this.sequenceIndex$.getValue()];
        this.displayTones$.next(event);

        if (!this.playing$.getValue()) {
            this.animationRunning = false;
            return;
        }

        const self = this;
        setTimeout(() => {
            this.animationRunning = false;

            let index = self.sequenceIndex$.getValue() + 1;

            if (self.repeat$.getValue() && index === self.sequence.length) {
                index = 0;
            }

            if (self.playing$.getValue()) {
                if (index < self.sequence.length)
                    self.sequenceIndex$.next(index);
                else {
                    self.playing$.next(false);
                    this.sequenceIndex$.next(-1);
                }
            }

        }, this.sequenceBeatMs$.getValue());
    }
}
