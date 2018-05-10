import { Experience } from './Experience';
import { CandidatePosition } from './position';

export class Candidate {
    id_candidate: number;
    name: string;
    lastName: string;
    firstName: string;
    positions: Array<CandidatePosition>;
    newPositions: Array<CandidatePosition>;
    oldPositions: Array<any>;
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
