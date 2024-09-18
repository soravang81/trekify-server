// Example: SignInComponent.tsx (React component)
import React from 'react';
import { signInWithGoogle } from './firebaseClient';

const SignInComponent= () => {
  const handleGoogleSignIn = async () => {
    try {
      const idToken = await signInWithGoogle();
      
      // Send the ID token to the Express backend
      const response = await fetch('/api/signin-with-google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('User signed in successfully:', data);
      } else {
        console.error('Error signing in:', data.error);
      }
    } catch (error) {
      console.error('Google sign-in failed:', error);
    }
  };

  return (
    <button onClick={handleGoogleSignIn}>
      Sign in with Google
    </button>
  );
};

export default SignInComponent;
