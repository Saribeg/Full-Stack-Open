import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../../../src/components/ui/Modal';

describe('Modal', () => {
  it('does not render when isOpened=false', () => {
    render(
      <Modal isOpened={false} onClose={() => {}}>
        Content
      </Modal>
    );
    expect(screen.queryByText(/Content/)).not.toBeInTheDocument();
  });

  it('renders children when isOpened=true', () => {
    render(
      <Modal isOpened={true} onClose={() => {}}>
        Hello Modal
      </Modal>
    );
    expect(screen.getByText(/Hello Modal/)).toBeInTheDocument();
  });

  it('calls onClose when overlay is clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpened={true} onClose={onClose}>
        content
      </Modal>
    );

    await userEvent.click(screen.getByTestId('overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does NOT call onClose when inner content clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpened={true} onClose={onClose}>
        <span>Inner</span>
      </Modal>
    );

    await userEvent.click(screen.getByText('Inner'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    render(
      <Modal isOpened={true} onClose={onClose}>
        content
      </Modal>
    );

    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
