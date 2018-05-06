import { Experience } from './Experience';

export class Candidate {
    id_candidate: number;
    name: string;
    lastName: string;
    firstName: string;
    position: string;
    positions: Array<any>;
    newPositions: Array<any>;
    oldPositions: Array<any>;
    status: string;
    exp: Array<Experience>;
    telephone: string;
    address: string;
    email: string;
    skills: any[];
    oldExp: Array<Experience>;
    newExp: Array<Experience>;
    oldSkills: Array<any>;
    newSkills: Array<any>;
  }
