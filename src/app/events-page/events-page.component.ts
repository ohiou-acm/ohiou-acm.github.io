import { Component, OnDestroy } from '@angular/core';
import { EventACM } from '../app.types';
import { MatButtonModule } from '@angular/material/button';
import { EventCardComponent } from '../event-card/event-card.component';
import { MatDialog } from '@angular/material/dialog';
import { EventFormDialogComponent } from '../event-form-dialog/event-form-dialog.component';
import {
  DocumentData,
  Firestore,
  QuerySnapshot,
  addDoc,
  collection,
  onSnapshot,
  doc,
  setDoc,
} from '@angular/fire/firestore';
import { Subscription, from, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [MatButtonModule, EventCardComponent],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.scss',
})
export class EventsPageComponent implements OnDestroy {
  constructor(public dialog: MatDialog, private store: Firestore) {}

  eventsList: EventACM[] = [];

  upcomingEvents: EventACM[] = [];
  pastEvents: EventACM[] = [];
  requestedEvents: EventACM[] = [];

  seeingScheduledEvents = true;

  subscription: Subscription = new Subscription();

  // Create a callback to reload data when Firestore has an update
  // This is done in this way to enable reload as the onSnapshot function is not a promise to be converted into an observable
  unsubscribeSnapshot = onSnapshot(
    collection(this.store, 'event'),
    (querySnapshot: QuerySnapshot<DocumentData, DocumentData>) => {
      this.eventsList = [];
      querySnapshot.forEach((doc) =>
        this.eventsList.push(this.createEvent(doc.id, doc.data()))
      );
      this.sortEvents();
    }
  );

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.unsubscribeSnapshot) {
      this.unsubscribeSnapshot();
    }
  }

  createEvent(id: string, docData: DocumentData): EventACM {
    const newEvent: EventACM = {
      title: docData['title'],
      description: docData['description'],
      upvotes: docData['upvotes'],
      presenter: docData['presenter'],
      id: id,
    };

    if (docData['date']) {
      newEvent.date = new Date(docData['date'].seconds * 1000);
    }

    return newEvent;
  }

  sortEvents() {
    this.upcomingEvents = [];
    this.pastEvents = [];
    this.requestedEvents = [];

    this.eventsList.forEach((event) => {
      if (event.date) {
        if (event.date > new Date()) {
          this.upcomingEvents.push(event);
        } else {
          this.pastEvents.push(event);
        }
      } else {
        this.requestedEvents.push(event);
      }

      this.upcomingEvents.sort((a, b) => {
        if (a.date && b.date) {
          return a.date.getTime() - b.date.getTime();
        }
        return 0;
      });

      this.pastEvents.sort((a, b) => {
        if (a.date && b.date) {
          return b.date.getTime() - a.date.getTime();
        }
        return 0;
      });

      this.requestedEvents.sort((a, b) => {
        return b.upvotes.length - a.upvotes.length;
      });
    });
  }

  updateEvent(event: EventACM) {
    this.subscription.add(
      from(setDoc(doc(this.store, 'event', event.id), event)).subscribe(() =>
        this.sortEvents()
      )
    );
  }

  addEvent() {
    const dialogRef = this.dialog.open(EventFormDialogComponent);
    this.subscription.add(
      dialogRef
        .afterClosed()
        .pipe(
          mergeMap((result) => {
            if (result) {
              return from(addDoc(collection(this.store, 'event'), result));
            }

            return of(null);
          })
        )
        .subscribe(() => this.sortEvents())
    );
  }
}
