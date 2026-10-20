import { Component } from 'react';
import styles from './ErrorBoundary.module.css';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // In a real deployment this would report to an error-tracking
    // service. For this prototype, a console log is honest and enough.
    console.error('AL Hospitality Group — unexpected error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div className={styles.page}>
        <p className={styles.eyebrow}>AL Hospitality Group</p>
        <h1>Something went wrong.</h1>
        <p>We&rsquo;re sorry — this page hit an unexpected error. Please try again.</p>
        <div className={styles.actions}>
          <button type="button" onClick={() => window.location.reload()}>Reload the page</button>
          <a href="/">Return home</a>
        </div>
      </div>
    );
  }
}