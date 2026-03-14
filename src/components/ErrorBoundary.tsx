import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-8 max-w-md w-full text-center space-y-4">
            <h2 className="text-lg font-semibold text-red-800">Algo deu errado</h2>
            <p className="text-sm text-red-700">{this.state.message || 'Erro inesperado na aplicação.'}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
