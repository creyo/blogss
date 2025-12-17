import React, { useState } from 'react';
import supabase from '../config/supabase';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      localStorage.setItem("sb-narivuecshkbtcueblcl-auth-token", user.access_token);

      console.log('User logged in:', user);

      navigate('/');
    } catch (error) {
      console.error('Login error:', error.message);
      setError('An error occurred during login.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        console.error('Google login error:', error.message);
      } else {
        
        localStorage.setItem("sb-narivuecshkbtcueblcl-auth-token", data.user.access_token);
        navigate('/');
      }
    } catch (error) {
      console.error('Google login error:', error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="login-input"
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="login-input"
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
      <button onClick={handleGoogleLogin} className="google-login-button">
        Login with Google
      </button>
      <p>
        Not registered yet? <Link to="/signup">Register</Link>
      </p>
    </div>
  );
}

export default Login;
