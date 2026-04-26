// server/Admin/components/PropertyCardList.jsx
import React, { useState, useEffect } from 'react';
import { useRecords } from 'adminjs'; // <-- From adminjs
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, H2, H5, Loader, Placeholder, Button, Badge, Label, Text, Pagination } from '@adminjs/design-system';
// Helper Functions
const isEmptyValue = (v) => v === null || v === undefined || String(v).trim() === "";
const displayValue = (v, fallback = "N/A") => (isEmptyValue(v) ? fallback : v);

const truncate = (text, n = 180) => {
    if (!text) return "";
    if (text.length <= n) return text;
    return text.slice(0, n) + "...";
};

const DetailItem = ({ label, value }) => (
    <Box>
        <Label color="grey60" style={{ textTransform: 'uppercase', fontSize: '11px' }}>{label}</Label>
        <Text fontWeight="bold">{displayValue(value)}</Text>
    </Box>
);
const Card = ({ children }) => (
    <Box variant="white" boxShadow="card" borderRadius="xl" p="xl" mb="2xl">
        {children}
    </Box>
);

// const Label = ({ children }) => <Box color="grey60" fontSize="sm">{children}</Box>;

const PropertyCardList = () => {
    const {
        records,
        loading,
        error,
        total,
        perPage,
        page,
        direction,
        sortBy
    } = useRecords('PropertyPost');
    const [expanded, setExpanded] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        // ถ้าใน URL ยังไม่มี 'pageSize' (ค่า default คือ 10)
        // และเรามี 'total' (16)
        if (!searchParams.has('pageSize') && total > 0) {
            // สั่งให้มันใช้ 100 รายการต่อหน้า
            searchParams.set('pageSize', '100');

            // สั่งเปลี่ยน URL (เช่น /admin/.../list?pageSize=100)
            // การเปลี่ยน URL นี้จะบังคับให้ useRecords โหลดข้อมูลใหม่
            navigate({ search: searchParams.toString() });
        }
    }, [total, perPage, location.search, navigate]);

    const searchParams = new URLSearchParams(location.search);
    if (!searchParams.has('pageSize') && total > 0) {
        // ถ้ารู้ว่ามี 16 แต่ยังไม่ได้สั่ง pageSize=100 ให้รอโหลดก่อน
        return <Box p="lg"><Loader /></Box>;
    }
    console.log('--- DEBUG: useRecords (FRONTEND) ---');
    console.log('Total from hook:', total);
    console.log('Per Page from hook:', perPage);
    console.log('Records in hook:', records?.length);
    console.log('Loading:', loading);
    console.log('------------------------------------');

    if (loading) return <Box p="lg"><Loader /></Box>;
    if (error) return <Box p="lg"><Placeholder><H5>เกิดข้อผิดพลาดในการโหลดข้อมูลโพสต์</H5></Placeholder></Box>;
    if (!records || records.length === 0) return <Box p="lg"><Placeholder><H5>ไม่พบโพสต์ที่ตรงกับเงื่อนไข</H5></Placeholder></Box>;

    // ✅ สีสำหรับแต่ละสถานะ
    const badgeStyles = {
        PENDING: { bg: "#FFF7E0", color: "#B58100" },  // เหลือง
        CONFIRMED: { bg: "#E6F7E6", color: "#0C7A0C" },  // เขียว
        SOLD: { bg: "#E0E0E0", color: "#555555" },  // เทา
        HIDDEN: { bg: "#F2F2F2", color: "#666666" },  // เทาอ่อน
        REJECTED: { bg: "#FFE6E6", color: "#D10000" },  // แดง
        default: { bg: "#F2F2F2", color: "#666666" },
    };

    return (
        <Box p="2xl">
            <Box display="grid" gridTemplateColumns={['1fr', 'repeat(auto-fill, minmax(380px, 1fr))']} style={{ gap: "20px" }}>
                {records.map((r) => {
                    const params = r.params ?? {};
                    const id = r.id ?? params.id;
                    const isExpanded = !!expanded[id];

                    // ✅ ดึงข้อมูลทั้งหมดจาก params
                    const name = displayValue(params.Property_Name);
                    const description = displayValue(params.Description, "");
                    const price = params.Price != null ? Number(params.Price).toLocaleString() : "N/A";
                    const sellRent = displayValue(params.Sell_Rent);
                    const status = params.Status_post;
                    const createdAt = new Date(params.createdAt).toLocaleDateString("th-TH", { year: 'numeric', month: 'short', day: 'numeric' });
                    const imgUrl = params._firstImage || null;
                    const categoryName = params._categoryName || 'N/A';
                    const deposit = params.Deposit_Amount != null ? Number(params.Deposit_Amount).toLocaleString() : null;

                    const categoryTranslations = {
                        condo: 'คอนโด', house: 'บ้าน', land: 'ที่ดิน', villa: 'วิลล่า', townhouse: 'ทาวน์เฮาส์',
                        'shop house': 'อาคารพาณิชย์', apartment: 'อพาร์ทเมนท์', penthouse: 'เพนท์เฮาส์',
                        resort: 'รีสอร์ท', hotel: 'โรงแรม', office: 'สำนักงาน',
                        'commercial building': 'ตึกพาณิชย์', factory: 'โรงงาน', warehouse: 'โกดัง/คลังสินค้า',
                    };
                    const categoryText = categoryTranslations[String(categoryName).toLowerCase()] || categoryName;

                    const statusTranslations = {
                        PENDING: 'รอตรวจสอบ',
                        CONFIRMED: 'อนุมัติแล้ว',
                        SOLD: 'ขายแล้ว',
                        HIDDEN: 'ซ่อน',
                        REJECTED: 'ถูกปฏิเสธ',
                    };
                    const sellRentTranslations = {
                        SALE: 'ขาย',
                        RENT: 'เช่า',
                    };
                    const sellRentText = sellRentTranslations[sellRent] || sellRent;
                    const statusText = statusTranslations[status] || status;
                    const style = badgeStyles[status] || badgeStyles.default;

                    return (
                        <Card key={id}>
                            {imgUrl ? (<Box width="100%" height={200} overflow="hidden" borderRadius="lg" mb="lg"><img src={imgUrl} alt="thumb" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Box>) : (<Box width="100%" height={120} display="flex" alignItems="center" justifyContent="center" bg="grey20" color="grey60" borderRadius="lg" mb="lg">ไม่มีรูป</Box>)}

                            {/* === Section: Main Info === */}
                            <H2 m={0} fontSize="xl" mb="sm">{name}</H2>
                            <Box display="flex" flexWrap="wrap" alignItems="flex-start" mb="md" style={{ gap: '12px' }}>

                                {/* 1. หุ้มราคาและมัดจำไว้ด้วยกัน */}
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg" color="primary100">{price} บาท</Text>

                                    {/* 2. เพิ่มส่วนแสดงมัดจำ (จะแสดงเฉพาะเมื่อมีข้อมูล) */}
                                    {deposit && (
                                        <Text fontSize="md" color="grey80" mt="xs">
                                            (มัดจำ: {deposit} บาท)
                                        </Text>
                                    )}
                                </Box>

                                {/* 3. (แนะนำ) เพิ่ม mt="6px" เพื่อจัดแนวให้สวยงาม */}
                                <Text color="grey80" mt="6px">{`${displayValue(params.District, '')}, ${displayValue(params.Province, '')}`}</Text>
                                <Badge variant="primary" mt="6px">{sellRentText}</Badge> {/* ⬅️ แก้ไขบรรทัดนี้ */}
                            </Box>

                            {/* === Section: Description === */}
                            <Box my="lg">
                                <Text>
                                    {isExpanded ? description : truncate(description, 120)}
                                    {description.length > 120 && (<Button variant="text" onClick={() => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))} ml="sm">{isExpanded ? "ย่อ" : "อ่านต่อ"}</Button>)}
                                </Text>
                            </Box>

                            {/* === Section: Property Details === */}
                            <Box borderTop="1px solid" borderColor="grey20" mt="lg" pt="lg">
                                <H5 mb="md">รายละเอียดทรัพย์สิน</H5>
                                <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gridGap="md">
                                    <DetailItem label="พื้นที่ใช้สอย" value={params.Usable_Area ? `${params.Usable_Area} ตร.ม.` : null} />
                                    <DetailItem label="ขนาดที่ดิน" value={params.Land_Size ? `${params.Land_Size} ตร.ว.` : null} />
                                    <DetailItem label="ห้องนอน" value={params.Bedrooms} />
                                    <DetailItem label="ห้องน้ำ" value={params.Bathroom} />
                                    <DetailItem label="ชั้น" value={params.floor} />
                                    <DetailItem label="ที่จอดรถ" value={params.Parking_Space} />
                                    <DetailItem label="จำนวนยูนิต" value={params.NumberOfUnits} />
                                    <DetailItem label="ปีที่สร้าง" value={params.Year_Built} />
                                    <DetailItem label="จำนวนห้องทั้งหมด" value={params.Total_Rooms} />
                                </Box>
                            </Box>

                            {/* === Section: Features === */}
                            <Box borderTop="1px solid" borderColor="grey20" mt="lg" pt="lg">
                                <H5 mb="md">สิ่งอำนวยความสะดวกและสถานที่ใกล้เคียง</H5>
                                {(params.Additional_Amenities?.length > 0) && <DetailItem label="สิ่งอำนวยความสะดวกเพิ่มเติม" value={params.Additional_Amenities.join(', ')} />}
                                {(params.Nearby_Landmarks?.length > 0) && <DetailItem label="สถานที่ใกล้เคียง" value={params.Nearby_Landmarks.join(', ')} />}
                            </Box>

                            {/* === Section: Contact & Links === */}
                            <Box borderTop="1px solid" borderColor="grey20" mt="lg" pt="lg">
                                <H5 mb="md">ข้อมูลติดต่อและลิงก์</H5>
                                <DetailItem label="ผู้ลงประกาศ" value={params.Name} />
                                <DetailItem label="เบอร์โทรศัพท์" value={params.Phone} />
                                <Box display="flex" gridGap="md" mt="md">
                                    {params.LinkMap && <Button as="a" href={params.LinkMap} target="_blank" size="sm">แผนที่</Button>}
                                    {params.Link_line && <Button as="a" href={params.Link_line} target="_blank" size="sm">LINE</Button>}
                                    {params.Link_facbook && <Button as="a" href={params.Link_facbook} target="_blank" size="sm">Facebook</Button>}
                                </Box>
                            </Box>

                            {/* === Section: Meta & Actions === */}
                            <Box borderTop="1px solid" borderColor="grey20" mt="lg" pt="lg" display="flex" justifyContent="space-between" alignItems="flex-end">
                                <Box display="flex" flexDirection="column" gap="sm">
                                    <Label><strong>หมวดหมู่:</strong> {categoryText}</Label>
                                    <Label><strong>สถานะ:</strong> <Badge variant="default" bg={style.bg} color={style.color} ml="md">{statusText}</Badge></Label>
                                    <Label><strong>สร้างเมื่อ:</strong> {createdAt}</Label>
                                </Box>
                                <Box display="flex" gridGap="md">
                                    <Button as="a" href={`/admin/resources/PropertyPost/records/${id}/show`} size="sm">ดู</Button>
                                    <Button as="a" href={`/admin/resources/PropertyPost/records/${id}/edit`} variant="primary" size="sm">แก้ไข</Button>
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

                        navigate({ search: search.toString() });
                    }}
                />
            </Box>

        </Box>
    );
};

export default PropertyCardList;
