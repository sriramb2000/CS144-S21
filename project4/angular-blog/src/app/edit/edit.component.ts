import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { emit } from 'process';
import { Post } from '../post';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  constructor() { }

  @Input() post: Post;
  modifiedTime: Date;

  @Output() savePost = new EventEmitter<Post>();

  saveOnClick(post: Post) {
    this.getModifiedTime(Date.now());
    this.savePost.emit(post);
  }

  @Output() deletePost = new EventEmitter<Post>();

  deleteOnClick(post: Post) {
    this.deletePost.emit(post);
  }

  @Output() previewPost = new EventEmitter<Post>();

  previewOnClick(post: Post) {
    this.previewPost.emit(post);
  }

  getModifiedTime(modified: number) {
    this.modifiedTime = new Date(modified);
  }

  ngOnInit(): void {

  }

}
