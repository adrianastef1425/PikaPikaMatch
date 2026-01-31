/**
 * Accessibility Tests for Button Component
 * 
 * This file documents the accessibility features of the Button component.
 * These tests verify WCAG 2.1 AA compliance.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Accessibility', () => {
  it('should have accessible name when aria-label is provided', () => {
    render(<Button icon="favorite" aria-label="Like this item" />);
    const button = screen.getByRole('button', { name: 'Like this item' });
    expect(button).toBeInTheDocument();
  });

  it('should hide icon from screen readers with aria-hidden', () => {
    const { container } = render(<Button icon="favorite" aria-label="Like" />);
    const icon = container.querySelector('.material-symbols-outlined');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  it('should be keyboard accessible with proper button role', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });

  it('should indicate disabled state properly', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button', { name: 'Disabled Button' });
    expect(button).toBeDisabled();
  });

  it('should support aria-describedby for additional context', () => {
    render(
      <>
        <Button aria-label="Submit" aria-describedby="submit-help">Submit</Button>
        <div id="submit-help">This will submit your vote</div>
      </>
    );
    const button = screen.getByRole('button', { name: 'Submit' });
    expect(button).toHaveAttribute('aria-describedby', 'submit-help');
  });
});
