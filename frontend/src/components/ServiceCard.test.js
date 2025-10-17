// frontend/src/components/__tests__/ServiceCard.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ServiceCard from '../ServiceCard';

const mockService = {
  _id: '1',
  title: 'Test Plumbing Service',
  description: 'Professional plumbing services for your home',
  category: 'plumbing',
  price: 50,
  priceType: 'hourly',
  rating: 4.5,
  reviewCount: 10,
  location: { city: 'Test City', state: 'TS' },
  provider: {
    _id: 'provider1',
    name: 'Test Provider',
    profilePicture: '/test-avatar.jpg'
  },
  images: ['/test-image.jpg']
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ServiceCard Component', () => {
  it('renders service information correctly', () => {
    renderWithRouter(<ServiceCard service={mockService} />);

    expect(screen.getByText('Test Plumbing Service')).toBeInTheDocument();
    expect(screen.getByText('Professional plumbing services for your home')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
    expect(screen.getByText('Test Provider')).toBeInTheDocument();
    expect(screen.getByText('plumbing')).toBeInTheDocument();
  });

  it('displays rating stars correctly', () => {
    renderWithRouter(<ServiceCard service={mockService} />);

    // Should display rating
    expect(screen.getByText('(10 reviews)')).toBeInTheDocument();
  });

  it('navigates to service detail on view details click', () => {
    renderWithRouter(<ServiceCard service={mockService} />);

    const viewDetailsButton = screen.getByText('View Details');
    expect(viewDetailsButton).toBeInTheDocument();
    expect(viewDetailsButton.closest('a')).toHaveAttribute('href', '/services/1');
  });
});