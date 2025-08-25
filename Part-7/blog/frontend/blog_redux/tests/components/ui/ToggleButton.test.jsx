import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ToggleButton from '../../../src/components/ui/ToggleButton';

vi.mock('../../../src/components/ui/Form/Button', () => ({
  default: ({ children, ...props }) => <button {...props}>{children}</button>
}));

describe('ToggleButton', () => {
  it('renders "➕ label" when visible=false', () => {
    render(<ToggleButton visible={false} label="Add blog" />);
    expect(screen.getByRole('button')).toHaveTextContent('➕ Add blog');
  });

  it('renders "▲ Cancel" when visible=true', () => {
    render(<ToggleButton visible={true} label="Add blog" />);
    expect(screen.getByRole('button')).toHaveTextContent('▲ Cancel');
  });

  it('passes extra props (e.g. onClick)', async () => {
    const onClick = vi.fn();
    render(<ToggleButton visible={false} label="Add blog" onClick={onClick} />);

    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
