import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MemberCardComponent } from '../member-card/member-card.component';
import { Member } from '../app.types';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MemberFormDialogComponent } from '../member-form-dialog/member-form-dialog.component';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
} from '@angular/fire/firestore';
import { Subscription, from, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-members-page',
  standalone: true,
  imports: [MatExpansionModule, MemberCardComponent, MatButtonModule],
  templateUrl: './members-page.component.html',
  styleUrl: './members-page.component.scss',
})
export class MembersPageComponent implements OnInit, OnDestroy {
  constructor(public dialog: MatDialog, private store: Firestore) {}

  membersList: Member[] = [];

  currentOfficers: Member[] = [];
  currentOfficersExpanded = true;

  currentMembers: Member[] = [];
  currentMembersExpanded = true;

  alumni: Member[] = [];
  alumniExpanded = true;

  subscription: Subscription = new Subscription();
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    // load users from firebase
    const memberCollection = collection(this.store, 'members');
    // create an observable of the members collection
    const member$ = collectionData(memberCollection);

    this.subscription.add(
      member$.subscribe((members) => {
        this.membersList = members.map((member) => {
          const newMember: Member = {
            name: member['name'],
            email: member['email'],
            graduationDate: new Date(member['graduationDate'].seconds * 1000),
          };

          if (member['officer']) {
            newMember.officer = member['officer'];
          }
          if (member['employment']) {
            newMember.employment = member['employment'];
          }
          if (member['selfBio']) {
            newMember.selfBio = member['selfBio'];
          }
          if (member['photoURL']) {
            newMember.photoURL = member['photoURL'];
          }

          return newMember;
        });

        // sort members by graduation date, seniors at the top
        this.membersList.sort((a, b) => {
          return a.graduationDate.getTime() - b.graduationDate.getTime();
        });

        this.groupMembers();
      })
    );
  }

  //group members into current officers, current members, and alumni
  groupMembers() {
    this.currentOfficers = [];
    this.currentMembers = [];
    this.alumni = [];

    this.membersList.forEach((member) => {
      if (member.graduationDate > new Date()) {
        if (member.officer) {
          this.currentOfficers.push(member);
        } else {
          this.currentMembers.push(member);
        }
      } else {
        this.alumni.push(member);
      }
    });
  }

  // if user signed in then allow them to create themselves as a member
  updateMember(member?: Member) {
    const dialogRef = this.dialog.open(MemberFormDialogComponent, {
      data: member,
    });

    this.subscription.add(
      dialogRef
        .afterClosed()
        .pipe(
          mergeMap((result) => {
            if (result) {
              // update firebase with new member info
              return from(addDoc(collection(this.store, 'members'), result));
            }
            return of(null);
          })
        )
        .subscribe((result) => {
          if (result) {
            this.groupMembers();
          }
        })
    );
  }
}
