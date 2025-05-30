import { inject, Injectable } from '@angular/core';
import { collection, collectionData, deleteDoc, doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private firestore: Firestore = inject(Firestore);

  constructor() { }

  getCollection<tipo>(enlace: string) {
    const documents = collection(this.firestore, enlace);
    return collectionData(documents) as Observable<tipo[]>;
  }

  createDocument(data: any, enlace: string, idDoc: string) {
    const document = doc(this.firestore, `${enlace}/${idDoc}`);
    return setDoc(document, data);
  }

  deleteDocument(enlace: string, idDoc: string) {
    const document = doc(this.firestore, `${enlace}/${idDoc}`);
    return deleteDoc(document);
  }

  createIdDoc() {
    return uuidv4();
  }
}

