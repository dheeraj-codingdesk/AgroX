import React, { useState, useEffect } from 'react';
import { LeafIcon, UserIcon, LockIcon, MailIcon, PhoneIcon, MapPinIcon, EyeIcon, EyeOffIcon } from './icons/Icons';
import * as db from '../services/db';
import type { User } from '../types';

interface LoginPageProps {
    onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Common State
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Login State
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({ email: '', password: '' });
  const [isLoginValid, setIsLoginValid] = useState(false);

  // Signup State
  const [signupData, setSignupData] = useState({ name: '', email: '', phone: '', location: '', password: '' });
  const [signupErrors, setSignupErrors] = useState({ name: '', email: '', phone: '', location: '', password: '' });
  const [isSignupValid, setIsSignupValid] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string>('');
  
  // --- Validation Logic ---
  const validateEmail = (email: string): string => {
    if (!email) return "Email is required.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email address.";
    return "";
  };

  const validatePassword = (password: string): string => {
    if (!password) return "Password is required.";
    if (password.length < 8) return "Password must be at least 8 characters long.";
    if (!/\d/.test(password)) return "Password must contain at least one number.";
    return "";
  };

  const validateRequired = (field: string, value: string): string => {
    if (!value) return `${field} is required.`;
    return "";
  };

  // --- Validation Effects ---
  useEffect(() => {
    const emailError = validateEmail(loginData.email);
    const passwordError = loginData.password ? "" : "Password is required.";
    setLoginErrors({ email: emailError, password: passwordError });
    setIsLoginValid(!emailError && !!loginData.password);
  }, [loginData]);

  useEffect(() => {
    const nameError = validateRequired("Full Name", signupData.name);
    const emailError = validateEmail(signupData.email);
    const phoneError = validateRequired("Phone Number", signupData.phone);
    const locationError = validateRequired("Location", signupData.location);
    const passwordError = validatePassword(signupData.password);
    setSignupErrors({ name: nameError, email: emailError, phone: phoneError, location: locationError, password: passwordError });
    setIsSignupValid(!nameError && !emailError && !phoneError && !locationError && !passwordError);
  }, [signupData]);


  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLoginSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLoginValid) return;

    setIsAuthLoading(true);
    setAuthError('');

    try {
      const user = await db.authenticateUser(loginData.email, loginData.password);
      if (user) {
        onLogin(user);
      } else {
        setAuthError("Invalid email or password.");
      }
    } catch (error: any) {
      setAuthError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSignupSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isSignupValid) return;
    
    setIsAuthLoading(true);
    setAuthError('');

    try {
        const newUser: User = {
            id: crypto.randomUUID(),
            ...signupData
        };

        await db.addUser(newUser);
        onLogin(newUser);

    } catch (error: any) {
        setAuthError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
        setIsAuthLoading(false);
    }
  };
  
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported by your browser.");
      return;
    }
    
    setSignupData(prev => ({...prev, location: ''}));
    setLocationMessage("Fetching location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        setSignupData(prev => ({...prev, location: locationString}));
        setLocationMessage("Location fetched successfully!");
      },
      (error) => {
        console.error("Error getting location:", error);
        let message = "Could not get location.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location permission denied. Please enable it in your browser settings.";
        }
        setLocationMessage(message);
      }
    );
  };

  const InputErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
    if (!message) return null;
    return <p className="text-red-500 text-xs mt-1 ml-1">{message}</p>;
  };

  const AuthErrorMessage: React.FC<{ message?: string }> = ({ message }) => {
    if (!message) return null;
    return <p className="text-red-500 text-sm mt-4 text-center">{message}</p>;
  }

  const loginForm = (
    <form className="mt-8 space-y-4" onSubmit={handleLoginSubmit} noValidate>
      <div>
        <div className="relative">
           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MailIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="email-address" name="email" type="email" autoComplete="email" required
            className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${loginErrors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Email address"
            value={loginData.email}
            onChange={handleLoginChange}
            disabled={isAuthLoading}
          />
        </div>
        <InputErrorMessage message={loginErrors.email} />
      </div>
      <div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <LockIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required
            className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${loginErrors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Password"
            value={loginData.password}
            onChange={handleLoginChange}
            disabled={isAuthLoading}
          />
           <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
            {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>
        <InputErrorMessage message={loginErrors.password} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Removed remember me for simplicity with local/session storage */}
        </div>
        <div className="text-sm">
          <a href="#" className="font-medium text-green-600 hover:text-green-500">Forgot your password?</a>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={!isLoginValid || isAuthLoading}
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
           {isAuthLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
          Sign in
        </button>
      </div>
      <AuthErrorMessage message={authError} />
    </form>
  );

  const signupForm = (
    <form className="mt-8 space-y-3" onSubmit={handleSignupSubmit} noValidate>
        <div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon className="h-5 w-5 text-gray-400" /></div>
                <input name="name" type="text" autoComplete="name" required
                    className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${signupErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Full Name" value={signupData.name} onChange={handleSignupChange} disabled={isAuthLoading} />
            </div>
            <InputErrorMessage message={signupErrors.name} />
        </div>
        <div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MailIcon className="h-5 w-5 text-gray-400" /></div>
                <input name="email" type="email" autoComplete="email" required
                    className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${signupErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Email address" value={signupData.email} onChange={handleSignupChange} disabled={isAuthLoading}/>
            </div>
            <InputErrorMessage message={signupErrors.email} />
        </div>
        <div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><PhoneIcon className="h-5 w-5 text-gray-400" /></div>
                <input name="phone" type="tel" autoComplete="tel" required
                    className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${signupErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Phone Number" value={signupData.phone} onChange={handleSignupChange} disabled={isAuthLoading}/>
            </div>
            <InputErrorMessage message={signupErrors.phone} />
        </div>
        <div>
            <div className="relative flex items-center">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPinIcon className="h-5 w-5 text-gray-400" /></div>
                <input id="location" name="location" type="text" required readOnly
                    className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm bg-gray-50 ${signupErrors.location ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Latitude, Longitude" value={signupData.location} />
                <button type="button" onClick={handleGetLocation} disabled={isAuthLoading} className="absolute right-1 top-1 bottom-1 px-3 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors disabled:opacity-50">Get Location</button>
            </div>
            {locationMessage && <p className="text-xs text-center mt-2 text-gray-600">{locationMessage}</p>}
            <InputErrorMessage message={signupErrors.location} />
        </div>
        <div>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockIcon className="h-5 w-5 text-gray-400" /></div>
                <input name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required
                    className={`appearance-none rounded-md relative block w-full px-3 py-3 pl-10 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm ${signupErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Password" value={signupData.password} onChange={handleSignupChange} disabled={isAuthLoading} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
            </div>
            <InputErrorMessage message={signupErrors.password} />
        </div>
        <div className="pt-2">
            <button
              type="submit"
              disabled={!isSignupValid || isAuthLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isAuthLoading && <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
              Create Account
            </button>
        </div>
        <AuthErrorMessage message={authError} />
    </form>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50/50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg border border-gray-200">
        <div className="text-center">
            <div className="flex items-center justify-center mb-4">
                 <LeafIcon className="w-10 h-10 text-green-600 mr-3"/>
                 <h1 className="text-3xl font-bold text-gray-800">
                    Agro<span className="text-green-600">X</span>
                </h1>
            </div>
          <p className="mt-2 text-gray-600">{isSigningUp ? 'Create an account to get started.' : 'Sign in to access your farm dashboard.'}</p>
        </div>
        
        {isSigningUp ? signupForm : loginForm}
        
        <div className="text-sm text-center text-gray-600">
          {isSigningUp ? 'Already have an account? ' : "Don't have an account? "}
          <button
            onClick={() => {
              setIsSigningUp(!isSigningUp);
              setAuthError('');
            }}
            className="font-medium text-green-600 hover:text-green-500"
          >
            {isSigningUp ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;