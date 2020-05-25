import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { map, finalize } from "rxjs/operators";
import { PostI } from "../../shared/models/post.interface";

import { FileI } from "../../shared/models/file.interface";
import { AngularFireStorage } from "@angular/fire/storage";

@Injectable({
  providedIn: "root",
})
export class PostService {
  private postsCollection: AngularFirestoreCollection<PostI>;
  private filePath: any;
  private downloadURL: Observable<string>;

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.postsCollection = afs.collection<PostI>("posts");
  }

  // recuperar todos los posts
  public getAllPosts(): Observable<PostI[]> {
    return this.postsCollection.snapshotChanges().pipe(
      map((actions) =>
        actions.map((a) => {
          const data = a.payload.doc.data() as PostI;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      )
    );
  }

  // buscara en la Base Datos y filtra por id indicado
  public getOnePost(id: PostI): Observable<PostI> {
    return this.afs.doc<PostI>(`posts/${id}`).valueChanges();
  }

  public deletePostById(post: PostI) {
    return this.postsCollection.doc(post.id).delete();
  }

  // editar post
  public editPostById(post: PostI) {
    return this.postsCollection.doc(post.id).update(post);
  }

  public preAddUpdatePost(post: PostI, image: FileI): void {
    this.uploadImage(post, image);
  }

  private uploadImage(post: PostI, image: FileI) {
    this.filePath = `images/${image.name}`;
    const fileRef = this.storage.ref(this.filePath);
    const task = this.storage.upload(this.filePath, image);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((urlImage) => {
            this.downloadURL = urlImage;
            console.log("URL_IMAGE", urlImage);
            console.log("POST", post);
            this.savePost(post);
          });
        })
      )
      .subscribe();
  }

  private savePost(post: PostI){
    const postObj ={
      titlePost:post.titlePost,
      contentPost:post.contentPost,
      imagePost:this.downloadURL,
      fileRef:this.filePath,
      tagsPost:post.tagsPost
    };

    // TODO editPost
    this.postsCollection.add(postObj);
  }
}
