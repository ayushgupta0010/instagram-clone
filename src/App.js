import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Button } from "@material-ui/core";
import { auth, db } from "./utils/firebase";
import Post from "./components/Post";
import ImageUpload from "./components/ImageUpload";
import SignupModal from "./components/SignupModal";
import LoginModal from "./components/LoginModal";

const App = () => {
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) =>
      authUser ? setUser(authUser) : setUser(null)
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    onSnapshot(q, (querySnapshot) => {
      setPosts(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
  }, []);

  return (
    <div className='app'>
      <SignupModal open={open} setOpen={setOpen} />

      <LoginModal openSignIn={openSignIn} setOpenSignIn={setOpenSignIn} />

      <div className='app__header'>
        <img
          className='app__headerImage'
          src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
          alt='instagram-logo'
        />

        {user ? (
          <Button onClick={() => signOut(auth)}>Logout</Button>
        ) : (
          <div className='app__loginContainer'>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
            <Button onClick={() => setOpenSignIn(true)}>Login</Button>
          </div>
        )}
      </div>

      <div className='app__posts'>
        <center>
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              caption={post.caption}
              username={post.username}
              imageUrl={post.imageUrl}
            />
          ))}
        </center>
      </div>

      {user && <ImageUpload username={user.displayName} />}
    </div>
  );
};

export default App;
