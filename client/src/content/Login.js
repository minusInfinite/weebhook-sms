import React, {useState} from "react"
import { useMutation } from "@apollo/client"
import Auth from "../utils/auth"
import { LOGIN_USER } from "../utils/mutations"
import { Box, Alert, Typography, TextField,Collapse,Button,Container } from "@mui/material"


const Login = () => {
    const [userFormData, setUserFormData] = useState({
        email: "",
        password: "",
    })
    const [validated] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    // eslint-disable-next-line no-unused-vars
    const [login, { error, data }] = useMutation(LOGIN_USER)

    const handleInputChange = (event) => {
        const { name, value } = event.target
        setUserFormData({ ...userFormData, [name]: value })
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault()

        // check if form has everything (as per react-bootstrap docs)
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }

        try {
            const { data } = await login({
                variables: { ...userFormData },
            })

            Auth.login(data.login.token)
        } catch (err) {
            console.error(err)
            setShowAlert(true)
        }

        setUserFormData({
            username: "",
            email: "",
            password: "",
        })
    }
    return (
        <>
            <Container maxWidth="sm">
            <Typography component="h1" variant="h5" align="center">Login</Typography>
            <Box component="form" onSubmit={handleFormSubmit} noValidate validated={validated}>
                <Collapse in={showAlert}>
                    <Alert severity="error" onClose={() => setShowAlert(false)} >Something went wrong with your login!</Alert>
                </Collapse>
                <TextField margin="normal" required id="email" label="email" name="email" autoComplete="email" type="email" autoFocus onChange={handleInputChange} value={userFormData.email} />
                <TextField margin="normal" required id="password" label="Password" name="password" type="password" autoComplete="current-password" onChange={handleInputChange} value={userFormData.password} />
                <Button disabled={!(userFormData.email && userFormData.password)} type="submit" variant="contained">Login</Button>
            </Box>
            </Container>
        </>
    )
}

export default Login