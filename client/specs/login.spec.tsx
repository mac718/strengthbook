import React from 'react';
import Home from '../pages/index';
import { render, screen } from '../test/test-utils';

describe('index', () => {
  it("should render 'Strength Book' heading", () => {
    render(<Home />);
    const heading = screen.getByText('Strength Book');
    expect(heading).toBeInTheDocument();
  });
});
