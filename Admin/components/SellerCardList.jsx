// server/Admin/components/SellerCardList.jsx
import React, { useEffect } from 'react';
import { useRecords } from 'adminjs';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, H2, Loader, Placeholder, H5, Button, Pagination } from '@adminjs/design-system';

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

const SellerCardList = () => {
  const {
    records,
    loading,
    error,
    total,
    perPage,
    page,
    direction,
    sortBy
  } = useRecords('Seller');


  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    // ถ้ายังไม่มี pageSize ใน URL และมี total (รู้จำนวนทั้งหมดแล้ว)
    if (!searchParams.has('pageSize') && total > 0) {
      searchParams.set('pageSize', '100'); // บังคับโหลด 100 รายการ
      navigate({ search: searchParams.toString() });
    }
  }, [total, perPage, location.search, navigate]); // <-- ใช้ navigate

  const searchParams = new URLSearchParams(location.search);
  if (!searchParams.has('pageSize') && total > 0) {
    return <Box p="lg"><Loader /></Box>;
  }

  if (loading) return <Box p="lg"><Loader /></Box>;
  if (error) return <Box p="lg"><Placeholder><H5>เกิดข้อผิดพลาด</H5><p>ไม่สามารถดึงข้อมูลผู้ขายได้</p></Placeholder></Box>;
  if (!records || records.length === 0) return <Box p="lg"><Placeholder><H5>ไม่มีผู้ขาย</H5><p>ไม่พบผู้ขายที่ตรงกับเงื่อนไขการกรองของคุณ</p></Placeholder></Box>;

  return (
    <Box p="2xl">
      <Box
        display="grid"
        gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(340px, 1fr))']}
        style={{ gap: "20px" }}
      >
        {records.map((r) => {
          const params = r.params ?? {};
          const userParams = r.populated?.user?.params ?? {};
          const id = r.id ?? params.id;

          const fullName = `${displayValue(userParams.First_name, '')} ${displayValue(userParams.Last_name, '')}`.trim() || "ไม่มีชื่อ";
          const imageUrl = params.nationalIdImage || null;

          const companyName = displayValue(params.Company_Name);
          const license = displayValue(params.RealEstate_License);
          const status = displayValue(params.Status);
          const createdAt = new Date(params.createdAt).toLocaleDateString("th-TH", {
            year: 'numeric', month: 'short', day: 'numeric'
          });

          const badgeStyles = {
            PENDING: { bg: "#fffbe6", color: "#faad14" },
            APPROVED: { bg: "#f6ffed", color: "#52c41a" },
            REJECTED: { bg: "#fff1f0", color: "#f5222d" },
            default: { bg: "#f2f2f2", color: "#555" },
          };
          const style = badgeStyles[status] || badgeStyles.default;

          // ✅ สร้าง Object สำหรับแปลสถานะ
          const statusTranslations = {
            PENDING: 'รอตรวจสอบ',
            APPROVED: 'อนุมัติแล้ว',
            REJECTED: 'ถูกปฏิเสธ',
          };

          // ✅ ดึงคำแปลภาษาไทย
          const statusText = statusTranslations[status] || status;

          return (
            <Card key={id}>
              <Box display="flex" alignItems="center" gridGap="lg">
                <Box width={80} height={80} borderRadius="50%" overflow="hidden" bg="grey20" flexShrink={0}>
                  {imageUrl ? (
                    <img src={imageUrl} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <Box width="100%" height="100%" display="flex" alignItems="center" justifyContent="center" color="grey60">
                      No Img
                    </Box>
                  )}
                </Box>
                <Box>
                  <H2 m={0} fontSize="xl">{fullName}</H2>
                  <Box color="grey80" mt="xs"><strong>บริษัท:</strong> {companyName}</Box>
                  <Box color="grey80"><strong>ใบอนุญาต:</strong> {license}</Box>
                </Box>
              </Box>

              <Box
                borderTop="1px solid" borderColor="grey20" mt="xl" pt="lg"
                display="flex" justifyContent="space-between" alignItems="center"
              >
                <Box>
                  <Box
                    as="span" px="md" py="sm" borderRadius="lg"
                    style={{ backgroundColor: style.bg, color: style.color, fontWeight: "bold", fontSize: "0.9rem" }}
                  >
                    {/* ✅ เปลี่ยนมาใช้ statusText เพื่อแสดงผล */}
                    {statusText}
                  </Box>
                  <Box fontSize="sm" color="grey60" mt="sm">
                    เป็นผู้ขายเมื่อ: {createdAt}
                  </Box>
                </Box>
                <Box display="flex" gridGap="md">
                  <Button as="a" href={`/admin/resources/Seller/records/${id}/show`} variant="primary">ดู</Button>
                  <Button as="a" href={`/admin/resources/Seller/records/${id}/edit`}>แก้ไข</Button>
                </Box>
              </Box>
            </Card>
          );
        })}
      </Box>
      <Box mt="xl" display="flex" justifyContent="center">
        <Pagination
          page={page}
          perPage={perPage}
          total={total}
          onChange={(pageNumber) => {
            const search = new URLSearchParams(window.location.search);
            search.set('page', String(pageNumber));
            // คงค่า pageSize ที่เราตั้งไว้ (100)
            if (!search.has('pageSize')) search.set('pageSize', '100');
            if (sortBy) search.set('sortBy', sortBy);
            if (direction) search.set('direction', direction);

            // ใช้ navigate (v6)
            navigate({ search: search.toString() });
          }}
        />
      </Box>
    </Box>
  );
};

export default SellerCardList;