import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private firestore: Firestore,
    private router: Router
  ) {}

  // Registro con email y contraseña
  async register(email: string, password: string, additionalData: any) {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      if (user) {
        // Crear un documento en Firestore para el usuario
        const userDocRef = doc(this.firestore, `usuarios/${user.uid}`);
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          ...additionalData
        });

        // Redirigir o realizar alguna acción post-registro
        this.router.navigate(['/point-register']);
      }
    } catch (error) {
      throw error;
    }
  }

  async getUserData(uid: string) {
    const userDocRef = doc(this.firestore, `usuarios/${uid}`);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error('Usuario no encontrado');
    }
  }

  logout() {
    return this.afAuth.signOut();
  }

  // Otros métodos de autenticación (login, logout, etc.) pueden ir aquí
}
