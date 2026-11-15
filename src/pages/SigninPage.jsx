// src/components/SignInForm/SignInForm.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router';

import { signIn } from '../services/authService';


const SignInForm = ({ setUser }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  function handleChange(event){
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event){
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const signedInUser = await signIn(formData);

      setUser(signedInUser);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <aside className="auth-aside"><div><span className="hero-eyebrow">Welcome back</span><h1>Your road<br/>continues here.</h1><p>Pick up where you left off. Your lessons, plans, and next steps are ready when you are.</p></div><small>DARBI · Driving forward, together.</small></aside>
      <section className="auth-panel">
      <h1>Sign in to DARBI</h1>
      <p>Enter your account details to continue.</p>
      {error && <p className="error" role="alert">{error}</p>}
      <form autoComplete='off' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='username'>Username:</label>
          <input
            type='text'
            autoComplete='off'
            id='username'
            value={formData.username}
            name='username'
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor='password'>Password:</label>
          <div className="password-field"><input
            type={showPassword ? 'text' : 'password'}
            autoComplete='off'
            id='password'
            value={formData.password}
            name='password'
            onChange={handleChange}
            required
          /><button className="password-toggle" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? 'Hide' : 'Show'}</button></div>
        </div>
        <div>
          <button type='submit' disabled={submitting}>{submitting ? 'Signing in…' : 'Sign In'}</button>
          <button type='button' onClick={() => navigate('/')}>Back to home</button>
        </div>
      </form>
      <p>New to DARBI? <Link to="/sign-up">Create an account</Link></p>
      </section>
    </main>
  );
};

export default SignInForm;
