export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '1rem',
      backgroundColor: 'var(--background)'
    }}>
      <div style={{
        maxWidth: '28rem',
        width: '100%',
        padding: '2rem',
        border: '4px solid var(--primary-dark)',
        borderRadius: '0.5rem',
        textAlign: 'center',
        backgroundColor: 'white'
      }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>404 - Page Not Found</h1>
        <p style={{marginBottom: '1.5rem'}}>The page you're looking for doesn't exist or has been moved.</p>
        <a href="/" style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--primary)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '0.25rem'
        }}>Return Home</a>
      </div>
    </div>
  );
}
