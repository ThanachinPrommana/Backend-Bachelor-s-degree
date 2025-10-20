import React from 'react';
import { useRecords } from 'adminjs';
import { Box, H2, H5, Loader, Placeholder, Button, Text } from '@adminjs/design-system';

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

const PaymentCardList = () => {
  const { records, loading, error } = useRecords('Payment');

  if (loading) return <Box p="lg"><Loader /></Box>;
  if (error) return <Box p="lg"><Placeholder><H5>เกิดข้อผิดพลาด</H5><p>ไม่สามารถดึงข้อมูลการชำระเงินได้</p></Placeholder></Box>;
  if (!records || records.length === 0) return <Box p="lg"><Placeholder><H5>ไม่มีข้อมูลการชำระเงิน</H5><p>ไม่พบข้อมูลที่ตรงกับเงื่อนไข</p></Placeholder></Box>;

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
          const postParams = r.populated?.PropertyPost?.params ?? {};
          const id = r.id ?? params.id;

          const paymentAmount = params.Payment_Amount != null ? `${Number(params.Payment_Amount).toLocaleString()} บาท` : "N/A";
          const paymentSlipUrl = params.Payment_Slip;
          const status = displayValue(params.Status);
          const userName = `${displayValue(userParams.First_name, '')} ${displayValue(userParams.Last_name, '')}`.trim() || "ไม่มีข้อมูล";
          const propertyName = displayValue(postParams.Property_Name, 'N/A');
          const createdAt = params.createdAt ? new Date(params.createdAt).toLocaleDateString("th-TH", { year: 'numeric', month: 'short', day: 'numeric'}) : 'N/A';

          const badgeStyles = {
            PENDING: { bg: "#fffbe6", color: "#faad14" },
            CONFIRMED: { bg: "#f6ffed", color: "#52c41a" },
            FAILED: { bg: "#fff1f0", color: "#f5222d" },
            default: { bg: "#f2f2f2", color: "#555" },
          };
          const style = badgeStyles[status] || badgeStyles.default;

          const statusTranslations = {
            PENDING: 'รอตรวจสอบ',
            CONFIRMED: 'ยืนยันแล้ว',
            FAILED: 'ล้มเหลว',
          };
          const statusText = statusTranslations[status] || status;

          return (
            <Card key={id}>
              {/* === Section: Header === */}
              <Box display="flex" alignItems="center" style={{ gap: '16px' }}>
                <Box 
                  width={80} height={80} borderRadius="50%" 
                  bg="primary20" color="primary100"
                  display="flex" alignItems="center" justifyContent="center" flexShrink={0}
                >
                  <Text fontSize={24} fontWeight="bold">฿</Text>
                </Box>
                <Box>
                  <H2 m={0} fontSize="xl">{paymentAmount}</H2>
                  <Text color="grey80" mt="xs"><strong>ผู้ชำระ:</strong> {userName}</Text>
                  <Text color="grey80"><strong>สำหรับโพสต์:</strong> {propertyName}</Text>
                </Box>
              </Box>

              {/* === Section: Slip Button === */}
              <Box borderTop="1px solid" borderColor="grey20" mt="lg" pt="lg">
                <Button 
                  as="a" 
                  href={paymentSlipUrl} 
                  target="_blank" 
                  variant="primary"
                  disabled={!paymentSlipUrl}
                  width="100%"
                >
                  ดูสลิป
                </Button>
              </Box>

              {/* === Section: Footer (Status Only) === */}
              <Box
                borderTop="1px solid" borderColor="grey20"
                mt="lg" pt="lg"
                display="flex" justifyContent="space-between" alignItems="center"
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
                    ชำระเมื่อ: {createdAt}
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

export default PaymentCardList;