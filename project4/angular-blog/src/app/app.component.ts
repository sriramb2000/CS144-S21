import { Component } from '@angular/core';
import { Post } from './post';
import { BlogService } from './blog.service';
import * as cookie from 'cookie';

enum AppState { List, Edit, Preview };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  posts: Post[];
  currentPost: Post;
  appState: AppState;
  cookies = cookie.parse(document.cookie);
  usr: string;

  constructor(private blogService: BlogService) {
    this.usr = this.parseJWT(document.cookie).usr;
    blogService.fetchPosts(this.usr).then((posts) => {
      posts.sort((a, b) => (a.postid > b.postid) ? 1 : -1);
      this.posts = posts;
      this.onHashChange();
      window.addEventListener("hashchange", () => this.onHashChange());
    })

  }

  // event handlers for list component events
  openPost(post: Post) {
    this.currentPost = post;
    window.location.hash = '#/edit/' + post.postid.toString();
    this.appState = AppState.Edit;
  }

  newPost() {
    this.currentPost = new Post();
    this.currentPost.modified = Date.now();
    this.currentPost.created = Date.now();
    window.location.hash = '#/edit/0';
    this.appState = AppState.Edit;
  }

  // event handlers for edit component events
  previewPost(post: Post) {
    window.location.hash = '#/preview/' + post.postid.toString();
    this.appState = AppState.Preview;
  }

  savePost(post: Post) {
    this.blogService.setPost(this.usr, post).then((savedPost) => {
      this.currentPost.modified = savedPost.modified;

      if (post.postid == 0) {
        this.posts.push(savedPost);
        this.currentPost.postid = savedPost.postid;
        window.location.hash = '#/edit/' + this.currentPost.postid.toString();
      }
    })
  }

  deletePost(post: Post) {
    this.blogService.deletePost(this.usr, post.postid);
    this.deleteHelper(post.postid);
    this.appState = AppState.List;
  }

  deleteHelper(ind: number) {
    this.posts.forEach((value, index) => {
      if (value.postid == ind) this.posts.splice(index, 1)
    })
  }

  // event handlers for preview component events
  editPost(post: Post) {
    window.location.hash = '#/edit/' + post.postid.toString();
    this.appState = AppState.Edit
  }

  // check the appState used in the template
  ifEdit() {
    return this.appState == AppState.Edit;
  }

  ifPreview() {
    return this.appState == AppState.Preview;
  }

  // cookies?
  parseJWT(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  }

  // hash for associating states with url
  onHashChange() {
    let parameters = window.location.hash.split("/");
    if (parameters.length == 3) {
      let postid = Number(parameters[2]);
      if (postid > 0) {
        let found = false;
        this.posts.forEach((value, index) => {
          if (value.postid == postid) {
            found = true;
          }
        })
        if (found) {
          this.blogService.getPost(this.usr,
            postid).then(result => {
              if (!this.currentPost || this.currentPost.postid != result.postid) {
                this.currentPost = result;
              }
              let state = parameters[1]
              if (state == "edit") {
                this.appState = AppState.Edit;
              }
              else if (state == "preview") {
                this.appState = AppState.Preview;
              }
            });
        }
        else {
          window.location.hash = '#/';
          this.appState = AppState.List;
        }
      }
      else if (postid == 0) {
        this.currentPost = new Post();
        this.currentPost.modified = Date.now();
        this.currentPost.created = Date.now();

        let state = parameters[1]
        if (state == "edit") {
          this.appState = AppState.Edit;
        }
        else if (state == "preview") {
          this.appState = AppState.Preview;
        }
      }

    }
    else {
      window.location.hash = '#/';
      this.appState = AppState.List;
    }

  }



}
