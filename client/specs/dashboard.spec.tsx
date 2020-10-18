import React from 'react';
import Dashboard from '../pages/dashboard';
import { render, screen } from '../test/test-utils';
import { IProfile, IUser } from '../../src/users/user.schema';

let mockProfile: IProfile = {
  firstName: 'Mike',
  lastName: 'Coon',
  bodyweight: 75,
  dob: new Date('1980-10-21'),
};
let mockUser: IUser = {
  firstName: 'Mike',
  lastName: 'Coon',
  email: 'mac718@gmail.com',
  password: 'thing',
  profile: mockProfile,
  workouts: [],
  prs: [],
};

describe('dashboard', () => {
  it("renders 'Recent Prs'", () => {
    render(<Dashboard user={mockUser} />);
    const heading = screen.getByText('Recent PRs');
    expect(heading).toBeInTheDocument();
  });
});
