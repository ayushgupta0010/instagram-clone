import React, { useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Button } from "@material-ui/core";
import { db, storage } from "../utils/firebase";

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");

  const handleChange = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  const handleUpload = () => {
    let storageRef = ref(storage, `images/${image.name}`);
    let uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        let p =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      },
      (error) => {
        alert(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          addDoc(collection(db, "posts"), {
            timestamp: serverTimestamp(),
            caption,
            imageUrl: downloadUrl,
            username,
          });
          setProgress(0);
          setCaption("");
          setImage(null);
        });
      }
    );
  };

  return (
    <div className='imageupload'>
      <progress className='imageupload__progress' value={progress} max='100' />
      <input
        type='text'
        placeholder='Enter a caption...'
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <input type='file' onChange={handleChange} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default ImageUpload;
