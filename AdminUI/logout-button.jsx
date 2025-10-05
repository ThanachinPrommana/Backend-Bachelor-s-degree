
import React from 'react';
import { Navigation, Button } from '@adminjs/design-system';

const LogoutLink = () => (
  <Navigation>
    <Button as="a" href="/admin/logout" variant="primary" mr="lg">
      Logout
    </Button>
  </Navigation>
);

export default LogoutLink;