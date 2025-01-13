import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Box, TextField, Grid, Button } from "@mui/material";
import { login } from "../../services/authentication";
import GlobalNavBar from "../../components/GlobalNavBar";
import Footer from "../../components/footer";
import theme  from "../../assets/theme";
import { Typography } from '@mui/material';

export const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Create refs for the input fields
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        let validationErrors = {};

        // Basic validation
        if (!email) {
            validationErrors.email = "Email is required.";
            emailRef.current.focus(); // Sets focus to email field
        }
        if (!password) {
            validationErrors.password = "Password is required.";
            if (!validationErrors.email) {
                passwordRef.current.focus(); // Sets focus to password field if email is valid
            }
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Stop submission if there are errors
        }

        try {
            const session = await login(email, password);
            const token = session.token;
            const user = session.user;
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
            console.log("logged in user's token -> " + token);
            navigate("/games");
        } catch (err) {
            console.error(err);
            setErrors({ general: err.message });
        }
    };

    return (
      <>
        <Typography
          variant="h4"
          sx={{ 
            fontFamily: theme.typography.fontFamily, 
            textAlign: 'center', 
            mb: 3, 
            color: theme.palette.text.primary,
          }}
        >
          LOG IN
        </Typography>
        <Box 
          sx={{ 
            width: '100vw', 
            height: 'auto',
            bgcolor: theme.palette.primary.main, 
            marginX: 'calc(50% - 50vw)', 
            paddingY: '5vw', 
            borderTop: '3px solid black',
            borderBottom: '3px solid black',
          }}
        >
          <Container className='login-container' sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              component='form'
              onSubmit={handleSubmit}
              noValidate
              sx={{ 
                bgcolor: theme.palette.green.main, 
                border: '3px solid black',
                boxShadow: 3,
                height: 'auto',
                p: 8,
                borderRadius: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="mail"
                  autoComplete="email"
                  autoFocus
                  inputRef={emailRef} // Attach ref here
                  onChange={(e) => setEmail(e.target.value)}
                  helperText={errors.email || "Enter the email address associated with your account"}
                  error={Boolean(errors.email)}
                  aria-label="Enter your email address" // aria-label for screen readers
              />
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  inputRef={passwordRef} // Attach ref here
                  onChange={(e) => setPassword(e.target.value)}
                  helperText={errors.password || "Enter your account password"}
                  error={Boolean(errors.password)}
                  aria-label="Enter your password" // aria-label for screen readers
              />
              <Button type='submit' fullWidth variant='outlined' aria-label="Submit login form">
                Sign In
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    <Link to='/signup' aria-label="Create a new account">
                      {"DON'T HAVE AN ACCOUNT? SIGN UP!"}
                    </Link>
                  </Typography>
                </Grid>
              </Grid>
              {errors.general && (
                <Typography color="error" role="alert">
                  {errors.general}
                </Typography>
              )}
            </Box>
          </Container>
        </Box>
        <Footer />
      </>
    );
};


