import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import {NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import { CANDIDATES_DETAIL } from '../../mock-candidates-detail';
import { take } from 'rxjs/operator/take';

import { CandidateService } from '../../candidate.service';
import { Candidate } from '../../candidate';
import { Experience} from '../../Experience';

@Component({
  selector: 'app-candidate-detail',
  templateUrl: './candidate-detail.component.html',
  styleUrls: ['./candidate-detail.component.scss']
})
export class CandidateDetailComponent implements OnInit {

  data: Observable<any>;
  activeEdit = false;
  candidate: Candidate;
  id = +this.route.snapshot.paramMap.get('id');
  newExp: Experience = new Experience();
  editPositionActive;


  constructor(
    private route: ActivatedRoute,
    private candidateService: CandidateService,
    private location: Location,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getCandidate();
  }

  getCandidate(): void {
    this.candidateService.getCandidate(this.id)
      .subscribe((data: any) => {
        if(data && data.docs){
          data.docs.exp.forEach(item => {
            item.dateStart = this.stringToDate(item.dateStart);
            if(item.dateEnd){
              item.dateEnd = this.stringToDate(item.dateEnd);
            }
          });
          this.data = data;
          this.candidate = data.docs;
          this.candidate.oldExp = new Array<any>();
          this.candidate.newExp = new Array<any>();
          this.candidate.oldSkills = new Array<any>();
          this.candidate.newSkills = new Array<any>();
        }
      });
  }

  addPosition(): void {
    if(!this.contains(this.candidate.positions, this.editPositionActive)){
      this.candidate.positions.push(this.editPositionActive);
      this.candidate.newPositions.push(this.editPositionActive);
    }
  }

  onChangeTo(item: Date, index: number){
    console.log(item);
    this.candidate.exp[index].dateEnd = item;
  }
  onChangeFrom(item: Date, index: number){
    console.log(item + " " + index);
    this.candidate.exp[index].dateStart = item;
  }

  changeProfile(): void {
    this.candidateService.getCandidate(this.id, this.candidate.position)
      .subscribe((data: any) => {
        this.data = data;
        this.candidate = data.docs;
        console.log(this.candidate);
      });
  }

  stringToDate(str: string): Date{
    return new Date(str);
  }

  openSkillAdd(modal): void{
    this.modalService.open(modal);
  }
  openExpAdd(modal): void{
    this.modalService.open(modal);
  }
  openAddPositionModal(modal): void{
    this.modalService.open(modal);
  }

  addSkill(skill): void{
    const cand = this.candidate;
    if(!this.contains(this.candidate.skills , skill)){
      this.candidate.oldSkills.forEach(function (elem, index) {
        if( elem.name === skill ){
          cand.oldSkills.splice(index, 1);
        }
      });
      this.candidate.skills.push({name: skill});
      this.candidate.newSkills.push(({name: skill}));
    }
  }

  contains(array: Array<any>, str: string): boolean{
    let f1 = false;
    array.forEach(function (item, index) {
      if(item.name === str){
        f1 = true;
      }
    });
    return f1;
  }

  deleteSkill(skill: string): void{
    let cand = this.candidate;
    if(this.activeEdit){
      this.candidate.skills.forEach(function (item, index) {
        if(item.name === skill){
          cand.newSkills.forEach(function (elem, index) {
            if( elem.name === skill ){
              cand.newSkills.splice(index, 1);
            }
          });
          cand.skills.splice(index, 1);
          cand.oldSkills.push({name: item.name});
        }
      });

    }
  }


  toggleToEditable(): void {
    this.activeEdit = true;
  }

  splitName(): void {
    const splitedArr = this.candidate.name.split(' ');
    this.candidate.firstName = splitedArr[0];
    this.candidate.lastName = '';
    if(splitedArr.length > 1){
      for(let i = 1; i < splitedArr.length; i++){
        this.candidate.lastName += splitedArr[i] + ' ';
      }
    }
  }

  deleteExp(index: number){
    console.log(index);
    let exp = new Experience();
    if ( this.candidate.exp[index].id_experience ){
      exp.id_experience = this.candidate.exp[index].id_experience;
      this.candidate.oldExp.push(exp);
      this.candidate.exp.splice(index, 1);
    } else {
      let spl = (this.candidate.newExp.length - 1) - (this.candidate.exp.length - 1 - index );
      console.log('splice: ' + spl);
      this.candidate.exp.splice(index, 1);

      this.candidate.newExp.splice(spl, 1);
    }
  }
  addExp(): void{
    console.log(this.newExp);
    this.candidate.exp.push(this.newExp);
    this.candidate.newExp.push(this.newExp);
    this.newExp = new Experience();
  }

  addNewExpFrom(event): void{
    this.newExp.dateStart = event;
  }
  addNewExpTo(event): void{
    this.newExp.dateEnd = event;
  }

  updateCandidateSkills(): void{
  }

  saveData(): void {
    this.splitName();
    this.updateCandidateSkills();
    this.candidateService.update(this.id, this.candidate);
    console.log(this.candidate);
    this.activeEdit = false;
  }


}
