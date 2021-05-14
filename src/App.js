// obvious imports are obvious >.>
import React, { useRef, useState } from 'react';
import './App.css';
import { SignIn, SignOut } from './comps/SignIn'
import { Button, Input, } from 'antd';
import { useSpring, animated} from '@react-spring/web';
import 'antd/dist/antd.css';
// firebase imports for auth and the general DB
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

// firebase hookzzzz
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

// pretty much explains itself
const auth = firebase.auth();
const firestore = firebase.firestore();



function App() {
  // declaring user state for checking current sign in status
  // ( obviously null if not signed in triggers the turnary below for sign in comp render )
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1 style={{color:'white'}}>💬FireBase101?💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}



function ChatRoom() {


  // reference a collection in the db ( in this case the messages so I can grab the documents from it )
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');

  // query for the sub documents via created at field
  const query = messagesRef.orderBy('createdAt').limit(25);

  // "grabbing" the obj of data using the useCollection hook from the query so I can render it later
  const [messages] = useCollectionData(query, { idField: 'id' });

  // just some form state
  const [formValue, setFormValue] = useState('');

  const { TextArea } = Input;

  const sendMessage = async (e) => {
    // prevent page refresh, firebase will handle the update 
    e.preventDefault();

    // grab me some stuff from the current user
    const { uid, photoURL } = auth.currentUser;
    // pretty much what I'm assuming is a post ("write") request to add these fields into a document in the specified collection 
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })
    // input field cleaning
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }
 // map over the messages I pulled from firebase collections and pass those props on downnn
 // connect form state, event handlers ect
 // ref the span for autoscroll behavior ( so the window stays at the most current message sent/received )
  return (<>
    <main>

      {messages && messages.map(msg => 
          <ChatMessage 
            key={msg.id} 
            message={msg}
            />
            )}

      <span ref={dummy}></span>

    </main>

      <form>

        <TextArea
          onPressEnter={sendMessage}
          showCount={true} 
          maxLength={100}
          rows={4}
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
          style={{width:'100%'}}
        />
        <Button style={{ height:"90%" }} type="submit" disabled={!formValue} onClick={sendMessage}>Send</Button>

      </form>

  </>)
}


function ChatMessage(props) {

  const [hovered, setHovered] = useState(false)
  const [hoveredPic, setHoveredPic] = useState(false)
  const ani = useSpring({
    config: { mass:0.5, tension:20, friction:8 },
    marginRight: hovered ? "1.5rem" : "1rem",
  })

  const ani2 = useSpring({
    config: { mass:0.5, tension:20, friction:8 },
    marginLeft: hovered ? "1.5rem" : "1rem",
  })

  const profile = useSpring({
    config: { mass:0.5, tension:20, friction:8 },
    width: hoveredPic ? "50px" : "40px",
    height: hoveredPic ? "50px" : "40px",
  })
  // some object destructuringgggggggggg
  const { text, uid, photoURL } = props.message;
  console.log(props)
  // ternary checking if the UID is equal to the current user's
  // ( so we can tell they are the sender of the message )
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  // assign style on sent or recieved  string value then just rendering some db info for the messages
  return (<>
    <div className={`message ${messageClass}`} >
      <animated.img 
        style={profile}
        src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'}
        onPointerOver={() => setHoveredPic(true)}
        onPointerOut={() => setHoveredPic(false)}
        />
      <animated.p
      style={messageClass === 'sent' ? ani : ani2}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)} 
      >
      {text}
      </animated.p>
    </div>
  </>)
}



export default App;