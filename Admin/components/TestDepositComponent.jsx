// server/Admin/components/TestPagination.jsx
import React from 'react';
import { useRecords } from 'adminjs';
import { Box, H5, Loader, Placeholder, Text, Pagination } from '@adminjs/design-system';

const TestDepositComponent = () => {
  const { records, loading, page, perPage, total, handleChangePage } = useRecords('User');

  console.log("TEST PAGINATION DATA:", { page, perPage, total });

  if (loading) return <Loader />;
  if (!records) return <Placeholder><H5>No records</H5></Placeholder>;

  return (
    <Box p="lg" variant="white">
      <H5>Pagination Test Component</H5>
      <Text>Total: {total}, PerPage: {perPage}, Current Page: {page}</Text>
      <ul>
        {records.map(r => <li key={r.id}>User ID: {r.id}</li>)}
      </ul>
      <Pagination page={page} perPage={perPage} total={total} onChange={handleChangePage} />
    </Box>
  );
};

export default TestDepositComponent;