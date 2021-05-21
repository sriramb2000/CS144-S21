import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { emit } from 'process';
import { Post } from '../post';
import { Parser, HtmlRenderer } from 'commonmark';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  constructor() { }

  @Input() post: Post;

  @Output() editPost = new EventEmitter<Post>();
  htmlRenderer = new HtmlRenderer();
  parser = new Parser();

  renderedTitle: String;
  renderedBody: String;

  editOnClick(post: Post) {
    this.editPost.emit(post);
  }

  ngOnInit(): void {
    this.renderedTitle = this.htmlRenderer.render(this.parser.parse(this.post.title));
    this.renderedBody = this.htmlRenderer.render(this.parser.parse(this.post.body));
  }

}
