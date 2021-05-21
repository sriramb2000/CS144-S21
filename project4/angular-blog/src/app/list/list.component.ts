import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { emit } from 'process';
import { Post } from '../post';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  constructor() { }

  @Input() posts: Post[];

  @Output() openPost = new EventEmitter<Post>();

  openOnClick(post: Post) {
    this.openPost.emit(post);
  }

  ngOnInit(): void {
  }

  intToDate(dateInt: number): String {
    var dateTime = new Date(dateInt).toString();
    return dateTime;
  }

  @Output() newPost = new EventEmitter<Post>();
  generateNewPost() {
    this.newPost.emit();
  }

}
