import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
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

const LoginModal = ({ openSignIn, setOpenSignIn }) => {
  const classes = useStyles();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalStyle] = useState(getModalStyle);

  const logIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setOpenSignIn(false);
        setEmail("");
        setPassword("");
      })
      .catch((err) => alert(err.message));
  };

  return (
    <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
      <div style={modalStyle} className={classes.paper}>
        <form className='app__signup' onSubmit={logIn}>
          <center>
            <img
              className='app__headerImage'
              src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
              alt='instagram-logo'
            />
          </center>

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
          <Button type='submit'>Login</Button>
        </form>
      </div>
    </Modal>
  );
};

export default LoginModal;
