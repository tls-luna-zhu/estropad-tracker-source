import React, { useState } from 'react';
import '../components/PixelStyles.css';

interface RegisterFormProps {
  onRegister: (email: string, password: string, name: string) => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);

    try {
      await onRegister(email, password, name);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pixel-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 className="pixel-text" style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Create Your Account</h2>
      
      {error && (
        <div style={{ backgroundColor: 'var(--error)', padding: '12px', marginBottom: '16px', color: 'white' }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="name" style={{ display: 'block', marginBottom: '8px' }}>
            Name
          </label>
          <input
            id="name"
            type="text"
            className="pixel-input"
            style={{ width: '100%' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '8px' }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            className="pixel-input"
            style={{ width: '100%' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div style={{ marginBottom: '16px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '8px' }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            className="pixel-input"
            style={{ width: '100%' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        
        <div style={{ marginBottom: '24px' }}>
          <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '8px' }}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="pixel-input"
            style={{ width: '100%' }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <button
          type="submit"
          className="pixel-button"
          style={{ width: '100%' }}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
