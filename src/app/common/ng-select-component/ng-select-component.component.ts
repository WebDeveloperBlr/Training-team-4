import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-ng-select-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ng-select-component.component.html',
  styleUrls: ['./ng-select-component.component.scss']
})

export class NgSelectComponentComponent implements OnInit{

  defaultBindingsList = [
    { value: 1, label: 'Vilnius' },
    { value: 2, label: 'Kaunas' },
    { value: 3, label: 'Pavilnys', disabled: true }
  ];

  statuses = [
    {id_status: 1, name: 'Any'},
    {id_status: 2, name: 'CV-rejected'},
    {id_status: 3, name: 'Interview accepted'},
    {id_status: 3, name: 'CV-accepted'}
  ];
  selectedItemId: number = null;

  cities = [
    { id: 1, name: 'Vilnius' },
    { id: 2, name: 'Kaunas' },
    { id: 3, name: 'Pavilnys', disabled: true }
  ];

  countries = [
    { id: 1, nested: { countryId: 'L', name: 'Lithuania' } },
    { id: 2, nested: { countryId: 'U', name: 'USA' } },
    { id: 3, nested: { countryId: 'A', name: 'Australia' } }
  ];

  selectedCountryId: string = null;
  selectedCity = null;
  selectedCityId: number = null;

  ngOnInit() {
    this.selectedCountryId = this.countries[0].nested.countryId;
    this.selectedCity = this.defaultBindingsList[0];
    this.selectedCityId = this.cities[0].id;
    this.selectedItemId = this.statuses[0].id_status;
  }
}

