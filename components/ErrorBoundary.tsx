import { handleError } from '@/utils/errorHandler';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    // Always return hasError: false to prevent any UI disruption
    return { hasError: false };
  }

  componentDidCatch(error: Error) {
    // Log the error to console but don't display in UI
    handleError(error);
  }

  render() {
    // Always render children regardless of error state
    return this.props.children;
  }
} 