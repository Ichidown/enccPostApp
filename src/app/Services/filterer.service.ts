import { Injectable } from '@angular/core';
import { Post } from '../Objects/Post';
import { Association } from '../Objects/Association';

@Injectable({
  providedIn: 'root'
})
export class FiltererService {

constructor() { }


public filterPostList(index: String, unfilteredPosts: Post[], associations: Association[]): number[] {
  const filteredPosts: number[] = [];
  if ( index === '-1' ) { // return all id
    for (let i = 0; i < unfilteredPosts.length; i++) {
          filteredPosts.push(unfilteredPosts[i].id);
    }
    return filteredPosts;
  } else { // return filtered id
    const associatedIdPosts: number[] = [];
    // get targetted associated posts
    for (let j = 0; j < associations.length; j++) {
      if (associations[j].id_post_type.toString() === index) {
        associatedIdPosts.push(associations[j].id_post);
      }
    }
    // filter
    for (let i = 0; i < unfilteredPosts.length; i++) {
      for (let j = 0; j < associatedIdPosts.length; j++) {
        if (associatedIdPosts[j] === unfilteredPosts[i].id) {
          filteredPosts.push(unfilteredPosts[i].id);
        }
      }
    }
    return filteredPosts;
  }
}

}
