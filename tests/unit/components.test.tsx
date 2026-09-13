import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Eyebrow } from '../../src/components/ui/Eyebrow';
import { PillButton } from '../../src/components/ui/PillButton';
import { TagChip } from '../../src/components/ui/TagChip';

describe('PillButton', () => {
  it('renders its label and calls onClick', () => {
    const onClick = vi.fn();
    render(<PillButton onClick={onClick}>Let&apos;s Talk</PillButton>);

    const button = screen.getByRole('button', { name: /let's talk/i });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('renders as a link when given an href', () => {
    render(
      <PillButton href="#about" withArrow>
        About Us
      </PillButton>,
    );
    expect(screen.getByRole('link', { name: /about us/i })).toHaveProperty('href');
  });

  it('inverts the arrow badge on the dark variant', () => {
    const { container } = render(
      <PillButton variant="dark" withArrow>
        Send
      </PillButton>,
    );
    expect(container.querySelector('.bg-white.text-ink')).not.toBeNull();
  });
});

describe('Eyebrow', () => {
  it('switches palette with the tone', () => {
    const { container, rerender } = render(<Eyebrow>Services</Eyebrow>);
    expect(container.querySelector('.text-foreground\\/70')).not.toBeNull();

    rerender(<Eyebrow tone="light">By the numbers</Eyebrow>);
    expect(container.querySelector('.text-white\\/70')).not.toBeNull();
  });

  it('adds a pill border when bordered', () => {
    const { container } = render(<Eyebrow bordered>Portfolio</Eyebrow>);
    expect(container.querySelector('.rounded-pill.border')).not.toBeNull();
  });
});

describe('TagChip', () => {
  it('renders its content', () => {
    render(<TagChip>Branding</TagChip>);
    expect(screen.getByText('Branding')).toBeTruthy();
  });
});
