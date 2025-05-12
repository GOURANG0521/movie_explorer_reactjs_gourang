import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { emailRegex, passwordRegex, phoneRegex, signUpUser } from '../../utils/User';
import img from '../../assets/Images/login.jpg';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
} from '@mui/material';
import { toast } from 'react-toastify';

interface Errors {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface SignUpResponse {
  message: string;
  token: string;
  name: string;
  email: string;
  mobile_number: string;
  role: string;
}

interface SignUpPayload {
  user: {
    name: string;
    email: string;
    password: string;
    mobile_number: string;
  };
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<Errors>({ name: '', email: '', phone: '', password: '' });
  const [signUpError, setSignUpError] = useState<string>('');

  const handleLogin = (): void => {
    navigate('/');
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setName(value);
    if (!value) {
      setErrors((prev) => ({ ...prev, name: 'Please enter your name' }));
    } else {
      setErrors((prev) => ({ ...prev, name: '' }));
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setEmail(value);
    if (!emailRegex.test(value)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address (e.g., gourang@gmail.com)' }));
    } else {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setPhone(value);
    if (!phoneRegex.test(value)) {
      setErrors((prev) => ({ ...prev, phone: 'Please enter a valid 10-digit phone number (e.g., 1234567890)' }));
    } else {
      setErrors((prev) => ({ ...prev, phone: '' }));
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setPassword(value);
    if (!passwordRegex.test(value)) {
      setErrors((prev) => ({ ...prev, password: 'Password must be at least 8 characters with a letter, number, and special character (@$!%*#?&)' }));
    } else {
      setErrors((prev) => ({ ...prev, password: '' }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSignUpError('');

    let isValid = true;

    if (!name) {
      setErrors((prev) => ({ ...prev, name: 'Please enter your name' }));
      isValid = false;
    }
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address (e.g., gourang@gmail.com)' }));
      isValid = false;
    }
    if (!phoneRegex.test(phone)) {
      setErrors((prev) => ({ ...prev, phone: 'Please enter a valid 10-digit phone number (e.g., 1234567890)' }));
      isValid = false;
    }
    if (!passwordRegex.test(password)) {
      setErrors((prev) => ({ ...prev, password: 'Password must be at least 8 characters with a letter, number, and special character (@$!%*#?&)' }));
      isValid = false;
    }

    if (!isValid) {
      toast.error('Please correct the errors in the form.', {
        position: 'top-right',
        autoClose: 5000,
      });
      return;
    }

    const payload: SignUpPayload = {
      user: {
        name,
        email,
        password,
        mobile_number: phone,
      },
    };

    try {
      const data: SignUpResponse = await signUpUser(payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('new user detail', JSON.stringify({
        name: data.name,
        email: data.email,
        mobile_number: data.mobile_number,
        role: data.role,
      }));
      toast.success('Sign-up successful!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/');
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred during signup. Please try again.';
      setSignUpError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 2, sm: 3, lg: 4 },
        py: 12,
        backgroundImage: `url(${img}), linear-gradient(to bottom right, #1a202c, #4c51bf)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          bgcolor: 'rgba(31, 41, 55, 0.8)',
          borderRadius: 4,
          transform: 'scale(1)',
          transition: 'transform 0.3s',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              color: 'grey.400',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            onClick={handleLogin}
          >
            LOGIN
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              borderBottom: '2px solid #dc2626',
              pb: 0.5,
            }}
          >
            SIGNUP
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} aria-label="signup-form">
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Name"
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Enter your name"
              variant="outlined"
              required
              error={!!errors.name}
              helperText={errors.name}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'grey.700',
                  color: 'white',
                  '& fieldset': { borderColor: 'grey.500' },
                  '&:hover fieldset': { borderColor: 'grey.400' },
                  '&.Mui-focused fieldset': { borderColor: '#4c51bf' },
                },
                '& .MuiInputLabel-root': { color: 'grey.300' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#4c51bf' },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Email Id"
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              variant="outlined"
              required
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'grey.700',
                  color: 'white',
                  '& fieldset': { borderColor: 'grey.500' },
                  '&:hover fieldset': { borderColor: 'grey.400' },
                  '&.Mui-focused fieldset': { borderColor: '#4c51bf' },
                },
                '& .MuiInputLabel-root': { color: 'grey.300' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#4c51bf' },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Phone Number"
              type="tel"
              id="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter your phone number"
              variant="outlined"
              required
              error={!!errors.phone}
              helperText={errors.phone}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'grey.700',
                  color: 'white',
                  '& fieldset': { borderColor: 'grey.500' },
                  '&:hover fieldset': { borderColor: 'grey.400' },
                  '&.Mui-focused fieldset': { borderColor: '#4c51bf' },
                },
                '& .MuiInputLabel-root': { color: 'grey.300' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#4c51bf' },
              }}
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Create a password"
              variant="outlined"
              required
              error={!!errors.password}
              helperText={errors.password}
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'grey.700',
                  color: 'white',
                  '& fieldset': { borderColor: 'grey.500' },
                  '&:hover fieldset': { borderColor: 'grey.400' },
                  '&.Mui-focused fieldset': { borderColor: '#4c51bf' },
                },
                '& .MuiInputLabel-root': { color: 'grey.300' },
                '& .MuiInputLabel-root.Mui-focused': { color: '#4c51bf' },
              }}
            />
          </Box>

          {signUpError && (
            <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
              {signUpError}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              bgcolor: '#dc2626',
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#b91c1c', transform: 'scale(1.05)', transition: 'all 0.3s' },
            }}
          >
            Sign Up
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default Signup;

// import React, { useState, FormEvent, ChangeEvent } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { emailRegex, passwordRegex, phoneRegex, signUpUser } from '../../utils/User';
// import img from '../../assets/Images/login.jpg';
// import {
//   Box,
//   Paper,
//   Typography,
//   TextField,
//   Button,
// } from '@mui/material';
// import { toast } from 'react-toastify';

// interface Errors {
//   name: string;
//   email: string;
//   phone: string;
//   password: string;
// }

// interface SignUpResponse {
//   message: string;
//   token: string;
//   name: string;
//   email: string;
//   mobile_number: string;
//   role: string;
// }

// interface SignUpPayload {
//   user: {
//     name: string;
//     email: string;
//     password: string;
//     mobile_number: string;
//   };
// }

// const Signup: React.FC = () => {
//   const navigate = useNavigate();
//   const [name, setName] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [phone, setPhone] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [errors, setErrors] = useState<Errors>({ name: '', email: '', phone: '', password: '' });
//   const [signUpError, setSignUpError] = useState<string>('');

//   const handleLogin = (): void => {
//     navigate('/');
//   };

//   const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
//     const value = e.target.value;
//     setName(value);
//     if (!value) {
//       setErrors((prev) => ({ ...prev, name: 'Please enter your name' }));
//     } else {
//       setErrors((prev) => ({ ...prev, name: '' }));
//     }
//   };

//   const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
//     const value = e.target.value;
//     setEmail(value);
//     if (!emailRegex.test(value)) {
//       setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address (e.g., gourang@gmail.com)' }));
//     } else {
//       setErrors((prev) => ({ ...prev, email: '' }));
//     }
//   };

//   const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>): void => {
//     const value = e.target.value;
//     setPhone(value);
//     if (!phoneRegex.test(value)) {
//       setErrors((prev) => ({ ...prev, phone: 'Please enter a valid 10-digit phone number (e.g., 1234567890)' }));
//     } else {
//       setErrors((prev) => ({ ...prev, phone: '' }));
//     }
//   };

//   const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
//     const value = e.target.value;
//     setPassword(value);
//     if (!passwordRegex.test(value)) {
//       setErrors((prev) => ({ ...prev, password: 'Password must be at least 8 characters with a letter, number, and special character (@$!%*#?&)' }));
//     } else {
//       setErrors((prev) => ({ ...prev, password: '' }));
//     }
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
//     setSignUpError('');

//     let isValid = true;

//     if (!name) {
//       setErrors((prev) => ({ ...prev, name: 'Please enter your name' }));
//       isValid = false;
//     }
//     if (!emailRegex.test(email)) {
//       setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address (e.g., gourang@gmail.com)' }));
//       isValid = false;
//     }
//     if (!phoneRegex.test(phone)) {
//       setErrors((prev) => ({ ...prev, phone: 'Please enter a valid 10-digit phone number (e.g., 1234567890)' }));
//       isValid = false;
//     }
//     if (!passwordRegex.test(password)) {
//       setErrors((prev) => ({ ...prev, password: 'Password must be at least 8 characters with a letter, number, and special character (@$!%*#?&)' }));
//       isValid = false;
//     }

//     if (!isValid) {
//       toast.error('Please correct the errors in the form.', {
//         position: 'top-right',
//         autoClose: 5000,
//       });
//       return;
//     }

//     const payload: SignUpPayload = {
//       user: {
//         name,
//         email,
//         password,
//         mobile_number: phone,
//       },
//     };
//     console.log('Sending sign-up payload:', payload);

//     try {
//       const data: SignUpResponse = await signUpUser(payload);
//       localStorage.setItem('token', data.token);
//       localStorage.setItem('new user detail', JSON.stringify({
//         name: data.name,
//         email: data.email,
//         mobile_number: data.mobile_number,
//         role: data.role,
//       }));
//       toast.success('Sign-up successful!', {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//       navigate('/');
//     } catch (error: any) {
//       const errorMessage = error.message || 'An error occurred during signup. Please try again.';
//       setSignUpError(errorMessage);
//       toast.error(errorMessage, {
//         position: 'top-right',
//         autoClose: 5000,
//       });
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         px: { xs: 2, sm: 3, lg: 4 },
//         py: 12,
//         backgroundImage: `url(${img}), linear-gradient(to bottom right, #1a202c, #4c51bf)`,
//         backgroundSize: 'cover',
//         backgroundPosition: 'center',
//         backgroundBlendMode: 'overlay',
//         backgroundRepeat: 'no-repeat',
//       }}
//     >
//       <Paper
//         elevation={6}
//         sx={{
//           p: 4,
//           width: '100%',
//           maxWidth: 400,
//           bgcolor: 'rgba(31, 41, 55, 0.8)',
//           borderRadius: 4,
//           transform: 'scale(1)',
//           transition: 'transform 0.3s',
//           '&:hover': {
//             transform: 'scale(1.05)',
//           },
//         }}
//       >
//         <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
//           <Typography
//             variant="h6"
//             sx={{
//               color: 'grey.400',
//               fontWeight: 'bold',
//               cursor: 'pointer',
//             }}
//             onClick={handleLogin}
//           >
//             LOGIN
//           </Typography>
//           <Typography
//             variant="h6"
//             sx={{
//               color: 'white',
//               fontWeight: 'bold',
//               borderBottom: '2px solid #dc2626',
//               pb: 0.5,
//             }}
//           >
//             SIGNUP
//           </Typography>
//         </Box>

//         <form onSubmit={handleSubmit}>
//           <Box sx={{ mb: 3 }}>
//             <TextField
//               fullWidth
//               label="Name"
//               type="text"
//               id="name"
//               value={name}
//               onChange={handleNameChange}
//               placeholder="Enter your name"
//               variant="outlined"
//               required
//               error={!!errors.name}
//               helperText={errors.name}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   bgcolor: 'grey.700',
//                   color: 'white',
//                   '& fieldset': { borderColor: 'grey.500' },
//                   '&:hover fieldset': { borderColor: 'grey.400' },
//                   '&.Mui-focused fieldset': { borderColor: '#4c51bf' },
//                 },
//                 '& .MuiInputLabel-root': { color: 'grey.300' },
//                 '& .MuiInputLabel-root.Mui-focused': { color: '#4c51bf' },
//               }}
//             />
//           </Box>

//           <Box sx={{ mb: 3 }}>
//             <TextField
//               fullWidth
//               label="Email Id"
//               type="email"
//               id="email"
//               value={email}
//               onChange={handleEmailChange}
//               placeholder="Enter your email"
//               variant="outlined"
//               required
//               error={!!errors.email}
//               helperText={errors.email}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   bgcolor: 'grey.700',
//                   color: 'white',
//                   '& fieldset': { borderColor: 'grey.500' },
//                   '&:hover fieldset': { borderColor: 'grey.400' },
//                   '&.Mui-focused fieldset': { borderColor: '#4c51bf' },
//                 },
//                 '& .MuiInputLabel-root': { color: 'grey.300' },
//                 '& .MuiInputLabel-root.Mui-focused': { color: '#4c51bf' },
//               }}
//             />
//           </Box>

//           <Box sx={{ mb: 3 }}>
//             <TextField
//               fullWidth
//               label="Phone Number"
//               type="tel"
//               id="phone"
//               value={phone}
//               onChange={handlePhoneChange}
//               placeholder="Enter your phone number"
//               variant="outlined"
//               required
//               error={!!errors.phone}
//               helperText={errors.phone}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   bgcolor: 'grey.700',
//                   color: 'white',
//                   '& fieldset': { borderColor: 'grey.500' },
//                   '&:hover fieldset': { borderColor: 'grey.400' },
//                   '&.Mui-focused fieldset': { borderColor: '#4c51bf' },
//                 },
//                 '& .MuiInputLabel-root': { color: 'grey.300' },
//                 '& .MuiInputLabel-root.Mui-focused': { color: '#4c51bf' },
//               }}
//             />
//           </Box>

//           <Box sx={{ mb: 3 }}>
//             <TextField
//               fullWidth
//               label="Password"
//               type="password"
//               id="password"
//               value={password}
//               onChange={handlePasswordChange}
//               placeholder="Create a password"
//               variant="outlined"
//               required
//               error={!!errors.password}
//               helperText={errors.password}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   bgcolor: 'grey.700',
//                   color: 'white',
//                   '& fieldset': { borderColor: 'grey.500' },
//                   '&:hover fieldset': { borderColor: 'grey.400' },
//                   '&.Mui-focused fieldset': { borderColor: '#4c51bf' },
//                 },
//                 '& .MuiInputLabel-root': { color: 'grey.300' },
//                 '& .MuiInputLabel-root.Mui-focused': { color: '#4c51bf' },
//               }}
//             />
//           </Box>

//           {signUpError && (
//             <Typography color="error" variant="body2" align="center" sx={{ mb: 2 }}>
//               {signUpError}
//             </Typography>
//           )}

//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{
//               bgcolor: '#dc2626',
//               py: 1.5,
//               borderRadius: 2,
//               textTransform: 'none',
//               fontWeight: 'bold',
//               '&:hover': { bgcolor: '#b91c1c', transform: 'scale(1.05)', transition: 'all 0.3s' },
//             }}
//           >
//             Sign Up
//           </Button>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default Signup;