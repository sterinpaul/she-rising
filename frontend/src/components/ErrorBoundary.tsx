import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#f5f1ee] to-[#c4b4a7] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#C4A173] to-[#4D361E] flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-white text-4xl"
              >
                ⚠️
              </motion.div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold text-[#4D361E] mb-4"
            >
              Oops! Something went wrong
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-[#6f360d] text-lg mb-8 leading-relaxed"
            >
              We encountered an unexpected error. Don't worry, our team has been notified and we're working on a fix.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-4"
            >
              <motion.button
                onClick={this.handleReload}
                className="w-full bg-gradient-to-r from-[#C4A173] to-[#4D361E] text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 15px 35px rgba(196, 161, 115, 0.4)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                Try Again
              </motion.button>

              <motion.button
                onClick={this.handleGoHome}
                className="w-full bg-white/40 backdrop-blur-sm text-[#4D361E] font-semibold px-6 py-3 rounded-xl border border-[#C4A173]/30 hover:bg-white/60 transition-all duration-300"
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(255, 255, 255, 0.6)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                Go Back Home
              </motion.button>
            </motion.div>

            {import.meta.env.DEV && this.state.error && (
              <motion.details
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="mt-8 text-left"
              >
                <summary className="cursor-pointer text-[#6f360d] font-medium mb-2">
                  Error Details (Development Mode)
                </summary>
                <pre className="bg-red-100 p-4 rounded-lg text-red-800 text-sm overflow-auto max-h-40">
                  {this.state.error.toString()}
                </pre>
              </motion.details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;