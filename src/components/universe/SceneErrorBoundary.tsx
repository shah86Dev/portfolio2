"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback: ReactNode;
  onError?: () => void;
}

interface State {
  failed: boolean;
}

/**
 * Catches anything the 3D scene throws — a lost context, a driver refusing a
 * shader, a browser that reports WebGL and then fails to give one — and swaps
 * in the 2D universe instead. A visitor should never see a broken canvas.
 */
export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
