import React from 'react';
import { useRecords } from 'adminjs';
import { Box, H2, H5, Loader, Placeholder, Button } from '@adminjs/design-system';

// Helper Functions
const isEmptyValue = (v) => v === null || v === undefined || String(v).trim() === "";
const displayValue = (v, fallback = "ว่าง") => (isEmptyValue(v) ? fallback : v);

const Card = ({ children }) => (
  <Box
    variant="white"
    boxShadow="card"
    borderRadius="xl"
    p="xl"
    mb="2xl"
    style={{ transition: "box-shadow 0.2s ease, transform 0.2s ease" }}
    _hover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)", transform: "translateY(-2px)" }}
  >
    {children}
  </Box>
);

const PropertyUnitCardList = () => {
  const { records, loading, error } = useRecords('PropertyUnit');

  if (loading) return <Box p="lg"><Loader /></Box>;
  if (error) return <Box p="lg"><Placeholder><H5>เกิดข้อผิดพลาด</H5><p>ไม่สามารถดึงข้อมูลยูนิตได้</p></Placeholder></Box>;
  if (!records || records.length === 0) return <Box p="lg"><Placeholder><H5>ไม่มียูนิต</H5><p>ไม่พบข้อมูลยูนิตที่ตรงกับเงื่อนไข</p></Placeholder></Box>;

  return (
    <Box p="2xl">
      <Box
        display="grid"
        gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(340px, 1fr))']}
        style={{ gap: "20px" }} 
      >
        {records.map((r) => {
          const params = r.params ?? {};
          const propertyPostParams = r.populated?.propertyPost?.params ?? {};
          const id = r.id ?? params.id;

          const unitNumber = displayValue(params.Unit_Number);
          const propertyName = displayValue(propertyPostParams.Property_Name, 'ไม่มีชื่อโครงการ');
          const status = displayValue(params.Status);

          const badgeStyles = {
            AVAILABLE: { bg: "#f6ffed", color: "#52c41a" },
            BOOKED: { bg: "#fffbe6", color: "#faad14" },
            SOLD: { bg: "#f2f2f2", color: "#555" },
            default: { bg: "#f2f2f2", color: "#555" },
          };
          const style = badgeStyles[status] || badgeStyles.default;

          const statusTranslations = {
            AVAILABLE: 'ว่าง',
            PENDING: 'กำลังดำเนินการ',
            SOLD: 'ขายแล้ว',
          };
          const statusText = statusTranslations[status] || status;

          return (
            <Card key={id}>
              {/* === Section: Header === */}
              {/* ✅ ส่วนของรูปไอคอนถูกลบออกไปแล้ว */}
              <Box>
                <H2 m={0} fontSize="xl">ยูนิตเลขที่: {unitNumber}</H2>
                <Box color="grey80" mt="xs"><strong>โครงการ:</strong> {propertyName}</Box>
              </Box>

              {/* === Section: Footer === */}
              <Box
                borderTop="1px solid"
                borderColor="grey20"
                mt="xl" pt="lg"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box>
                  <Box
                    as="span" px="md" py="sm"
                    borderRadius="lg"
                    style={{ backgroundColor: style.bg, color: style.color, fontWeight: "bold", fontSize: "0.9rem" }}
                  >
                    {statusText}
                  </Box>
                </Box>
                {/* <Box display="flex" gap="md">
                  <Button as="a" href={`/admin/resources/PropertyUnit/records/${id}/show`} variant="primary">ดู</Button>
                </Box> */}
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default PropertyUnitCardList;