/* Copyright: Junghoo Cho (cho@cs.ucla.edu) */
/* This file was created for CS144 class at UCLA */
import { Injectable } from '@angular/core';
import { Post } from './post';
import { plainToClass } from 'class-transformer';
@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor() {
  }

  // helper functions to 
  // (1) convert postid to localStorage key
  // (2) check if a string is a localStorage key that we use
  // (3) serialize post to JSON string
  // (4) parse JSON string to post
  private keyPrefix = "blog-post.";
  private key(postid: number): string {
    return this.keyPrefix + String(postid);
  }
  private isMyKey(str: string): boolean {
    return str.startsWith(this.keyPrefix);
  }
  private serialize(post: Post): string {
    return JSON.stringify(post);
  }
  private parse(value: string): Post {
    return JSON.parse(value);
  }

  fetchPosts(username: string): Promise<Post[]> {
    return new Promise((resolve, reject) => {
      fetch('/api/posts?' + new URLSearchParams({
        "username": username
      }), {
        method: 'GET'
      }).then(response => {
        if (response.status == 200) {
          response.json()
            .then((data: Object[]) => {
              let posts: Post[] = plainToClass(Post, data);
              resolve(posts);
            });
        }
        else {
          reject(new Error(String(response.status)))
        }
      })
    })
  }

  getPost(username: string, postid: number): Promise<Post> {
    return new Promise((resolve, reject) => {
      fetch('/api/posts?' + new URLSearchParams({
        "username": username,
        "postid": postid.toString()
      }), {
        method: 'GET'
      }).then(response => {
        if (response.status == 200) {
          response.json()
            .then((data: Object) => {
              let post: Post = plainToClass(Post, data);
              resolve(post);
            });
        }
        else {
          reject(new Error(String(response.status)))
        }
      })
    })
  }

  setPost(username: string, p: Post): Promise<Post> {
    return new Promise((resolve, reject) => {
      if (!p.body) {
        p.body = ""
      }
      let reqBody = { "username": username, "postid": p.postid, "title": p.title, "body": p.body }
      fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody)
      }).then(response => {
        console.log(response.body)
        if (response.status == 200 || response.status == 201) {
          response.json()
            .then((data: Object) => {
              let post: Post = plainToClass(Post, data);
              resolve(post);
            });
        }
        else {
          reject(new Error(String(response.status)))
        }
      })
    })
  }

  deletePost(username: string, postid: number): Promise<void> {
    return new Promise((resolve, reject) => {
      
      fetch('/api/posts?' + new URLSearchParams({
        "username": username,
        "postid": postid.toString()
      }), {
        method: 'DELETE'
      }).then(response => {
        if (response.status == 204) {
          resolve();
        }
        else {
          reject(new Error(String(response.status)))
        }
      })
    })
  }
}
