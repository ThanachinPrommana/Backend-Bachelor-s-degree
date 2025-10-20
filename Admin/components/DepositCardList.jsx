import React from 'react';
import { useRecords } from 'adminjs';
import { Box, H2, H5, Loader, Placeholder, Badge, Text } from '@adminjs/design-system';

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

const DepositCardList = () => {
  const { records, loading, error } = useRecords("Deposit");

  if (loading) return <Box p="lg"><Loader /></Box>;
  if (error) return <Box p="lg"><Placeholder><H5>เกิดข้อผิดพลาด</H5><p>ไม่สามารถดึงข้อมูลเงินมัดจำได้</p></Placeholder></Box>;
  if (!records || records.length === 0) return <Box p="lg"><Placeholder><H5>ไม่มีข้อมูลเงินมัดจำ</H5><p>ไม่พบข้อมูลที่ตรงกับเงื่อนไข</p></Placeholder></Box>;

  return (
    <Box p="2xl">
      <Box
        display="grid"
        gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(340px, 1fr))']}
        style={{ gap: "20px" }} 
      >
        {records.map((r) => {
          const params = r.params ?? {};
          const userParams = r.populated?.User?.params ?? {};
          const postParams = r.populated?.Post?.params ?? {};
          const unitParams = r.populated?.Unit?.params ?? {};
          const id = r.id ?? params.id;

          const userName = `${displayValue(userParams.First_name, '')} ${displayValue(userParams.Last_name, '')}`.trim() || "ไม่มีชื่อ";
          const depositAmount = params.Deposit_Amount != null ? `${Number(params.Deposit_Amount).toLocaleString()} บาท` : "N/A";
          const propertyName = displayValue(postParams.Property_Name, 'N/A');
          const unitNumber = displayValue(unitParams.Unit_Number, 'N/A');
          const status = displayValue(params.Deposit_Status, 'UNKNOWN');
          const createdAt = params.createdAt ? new Date(params.createdAt).toLocaleDateString("th-TH", { year: 'numeric', month: 'short', day: 'numeric'}) : 'N/A';

          const badgeStyles = {
            PENDING: { bg: "#fffbe6", color: "#faad14" },
            CONFIRMED: { bg: "#f6ffed", color: "#52c41a" },
            REJECTED: { bg: "#fff1f0", color: "#f5222d" },
            default: { bg: "#f2f2f2", color: "#555" },
          };
          const statusTranslations = {
            PENDING: 'รอดำเนินการ',
            CONFIRMED: 'ยืนยันแล้ว',
            REJECTED: 'ถูกปฏิเสธ',
          };
          
          const style = badgeStyles[status] || badgeStyles.default;
          const statusText = statusTranslations[status] || status;

          return (
            <Card key={id}>
              {/* === Section: Header === */}
              {/* ✅ ส่วนของรูปไอคอนถูกลบออกไปแล้ว */}
              <Box>
                <H2 m={0} fontSize="xl">{depositAmount}</H2>
                <Text color="grey80" mt="xs"><strong>ผู้ทำรายการ:</strong> {userName}</Text>
                <Text color="grey80"><strong>โครงการ:</strong> {propertyName} (ยูนิต: {unitNumber})</Text>
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
                  <Box fontSize="sm" color="grey60" mt="sm">
                    ทำรายการเมื่อ: {createdAt}
                  </Box>
                </Box>
              </Box>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default DepositCardList;