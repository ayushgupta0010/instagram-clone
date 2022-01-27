import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import {
  query,
  addDoc,
  orderBy,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../utils/firebase";

const Post = ({ postId, user, username, caption, imageUrl }) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  const postComment = (e) => {
    e.preventDefault();
    addDoc(collection(db, "posts", postId, "comments"), {
      text: comment,
      username: user.displayName,
      timestamp: serverTimestamp(),
    });
    setComment("");
  };

  useEffect(() => {
    if (!postId) return;
    let q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("timestamp", "desc")
    );
    let unsubscribe = onSnapshot(q, (querySnapshot) => {
      setComments(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  }, [postId]);

  return (
    <div className='post'>
      <div className='post__header'>
        <Avatar className='post__avatar' alt={username} src='' />
        <h3>{username}</h3>
      </div>
      <img className='post__image' src={imageUrl} alt='' />
      <h4 className='post__text'>
        <strong>{username} </strong>
        {caption}
      </h4>

      <div className='post__comments'>
        {comments.map((c, i) => (
          <p key={i}>
            <strong>{c.username}</strong> {c.text}
          </p>
        ))}
      </div>

      {user && (
        <form className='post__commentBox' onSubmit={postComment}>
          <input
            type='text'
            className='post__input'
            placeholder='Add a comment...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button className='post__button' disabled={!comment} type='submit'>
            Post
          </button>
        </form>
      )}
    </div>
  );
};

export default Post;
