import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '80px 24px',
          }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 16 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>
            An unexpected error occurred. Please try refreshing.
          </p>
          <Link
            to="/"
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Back to Home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
