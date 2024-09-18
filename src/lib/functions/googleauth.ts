import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log('User Info:', result.user);
    const token = await result.user.getIdToken();
    return token;
  } catch (error) {
    console.error('Error during Google Sign-In:', error);
  }
};