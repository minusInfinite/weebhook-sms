import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";
import Auth from "../utils/auth";
import {
  Box,
  Alert,
  Typography,
  TextField,
  Collapse,
  Button,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router";

const Signup = () => {
  let navigate = useNavigate();
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [validated] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  const [addUser, { error, data }] = useMutation(ADD_USER);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });
      Auth.login(data.addUser.token);
      if (Auth.loggedIn()) {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: "",
      email: "",
      password: "",
    });
  };
  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "#fff",
          my: "2rem",
          p: "2rem",
          borderRadius: "1rem",
          boxShadow: "1px 1px 3px #424242",
        }}
      >
        <Typography component="h1" variant="h5" align="center">
          Sign In
        </Typography>
        <Box
          component="form"
          onSubmit={handleFormSubmit}
          noValidate
          validated={validated}
          sx={{ display: "flex", flexDirection: "column", mt: 1 }}
        >
          <Collapse in={showAlert}>
            <Alert severity="error" onClose={() => setShowAlert(false)}>
              Something went wrong with your signup!
            </Alert>
          </Collapse>
          <TextField
            margin="normal"
            required
            id="username"
            label="Username"
            name="username"
            autoFocus
            onChange={handleInputChange}
            value={userFormData.username}
          />
          <TextField
            margin="normal"
            required
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            type="email"
            onChange={handleInputChange}
            value={userFormData.email}
          />
          <TextField
            margin="normal"
            required
            id="password"
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            onChange={handleInputChange}
            value={userFormData.password}
          />
          <Button
            disabled={
              !(
                userFormData.email &&
                userFormData.username &&
                userFormData.password
              )
            }
            type="submit"
            variant="contained"
          >
            Sign Up
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Signup;
