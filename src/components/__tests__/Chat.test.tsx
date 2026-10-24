import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Chat, { Message } from '../Chat';

describe('Chat Component', () => {
  const mockOnSendMessage = vi.fn();
  const mockOnClearBoard = vi.fn();

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock scrollIntoView which is not implemented in jsdom
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  const defaultProps = {
    messages: [],
    onSendMessage: mockOnSendMessage,
    isLoading: false,
    onClearBoard: mockOnClearBoard,
  };

  test('renders initial empty state greeting', () => {
    render(<Chat {...defaultProps} />);

    expect(screen.getByText('Poly Math & Physics Teacher')).toBeInTheDocument();
    expect(screen.getByText('¡Hola! Soy tu asistente matemático.')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Escribe un problema matemático...')).toBeInTheDocument();
  });

  test('renders messages correctly', () => {
    const messages: Message[] = [
      { id: '1', role: 'user', text: 'Hello, what is 2+2?' },
      { id: '2', role: 'model', text: 'It is 4.' }
    ];

    render(<Chat {...defaultProps} messages={messages} />);

    expect(screen.getByText('Hello, what is 2+2?')).toBeInTheDocument();
    expect(screen.getByText('It is 4.')).toBeInTheDocument();
    // Empty state shouldn't be shown if there are messages
    expect(screen.queryByText('¡Hola! Soy tu asistente matemático.')).not.toBeInTheDocument();
  });

  test('allows typing and submitting a message', async () => {
    render(<Chat {...defaultProps} />);

    const input = screen.getByPlaceholderText('Escribe un problema matemático...');

    await userEvent.type(input, 'What is the speed of light?');
    expect(input).toHaveValue('What is the speed of light?');

    // form submission
    fireEvent.submit(input); // or click submit button

    expect(mockOnSendMessage).toHaveBeenCalledWith('What is the speed of light?');
    // Input should be cleared after submit
    expect(input).toHaveValue('');
  });

  test('does not submit empty messages', async () => {
    render(<Chat {...defaultProps} />);

    const input = screen.getByPlaceholderText('Escribe un problema matemático...');
    fireEvent.submit(input);

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  test('handles clear board action', async () => {
    render(<Chat {...defaultProps} />);

    const clearButton = screen.getByTitle('Limpiar Pizarra');
    await userEvent.click(clearButton);

    expect(mockOnClearBoard).toHaveBeenCalled();
  });

  test('disables input and shows loading state when isLoading is true', () => {
    render(<Chat {...defaultProps} isLoading={true} />);

    const input = screen.getByPlaceholderText('Escribe un problema matemático...');
    expect(input).toBeDisabled();

    // The submit button is disabled
    // Since the submit button has a Send icon, we can get it via the disabled prop on button with type submit
    // But testing the loading text is easier:
    expect(screen.getByText('Pensando...')).toBeInTheDocument();
  });
});
