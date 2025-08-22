import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../../../../src/components/ui/Form/Button';

describe('Button', () => {
  it('renders children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies primary classes by default', () => {
    render(<Button>Primary</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bg-gradient-to-br', 'from-blue-500', 'to-blue-700');
  });

  it('applies danger classes when uiType="danger"', () => {
    render(<Button uiType="danger">Danger</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('bg-[#2b1212]');
    expect(btn).toHaveClass('text-red-300');
  });

  it('applies custom className in addition to base', () => {
    render(<Button className="custom-class">With custom</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveClass('custom-class');
    expect(btn).toHaveClass('inline-flex');
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
