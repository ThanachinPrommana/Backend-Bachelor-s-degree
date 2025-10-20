import React from 'react';
import { useRecords } from 'adminjs';
import { Box, H2, H5, Loader, Placeholder, Button } from '@adminjs/design-system';

// Helper Functions
const isEmptyValue = (v) => v === null || v === undefined || String(v).trim() === "";
const displayValue = (v, fallback = "ว่าง") => (isEmptyValue(v) ? fallback : v);
const truncate = (text, n = 35) => text && text.length > n ? text.slice(0, n - 1) + '…' : text;

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

const DocumentCardList = () => {
    const { records, loading, error } = useRecords('DocumentUpload');

    if (loading) return <Box p="lg"><Loader /></Box>;
    if (error) return <Box p="lg"><Placeholder><H5>เกิดข้อผิดพลาด</H5><p>ไม่สามารถดึงข้อมูลเอกสารได้</p></Placeholder></Box>;
    if (!records || records.length === 0) return <Box p="lg"><Placeholder><H5>ไม่มีเอกสาร</H5><p>ไม่พบข้อมูลเอกสารที่ตรงกับเงื่อนไข</p></Placeholder></Box>;

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
                    const id = r.id ?? params.id;

                    const documentName = displayValue(params.DocumentName, 'ไม่มีชื่อเอกสาร');
                    const documentUrl = params.DocumentUrl;
                    const status = displayValue(params.Review_Status);
                    const userName = `${displayValue(userParams.First_name, '')} ${displayValue(userParams.Last_name, '')}`.trim() || "ไม่มีข้อมูล";
                    const createdAt = params.createdAt ? new Date(params.createdAt).toLocaleDateString("th-TH", { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';

                    const badgeStyles = {
                        PENDING: { bg: "#fffbe6", color: "#faad14" },
                        APPROVED: { bg: "#f6ffed", color: "#52c41a" },
                        REJECTED: { bg: "#fff1f0", color: "#f5222d" },
                        HIDDEN: { bg: "#f2f2f2", color: "#555" },
                        default: { bg: "#f2f2f2", color: "#555" },
                    };
                    const style = badgeStyles[status] || badgeStyles.default;

                    const statusTranslations = {
                        PENDING: 'รอตรวจสอบ',
                        APPROVED: 'อนุมัติแล้ว',
                        REJECTED: 'ถูกปฏิเสธ',
                        HIDDEN: "สำเร็จ"
                    };
                    const statusText = statusTranslations[status] || status;

                    return (
                        <Card key={id}>
                            {/* === Section: Header === */}
                            {/* ✅ ส่วนของรูปไอคอนถูกลบออกไปแล้ว */}
                            <Box>
                                <H2 m={0} fontSize="l" title={documentName}>{truncate(documentName)}</H2>
                                <Box color="grey80" mt="xs"><strong>ผู้อัปโหลด:</strong> {userName}</Box>
                            </Box>

                            {/* === Section: Footer === */}
                            <Box
                                borderTop="1px solid" borderColor="grey20"
                                mt="xl" pt="lg"
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
                                        อัปโหลดเมื่อ: {createdAt}
                                    </Box>
                                </Box>
                                <Box>
                                    <Button
                                        as="a"
                                        href={documentUrl}
                                        target="_blank"
                                        variant="primary"
                                        disabled={!documentUrl}
                                    >
                                        ดูไฟล์
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

export default DocumentCardList;