export interface Member {
  name: string;
  email: string;
  officer?: 'president' | 'vice-president' | 'treasurer' | 'secretary';
  graduationDate: Date;
  employment?: string;
  selfBio?: string;
  photoURL?: string;
  id?: string;
}

export const emptyMember: Member = {
  name: '',
  email: '',
  graduationDate: new Date(),
};

export interface EventACM {
  title: string;
  description: string;
  upvotes: string[];
  date?: Date;
  presenter?: string;
  id: string;
}

export const emptyEvent: EventACM = {
  title: '',
  description: '',
  upvotes: [],
  id: '',
};
