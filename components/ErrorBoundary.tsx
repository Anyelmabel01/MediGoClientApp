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
    return { hasError: false }; // Retornamos false para que los errores no interrumpan la UI
  }

  componentDidCatch(error: Error) {
    handleError(error);
  }

  render() {
    return this.props.children;
  }
} 