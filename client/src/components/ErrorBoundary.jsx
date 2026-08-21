import { Component } from "react";

// Minimal error boundary for Phase 1. Catches unhandled render
// errors and shows a fallback message instead of a blank screen.
// Per-feature loading/empty/error states are handled individually
// starting with real features in later phases.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Unhandled application error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <p>Something went wrong. Please refresh the page.</p>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;