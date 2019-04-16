import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tablelayout',
  templateUrl: './tablelayout.component.html',
  styleUrls: ['./tablelayout.component.css']
})
export class TablelayoutComponent implements OnInit {
  data: any

  constructor(private http: HttpClient) {}   

  ngOnInit() {
  }
}

