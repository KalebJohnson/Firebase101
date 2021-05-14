import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { Button } from 'antd';
import 'antd/dist/antd.css';

firebase.initializeApp({
    apiKey: "AIzaSyCADsIQ4TYLwWx2ZjUfma9BYfiDWs8V4Ec",
    authDomain: "test-9ea2a.firebaseapp.com",
    projectId: "test-9ea2a",
    storageBucket: "test-9ea2a.appspot.com",
    messagingSenderId: "631449253461",
    appId: "1:631449253461:web:6b793593e96f914f34c6dc"
  })

const auth = firebase.auth();

function SignIn() {

    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    }
  
    return (
      <>
        <Button style={{ width:'50%', alignSelf:'center'}} type="primary" onClick={signInWithGoogle}>
            Sign in
        </Button>
      </>
    )
  
  }
  
  function SignOut() {
    return auth.currentUser && (
      <Button  onClick={() => auth.signOut()}>Sign Out</Button>
    )
  }

export {
    SignIn,
    SignOut
}