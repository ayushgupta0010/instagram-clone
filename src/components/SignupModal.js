import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Button, Input, makeStyles, Modal } from "@material-ui/core";
import { auth } from "../utils/firebase";

const getModalStyle = () => ({
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
});

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const SignupModal = ({ open, setOpen }) => {
  const classes = useStyles();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalStyle] = useState(getModalStyle);

  const signUp = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((authuser) => {
        updateProfile(authuser.user, { displayName: username });
        setOpen(false);
        setEmail("");
        setUsername("");
        setPassword("");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <div style={modalStyle} className={classes.paper}>
        <form className='app__signup' onSubmit={signUp}>
          <center>
            <img
              className='app__headerImage'
              src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
              alt='instagram-logo'
            />
          </center>
          <Input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type='submit'>Sign Up</Button>
        </form>
      </div>
    </Modal>
  );
};

export default SignupModal;
