// server/Admin/components/UserCardList.jsx
import React from 'react';
import { useRecords } from 'adminjs';
import { Box, H2, Loader, Placeholder, H5, Button } from '@adminjs/design-system';

// Helper Functions
const isEmptyValue = (v) => v === null || v === undefined || String(v).trim() === "";
const displayValue = (v) => (isEmptyValue(v) ? "N/A" : v);

const Card = ({ children }) => (
  <Box
    variant="white"
    boxShadow="card"
    borderRadius="xl"
    p="xl"
    mb="xl"
    _hover={{ boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}
  >
    {children}
  </Box>
);

const UserCardList = () => {
  const { records, loading, error } = useRecords('User');

  if (loading) {
    return (
      <Box p="lg">
        <Loader />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p="lg">
        <Placeholder>
          <H5>เกิดข้อผิดพลาด</H5>
          <p>ไม่สามารถดึงข้อมูลผู้ใช้งานได้</p>
        </Placeholder>
      </Box>
    );
  }

  if (!records || records.length === 0) {
    return (
      <Box p="lg">
        <Placeholder>
          <H5>ไม่มีผู้ใช้งาน</H5>
          <p>ไม่พบผู้ใช้งานที่ตรงกับเงื่อนไขการกรองของคุณ</p>
        </Placeholder>
      </Box>
    );
  }

  return (
    <Box p="xl">
      <Box
        display="grid"
        gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(340px, 1fr))']}
        gap="xl"
      >
        {records.map((r) => {
          const params = r.params ?? {};
          const id = r.id ?? params.id;

          const fullName = `${displayValue(params.First_name)} ${displayValue(params.Last_name)}`;
          const email = displayValue(params.Email);
          const phone = displayValue(params.Phone);
          const userType = displayValue(params.userType);
          const imageUrl = params.image || null;
          const createdAt = new Date(params.createdAt).toLocaleDateString("th-TH", {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });

          // ✅ เพิ่มสีตามประเภท
          const badgeStyles = {
            Admin: {
              bg: "#e6f0ff", // ฟ้าอ่อน
              color: "#0047ab", // น้ำเงินเข้ม
            },
            Seller: {
              bg: "#eaffea", // เขียวอ่อน
              color: "#008000", // เขียวเข้ม
            },
            Buyer: {
              bg: "#eaffea", // เขียวอ่อน
              color: "#008000",
            },
            default: {
              bg: "#f2f2f2",
              color: "#555",
            },
          };

          const style = badgeStyles[userType] || badgeStyles.default;

          return (
            <Card key={id}>
              <Box display="flex" alignItems="center" gridGap="lg">
                <Box
                  width={80}
                  height={80}
                  borderRadius="50%"
                  overflow="hidden"
                  bg="grey20"
                  flexShrink={0}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Box
                      width="100%"
                      height="100%"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="grey60"
                    >
                      No Img
                    </Box>
                  )}
                </Box>
                <Box>
                  <H2 m={0} fontSize="xl">{fullName}</H2>
                  <Box color="grey80" mt="xs">{email}</Box>
                  <Box color="grey80">{phone}</Box>
                </Box>
              </Box>

              <Box
                borderTop="1px solid"
                borderColor="grey20"
                mt="lg"
                pt="lg"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Box
                    as="span"
                    px="md"
                    py="sm"
                    borderRadius="lg"
                    style={{
                      backgroundColor: style.bg,
                      color: style.color,
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                      boxShadow: "0 0 4px rgba(0,0,0,0.05)",
                    }}
                  >
                    {userType}
                  </Box>
                  <Box fontSize="sm" color="grey60" mt="sm">
                    เป็นสมาชิกเมื่อ: {createdAt}
                  </Box>
                </Box>
                <Box display="flex" gridGap="md">
                  <Button as="a" href={`/admin/resources/User/records/${id}/show`} variant="primary">
                    ดู
                  </Button>
                  <Button as="a" href={`/admin/resources/User/records/${id}/edit`}>
                    แก้ไข
                  </Button>
                </Box>
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default UserCardList;
