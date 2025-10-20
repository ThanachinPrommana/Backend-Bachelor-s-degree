(function (React, adminjs, designSystem) {
    'use strict';

    function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

    var React__default = /*#__PURE__*/_interopDefault(React);

    // server/Admin/components/PropertyCardList.jsx
    // Helper Functions
    const isEmptyValue$6 = v => v === null || v === undefined || String(v).trim() === "";
    const displayValue$6 = (v, fallback = "N/A") => isEmptyValue$6(v) ? fallback : v;
    const truncate$1 = (text, n = 180) => {
      if (!text) return "";
      if (text.length <= n) return text;
      return text.slice(0, n) + "...";
    };
    const DetailItem = ({
      label,
      value
    }) => /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Label, {
      color: "grey60",
      style: {
        textTransform: 'uppercase',
        fontSize: '11px'
      }
    }, label), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
      fontWeight: "bold"
    }, displayValue$6(value)));
    const Card$6 = ({
      children
    }) => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "white",
      boxShadow: "card",
      borderRadius: "xl",
      p: "xl",
      mb: "2xl"
    }, children);

    // const Label = ({ children }) => <Box color="grey60" fontSize="sm">{children}</Box>;

    const PropertyCardList = () => {
      const {
        records,
        loading,
        error
      } = adminjs.useRecords('PropertyPost');
      const [expanded, setExpanded] = React.useState({});
      if (loading) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null));
      if (error) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14\u0E43\u0E19\u0E01\u0E32\u0E23\u0E42\u0E2B\u0E25\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E42\u0E1E\u0E2A\u0E15\u0E4C")));
      if (!records || records.length === 0) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E42\u0E1E\u0E2A\u0E15\u0E4C\u0E17\u0E35\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02")));

      // ✅ สีสำหรับแต่ละสถานะ
      const badgeStyles = {
        PENDING: {
          bg: "#FFF7E0",
          color: "#B58100"
        },
        // เหลือง
        CONFIRMED: {
          bg: "#E6F7E6",
          color: "#0C7A0C"
        },
        // เขียว
        SOLD: {
          bg: "#E0E0E0",
          color: "#555555"
        },
        // เทา
        HIDDEN: {
          bg: "#F2F2F2",
          color: "#666666"
        },
        // เทาอ่อน
        REJECTED: {
          bg: "#FFE6E6",
          color: "#D10000"
        },
        // แดง
        default: {
          bg: "#F2F2F2",
          color: "#666666"
        }
      };
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "2xl"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        display: "grid",
        gridTemplateColumns: ['1fr', 'repeat(auto-fill, minmax(380px, 1fr))'],
        style: {
          gap: "20px"
        }
      }, records.map(r => {
        const params = r.params ?? {};
        const id = r.id ?? params.id;
        const isExpanded = !!expanded[id];

        // ✅ ดึงข้อมูลทั้งหมดจาก params
        const name = displayValue$6(params.Property_Name);
        const description = displayValue$6(params.Description, "");
        const price = params.Price != null ? Number(params.Price).toLocaleString() : "N/A";
        const sellRent = displayValue$6(params.Sell_Rent);
        const status = params.Status_post;
        const createdAt = new Date(params.createdAt).toLocaleDateString("th-TH", {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        const imgUrl = params._firstImage || null;
        const categoryName = params._categoryName || 'N/A';
        const categoryTranslations = {
          condo: 'คอนโด',
          house: 'บ้าน',
          land: 'ที่ดิน',
          villa: 'วิลล่า',
          townhouse: 'ทาวน์เฮาส์',
          'shop house': 'อาคารพาณิชย์',
          apartment: 'อพาร์ทเมนท์',
          penthouse: 'เพนท์เฮาส์',
          resort: 'รีสอร์ท',
          hotel: 'โรงแรม',
          office: 'สำนักงาน',
          'commercial building': 'ตึกพาณิชย์',
          factory: 'โรงงาน',
          warehouse: 'โกดัง/คลังสินค้า'
        };
        const categoryText = categoryTranslations[String(categoryName).toLowerCase()] || categoryName;
        const statusTranslations = {
          PENDING: 'รอตรวจสอบ',
          CONFIRMED: 'อนุมัติแล้ว',
          SOLD: 'ขายแล้ว',
          HIDDEN: 'ซ่อน',
          REJECTED: 'ถูกปฏิเสธ'
        };
        const statusText = statusTranslations[status] || status;
        const style = badgeStyles[status] || badgeStyles.default;
        return /*#__PURE__*/React__default.default.createElement(Card$6, {
          key: id
        }, imgUrl ? /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          width: "100%",
          height: 200,
          overflow: "hidden",
          borderRadius: "lg",
          mb: "lg"
        }, /*#__PURE__*/React__default.default.createElement("img", {
          src: imgUrl,
          alt: "thumb",
          style: {
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }
        })) : /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          width: "100%",
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bg: "grey20",
          color: "grey60",
          borderRadius: "lg",
          mb: "lg"
        }, "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E23\u0E39\u0E1B"), /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
          m: 0,
          fontSize: "xl",
          mb: "sm"
        }, name), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          mb: "md",
          style: {
            gap: '12px'
          }
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
          fontWeight: "bold",
          fontSize: "lg",
          color: "primary100"
        }, price, " \u0E1A\u0E32\u0E17"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
          color: "grey80"
        }, `${displayValue$6(params.District, '')}, ${displayValue$6(params.Province, '')}`), /*#__PURE__*/React__default.default.createElement(designSystem.Badge, {
          variant: "primary"
        }, sellRent)), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          my: "lg"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, null, isExpanded ? description : truncate$1(description, 120), description.length > 120 && /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
          variant: "text",
          onClick: () => setExpanded(prev => ({
            ...prev,
            [id]: !prev[id]
          })),
          ml: "sm"
        }, isExpanded ? "ย่อ" : "อ่านต่อ"))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          borderTop: "1px solid",
          borderColor: "grey20",
          mt: "lg",
          pt: "lg"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
          mb: "md"
        }, "\u0E23\u0E32\u0E22\u0E25\u0E30\u0E40\u0E2D\u0E35\u0E22\u0E14\u0E17\u0E23\u0E31\u0E1E\u0E22\u0E4C\u0E2A\u0E34\u0E19"), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridGap: "md"
        }, /*#__PURE__*/React__default.default.createElement(DetailItem, {
          label: "\u0E1E\u0E37\u0E49\u0E19\u0E17\u0E35\u0E48\u0E43\u0E0A\u0E49\u0E2A\u0E2D\u0E22",
          value: params.Usable_Area ? `${params.Usable_Area} ตร.ม.` : null
        }), /*#__PURE__*/React__default.default.createElement(DetailItem, {
          label: "\u0E02\u0E19\u0E32\u0E14\u0E17\u0E35\u0E48\u0E14\u0E34\u0E19",
          value: params.Land_Size ? `${params.Land_Size} ตร.ว.` : null
        }), /*#__PURE__*/React__default.default.createElement(DetailItem, {
          label: "\u0E2B\u0E49\u0E2D\u0E07\u0E19\u0E2D\u0E19",
          value: params.Bedrooms
        }), /*#__PURE__*/React__default.default.createElement(DetailItem, {
          label: "\u0E2B\u0E49\u0E2D\u0E07\u0E19\u0E49\u0E33",
          value: params.Bathroom
        }), /*#__PURE__*/React__default.default.createElement(DetailItem, {
          label: "\u0E0A\u0E31\u0E49\u0E19",
          value: params.floor
        }), /*#__PURE__*/React__default.default.createElement(DetailItem, {
          label: "\u0E17\u0E35\u0E48\u0E08\u0E2D\u0E14\u0E23\u0E16",
          value: params.Parking_Space
        }), /*#__PURE__*/React__default.default.createElement(DetailItem, {
          label: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E22\u0E39\u0E19\u0E34\u0E15",
          value: params.NumberOfUnits
        }), /*#__PURE__*/React__default.default.createElement(DetailItem, {
          label: "\u0E1B\u0E35\u0E17\u0E35\u0E48\u0E2A\u0E23\u0E49\u0E32\u0E07",
          value: params.Year_Built
        }), /*#__PURE__*/React__default.default.createElement(DetailItem, {
          label: "\u0E08\u0E33\u0E19\u0E27\u0E19\u0E2B\u0E49\u0E2D\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14",
          value: params.Total_Rooms
        }))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          borderTop: "1px solid",
          borderColor: "grey20",
          mt: "lg",
          pt: "lg"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
          mb: "md"
        }, "\u0E2A\u0E34\u0E48\u0E07\u0E2D\u0E33\u0E19\u0E27\u0E22\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E30\u0E14\u0E27\u0E01\u0E41\u0E25\u0E30\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E43\u0E01\u0E25\u0E49\u0E40\u0E04\u0E35\u0E22\u0E07"), params.Additional_Amenities?.length > 0 && /*#__PURE__*/React__default.default.createElement(DetailItem, {
          label: "\u0E2A\u0E34\u0E48\u0E07\u0E2D\u0E33\u0E19\u0E27\u0E22\u0E04\u0E27\u0E32\u0E21\u0E2A\u0E30\u0E14\u0E27\u0E01\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E15\u0E34\u0E21",
          value: params.Additional_Amenities.join(', ')
        }), params.Nearby_Landmarks?.length > 0 && /*#__PURE__*/React__default.default.createElement(DetailItem, {
          label: "\u0E2A\u0E16\u0E32\u0E19\u0E17\u0E35\u0E48\u0E43\u0E01\u0E25\u0E49\u0E40\u0E04\u0E35\u0E22\u0E07",
          value: params.Nearby_Landmarks.join(', ')
        })), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          borderTop: "1px solid",
          borderColor: "grey20",
          mt: "lg",
          pt: "lg"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, {
          mb: "md"
        }, "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E15\u0E34\u0E14\u0E15\u0E48\u0E2D\u0E41\u0E25\u0E30\u0E25\u0E34\u0E07\u0E01\u0E4C"), /*#__PURE__*/React__default.default.createElement(DetailItem, {
          label: "\u0E1C\u0E39\u0E49\u0E25\u0E07\u0E1B\u0E23\u0E30\u0E01\u0E32\u0E28",
          value: params.Name
        }), /*#__PURE__*/React__default.default.createElement(DetailItem, {
          label: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C",
          value: params.Phone
        }), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          display: "flex",
          gridGap: "md",
          mt: "md"
        }, params.LinkMap && /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
          as: "a",
          href: params.LinkMap,
          target: "_blank",
          size: "sm"
        }, "\u0E41\u0E1C\u0E19\u0E17\u0E35\u0E48"), params.Link_line && /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
          as: "a",
          href: params.Link_line,
          target: "_blank",
          size: "sm"
        }, "LINE"), params.Link_facbook && /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
          as: "a",
          href: params.Link_facbook,
          target: "_blank",
          size: "sm"
        }, "Facebook"))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          borderTop: "1px solid",
          borderColor: "grey20",
          mt: "lg",
          pt: "lg",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          display: "flex",
          flexDirection: "column",
          gap: "sm"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, /*#__PURE__*/React__default.default.createElement("strong", null, "\u0E2B\u0E21\u0E27\u0E14\u0E2B\u0E21\u0E39\u0E48:"), " ", categoryText), /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, /*#__PURE__*/React__default.default.createElement("strong", null, "\u0E2A\u0E16\u0E32\u0E19\u0E30:"), " ", /*#__PURE__*/React__default.default.createElement(designSystem.Badge, {
          variant: "default",
          bg: style.bg,
          color: style.color,
          ml: "md"
        }, statusText)), /*#__PURE__*/React__default.default.createElement(designSystem.Label, null, /*#__PURE__*/React__default.default.createElement("strong", null, "\u0E2A\u0E23\u0E49\u0E32\u0E07\u0E40\u0E21\u0E37\u0E48\u0E2D:"), " ", createdAt)), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          display: "flex",
          gridGap: "md"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
          as: "a",
          href: `/admin/resources/PropertyPost/records/${id}/show`,
          size: "sm"
        }, "\u0E14\u0E39"), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
          as: "a",
          href: `/admin/resources/PropertyPost/records/${id}/edit`,
          variant: "primary",
          size: "sm"
        }, "\u0E41\u0E01\u0E49\u0E44\u0E02"))));
      })));
    };

    // server/Admin/components/SellerCardList.jsx

    // Helper Functions
    const isEmptyValue$5 = v => v === null || v === undefined || String(v).trim() === "";
    const displayValue$5 = (v, fallback = "ว่าง") => isEmptyValue$5(v) ? fallback : v;
    const Card$5 = ({
      children
    }) => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "white",
      boxShadow: "card",
      borderRadius: "xl",
      p: "xl",
      mb: "2xl",
      style: {
        transition: "box-shadow 0.2s ease, transform 0.2s ease"
      },
      _hover: {
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transform: "translateY(-2px)"
      }
    }, children);
    const SellerCardList = () => {
      const {
        records,
        loading,
        error
      } = adminjs.useRecords('Seller');
      if (loading) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null));
      if (error) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14"), /*#__PURE__*/React__default.default.createElement("p", null, "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E14\u0E36\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E02\u0E32\u0E22\u0E44\u0E14\u0E49")));
      if (!records || records.length === 0) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1C\u0E39\u0E49\u0E02\u0E32\u0E22"), /*#__PURE__*/React__default.default.createElement("p", null, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1C\u0E39\u0E49\u0E02\u0E32\u0E22\u0E17\u0E35\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02\u0E01\u0E32\u0E23\u0E01\u0E23\u0E2D\u0E07\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13")));
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "2xl"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        display: "grid",
        gridTemplateColumns: ['1fr', 'repeat(auto-fill, minmax(340px, 1fr))'],
        style: {
          gap: "20px"
        }
      }, records.map(r => {
        const params = r.params ?? {};
        const userParams = r.populated?.user?.params ?? {};
        const id = r.id ?? params.id;
        const fullName = `${displayValue$5(userParams.First_name, '')} ${displayValue$5(userParams.Last_name, '')}`.trim() || "ไม่มีชื่อ";
        const imageUrl = params.nationalIdImage || null;
        const companyName = displayValue$5(params.Company_Name);
        const license = displayValue$5(params.RealEstate_License);
        const status = displayValue$5(params.Status);
        const createdAt = new Date(params.createdAt).toLocaleDateString("th-TH", {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
        const badgeStyles = {
          PENDING: {
            bg: "#fffbe6",
            color: "#faad14"
          },
          APPROVED: {
            bg: "#f6ffed",
            color: "#52c41a"
          },
          REJECTED: {
            bg: "#fff1f0",
            color: "#f5222d"
          },
          default: {
            bg: "#f2f2f2",
            color: "#555"
          }
        };
        const style = badgeStyles[status] || badgeStyles.default;

        // ✅ สร้าง Object สำหรับแปลสถานะ
        const statusTranslations = {
          PENDING: 'รอตรวจสอบ',
          APPROVED: 'อนุมัติแล้ว',
          REJECTED: 'ถูกปฏิเสธ'
        };

        // ✅ ดึงคำแปลภาษาไทย
        const statusText = statusTranslations[status] || status;
        return /*#__PURE__*/React__default.default.createElement(Card$5, {
          key: id
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          display: "flex",
          alignItems: "center",
          gridGap: "lg"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          width: 80,
          height: 80,
          borderRadius: "50%",
          overflow: "hidden",
          bg: "grey20",
          flexShrink: 0
        }, imageUrl ? /*#__PURE__*/React__default.default.createElement("img", {
          src: imageUrl,
          alt: "profile",
          style: {
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }
        }) : /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "grey60"
        }, "No Img")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
          m: 0,
          fontSize: "xl"
        }, fullName), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          color: "grey80",
          mt: "xs"
        }, /*#__PURE__*/React__default.default.createElement("strong", null, "\u0E1A\u0E23\u0E34\u0E29\u0E31\u0E17:"), " ", companyName), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          color: "grey80"
        }, /*#__PURE__*/React__default.default.createElement("strong", null, "\u0E43\u0E1A\u0E2D\u0E19\u0E38\u0E0D\u0E32\u0E15:"), " ", license))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          borderTop: "1px solid",
          borderColor: "grey20",
          mt: "xl",
          pt: "lg",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          as: "span",
          px: "md",
          py: "sm",
          borderRadius: "lg",
          style: {
            backgroundColor: style.bg,
            color: style.color,
            fontWeight: "bold",
            fontSize: "0.9rem"
          }
        }, statusText), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          fontSize: "sm",
          color: "grey60",
          mt: "sm"
        }, "\u0E40\u0E1B\u0E47\u0E19\u0E1C\u0E39\u0E49\u0E02\u0E32\u0E22\u0E40\u0E21\u0E37\u0E48\u0E2D: ", createdAt)), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          display: "flex",
          gridGap: "md"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
          as: "a",
          href: `/admin/resources/Seller/records/${id}/show`,
          variant: "primary"
        }, "\u0E14\u0E39"), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
          as: "a",
          href: `/admin/resources/Seller/records/${id}/edit`
        }, "\u0E41\u0E01\u0E49\u0E44\u0E02"))));
      })));
    };

    // Helper Functions
    const isEmptyValue$4 = v => v === null || v === undefined || String(v).trim() === "";
    const displayValue$4 = (v, fallback = "ว่าง") => isEmptyValue$4(v) ? fallback : v;
    const Card$4 = ({
      children
    }) => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "white",
      boxShadow: "card",
      borderRadius: "xl",
      p: "xl",
      mb: "2xl",
      style: {
        transition: "box-shadow 0.2s ease, transform 0.2s ease"
      },
      _hover: {
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transform: "translateY(-2px)"
      }
    }, children);
    const PropertyUnitCardList = () => {
      const {
        records,
        loading,
        error
      } = adminjs.useRecords('PropertyUnit');
      if (loading) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null));
      if (error) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14"), /*#__PURE__*/React__default.default.createElement("p", null, "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E14\u0E36\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E22\u0E39\u0E19\u0E34\u0E15\u0E44\u0E14\u0E49")));
      if (!records || records.length === 0) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E22\u0E39\u0E19\u0E34\u0E15"), /*#__PURE__*/React__default.default.createElement("p", null, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E22\u0E39\u0E19\u0E34\u0E15\u0E17\u0E35\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02")));
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "2xl"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        display: "grid",
        gridTemplateColumns: ['1fr', 'repeat(auto-fill, minmax(340px, 1fr))'],
        style: {
          gap: "20px"
        }
      }, records.map(r => {
        const params = r.params ?? {};
        const propertyPostParams = r.populated?.propertyPost?.params ?? {};
        const id = r.id ?? params.id;
        const unitNumber = displayValue$4(params.Unit_Number);
        const propertyName = displayValue$4(propertyPostParams.Property_Name, 'ไม่มีชื่อโครงการ');
        const status = displayValue$4(params.Status);
        const badgeStyles = {
          AVAILABLE: {
            bg: "#f6ffed",
            color: "#52c41a"
          },
          BOOKED: {
            bg: "#fffbe6",
            color: "#faad14"
          },
          SOLD: {
            bg: "#f2f2f2",
            color: "#555"
          },
          default: {
            bg: "#f2f2f2",
            color: "#555"
          }
        };
        const style = badgeStyles[status] || badgeStyles.default;
        const statusTranslations = {
          AVAILABLE: 'ว่าง',
          PENDING: 'กำลังดำเนินการ',
          SOLD: 'ขายแล้ว'
        };
        const statusText = statusTranslations[status] || status;
        return /*#__PURE__*/React__default.default.createElement(Card$4, {
          key: id
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
          m: 0,
          fontSize: "xl"
        }, "\u0E22\u0E39\u0E19\u0E34\u0E15\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48: ", unitNumber), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          color: "grey80",
          mt: "xs"
        }, /*#__PURE__*/React__default.default.createElement("strong", null, "\u0E42\u0E04\u0E23\u0E07\u0E01\u0E32\u0E23:"), " ", propertyName)), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          borderTop: "1px solid",
          borderColor: "grey20",
          mt: "xl",
          pt: "lg",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          as: "span",
          px: "md",
          py: "sm",
          borderRadius: "lg",
          style: {
            backgroundColor: style.bg,
            color: style.color,
            fontWeight: "bold",
            fontSize: "0.9rem"
          }
        }, statusText))));
      })));
    };

    // Helper Functions
    const isEmptyValue$3 = v => v === null || v === undefined || String(v).trim() === "";
    const displayValue$3 = (v, fallback = "ว่าง") => isEmptyValue$3(v) ? fallback : v;
    const Card$3 = ({
      children
    }) => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "white",
      boxShadow: "card",
      borderRadius: "xl",
      p: "xl",
      mb: "2xl",
      style: {
        transition: "box-shadow 0.2s ease, transform 0.2s ease"
      },
      _hover: {
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transform: "translateY(-2px)"
      }
    }, children);
    const DepositCardList = () => {
      const {
        records,
        loading,
        error
      } = adminjs.useRecords("Deposit");
      if (loading) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null));
      if (error) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14"), /*#__PURE__*/React__default.default.createElement("p", null, "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E14\u0E36\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E07\u0E34\u0E19\u0E21\u0E31\u0E14\u0E08\u0E33\u0E44\u0E14\u0E49")));
      if (!records || records.length === 0) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E07\u0E34\u0E19\u0E21\u0E31\u0E14\u0E08\u0E33"), /*#__PURE__*/React__default.default.createElement("p", null, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02")));
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "2xl"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        display: "grid",
        gridTemplateColumns: ['1fr', 'repeat(auto-fill, minmax(340px, 1fr))'],
        style: {
          gap: "20px"
        }
      }, records.map(r => {
        const params = r.params ?? {};
        const userParams = r.populated?.User?.params ?? {};
        const postParams = r.populated?.Post?.params ?? {};
        const unitParams = r.populated?.Unit?.params ?? {};
        const id = r.id ?? params.id;
        const userName = `${displayValue$3(userParams.First_name, '')} ${displayValue$3(userParams.Last_name, '')}`.trim() || "ไม่มีชื่อ";
        const depositAmount = params.Deposit_Amount != null ? `${Number(params.Deposit_Amount).toLocaleString()} บาท` : "N/A";
        const propertyName = displayValue$3(postParams.Property_Name, 'N/A');
        const unitNumber = displayValue$3(unitParams.Unit_Number, 'N/A');
        const status = displayValue$3(params.Deposit_Status, 'UNKNOWN');
        const createdAt = params.createdAt ? new Date(params.createdAt).toLocaleDateString("th-TH", {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'N/A';
        const badgeStyles = {
          PENDING: {
            bg: "#fffbe6",
            color: "#faad14"
          },
          CONFIRMED: {
            bg: "#f6ffed",
            color: "#52c41a"
          },
          REJECTED: {
            bg: "#fff1f0",
            color: "#f5222d"
          },
          default: {
            bg: "#f2f2f2",
            color: "#555"
          }
        };
        const statusTranslations = {
          PENDING: 'รอดำเนินการ',
          CONFIRMED: 'ยืนยันแล้ว',
          REJECTED: 'ถูกปฏิเสธ'
        };
        const style = badgeStyles[status] || badgeStyles.default;
        const statusText = statusTranslations[status] || status;
        return /*#__PURE__*/React__default.default.createElement(Card$3, {
          key: id
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
          m: 0,
          fontSize: "xl"
        }, depositAmount), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
          color: "grey80",
          mt: "xs"
        }, /*#__PURE__*/React__default.default.createElement("strong", null, "\u0E1C\u0E39\u0E49\u0E17\u0E33\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23:"), " ", userName), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
          color: "grey80"
        }, /*#__PURE__*/React__default.default.createElement("strong", null, "\u0E42\u0E04\u0E23\u0E07\u0E01\u0E32\u0E23:"), " ", propertyName, " (\u0E22\u0E39\u0E19\u0E34\u0E15: ", unitNumber, ")")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          borderTop: "1px solid",
          borderColor: "grey20",
          mt: "xl",
          pt: "lg",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          as: "span",
          px: "md",
          py: "sm",
          borderRadius: "lg",
          style: {
            backgroundColor: style.bg,
            color: style.color,
            fontWeight: "bold",
            fontSize: "0.9rem"
          }
        }, statusText), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          fontSize: "sm",
          color: "grey60",
          mt: "sm"
        }, "\u0E17\u0E33\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E40\u0E21\u0E37\u0E48\u0E2D: ", createdAt))));
      })));
    };

    // server/Admin/components/TestPagination.jsx
    const TestDepositComponent = () => {
      const {
        records,
        loading,
        page,
        perPage,
        total,
        handleChangePage
      } = adminjs.useRecords('User');
      console.log("TEST PAGINATION DATA:", {
        page,
        perPage,
        total
      });
      if (loading) return /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null);
      if (!records) return /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "No records"));
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg",
        variant: "white"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "Pagination Test Component"), /*#__PURE__*/React__default.default.createElement(designSystem.Text, null, "Total: ", total, ", PerPage: ", perPage, ", Current Page: ", page), /*#__PURE__*/React__default.default.createElement("ul", null, records.map(r => /*#__PURE__*/React__default.default.createElement("li", {
        key: r.id
      }, "User ID: ", r.id))), /*#__PURE__*/React__default.default.createElement(designSystem.Pagination, {
        page: page,
        perPage: perPage,
        total: total,
        onChange: handleChangePage
      }));
    };

    // server/Admin/components/UserCardList.jsx

    // Helper Functions
    const isEmptyValue$2 = v => v === null || v === undefined || String(v).trim() === "";
    const displayValue$2 = v => isEmptyValue$2(v) ? "N/A" : v;
    const Card$2 = ({
      children
    }) => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "white",
      boxShadow: "card",
      borderRadius: "xl",
      p: "xl",
      mb: "xl",
      _hover: {
        boxShadow: "0 0 10px rgba(0,0,0,0.1)"
      }
    }, children);
    const UserCardList = () => {
      const {
        records,
        loading,
        error
      } = adminjs.useRecords('User');
      if (loading) {
        return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          p: "lg"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null));
      }
      if (error) {
        return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          p: "lg"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14"), /*#__PURE__*/React__default.default.createElement("p", null, "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E14\u0E36\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E44\u0E14\u0E49")));
      }
      if (!records || records.length === 0) {
        return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          p: "lg"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19"), /*#__PURE__*/React__default.default.createElement("p", null, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49\u0E07\u0E32\u0E19\u0E17\u0E35\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02\u0E01\u0E32\u0E23\u0E01\u0E23\u0E2D\u0E07\u0E02\u0E2D\u0E07\u0E04\u0E38\u0E13")));
      }
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "xl"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        display: "grid",
        gridTemplateColumns: ['1fr', 'repeat(auto-fill, minmax(340px, 1fr))'],
        gap: "xl"
      }, records.map(r => {
        const params = r.params ?? {};
        const id = r.id ?? params.id;
        const fullName = `${displayValue$2(params.First_name)} ${displayValue$2(params.Last_name)}`;
        const email = displayValue$2(params.Email);
        const phone = displayValue$2(params.Phone);
        const userType = displayValue$2(params.userType);
        const imageUrl = params.image || null;
        const createdAt = new Date(params.createdAt).toLocaleDateString("th-TH", {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });

        // ✅ เพิ่มสีตามประเภท
        const badgeStyles = {
          Admin: {
            bg: "#e6f0ff",
            // ฟ้าอ่อน
            color: "#0047ab" // น้ำเงินเข้ม
          },
          Seller: {
            bg: "#eaffea",
            // เขียวอ่อน
            color: "#008000" // เขียวเข้ม
          },
          Buyer: {
            bg: "#eaffea",
            // เขียวอ่อน
            color: "#008000"
          },
          default: {
            bg: "#f2f2f2",
            color: "#555"
          }
        };
        const style = badgeStyles[userType] || badgeStyles.default;
        return /*#__PURE__*/React__default.default.createElement(Card$2, {
          key: id
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          display: "flex",
          alignItems: "center",
          gridGap: "lg"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          width: 80,
          height: 80,
          borderRadius: "50%",
          overflow: "hidden",
          bg: "grey20",
          flexShrink: 0
        }, imageUrl ? /*#__PURE__*/React__default.default.createElement("img", {
          src: imageUrl,
          alt: "profile",
          style: {
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }
        }) : /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "grey60"
        }, "No Img")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
          m: 0,
          fontSize: "xl"
        }, fullName), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          color: "grey80",
          mt: "xs"
        }, email), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          color: "grey80"
        }, phone))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          borderTop: "1px solid",
          borderColor: "grey20",
          mt: "lg",
          pt: "lg",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          as: "span",
          px: "md",
          py: "sm",
          borderRadius: "lg",
          style: {
            backgroundColor: style.bg,
            color: style.color,
            fontWeight: "bold",
            fontSize: "0.85rem",
            boxShadow: "0 0 4px rgba(0,0,0,0.05)"
          }
        }, userType), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          fontSize: "sm",
          color: "grey60",
          mt: "sm"
        }, "\u0E40\u0E1B\u0E47\u0E19\u0E2A\u0E21\u0E32\u0E0A\u0E34\u0E01\u0E40\u0E21\u0E37\u0E48\u0E2D: ", createdAt)), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          display: "flex",
          gridGap: "md"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
          as: "a",
          href: `/admin/resources/User/records/${id}/show`,
          variant: "primary"
        }, "\u0E14\u0E39"), /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
          as: "a",
          href: `/admin/resources/User/records/${id}/edit`
        }, "\u0E41\u0E01\u0E49\u0E44\u0E02"))));
      })));
    };

    // Helper Functions
    const isEmptyValue$1 = v => v === null || v === undefined || String(v).trim() === "";
    const displayValue$1 = (v, fallback = "ว่าง") => isEmptyValue$1(v) ? fallback : v;
    const truncate = (text, n = 35) => text && text.length > n ? text.slice(0, n - 1) + '…' : text;
    const Card$1 = ({
      children
    }) => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "white",
      boxShadow: "card",
      borderRadius: "xl",
      p: "xl",
      mb: "2xl",
      style: {
        transition: "box-shadow 0.2s ease, transform 0.2s ease"
      },
      _hover: {
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transform: "translateY(-2px)"
      }
    }, children);
    const DocumentCardList = () => {
      const {
        records,
        loading,
        error
      } = adminjs.useRecords('DocumentUpload');
      if (loading) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null));
      if (error) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14"), /*#__PURE__*/React__default.default.createElement("p", null, "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E14\u0E36\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E44\u0E14\u0E49")));
      if (!records || records.length === 0) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23"), /*#__PURE__*/React__default.default.createElement("p", null, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E17\u0E35\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02")));
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "2xl"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        display: "grid",
        gridTemplateColumns: ['1fr', 'repeat(auto-fill, minmax(340px, 1fr))'],
        style: {
          gap: "20px"
        }
      }, records.map(r => {
        const params = r.params ?? {};
        const userParams = r.populated?.User?.params ?? {};
        const id = r.id ?? params.id;
        const documentName = displayValue$1(params.DocumentName, 'ไม่มีชื่อเอกสาร');
        const documentUrl = params.DocumentUrl;
        const status = displayValue$1(params.Review_Status);
        const userName = `${displayValue$1(userParams.First_name, '')} ${displayValue$1(userParams.Last_name, '')}`.trim() || "ไม่มีข้อมูล";
        const createdAt = params.createdAt ? new Date(params.createdAt).toLocaleDateString("th-TH", {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'N/A';
        const badgeStyles = {
          PENDING: {
            bg: "#fffbe6",
            color: "#faad14"
          },
          APPROVED: {
            bg: "#f6ffed",
            color: "#52c41a"
          },
          REJECTED: {
            bg: "#fff1f0",
            color: "#f5222d"
          },
          HIDDEN: {
            bg: "#f2f2f2",
            color: "#555"
          },
          default: {
            bg: "#f2f2f2",
            color: "#555"
          }
        };
        const style = badgeStyles[status] || badgeStyles.default;
        const statusTranslations = {
          PENDING: 'รอตรวจสอบ',
          APPROVED: 'อนุมัติแล้ว',
          REJECTED: 'ถูกปฏิเสธ',
          HIDDEN: "สำเร็จ"
        };
        const statusText = statusTranslations[status] || status;
        return /*#__PURE__*/React__default.default.createElement(Card$1, {
          key: id
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
          m: 0,
          fontSize: "l",
          title: documentName
        }, truncate(documentName)), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          color: "grey80",
          mt: "xs"
        }, /*#__PURE__*/React__default.default.createElement("strong", null, "\u0E1C\u0E39\u0E49\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14:"), " ", userName)), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          borderTop: "1px solid",
          borderColor: "grey20",
          mt: "xl",
          pt: "lg",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          as: "span",
          px: "md",
          py: "sm",
          borderRadius: "lg",
          style: {
            backgroundColor: style.bg,
            color: style.color,
            fontWeight: "bold",
            fontSize: "0.9rem"
          }
        }, statusText), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          fontSize: "sm",
          color: "grey60",
          mt: "sm"
        }, "\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u0E40\u0E21\u0E37\u0E48\u0E2D: ", createdAt)), /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
          as: "a",
          href: documentUrl,
          target: "_blank",
          variant: "primary",
          disabled: !documentUrl
        }, "\u0E14\u0E39\u0E44\u0E1F\u0E25\u0E4C"))));
      })));
    };

    // Helper Functions
    const isEmptyValue = v => v === null || v === undefined || String(v).trim() === "";
    const displayValue = (v, fallback = "ว่าง") => isEmptyValue(v) ? fallback : v;
    const Card = ({
      children
    }) => /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
      variant: "white",
      boxShadow: "card",
      borderRadius: "xl",
      p: "xl",
      mb: "2xl",
      style: {
        transition: "box-shadow 0.2s ease, transform 0.2s ease"
      },
      _hover: {
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transform: "translateY(-2px)"
      }
    }, children);
    const PaymentCardList = () => {
      const {
        records,
        loading,
        error
      } = adminjs.useRecords('Payment');
      if (loading) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null));
      if (error) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "\u0E40\u0E01\u0E34\u0E14\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14"), /*#__PURE__*/React__default.default.createElement("p", null, "\u0E44\u0E21\u0E48\u0E2A\u0E32\u0E21\u0E32\u0E23\u0E16\u0E14\u0E36\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19\u0E44\u0E14\u0E49")));
      if (!records || records.length === 0) return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "lg"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Placeholder, null, /*#__PURE__*/React__default.default.createElement(designSystem.H5, null, "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E01\u0E32\u0E23\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E07\u0E34\u0E19"), /*#__PURE__*/React__default.default.createElement("p", null, "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E17\u0E35\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E1A\u0E40\u0E07\u0E37\u0E48\u0E2D\u0E19\u0E44\u0E02")));
      return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        p: "2xl"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        display: "grid",
        gridTemplateColumns: ['1fr', 'repeat(auto-fill, minmax(340px, 1fr))'],
        style: {
          gap: "20px"
        }
      }, records.map(r => {
        const params = r.params ?? {};
        const userParams = r.populated?.User?.params ?? {};
        const postParams = r.populated?.PropertyPost?.params ?? {};
        const id = r.id ?? params.id;
        const paymentAmount = params.Payment_Amount != null ? `${Number(params.Payment_Amount).toLocaleString()} บาท` : "N/A";
        const paymentSlipUrl = params.Payment_Slip;
        const status = displayValue(params.Status);
        const userName = `${displayValue(userParams.First_name, '')} ${displayValue(userParams.Last_name, '')}`.trim() || "ไม่มีข้อมูล";
        const propertyName = displayValue(postParams.Property_Name, 'N/A');
        const createdAt = params.createdAt ? new Date(params.createdAt).toLocaleDateString("th-TH", {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }) : 'N/A';
        const badgeStyles = {
          PENDING: {
            bg: "#fffbe6",
            color: "#faad14"
          },
          CONFIRMED: {
            bg: "#f6ffed",
            color: "#52c41a"
          },
          FAILED: {
            bg: "#fff1f0",
            color: "#f5222d"
          },
          default: {
            bg: "#f2f2f2",
            color: "#555"
          }
        };
        const style = badgeStyles[status] || badgeStyles.default;
        const statusTranslations = {
          PENDING: 'รอตรวจสอบ',
          CONFIRMED: 'ยืนยันแล้ว',
          FAILED: 'ล้มเหลว'
        };
        const statusText = statusTranslations[status] || status;
        return /*#__PURE__*/React__default.default.createElement(Card, {
          key: id
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          display: "flex",
          alignItems: "center",
          style: {
            gap: '16px'
          }
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          width: 80,
          height: 80,
          borderRadius: "50%",
          bg: "primary20",
          color: "primary100",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
          fontSize: 24,
          fontWeight: "bold"
        }, "\u0E3F")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.H2, {
          m: 0,
          fontSize: "xl"
        }, paymentAmount), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
          color: "grey80",
          mt: "xs"
        }, /*#__PURE__*/React__default.default.createElement("strong", null, "\u0E1C\u0E39\u0E49\u0E0A\u0E33\u0E23\u0E30:"), " ", userName), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
          color: "grey80"
        }, /*#__PURE__*/React__default.default.createElement("strong", null, "\u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A\u0E42\u0E1E\u0E2A\u0E15\u0E4C:"), " ", propertyName))), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          borderTop: "1px solid",
          borderColor: "grey20",
          mt: "lg",
          pt: "lg"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Button, {
          as: "a",
          href: paymentSlipUrl,
          target: "_blank",
          variant: "primary",
          disabled: !paymentSlipUrl,
          width: "100%"
        }, "\u0E14\u0E39\u0E2A\u0E25\u0E34\u0E1B")), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          borderTop: "1px solid",
          borderColor: "grey20",
          mt: "lg",
          pt: "lg",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          as: "span",
          px: "md",
          py: "sm",
          borderRadius: "lg",
          style: {
            backgroundColor: style.bg,
            color: style.color,
            fontWeight: "bold",
            fontSize: "0.9rem"
          }
        }, statusText), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          fontSize: "sm",
          color: "grey60",
          mt: "sm"
        }, "\u0E0A\u0E33\u0E23\u0E30\u0E40\u0E21\u0E37\u0E48\u0E2D: ", createdAt))));
      })));
    };

    AdminJS.UserComponents = {};
    AdminJS.UserComponents.PropertyCardList = PropertyCardList;
    AdminJS.UserComponents.SellerCardList = SellerCardList;
    AdminJS.UserComponents.PropertyUnitListComponent = PropertyUnitCardList;
    AdminJS.UserComponents.DepositCardList = DepositCardList;
    AdminJS.UserComponents.TestDeposit = TestDepositComponent;
    AdminJS.UserComponents.UserCardList = UserCardList;
    AdminJS.UserComponents.DocumentCardList = DocumentCardList;
    AdminJS.UserComponents.PaymentCardList = PaymentCardList;

})(React, AdminJS, AdminJSDesignSystem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9BZG1pbi9jb21wb25lbnRzL1Byb3BlcnR5Q2FyZExpc3QuanN4IiwiLi4vQWRtaW4vY29tcG9uZW50cy9TZWxsZXJDYXJkTGlzdC5qc3giLCIuLi9BZG1pbi9jb21wb25lbnRzL1Byb3BlcnR5VW5pdENhcmRMaXN0LmpzeCIsIi4uL0FkbWluL2NvbXBvbmVudHMvRGVwb3NpdENhcmRMaXN0LmpzeCIsIi4uL0FkbWluL2NvbXBvbmVudHMvVGVzdERlcG9zaXRDb21wb25lbnQuanN4IiwiLi4vQWRtaW4vY29tcG9uZW50cy9Vc2VyQ2FyZExpc3QuanN4IiwiLi4vQWRtaW4vY29tcG9uZW50cy9Eb2N1bWVudENhcmRMaXN0LmpzeCIsIi4uL0FkbWluL2NvbXBvbmVudHMvUGF5bWVudENhcmRMaXN0LmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNlcnZlci9BZG1pbi9jb21wb25lbnRzL1Byb3BlcnR5Q2FyZExpc3QuanN4XHJcbmltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVjb3JkcyB9IGZyb20gJ2FkbWluanMnO1xyXG5pbXBvcnQgeyBCb3gsIEgyLCBINSwgTG9hZGVyLCBQbGFjZWhvbGRlciwgQnV0dG9uLCBCYWRnZSwgTGFiZWwsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcclxuLy8gSGVscGVyIEZ1bmN0aW9uc1xyXG5jb25zdCBpc0VtcHR5VmFsdWUgPSAodikgPT4gdiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQgfHwgU3RyaW5nKHYpLnRyaW0oKSA9PT0gXCJcIjtcclxuY29uc3QgZGlzcGxheVZhbHVlID0gKHYsIGZhbGxiYWNrID0gXCJOL0FcIikgPT4gKGlzRW1wdHlWYWx1ZSh2KSA/IGZhbGxiYWNrIDogdik7XHJcblxyXG5jb25zdCB0cnVuY2F0ZSA9ICh0ZXh0LCBuID0gMTgwKSA9PiB7XHJcbiAgICBpZiAoIXRleHQpIHJldHVybiBcIlwiO1xyXG4gICAgaWYgKHRleHQubGVuZ3RoIDw9IG4pIHJldHVybiB0ZXh0O1xyXG4gICAgcmV0dXJuIHRleHQuc2xpY2UoMCwgbikgKyBcIi4uLlwiO1xyXG59O1xyXG5cclxuY29uc3QgRGV0YWlsSXRlbSA9ICh7IGxhYmVsLCB2YWx1ZSB9KSA9PiAoXHJcbiAgICA8Qm94PlxyXG4gICAgICAgIDxMYWJlbCBjb2xvcj1cImdyZXk2MFwiIHN0eWxlPXt7IHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLCBmb250U2l6ZTogJzExcHgnIH19PntsYWJlbH08L0xhYmVsPlxyXG4gICAgICAgIDxUZXh0IGZvbnRXZWlnaHQ9XCJib2xkXCI+e2Rpc3BsYXlWYWx1ZSh2YWx1ZSl9PC9UZXh0PlxyXG4gICAgPC9Cb3g+XHJcbik7XHJcbmNvbnN0IENhcmQgPSAoeyBjaGlsZHJlbiB9KSA9PiAoXHJcbiAgICA8Qm94IHZhcmlhbnQ9XCJ3aGl0ZVwiIGJveFNoYWRvdz1cImNhcmRcIiBib3JkZXJSYWRpdXM9XCJ4bFwiIHA9XCJ4bFwiIG1iPVwiMnhsXCI+XHJcbiAgICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9Cb3g+XHJcbik7XHJcblxyXG4vLyBjb25zdCBMYWJlbCA9ICh7IGNoaWxkcmVuIH0pID0+IDxCb3ggY29sb3I9XCJncmV5NjBcIiBmb250U2l6ZT1cInNtXCI+e2NoaWxkcmVufTwvQm94PjtcclxuXHJcbmNvbnN0IFByb3BlcnR5Q2FyZExpc3QgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB7IHJlY29yZHMsIGxvYWRpbmcsIGVycm9yIH0gPSB1c2VSZWNvcmRzKCdQcm9wZXJ0eVBvc3QnKTtcclxuICAgIGNvbnN0IFtleHBhbmRlZCwgc2V0RXhwYW5kZWRdID0gdXNlU3RhdGUoe30pO1xyXG5cclxuXHJcbiAgICBpZiAobG9hZGluZykgcmV0dXJuIDxCb3ggcD1cImxnXCI+PExvYWRlciAvPjwvQm94PjtcclxuICAgIGlmIChlcnJvcikgcmV0dXJuIDxCb3ggcD1cImxnXCI+PFBsYWNlaG9sZGVyPjxINT7guYDguIHguLTguJTguILguYnguK3guJzguLTguJTguJ7guKXguLLguJTguYPguJnguIHguLLguKPguYLguKvguKXguJTguILguYnguK3guKHguLnguKXguYLguJ7guKrguJXguYw8L0g1PjwvUGxhY2Vob2xkZXI+PC9Cb3g+O1xyXG4gICAgaWYgKCFyZWNvcmRzIHx8IHJlY29yZHMubGVuZ3RoID09PSAwKSByZXR1cm4gPEJveCBwPVwibGdcIj48UGxhY2Vob2xkZXI+PEg1PuC5hOC4oeC5iOC4nuC4muC5guC4nuC4quC4leC5jOC4l+C4teC5iOC4leC4o+C4h+C4geC4seC4muC5gOC4h+C4t+C5iOC4reC4meC5hOC4gjwvSDU+PC9QbGFjZWhvbGRlcj48L0JveD47XHJcblxyXG4gICAgLy8g4pyFIOC4quC4teC4quC4s+C4q+C4o+C4seC4muC5geC4leC5iOC4peC4sOC4quC4luC4suC4meC4sFxyXG4gICAgY29uc3QgYmFkZ2VTdHlsZXMgPSB7XHJcbiAgICAgICAgUEVORElORzogeyBiZzogXCIjRkZGN0UwXCIsIGNvbG9yOiBcIiNCNTgxMDBcIiB9LCAgLy8g4LmA4Lir4Lil4Li34Lit4LiHXHJcbiAgICAgICAgQ09ORklSTUVEOiB7IGJnOiBcIiNFNkY3RTZcIiwgY29sb3I6IFwiIzBDN0EwQ1wiIH0sICAvLyDguYDguILguLXguKLguKdcclxuICAgICAgICBTT0xEOiB7IGJnOiBcIiNFMEUwRTBcIiwgY29sb3I6IFwiIzU1NTU1NVwiIH0sICAvLyDguYDguJfguLJcclxuICAgICAgICBISURERU46IHsgYmc6IFwiI0YyRjJGMlwiLCBjb2xvcjogXCIjNjY2NjY2XCIgfSwgIC8vIOC5gOC4l+C4suC4reC5iOC4reC4mVxyXG4gICAgICAgIFJFSkVDVEVEOiB7IGJnOiBcIiNGRkU2RTZcIiwgY29sb3I6IFwiI0QxMDAwMFwiIH0sICAvLyDguYHguJTguIdcclxuICAgICAgICBkZWZhdWx0OiB7IGJnOiBcIiNGMkYyRjJcIiwgY29sb3I6IFwiIzY2NjY2NlwiIH0sXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPEJveCBwPVwiMnhsXCI+XHJcbiAgICAgICAgICAgIDxCb3ggZGlzcGxheT1cImdyaWRcIiBncmlkVGVtcGxhdGVDb2x1bW5zPXtbJzFmcicsICdyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMzgwcHgsIDFmcikpJ119IHN0eWxlPXt7IGdhcDogXCIyMHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICB7cmVjb3Jkcy5tYXAoKHIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJhbXMgPSByLnBhcmFtcyA/PyB7fTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHIuaWQgPz8gcGFyYW1zLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzRXhwYW5kZWQgPSAhIWV4cGFuZGVkW2lkXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g4pyFIOC4lOC4tuC4h+C4guC5ieC4reC4oeC4ueC4peC4l+C4seC5ieC4h+C4q+C4oeC4lOC4iOC4suC4gSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gZGlzcGxheVZhbHVlKHBhcmFtcy5Qcm9wZXJ0eV9OYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGRpc3BsYXlWYWx1ZShwYXJhbXMuRGVzY3JpcHRpb24sIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByaWNlID0gcGFyYW1zLlByaWNlICE9IG51bGwgPyBOdW1iZXIocGFyYW1zLlByaWNlKS50b0xvY2FsZVN0cmluZygpIDogXCJOL0FcIjtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWxsUmVudCA9IGRpc3BsYXlWYWx1ZShwYXJhbXMuU2VsbF9SZW50KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGF0dXMgPSBwYXJhbXMuU3RhdHVzX3Bvc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlZEF0ID0gbmV3IERhdGUocGFyYW1zLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwidGgtVEhcIiwgeyB5ZWFyOiAnbnVtZXJpYycsIG1vbnRoOiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbWdVcmwgPSBwYXJhbXMuX2ZpcnN0SW1hZ2UgfHwgbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXRlZ29yeU5hbWUgPSBwYXJhbXMuX2NhdGVnb3J5TmFtZSB8fCAnTi9BJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlUcmFuc2xhdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRvOiAn4LiE4Lit4LiZ4LmC4LiUJywgaG91c2U6ICfguJrguYnguLLguJknLCBsYW5kOiAn4LiX4Li14LmI4LiU4Li04LiZJywgdmlsbGE6ICfguKfguLTguKXguKXguYjguLInLCB0b3duaG91c2U6ICfguJfguLLguKfguJnguYzguYDguK7guLLguKrguYwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnc2hvcCBob3VzZSc6ICfguK3guLLguITguLLguKPguJ7guLLguJPguLTguIrguKLguYwnLCBhcGFydG1lbnQ6ICfguK3guJ7guLLguKPguYzguJfguYDguKHguJnguJfguYwnLCBwZW50aG91c2U6ICfguYDguJ7guJnguJfguYzguYDguK7guLLguKrguYwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvcnQ6ICfguKPguLXguKrguK3guKPguYzguJcnLCBob3RlbDogJ+C5guC4o+C4h+C5geC4o+C4oScsIG9mZmljZTogJ+C4quC4s+C4meC4seC4geC4h+C4suC4mScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb21tZXJjaWFsIGJ1aWxkaW5nJzogJ+C4leC4tuC4geC4nuC4suC4k+C4tOC4iuC4ouC5jCcsIGZhY3Rvcnk6ICfguYLguKPguIfguIfguLLguJknLCB3YXJlaG91c2U6ICfguYLguIHguJTguLHguIcv4LiE4Lil4Lix4LiH4Liq4Li04LiZ4LiE4LmJ4LiyJyxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhdGVnb3J5VGV4dCA9IGNhdGVnb3J5VHJhbnNsYXRpb25zW1N0cmluZyhjYXRlZ29yeU5hbWUpLnRvTG93ZXJDYXNlKCldIHx8IGNhdGVnb3J5TmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzVHJhbnNsYXRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQRU5ESU5HOiAn4Lij4Lit4LiV4Lij4Lin4LiI4Liq4Lit4LiaJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ09ORklSTUVEOiAn4Lit4LiZ4Li44Lih4Lix4LiV4Li04LmB4Lil4LmJ4LinJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgU09MRDogJ+C4guC4suC4ouC5geC4peC5ieC4pycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEhJRERFTjogJ+C4i+C5iOC4reC4mScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFSkVDVEVEOiAn4LiW4Li54LiB4Lib4LiP4Li04LmA4Liq4LiYJyxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1c1RleHQgPSBzdGF0dXNUcmFuc2xhdGlvbnNbc3RhdHVzXSB8fCBzdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBiYWRnZVN0eWxlc1tzdGF0dXNdIHx8IGJhZGdlU3R5bGVzLmRlZmF1bHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDYXJkIGtleT17aWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2ltZ1VybCA/ICg8Qm94IHdpZHRoPVwiMTAwJVwiIGhlaWdodD17MjAwfSBvdmVyZmxvdz1cImhpZGRlblwiIGJvcmRlclJhZGl1cz1cImxnXCIgbWI9XCJsZ1wiPjxpbWcgc3JjPXtpbWdVcmx9IGFsdD1cInRodW1iXCIgc3R5bGU9e3sgd2lkdGg6IFwiMTAwJVwiLCBoZWlnaHQ6IFwiMTAwJVwiLCBvYmplY3RGaXQ6IFwiY292ZXJcIiB9fSAvPjwvQm94PikgOiAoPEJveCB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9ezEyMH0gZGlzcGxheT1cImZsZXhcIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCIganVzdGlmeUNvbnRlbnQ9XCJjZW50ZXJcIiBiZz1cImdyZXkyMFwiIGNvbG9yPVwiZ3JleTYwXCIgYm9yZGVyUmFkaXVzPVwibGdcIiBtYj1cImxnXCI+4LmE4Lih4LmI4Lih4Li14Lij4Li54LibPC9Cb3g+KX1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogPT09IFNlY3Rpb246IE1haW4gSW5mbyA9PT0gKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SDIgbT17MH0gZm9udFNpemU9XCJ4bFwiIG1iPVwic21cIj57bmFtZX08L0gyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGZsZXhXcmFwPVwid3JhcFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBtYj1cIm1kXCIgc3R5bGU9e3sgZ2FwOiAnMTJweCcgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRleHQgZm9udFdlaWdodD1cImJvbGRcIiBmb250U2l6ZT1cImxnXCIgY29sb3I9XCJwcmltYXJ5MTAwXCI+e3ByaWNlfSDguJrguLLguJc8L1RleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRleHQgY29sb3I9XCJncmV5ODBcIj57YCR7ZGlzcGxheVZhbHVlKHBhcmFtcy5EaXN0cmljdCwgJycpfSwgJHtkaXNwbGF5VmFsdWUocGFyYW1zLlByb3ZpbmNlLCAnJyl9YH08L1RleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJhZGdlIHZhcmlhbnQ9XCJwcmltYXJ5XCI+e3NlbGxSZW50fTwvQmFkZ2U+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogPT09IFNlY3Rpb246IERlc2NyaXB0aW9uID09PSAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3ggbXk9XCJsZ1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUZXh0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aXNFeHBhbmRlZCA/IGRlc2NyaXB0aW9uIDogdHJ1bmNhdGUoZGVzY3JpcHRpb24sIDEyMCl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtkZXNjcmlwdGlvbi5sZW5ndGggPiAxMjAgJiYgKDxCdXR0b24gdmFyaWFudD1cInRleHRcIiBvbkNsaWNrPXsoKSA9PiBzZXRFeHBhbmRlZChwcmV2ID0+ICh7IC4uLnByZXYsIFtpZF06ICFwcmV2W2lkXSB9KSl9IG1sPVwic21cIj57aXNFeHBhbmRlZCA/IFwi4Lii4LmI4LitXCIgOiBcIuC4reC5iOC4suC4meC4leC5iOC4rVwifTwvQnV0dG9uPil9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9UZXh0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBQcm9wZXJ0eSBEZXRhaWxzID09PSAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3ggYm9yZGVyVG9wPVwiMXB4IHNvbGlkXCIgYm9yZGVyQ29sb3I9XCJncmV5MjBcIiBtdD1cImxnXCIgcHQ9XCJsZ1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxINSBtYj1cIm1kXCI+4Lij4Liy4Lii4Lil4Liw4LmA4Lit4Li14Lii4LiU4LiX4Lij4Lix4Lie4Lii4LmM4Liq4Li04LiZPC9INT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJncmlkXCIgZ3JpZFRlbXBsYXRlQ29sdW1ucz1cInJlcGVhdCgzLCAxZnIpXCIgZ3JpZEdhcD1cIm1kXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxEZXRhaWxJdGVtIGxhYmVsPVwi4Lie4Li34LmJ4LiZ4LiX4Li14LmI4LmD4LiK4LmJ4Liq4Lit4LiiXCIgdmFsdWU9e3BhcmFtcy5Vc2FibGVfQXJlYSA/IGAke3BhcmFtcy5Vc2FibGVfQXJlYX0g4LiV4LijLuC4oS5gIDogbnVsbH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPERldGFpbEl0ZW0gbGFiZWw9XCLguILguJnguLLguJTguJfguLXguYjguJTguLTguJlcIiB2YWx1ZT17cGFyYW1zLkxhbmRfU2l6ZSA/IGAke3BhcmFtcy5MYW5kX1NpemV9IOC4leC4oy7guKcuYCA6IG51bGx9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxEZXRhaWxJdGVtIGxhYmVsPVwi4Lir4LmJ4Lit4LiH4LiZ4Lit4LiZXCIgdmFsdWU9e3BhcmFtcy5CZWRyb29tc30gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPERldGFpbEl0ZW0gbGFiZWw9XCLguKvguYnguK3guIfguJnguYnguLNcIiB2YWx1ZT17cGFyYW1zLkJhdGhyb29tfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RGV0YWlsSXRlbSBsYWJlbD1cIuC4iuC4seC5ieC4mVwiIHZhbHVlPXtwYXJhbXMuZmxvb3J9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxEZXRhaWxJdGVtIGxhYmVsPVwi4LiX4Li14LmI4LiI4Lit4LiU4Lij4LiWXCIgdmFsdWU9e3BhcmFtcy5QYXJraW5nX1NwYWNlfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RGV0YWlsSXRlbSBsYWJlbD1cIuC4iOC4s+C4meC4p+C4meC4ouC4ueC4meC4tOC4lVwiIHZhbHVlPXtwYXJhbXMuTnVtYmVyT2ZVbml0c30gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPERldGFpbEl0ZW0gbGFiZWw9XCLguJvguLXguJfguLXguYjguKrguKPguYnguLLguIdcIiB2YWx1ZT17cGFyYW1zLlllYXJfQnVpbHR9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxEZXRhaWxJdGVtIGxhYmVsPVwi4LiI4Liz4LiZ4Lin4LiZ4Lir4LmJ4Lit4LiH4LiX4Lix4LmJ4LiH4Lir4Lih4LiUXCIgdmFsdWU9e3BhcmFtcy5Ub3RhbF9Sb29tc30gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogRmVhdHVyZXMgPT09ICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveCBib3JkZXJUb3A9XCIxcHggc29saWRcIiBib3JkZXJDb2xvcj1cImdyZXkyMFwiIG10PVwibGdcIiBwdD1cImxnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEg1IG1iPVwibWRcIj7guKrguLTguYjguIfguK3guLPguJnguKfguKLguITguKfguLLguKHguKrguLDguJTguKfguIHguYHguKXguLDguKrguJbguLLguJnguJfguLXguYjguYPguIHguKXguYnguYDguITguLXguKLguIc8L0g1PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsocGFyYW1zLkFkZGl0aW9uYWxfQW1lbml0aWVzPy5sZW5ndGggPiAwKSAmJiA8RGV0YWlsSXRlbSBsYWJlbD1cIuC4quC4tOC5iOC4h+C4reC4s+C4meC4p+C4ouC4hOC4p+C4suC4oeC4quC4sOC4lOC4p+C4geC5gOC4nuC4tOC5iOC4oeC5gOC4leC4tOC4oVwiIHZhbHVlPXtwYXJhbXMuQWRkaXRpb25hbF9BbWVuaXRpZXMuam9pbignLCAnKX0gLz59XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyhwYXJhbXMuTmVhcmJ5X0xhbmRtYXJrcz8ubGVuZ3RoID4gMCkgJiYgPERldGFpbEl0ZW0gbGFiZWw9XCLguKrguJbguLLguJnguJfguLXguYjguYPguIHguKXguYnguYDguITguLXguKLguIdcIiB2YWx1ZT17cGFyYW1zLk5lYXJieV9MYW5kbWFya3Muam9pbignLCAnKX0gLz59XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogPT09IFNlY3Rpb246IENvbnRhY3QgJiBMaW5rcyA9PT0gKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGJvcmRlclRvcD1cIjFweCBzb2xpZFwiIGJvcmRlckNvbG9yPVwiZ3JleTIwXCIgbXQ9XCJsZ1wiIHB0PVwibGdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SDUgbWI9XCJtZFwiPuC4guC5ieC4reC4oeC4ueC4peC4leC4tOC4lOC4leC5iOC4reC5geC4peC4sOC4peC4tOC4h+C4geC5jDwvSDU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPERldGFpbEl0ZW0gbGFiZWw9XCLguJzguLnguYnguKXguIfguJvguKPguLDguIHguLLguKhcIiB2YWx1ZT17cGFyYW1zLk5hbWV9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPERldGFpbEl0ZW0gbGFiZWw9XCLguYDguJrguK3guKPguYzguYLguJfguKPguKjguLHguJ7guJfguYxcIiB2YWx1ZT17cGFyYW1zLlBob25lfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBncmlkR2FwPVwibWRcIiBtdD1cIm1kXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwYXJhbXMuTGlua01hcCAmJiA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e3BhcmFtcy5MaW5rTWFwfSB0YXJnZXQ9XCJfYmxhbmtcIiBzaXplPVwic21cIj7guYHguJzguJnguJfguLXguYg8L0J1dHRvbj59XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwYXJhbXMuTGlua19saW5lICYmIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17cGFyYW1zLkxpbmtfbGluZX0gdGFyZ2V0PVwiX2JsYW5rXCIgc2l6ZT1cInNtXCI+TElORTwvQnV0dG9uPn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3BhcmFtcy5MaW5rX2ZhY2Jvb2sgJiYgPEJ1dHRvbiBhcz1cImFcIiBocmVmPXtwYXJhbXMuTGlua19mYWNib29rfSB0YXJnZXQ9XCJfYmxhbmtcIiBzaXplPVwic21cIj5GYWNlYm9vazwvQnV0dG9uPn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogTWV0YSAmIEFjdGlvbnMgPT09ICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveCBib3JkZXJUb3A9XCIxcHggc29saWRcIiBib3JkZXJDb2xvcj1cImdyZXkyMFwiIG10PVwibGdcIiBwdD1cImxnXCIgZGlzcGxheT1cImZsZXhcIiBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIiBhbGlnbkl0ZW1zPVwiZmxleC1lbmRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgZmxleERpcmVjdGlvbj1cImNvbHVtblwiIGdhcD1cInNtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMYWJlbD48c3Ryb25nPuC4q+C4oeC4p+C4lOC4q+C4oeC4ueC5iDo8L3N0cm9uZz4ge2NhdGVnb3J5VGV4dH08L0xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGFiZWw+PHN0cm9uZz7guKrguJbguLLguJnguLA6PC9zdHJvbmc+IDxCYWRnZSB2YXJpYW50PVwiZGVmYXVsdFwiIGJnPXtzdHlsZS5iZ30gY29sb3I9e3N0eWxlLmNvbG9yfSBtbD1cIm1kXCI+e3N0YXR1c1RleHR9PC9CYWRnZT48L0xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGFiZWw+PHN0cm9uZz7guKrguKPguYnguLLguIfguYDguKHguLfguYjguK06PC9zdHJvbmc+IHtjcmVhdGVkQXR9PC9MYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgZ3JpZEdhcD1cIm1kXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YC9hZG1pbi9yZXNvdXJjZXMvUHJvcGVydHlQb3N0L3JlY29yZHMvJHtpZH0vc2hvd2B9IHNpemU9XCJzbVwiPuC4lOC4uTwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e2AvYWRtaW4vcmVzb3VyY2VzL1Byb3BlcnR5UG9zdC9yZWNvcmRzLyR7aWR9L2VkaXRgfSB2YXJpYW50PVwicHJpbWFyeVwiIHNpemU9XCJzbVwiPuC5geC4geC5ieC5hOC4gjwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ2FyZD5cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvQm94PlxyXG5cclxuICAgICAgICA8L0JveD5cclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQcm9wZXJ0eUNhcmRMaXN0O1xyXG4iLCIvLyBzZXJ2ZXIvQWRtaW4vY29tcG9uZW50cy9TZWxsZXJDYXJkTGlzdC5qc3hcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVjb3JkcyB9IGZyb20gJ2FkbWluanMnO1xyXG5pbXBvcnQgeyBCb3gsIEgyLCBMb2FkZXIsIFBsYWNlaG9sZGVyLCBINSwgQnV0dG9uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XHJcblxyXG4vLyBIZWxwZXIgRnVuY3Rpb25zXHJcbmNvbnN0IGlzRW1wdHlWYWx1ZSA9ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCB8fCBTdHJpbmcodikudHJpbSgpID09PSBcIlwiO1xyXG5jb25zdCBkaXNwbGF5VmFsdWUgPSAodiwgZmFsbGJhY2sgPSBcIuC4p+C5iOC4suC4h1wiKSA9PiAoaXNFbXB0eVZhbHVlKHYpID8gZmFsbGJhY2sgOiB2KTtcclxuXHJcbmNvbnN0IENhcmQgPSAoeyBjaGlsZHJlbiB9KSA9PiAoXHJcbiAgPEJveFxyXG4gICAgdmFyaWFudD1cIndoaXRlXCJcclxuICAgIGJveFNoYWRvdz1cImNhcmRcIlxyXG4gICAgYm9yZGVyUmFkaXVzPVwieGxcIlxyXG4gICAgcD1cInhsXCJcclxuICAgIG1iPVwiMnhsXCJcclxuICAgIHN0eWxlPXt7IHRyYW5zaXRpb246IFwiYm94LXNoYWRvdyAwLjJzIGVhc2UsIHRyYW5zZm9ybSAwLjJzIGVhc2VcIiB9fVxyXG4gICAgX2hvdmVyPXt7IGJveFNoYWRvdzogXCIwIDRweCAyMHB4IHJnYmEoMCwwLDAsMC4wOClcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoLTJweClcIiB9fVxyXG4gID5cclxuICAgIHtjaGlsZHJlbn1cclxuICA8L0JveD5cclxuKTtcclxuXHJcbmNvbnN0IFNlbGxlckNhcmRMaXN0ID0gKCkgPT4ge1xyXG4gIGNvbnN0IHsgcmVjb3JkcywgbG9hZGluZywgZXJyb3IgfSA9IHVzZVJlY29yZHMoJ1NlbGxlcicpO1xyXG5cclxuICBpZiAobG9hZGluZykgcmV0dXJuIDxCb3ggcD1cImxnXCI+PExvYWRlciAvPjwvQm94PjtcclxuICBpZiAoZXJyb3IpIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxQbGFjZWhvbGRlcj48SDU+4LmA4LiB4Li04LiU4LiC4LmJ4Lit4Lic4Li04LiU4Lie4Lil4Liy4LiUPC9INT48cD7guYTguKHguYjguKrguLLguKHguLLguKPguJbguJTguLbguIfguILguYnguK3guKHguLnguKXguJzguLnguYnguILguLLguKLguYTguJTguYk8L3A+PC9QbGFjZWhvbGRlcj48L0JveD47XHJcbiAgaWYgKCFyZWNvcmRzIHx8IHJlY29yZHMubGVuZ3RoID09PSAwKSByZXR1cm4gPEJveCBwPVwibGdcIj48UGxhY2Vob2xkZXI+PEg1PuC5hOC4oeC5iOC4oeC4teC4nOC4ueC5ieC4guC4suC4ojwvSDU+PHA+4LmE4Lih4LmI4Lie4Lia4Lic4Li54LmJ4LiC4Liy4Lii4LiX4Li14LmI4LiV4Lij4LiH4LiB4Lix4Lia4LmA4LiH4Li34LmI4Lit4LiZ4LmE4LiC4LiB4Liy4Lij4LiB4Lij4Lit4LiH4LiC4Lit4LiH4LiE4Li44LiTPC9wPjwvUGxhY2Vob2xkZXI+PC9Cb3g+O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPEJveCBwPVwiMnhsXCI+XHJcbiAgICAgIDxCb3hcclxuICAgICAgICBkaXNwbGF5PVwiZ3JpZFwiXHJcbiAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1ucz17WycxZnInLCAncmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDM0MHB4LCAxZnIpKSddfVxyXG4gICAgICAgIHN0eWxlPXt7IGdhcDogXCIyMHB4XCIgfX0gXHJcbiAgICAgID5cclxuICAgICAgICB7cmVjb3Jkcy5tYXAoKHIpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHIucGFyYW1zID8/IHt9O1xyXG4gICAgICAgICAgY29uc3QgdXNlclBhcmFtcyA9IHIucG9wdWxhdGVkPy51c2VyPy5wYXJhbXMgPz8ge307XHJcbiAgICAgICAgICBjb25zdCBpZCA9IHIuaWQgPz8gcGFyYW1zLmlkO1xyXG5cclxuICAgICAgICAgIGNvbnN0IGZ1bGxOYW1lID0gYCR7ZGlzcGxheVZhbHVlKHVzZXJQYXJhbXMuRmlyc3RfbmFtZSwgJycpfSAke2Rpc3BsYXlWYWx1ZSh1c2VyUGFyYW1zLkxhc3RfbmFtZSwgJycpfWAudHJpbSgpIHx8IFwi4LmE4Lih4LmI4Lih4Li14LiK4Li34LmI4LitXCI7XHJcbiAgICAgICAgICBjb25zdCBpbWFnZVVybCA9IHBhcmFtcy5uYXRpb25hbElkSW1hZ2UgfHwgbnVsbDtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgY29uc3QgY29tcGFueU5hbWUgPSBkaXNwbGF5VmFsdWUocGFyYW1zLkNvbXBhbnlfTmFtZSk7XHJcbiAgICAgICAgICBjb25zdCBsaWNlbnNlID0gZGlzcGxheVZhbHVlKHBhcmFtcy5SZWFsRXN0YXRlX0xpY2Vuc2UpO1xyXG4gICAgICAgICAgY29uc3Qgc3RhdHVzID0gZGlzcGxheVZhbHVlKHBhcmFtcy5TdGF0dXMpO1xyXG4gICAgICAgICAgY29uc3QgY3JlYXRlZEF0ID0gbmV3IERhdGUocGFyYW1zLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwidGgtVEhcIiwge1xyXG4gICAgICAgICAgICB5ZWFyOiAnbnVtZXJpYycsIG1vbnRoOiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJ1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgY29uc3QgYmFkZ2VTdHlsZXMgPSB7XHJcbiAgICAgICAgICAgIFBFTkRJTkc6IHsgYmc6IFwiI2ZmZmJlNlwiLCBjb2xvcjogXCIjZmFhZDE0XCIgfSxcclxuICAgICAgICAgICAgQVBQUk9WRUQ6IHsgYmc6IFwiI2Y2ZmZlZFwiLCBjb2xvcjogXCIjNTJjNDFhXCIgfSxcclxuICAgICAgICAgICAgUkVKRUNURUQ6IHsgYmc6IFwiI2ZmZjFmMFwiLCBjb2xvcjogXCIjZjUyMjJkXCIgfSxcclxuICAgICAgICAgICAgZGVmYXVsdDogeyBiZzogXCIjZjJmMmYyXCIsIGNvbG9yOiBcIiM1NTVcIiB9LFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGNvbnN0IHN0eWxlID0gYmFkZ2VTdHlsZXNbc3RhdHVzXSB8fCBiYWRnZVN0eWxlcy5kZWZhdWx0O1xyXG5cclxuICAgICAgICAgIC8vIOKchSDguKrguKPguYnguLLguIcgT2JqZWN0IOC4quC4s+C4q+C4o+C4seC4muC5geC4m+C4peC4quC4luC4suC4meC4sFxyXG4gICAgICAgICAgY29uc3Qgc3RhdHVzVHJhbnNsYXRpb25zID0ge1xyXG4gICAgICAgICAgICBQRU5ESU5HOiAn4Lij4Lit4LiV4Lij4Lin4LiI4Liq4Lit4LiaJyxcclxuICAgICAgICAgICAgQVBQUk9WRUQ6ICfguK3guJnguLjguKHguLHguJXguLTguYHguKXguYnguKcnLFxyXG4gICAgICAgICAgICBSRUpFQ1RFRDogJ+C4luC4ueC4geC4m+C4j+C4tOC5gOC4quC4mCcsXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIC8vIOKchSDguJTguLbguIfguITguLPguYHguJvguKXguKDguLLguKnguLLguYTguJfguKJcclxuICAgICAgICAgIGNvbnN0IHN0YXR1c1RleHQgPSBzdGF0dXNUcmFuc2xhdGlvbnNbc3RhdHVzXSB8fCBzdGF0dXM7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPENhcmQga2V5PXtpZH0+XHJcbiAgICAgICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBncmlkR2FwPVwibGdcIj5cclxuICAgICAgICAgICAgICAgIDxCb3ggd2lkdGg9ezgwfSBoZWlnaHQ9ezgwfSBib3JkZXJSYWRpdXM9XCI1MCVcIiBvdmVyZmxvdz1cImhpZGRlblwiIGJnPVwiZ3JleTIwXCIgZmxleFNocmluaz17MH0+XHJcbiAgICAgICAgICAgICAgICAgIHtpbWFnZVVybCA/IChcclxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2VVcmx9IGFsdD1cInByb2ZpbGVcIiBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogXCIxMDAlXCIsIG9iamVjdEZpdDogXCJjb3ZlclwiIH19IC8+XHJcbiAgICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPEJveCB3aWR0aD1cIjEwMCVcIiBoZWlnaHQ9XCIxMDAlXCIgZGlzcGxheT1cImZsZXhcIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCIganVzdGlmeUNvbnRlbnQ9XCJjZW50ZXJcIiBjb2xvcj1cImdyZXk2MFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgTm8gSW1nXHJcbiAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgIDxCb3g+XHJcbiAgICAgICAgICAgICAgICAgIDxIMiBtPXswfSBmb250U2l6ZT1cInhsXCI+e2Z1bGxOYW1lfTwvSDI+XHJcbiAgICAgICAgICAgICAgICAgIDxCb3ggY29sb3I9XCJncmV5ODBcIiBtdD1cInhzXCI+PHN0cm9uZz7guJrguKPguLTguKnguLHguJc6PC9zdHJvbmc+IHtjb21wYW55TmFtZX08L0JveD5cclxuICAgICAgICAgICAgICAgICAgPEJveCBjb2xvcj1cImdyZXk4MFwiPjxzdHJvbmc+4LmD4Lia4Lit4LiZ4Li44LiN4Liy4LiVOjwvc3Ryb25nPiB7bGljZW5zZX08L0JveD5cclxuICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgIDwvQm94PlxyXG5cclxuICAgICAgICAgICAgICA8Qm94XHJcbiAgICAgICAgICAgICAgICBib3JkZXJUb3A9XCIxcHggc29saWRcIiBib3JkZXJDb2xvcj1cImdyZXkyMFwiIG10PVwieGxcIiBwdD1cImxnXCJcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk9XCJmbGV4XCIganVzdGlmeUNvbnRlbnQ9XCJzcGFjZS1iZXR3ZWVuXCIgYWxpZ25JdGVtcz1cImNlbnRlclwiXHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgPEJveD5cclxuICAgICAgICAgICAgICAgICAgPEJveFxyXG4gICAgICAgICAgICAgICAgICAgIGFzPVwic3BhblwiIHB4PVwibWRcIiBweT1cInNtXCIgYm9yZGVyUmFkaXVzPVwibGdcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogc3R5bGUuYmcsIGNvbG9yOiBzdHlsZS5jb2xvciwgZm9udFdlaWdodDogXCJib2xkXCIsIGZvbnRTaXplOiBcIjAuOXJlbVwiIH19XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICB7Lyog4pyFIOC5gOC4m+C4peC4teC5iOC4ouC4meC4oeC4suC5g+C4iuC5iSBzdGF0dXNUZXh0IOC5gOC4nuC4t+C5iOC4reC5geC4quC4lOC4h+C4nOC4pSAqL31cclxuICAgICAgICAgICAgICAgICAgICB7c3RhdHVzVGV4dH1cclxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgIDxCb3ggZm9udFNpemU9XCJzbVwiIGNvbG9yPVwiZ3JleTYwXCIgbXQ9XCJzbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIOC5gOC4m+C5h+C4meC4nOC4ueC5ieC4guC4suC4ouC5gOC4oeC4t+C5iOC4rToge2NyZWF0ZWRBdH1cclxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBncmlkR2FwPVwibWRcIj5cclxuICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBhcz1cImFcIiBocmVmPXtgL2FkbWluL3Jlc291cmNlcy9TZWxsZXIvcmVjb3Jkcy8ke2lkfS9zaG93YH0gdmFyaWFudD1cInByaW1hcnlcIj7guJTguLk8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBhcz1cImFcIiBocmVmPXtgL2FkbWluL3Jlc291cmNlcy9TZWxsZXIvcmVjb3Jkcy8ke2lkfS9lZGl0YH0+4LmB4LiB4LmJ4LmE4LiCPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgPC9DYXJkPlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KX1cclxuICAgICAgPC9Cb3g+XHJcbiAgICA8L0JveD5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgU2VsbGVyQ2FyZExpc3Q7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVjb3JkcyB9IGZyb20gJ2FkbWluanMnO1xyXG5pbXBvcnQgeyBCb3gsIEgyLCBINSwgTG9hZGVyLCBQbGFjZWhvbGRlciwgQnV0dG9uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XHJcblxyXG4vLyBIZWxwZXIgRnVuY3Rpb25zXHJcbmNvbnN0IGlzRW1wdHlWYWx1ZSA9ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCB8fCBTdHJpbmcodikudHJpbSgpID09PSBcIlwiO1xyXG5jb25zdCBkaXNwbGF5VmFsdWUgPSAodiwgZmFsbGJhY2sgPSBcIuC4p+C5iOC4suC4h1wiKSA9PiAoaXNFbXB0eVZhbHVlKHYpID8gZmFsbGJhY2sgOiB2KTtcclxuXHJcbmNvbnN0IENhcmQgPSAoeyBjaGlsZHJlbiB9KSA9PiAoXHJcbiAgPEJveFxyXG4gICAgdmFyaWFudD1cIndoaXRlXCJcclxuICAgIGJveFNoYWRvdz1cImNhcmRcIlxyXG4gICAgYm9yZGVyUmFkaXVzPVwieGxcIlxyXG4gICAgcD1cInhsXCJcclxuICAgIG1iPVwiMnhsXCJcclxuICAgIHN0eWxlPXt7IHRyYW5zaXRpb246IFwiYm94LXNoYWRvdyAwLjJzIGVhc2UsIHRyYW5zZm9ybSAwLjJzIGVhc2VcIiB9fVxyXG4gICAgX2hvdmVyPXt7IGJveFNoYWRvdzogXCIwIDRweCAyMHB4IHJnYmEoMCwwLDAsMC4wOClcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoLTJweClcIiB9fVxyXG4gID5cclxuICAgIHtjaGlsZHJlbn1cclxuICA8L0JveD5cclxuKTtcclxuXHJcbmNvbnN0IFByb3BlcnR5VW5pdENhcmRMaXN0ID0gKCkgPT4ge1xyXG4gIGNvbnN0IHsgcmVjb3JkcywgbG9hZGluZywgZXJyb3IgfSA9IHVzZVJlY29yZHMoJ1Byb3BlcnR5VW5pdCcpO1xyXG5cclxuICBpZiAobG9hZGluZykgcmV0dXJuIDxCb3ggcD1cImxnXCI+PExvYWRlciAvPjwvQm94PjtcclxuICBpZiAoZXJyb3IpIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxQbGFjZWhvbGRlcj48SDU+4LmA4LiB4Li04LiU4LiC4LmJ4Lit4Lic4Li04LiU4Lie4Lil4Liy4LiUPC9INT48cD7guYTguKHguYjguKrguLLguKHguLLguKPguJbguJTguLbguIfguILguYnguK3guKHguLnguKXguKLguLnguJnguLTguJXguYTguJTguYk8L3A+PC9QbGFjZWhvbGRlcj48L0JveD47XHJcbiAgaWYgKCFyZWNvcmRzIHx8IHJlY29yZHMubGVuZ3RoID09PSAwKSByZXR1cm4gPEJveCBwPVwibGdcIj48UGxhY2Vob2xkZXI+PEg1PuC5hOC4oeC5iOC4oeC4teC4ouC4ueC4meC4tOC4lTwvSDU+PHA+4LmE4Lih4LmI4Lie4Lia4LiC4LmJ4Lit4Lih4Li54Lil4Lii4Li54LiZ4Li04LiV4LiX4Li14LmI4LiV4Lij4LiH4LiB4Lix4Lia4LmA4LiH4Li34LmI4Lit4LiZ4LmE4LiCPC9wPjwvUGxhY2Vob2xkZXI+PC9Cb3g+O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPEJveCBwPVwiMnhsXCI+XHJcbiAgICAgIDxCb3hcclxuICAgICAgICBkaXNwbGF5PVwiZ3JpZFwiXHJcbiAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1ucz17WycxZnInLCAncmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDM0MHB4LCAxZnIpKSddfVxyXG4gICAgICAgIHN0eWxlPXt7IGdhcDogXCIyMHB4XCIgfX0gXHJcbiAgICAgID5cclxuICAgICAgICB7cmVjb3Jkcy5tYXAoKHIpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHIucGFyYW1zID8/IHt9O1xyXG4gICAgICAgICAgY29uc3QgcHJvcGVydHlQb3N0UGFyYW1zID0gci5wb3B1bGF0ZWQ/LnByb3BlcnR5UG9zdD8ucGFyYW1zID8/IHt9O1xyXG4gICAgICAgICAgY29uc3QgaWQgPSByLmlkID8/IHBhcmFtcy5pZDtcclxuXHJcbiAgICAgICAgICBjb25zdCB1bml0TnVtYmVyID0gZGlzcGxheVZhbHVlKHBhcmFtcy5Vbml0X051bWJlcik7XHJcbiAgICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBkaXNwbGF5VmFsdWUocHJvcGVydHlQb3N0UGFyYW1zLlByb3BlcnR5X05hbWUsICfguYTguKHguYjguKHguLXguIrguLfguYjguK3guYLguITguKPguIfguIHguLLguKMnKTtcclxuICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IGRpc3BsYXlWYWx1ZShwYXJhbXMuU3RhdHVzKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBiYWRnZVN0eWxlcyA9IHtcclxuICAgICAgICAgICAgQVZBSUxBQkxFOiB7IGJnOiBcIiNmNmZmZWRcIiwgY29sb3I6IFwiIzUyYzQxYVwiIH0sXHJcbiAgICAgICAgICAgIEJPT0tFRDogeyBiZzogXCIjZmZmYmU2XCIsIGNvbG9yOiBcIiNmYWFkMTRcIiB9LFxyXG4gICAgICAgICAgICBTT0xEOiB7IGJnOiBcIiNmMmYyZjJcIiwgY29sb3I6IFwiIzU1NVwiIH0sXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHsgYmc6IFwiI2YyZjJmMlwiLCBjb2xvcjogXCIjNTU1XCIgfSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBjb25zdCBzdHlsZSA9IGJhZGdlU3R5bGVzW3N0YXR1c10gfHwgYmFkZ2VTdHlsZXMuZGVmYXVsdDtcclxuXHJcbiAgICAgICAgICBjb25zdCBzdGF0dXNUcmFuc2xhdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIEFWQUlMQUJMRTogJ+C4p+C5iOC4suC4hycsXHJcbiAgICAgICAgICAgIFBFTkRJTkc6ICfguIHguLPguKXguLHguIfguJTguLPguYDguJnguLTguJnguIHguLLguKMnLFxyXG4gICAgICAgICAgICBTT0xEOiAn4LiC4Liy4Lii4LmB4Lil4LmJ4LinJyxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBjb25zdCBzdGF0dXNUZXh0ID0gc3RhdHVzVHJhbnNsYXRpb25zW3N0YXR1c10gfHwgc3RhdHVzO1xyXG5cclxuICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxDYXJkIGtleT17aWR9PlxyXG4gICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogSGVhZGVyID09PSAqL31cclxuICAgICAgICAgICAgICB7Lyog4pyFIOC4quC5iOC4p+C4meC4guC4reC4h+C4o+C4ueC4m+C5hOC4reC4hOC4reC4meC4luC4ueC4geC4peC4muC4reC4reC4geC5hOC4m+C5geC4peC5ieC4pyAqL31cclxuICAgICAgICAgICAgICA8Qm94PlxyXG4gICAgICAgICAgICAgICAgPEgyIG09ezB9IGZvbnRTaXplPVwieGxcIj7guKLguLnguJnguLTguJXguYDguKXguILguJfguLXguYg6IHt1bml0TnVtYmVyfTwvSDI+XHJcbiAgICAgICAgICAgICAgICA8Qm94IGNvbG9yPVwiZ3JleTgwXCIgbXQ9XCJ4c1wiPjxzdHJvbmc+4LmC4LiE4Lij4LiH4LiB4Liy4LijOjwvc3Ryb25nPiB7cHJvcGVydHlOYW1lfTwvQm94PlxyXG4gICAgICAgICAgICAgIDwvQm94PlxyXG5cclxuICAgICAgICAgICAgICB7LyogPT09IFNlY3Rpb246IEZvb3RlciA9PT0gKi99XHJcbiAgICAgICAgICAgICAgPEJveFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyVG9wPVwiMXB4IHNvbGlkXCJcclxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yPVwiZ3JleTIwXCJcclxuICAgICAgICAgICAgICAgIG10PVwieGxcIiBwdD1cImxnXCJcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk9XCJmbGV4XCJcclxuICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50PVwic3BhY2UtYmV0d2VlblwiXHJcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8Qm94PlxyXG4gICAgICAgICAgICAgICAgICA8Qm94XHJcbiAgICAgICAgICAgICAgICAgICAgYXM9XCJzcGFuXCIgcHg9XCJtZFwiIHB5PVwic21cIlxyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1cz1cImxnXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kQ29sb3I6IHN0eWxlLmJnLCBjb2xvcjogc3R5bGUuY29sb3IsIGZvbnRXZWlnaHQ6IFwiYm9sZFwiLCBmb250U2l6ZTogXCIwLjlyZW1cIiB9fVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAge3N0YXR1c1RleHR9XHJcbiAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICB7LyogPEJveCBkaXNwbGF5PVwiZmxleFwiIGdhcD1cIm1kXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YC9hZG1pbi9yZXNvdXJjZXMvUHJvcGVydHlVbml0L3JlY29yZHMvJHtpZH0vc2hvd2B9IHZhcmlhbnQ9XCJwcmltYXJ5XCI+4LiU4Li5PC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICA8L0JveD4gKi99XHJcbiAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgIDwvQ2FyZD5cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSl9XHJcbiAgICAgIDwvQm94PlxyXG4gICAgPC9Cb3g+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb3BlcnR5VW5pdENhcmRMaXN0OyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlY29yZHMgfSBmcm9tICdhZG1pbmpzJztcclxuaW1wb3J0IHsgQm94LCBIMiwgSDUsIExvYWRlciwgUGxhY2Vob2xkZXIsIEJhZGdlLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XHJcblxyXG4vLyBIZWxwZXIgRnVuY3Rpb25zXHJcbmNvbnN0IGlzRW1wdHlWYWx1ZSA9ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCB8fCBTdHJpbmcodikudHJpbSgpID09PSBcIlwiO1xyXG5jb25zdCBkaXNwbGF5VmFsdWUgPSAodiwgZmFsbGJhY2sgPSBcIuC4p+C5iOC4suC4h1wiKSA9PiAoaXNFbXB0eVZhbHVlKHYpID8gZmFsbGJhY2sgOiB2KTtcclxuXHJcbmNvbnN0IENhcmQgPSAoeyBjaGlsZHJlbiB9KSA9PiAoXHJcbiAgPEJveFxyXG4gICAgdmFyaWFudD1cIndoaXRlXCJcclxuICAgIGJveFNoYWRvdz1cImNhcmRcIlxyXG4gICAgYm9yZGVyUmFkaXVzPVwieGxcIlxyXG4gICAgcD1cInhsXCJcclxuICAgIG1iPVwiMnhsXCJcclxuICAgIHN0eWxlPXt7IHRyYW5zaXRpb246IFwiYm94LXNoYWRvdyAwLjJzIGVhc2UsIHRyYW5zZm9ybSAwLjJzIGVhc2VcIiB9fVxyXG4gICAgX2hvdmVyPXt7IGJveFNoYWRvdzogXCIwIDRweCAyMHB4IHJnYmEoMCwwLDAsMC4wOClcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoLTJweClcIiB9fVxyXG4gID5cclxuICAgIHtjaGlsZHJlbn1cclxuICA8L0JveD5cclxuKTtcclxuXHJcbmNvbnN0IERlcG9zaXRDYXJkTGlzdCA9ICgpID0+IHtcclxuICBjb25zdCB7IHJlY29yZHMsIGxvYWRpbmcsIGVycm9yIH0gPSB1c2VSZWNvcmRzKFwiRGVwb3NpdFwiKTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxMb2FkZXIgLz48L0JveD47XHJcbiAgaWYgKGVycm9yKSByZXR1cm4gPEJveCBwPVwibGdcIj48UGxhY2Vob2xkZXI+PEg1PuC5gOC4geC4tOC4lOC4guC5ieC4reC4nOC4tOC4lOC4nuC4peC4suC4lDwvSDU+PHA+4LmE4Lih4LmI4Liq4Liy4Lih4Liy4Lij4LiW4LiU4Li24LiH4LiC4LmJ4Lit4Lih4Li54Lil4LmA4LiH4Li04LiZ4Lih4Lix4LiU4LiI4Liz4LmE4LiU4LmJPC9wPjwvUGxhY2Vob2xkZXI+PC9Cb3g+O1xyXG4gIGlmICghcmVjb3JkcyB8fCByZWNvcmRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDxCb3ggcD1cImxnXCI+PFBsYWNlaG9sZGVyPjxINT7guYTguKHguYjguKHguLXguILguYnguK3guKHguLnguKXguYDguIfguLTguJnguKHguLHguJTguIjguLM8L0g1PjxwPuC5hOC4oeC5iOC4nuC4muC4guC5ieC4reC4oeC4ueC4peC4l+C4teC5iOC4leC4o+C4h+C4geC4seC4muC5gOC4h+C4t+C5iOC4reC4meC5hOC4gjwvcD48L1BsYWNlaG9sZGVyPjwvQm94PjtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxCb3ggcD1cIjJ4bFwiPlxyXG4gICAgICA8Qm94XHJcbiAgICAgICAgZGlzcGxheT1cImdyaWRcIlxyXG4gICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM9e1snMWZyJywgJ3JlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgzNDBweCwgMWZyKSknXX1cclxuICAgICAgICBzdHlsZT17eyBnYXA6IFwiMjBweFwiIH19IFxyXG4gICAgICA+XHJcbiAgICAgICAge3JlY29yZHMubWFwKChyKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBwYXJhbXMgPSByLnBhcmFtcyA/PyB7fTtcclxuICAgICAgICAgIGNvbnN0IHVzZXJQYXJhbXMgPSByLnBvcHVsYXRlZD8uVXNlcj8ucGFyYW1zID8/IHt9O1xyXG4gICAgICAgICAgY29uc3QgcG9zdFBhcmFtcyA9IHIucG9wdWxhdGVkPy5Qb3N0Py5wYXJhbXMgPz8ge307XHJcbiAgICAgICAgICBjb25zdCB1bml0UGFyYW1zID0gci5wb3B1bGF0ZWQ/LlVuaXQ/LnBhcmFtcyA/PyB7fTtcclxuICAgICAgICAgIGNvbnN0IGlkID0gci5pZCA/PyBwYXJhbXMuaWQ7XHJcblxyXG4gICAgICAgICAgY29uc3QgdXNlck5hbWUgPSBgJHtkaXNwbGF5VmFsdWUodXNlclBhcmFtcy5GaXJzdF9uYW1lLCAnJyl9ICR7ZGlzcGxheVZhbHVlKHVzZXJQYXJhbXMuTGFzdF9uYW1lLCAnJyl9YC50cmltKCkgfHwgXCLguYTguKHguYjguKHguLXguIrguLfguYjguK1cIjtcclxuICAgICAgICAgIGNvbnN0IGRlcG9zaXRBbW91bnQgPSBwYXJhbXMuRGVwb3NpdF9BbW91bnQgIT0gbnVsbCA/IGAke051bWJlcihwYXJhbXMuRGVwb3NpdF9BbW91bnQpLnRvTG9jYWxlU3RyaW5nKCl9IOC4muC4suC4l2AgOiBcIk4vQVwiO1xyXG4gICAgICAgICAgY29uc3QgcHJvcGVydHlOYW1lID0gZGlzcGxheVZhbHVlKHBvc3RQYXJhbXMuUHJvcGVydHlfTmFtZSwgJ04vQScpO1xyXG4gICAgICAgICAgY29uc3QgdW5pdE51bWJlciA9IGRpc3BsYXlWYWx1ZSh1bml0UGFyYW1zLlVuaXRfTnVtYmVyLCAnTi9BJyk7XHJcbiAgICAgICAgICBjb25zdCBzdGF0dXMgPSBkaXNwbGF5VmFsdWUocGFyYW1zLkRlcG9zaXRfU3RhdHVzLCAnVU5LTk9XTicpO1xyXG4gICAgICAgICAgY29uc3QgY3JlYXRlZEF0ID0gcGFyYW1zLmNyZWF0ZWRBdCA/IG5ldyBEYXRlKHBhcmFtcy5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInRoLVRIXCIsIHsgeWVhcjogJ251bWVyaWMnLCBtb250aDogJ3Nob3J0JywgZGF5OiAnbnVtZXJpYyd9KSA6ICdOL0EnO1xyXG5cclxuICAgICAgICAgIGNvbnN0IGJhZGdlU3R5bGVzID0ge1xyXG4gICAgICAgICAgICBQRU5ESU5HOiB7IGJnOiBcIiNmZmZiZTZcIiwgY29sb3I6IFwiI2ZhYWQxNFwiIH0sXHJcbiAgICAgICAgICAgIENPTkZJUk1FRDogeyBiZzogXCIjZjZmZmVkXCIsIGNvbG9yOiBcIiM1MmM0MWFcIiB9LFxyXG4gICAgICAgICAgICBSRUpFQ1RFRDogeyBiZzogXCIjZmZmMWYwXCIsIGNvbG9yOiBcIiNmNTIyMmRcIiB9LFxyXG4gICAgICAgICAgICBkZWZhdWx0OiB7IGJnOiBcIiNmMmYyZjJcIiwgY29sb3I6IFwiIzU1NVwiIH0sXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgY29uc3Qgc3RhdHVzVHJhbnNsYXRpb25zID0ge1xyXG4gICAgICAgICAgICBQRU5ESU5HOiAn4Lij4Lit4LiU4Liz4LmA4LiZ4Li04LiZ4LiB4Liy4LijJyxcclxuICAgICAgICAgICAgQ09ORklSTUVEOiAn4Lii4Li34LiZ4Lii4Lix4LiZ4LmB4Lil4LmJ4LinJyxcclxuICAgICAgICAgICAgUkVKRUNURUQ6ICfguJbguLnguIHguJvguI/guLTguYDguKrguJgnLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIFxyXG4gICAgICAgICAgY29uc3Qgc3R5bGUgPSBiYWRnZVN0eWxlc1tzdGF0dXNdIHx8IGJhZGdlU3R5bGVzLmRlZmF1bHQ7XHJcbiAgICAgICAgICBjb25zdCBzdGF0dXNUZXh0ID0gc3RhdHVzVHJhbnNsYXRpb25zW3N0YXR1c10gfHwgc3RhdHVzO1xyXG5cclxuICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxDYXJkIGtleT17aWR9PlxyXG4gICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogSGVhZGVyID09PSAqL31cclxuICAgICAgICAgICAgICB7Lyog4pyFIOC4quC5iOC4p+C4meC4guC4reC4h+C4o+C4ueC4m+C5hOC4reC4hOC4reC4meC4luC4ueC4geC4peC4muC4reC4reC4geC5hOC4m+C5geC4peC5ieC4pyAqL31cclxuICAgICAgICAgICAgICA8Qm94PlxyXG4gICAgICAgICAgICAgICAgPEgyIG09ezB9IGZvbnRTaXplPVwieGxcIj57ZGVwb3NpdEFtb3VudH08L0gyPlxyXG4gICAgICAgICAgICAgICAgPFRleHQgY29sb3I9XCJncmV5ODBcIiBtdD1cInhzXCI+PHN0cm9uZz7guJzguLnguYnguJfguLPguKPguLLguKLguIHguLLguKM6PC9zdHJvbmc+IHt1c2VyTmFtZX08L1RleHQ+XHJcbiAgICAgICAgICAgICAgICA8VGV4dCBjb2xvcj1cImdyZXk4MFwiPjxzdHJvbmc+4LmC4LiE4Lij4LiH4LiB4Liy4LijOjwvc3Ryb25nPiB7cHJvcGVydHlOYW1lfSAo4Lii4Li54LiZ4Li04LiVOiB7dW5pdE51bWJlcn0pPC9UZXh0PlxyXG4gICAgICAgICAgICAgIDwvQm94PlxyXG5cclxuICAgICAgICAgICAgICB7LyogPT09IFNlY3Rpb246IEZvb3RlciA9PT0gKi99XHJcbiAgICAgICAgICAgICAgPEJveFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyVG9wPVwiMXB4IHNvbGlkXCJcclxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yPVwiZ3JleTIwXCJcclxuICAgICAgICAgICAgICAgIG10PVwieGxcIiBwdD1cImxnXCJcclxuICAgICAgICAgICAgICAgIGRpc3BsYXk9XCJmbGV4XCJcclxuICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50PVwic3BhY2UtYmV0d2VlblwiXHJcbiAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8Qm94PlxyXG4gICAgICAgICAgICAgICAgICA8Qm94XHJcbiAgICAgICAgICAgICAgICAgICAgYXM9XCJzcGFuXCIgcHg9XCJtZFwiIHB5PVwic21cIlxyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1cz1cImxnXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kQ29sb3I6IHN0eWxlLmJnLCBjb2xvcjogc3R5bGUuY29sb3IsIGZvbnRXZWlnaHQ6IFwiYm9sZFwiLCBmb250U2l6ZTogXCIwLjlyZW1cIiB9fVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAge3N0YXR1c1RleHR9XHJcbiAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgICA8Qm94IGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyZXk2MFwiIG10PVwic21cIj5cclxuICAgICAgICAgICAgICAgICAgICDguJfguLPguKPguLLguKLguIHguLLguKPguYDguKHguLfguYjguK06IHtjcmVhdGVkQXR9XHJcbiAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgIDwvQ2FyZD5cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSl9XHJcbiAgICAgIDwvQm94PlxyXG4gICAgPC9Cb3g+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERlcG9zaXRDYXJkTGlzdDsiLCIvLyBzZXJ2ZXIvQWRtaW4vY29tcG9uZW50cy9UZXN0UGFnaW5hdGlvbi5qc3hcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVjb3JkcyB9IGZyb20gJ2FkbWluanMnO1xyXG5pbXBvcnQgeyBCb3gsIEg1LCBMb2FkZXIsIFBsYWNlaG9sZGVyLCBUZXh0LCBQYWdpbmF0aW9uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XHJcblxyXG5jb25zdCBUZXN0RGVwb3NpdENvbXBvbmVudCA9ICgpID0+IHtcclxuICBjb25zdCB7IHJlY29yZHMsIGxvYWRpbmcsIHBhZ2UsIHBlclBhZ2UsIHRvdGFsLCBoYW5kbGVDaGFuZ2VQYWdlIH0gPSB1c2VSZWNvcmRzKCdVc2VyJyk7XHJcblxyXG4gIGNvbnNvbGUubG9nKFwiVEVTVCBQQUdJTkFUSU9OIERBVEE6XCIsIHsgcGFnZSwgcGVyUGFnZSwgdG90YWwgfSk7XHJcblxyXG4gIGlmIChsb2FkaW5nKSByZXR1cm4gPExvYWRlciAvPjtcclxuICBpZiAoIXJlY29yZHMpIHJldHVybiA8UGxhY2Vob2xkZXI+PEg1Pk5vIHJlY29yZHM8L0g1PjwvUGxhY2Vob2xkZXI+O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPEJveCBwPVwibGdcIiB2YXJpYW50PVwid2hpdGVcIj5cclxuICAgICAgPEg1PlBhZ2luYXRpb24gVGVzdCBDb21wb25lbnQ8L0g1PlxyXG4gICAgICA8VGV4dD5Ub3RhbDoge3RvdGFsfSwgUGVyUGFnZToge3BlclBhZ2V9LCBDdXJyZW50IFBhZ2U6IHtwYWdlfTwvVGV4dD5cclxuICAgICAgPHVsPlxyXG4gICAgICAgIHtyZWNvcmRzLm1hcChyID0+IDxsaSBrZXk9e3IuaWR9PlVzZXIgSUQ6IHtyLmlkfTwvbGk+KX1cclxuICAgICAgPC91bD5cclxuICAgICAgPFBhZ2luYXRpb24gcGFnZT17cGFnZX0gcGVyUGFnZT17cGVyUGFnZX0gdG90YWw9e3RvdGFsfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlUGFnZX0gLz5cclxuICAgIDwvQm94PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBUZXN0RGVwb3NpdENvbXBvbmVudDsiLCIvLyBzZXJ2ZXIvQWRtaW4vY29tcG9uZW50cy9Vc2VyQ2FyZExpc3QuanN4XHJcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlY29yZHMgfSBmcm9tICdhZG1pbmpzJztcclxuaW1wb3J0IHsgQm94LCBIMiwgTG9hZGVyLCBQbGFjZWhvbGRlciwgSDUsIEJ1dHRvbiB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xyXG5cclxuLy8gSGVscGVyIEZ1bmN0aW9uc1xyXG5jb25zdCBpc0VtcHR5VmFsdWUgPSAodikgPT4gdiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQgfHwgU3RyaW5nKHYpLnRyaW0oKSA9PT0gXCJcIjtcclxuY29uc3QgZGlzcGxheVZhbHVlID0gKHYpID0+IChpc0VtcHR5VmFsdWUodikgPyBcIk4vQVwiIDogdik7XHJcblxyXG5jb25zdCBDYXJkID0gKHsgY2hpbGRyZW4gfSkgPT4gKFxyXG4gIDxCb3hcclxuICAgIHZhcmlhbnQ9XCJ3aGl0ZVwiXHJcbiAgICBib3hTaGFkb3c9XCJjYXJkXCJcclxuICAgIGJvcmRlclJhZGl1cz1cInhsXCJcclxuICAgIHA9XCJ4bFwiXHJcbiAgICBtYj1cInhsXCJcclxuICAgIF9ob3Zlcj17eyBib3hTaGFkb3c6IFwiMCAwIDEwcHggcmdiYSgwLDAsMCwwLjEpXCIgfX1cclxuICA+XHJcbiAgICB7Y2hpbGRyZW59XHJcbiAgPC9Cb3g+XHJcbik7XHJcblxyXG5jb25zdCBVc2VyQ2FyZExpc3QgPSAoKSA9PiB7XHJcbiAgY29uc3QgeyByZWNvcmRzLCBsb2FkaW5nLCBlcnJvciB9ID0gdXNlUmVjb3JkcygnVXNlcicpO1xyXG5cclxuICBpZiAobG9hZGluZykge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPEJveCBwPVwibGdcIj5cclxuICAgICAgICA8TG9hZGVyIC8+XHJcbiAgICAgIDwvQm94PlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGlmIChlcnJvcikge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPEJveCBwPVwibGdcIj5cclxuICAgICAgICA8UGxhY2Vob2xkZXI+XHJcbiAgICAgICAgICA8SDU+4LmA4LiB4Li04LiU4LiC4LmJ4Lit4Lic4Li04LiU4Lie4Lil4Liy4LiUPC9INT5cclxuICAgICAgICAgIDxwPuC5hOC4oeC5iOC4quC4suC4oeC4suC4o+C4luC4lOC4tuC4h+C4guC5ieC4reC4oeC4ueC4peC4nOC4ueC5ieC5g+C4iuC5ieC4h+C4suC4meC5hOC4lOC5iTwvcD5cclxuICAgICAgICA8L1BsYWNlaG9sZGVyPlxyXG4gICAgICA8L0JveD5cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBpZiAoIXJlY29yZHMgfHwgcmVjb3Jkcy5sZW5ndGggPT09IDApIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxCb3ggcD1cImxnXCI+XHJcbiAgICAgICAgPFBsYWNlaG9sZGVyPlxyXG4gICAgICAgICAgPEg1PuC5hOC4oeC5iOC4oeC4teC4nOC4ueC5ieC5g+C4iuC5ieC4h+C4suC4mTwvSDU+XHJcbiAgICAgICAgICA8cD7guYTguKHguYjguJ7guJrguJzguLnguYnguYPguIrguYnguIfguLLguJnguJfguLXguYjguJXguKPguIfguIHguLHguJrguYDguIfguLfguYjguK3guJnguYTguILguIHguLLguKPguIHguKPguK3guIfguILguK3guIfguITguLjguJM8L3A+XHJcbiAgICAgICAgPC9QbGFjZWhvbGRlcj5cclxuICAgICAgPC9Cb3g+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxCb3ggcD1cInhsXCI+XHJcbiAgICAgIDxCb3hcclxuICAgICAgICBkaXNwbGF5PVwiZ3JpZFwiXHJcbiAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1ucz17WycxZnInLCAncmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDM0MHB4LCAxZnIpKSddfVxyXG4gICAgICAgIGdhcD1cInhsXCJcclxuICAgICAgPlxyXG4gICAgICAgIHtyZWNvcmRzLm1hcCgocikgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcGFyYW1zID0gci5wYXJhbXMgPz8ge307XHJcbiAgICAgICAgICBjb25zdCBpZCA9IHIuaWQgPz8gcGFyYW1zLmlkO1xyXG5cclxuICAgICAgICAgIGNvbnN0IGZ1bGxOYW1lID0gYCR7ZGlzcGxheVZhbHVlKHBhcmFtcy5GaXJzdF9uYW1lKX0gJHtkaXNwbGF5VmFsdWUocGFyYW1zLkxhc3RfbmFtZSl9YDtcclxuICAgICAgICAgIGNvbnN0IGVtYWlsID0gZGlzcGxheVZhbHVlKHBhcmFtcy5FbWFpbCk7XHJcbiAgICAgICAgICBjb25zdCBwaG9uZSA9IGRpc3BsYXlWYWx1ZShwYXJhbXMuUGhvbmUpO1xyXG4gICAgICAgICAgY29uc3QgdXNlclR5cGUgPSBkaXNwbGF5VmFsdWUocGFyYW1zLnVzZXJUeXBlKTtcclxuICAgICAgICAgIGNvbnN0IGltYWdlVXJsID0gcGFyYW1zLmltYWdlIHx8IG51bGw7XHJcbiAgICAgICAgICBjb25zdCBjcmVhdGVkQXQgPSBuZXcgRGF0ZShwYXJhbXMuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoXCJ0aC1USFwiLCB7XHJcbiAgICAgICAgICAgIHllYXI6ICdudW1lcmljJyxcclxuICAgICAgICAgICAgbW9udGg6ICdzaG9ydCcsXHJcbiAgICAgICAgICAgIGRheTogJ251bWVyaWMnXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvLyDinIUg4LmA4Lie4Li04LmI4Lih4Liq4Li14LiV4Liy4Lih4Lib4Lij4Liw4LmA4Lig4LiXXHJcbiAgICAgICAgICBjb25zdCBiYWRnZVN0eWxlcyA9IHtcclxuICAgICAgICAgICAgQWRtaW46IHtcclxuICAgICAgICAgICAgICBiZzogXCIjZTZmMGZmXCIsIC8vIOC4n+C5ieC4suC4reC5iOC4reC4mVxyXG4gICAgICAgICAgICAgIGNvbG9yOiBcIiMwMDQ3YWJcIiwgLy8g4LiZ4LmJ4Liz4LmA4LiH4Li04LiZ4LmA4LiC4LmJ4LihXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFNlbGxlcjoge1xyXG4gICAgICAgICAgICAgIGJnOiBcIiNlYWZmZWFcIiwgLy8g4LmA4LiC4Li14Lii4Lin4Lit4LmI4Lit4LiZXHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiIzAwODAwMFwiLCAvLyDguYDguILguLXguKLguKfguYDguILguYnguKFcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgQnV5ZXI6IHtcclxuICAgICAgICAgICAgICBiZzogXCIjZWFmZmVhXCIsIC8vIOC5gOC4guC4teC4ouC4p+C4reC5iOC4reC4mVxyXG4gICAgICAgICAgICAgIGNvbG9yOiBcIiMwMDgwMDBcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgICAgICAgIGJnOiBcIiNmMmYyZjJcIixcclxuICAgICAgICAgICAgICBjb2xvcjogXCIjNTU1XCIsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIGNvbnN0IHN0eWxlID0gYmFkZ2VTdHlsZXNbdXNlclR5cGVdIHx8IGJhZGdlU3R5bGVzLmRlZmF1bHQ7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPENhcmQga2V5PXtpZH0+XHJcbiAgICAgICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBncmlkR2FwPVwibGdcIj5cclxuICAgICAgICAgICAgICAgIDxCb3hcclxuICAgICAgICAgICAgICAgICAgd2lkdGg9ezgwfVxyXG4gICAgICAgICAgICAgICAgICBoZWlnaHQ9ezgwfVxyXG4gICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM9XCI1MCVcIlxyXG4gICAgICAgICAgICAgICAgICBvdmVyZmxvdz1cImhpZGRlblwiXHJcbiAgICAgICAgICAgICAgICAgIGJnPVwiZ3JleTIwXCJcclxuICAgICAgICAgICAgICAgICAgZmxleFNocmluaz17MH1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAge2ltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICAgICAgICAgIHNyYz17aW1hZ2VVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICBhbHQ9XCJwcm9maWxlXCJcclxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjEwMCVcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0Rml0OiBcImNvdmVyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICB9fVxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICkgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPEJveFxyXG4gICAgICAgICAgICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcclxuICAgICAgICAgICAgICAgICAgICAgIGhlaWdodD1cIjEwMCVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgZGlzcGxheT1cImZsZXhcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcj1cImdyZXk2MFwiXHJcbiAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgTm8gSW1nXHJcbiAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgIDxCb3g+XHJcbiAgICAgICAgICAgICAgICAgIDxIMiBtPXswfSBmb250U2l6ZT1cInhsXCI+e2Z1bGxOYW1lfTwvSDI+XHJcbiAgICAgICAgICAgICAgICAgIDxCb3ggY29sb3I9XCJncmV5ODBcIiBtdD1cInhzXCI+e2VtYWlsfTwvQm94PlxyXG4gICAgICAgICAgICAgICAgICA8Qm94IGNvbG9yPVwiZ3JleTgwXCI+e3Bob25lfTwvQm94PlxyXG4gICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgPC9Cb3g+XHJcblxyXG4gICAgICAgICAgICAgIDxCb3hcclxuICAgICAgICAgICAgICAgIGJvcmRlclRvcD1cIjFweCBzb2xpZFwiXHJcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcj1cImdyZXkyMFwiXHJcbiAgICAgICAgICAgICAgICBtdD1cImxnXCJcclxuICAgICAgICAgICAgICAgIHB0PVwibGdcIlxyXG4gICAgICAgICAgICAgICAgZGlzcGxheT1cImZsZXhcIlxyXG4gICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ9XCJzcGFjZS1iZXR3ZWVuXCJcclxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxCb3g+XHJcbiAgICAgICAgICAgICAgICAgIDxCb3hcclxuICAgICAgICAgICAgICAgICAgICBhcz1cInNwYW5cIlxyXG4gICAgICAgICAgICAgICAgICAgIHB4PVwibWRcIlxyXG4gICAgICAgICAgICAgICAgICAgIHB5PVwic21cIlxyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1cz1cImxnXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBzdHlsZS5iZyxcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBzdHlsZS5jb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6IFwiYm9sZFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IFwiMC44NXJlbVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiBcIjAgMCA0cHggcmdiYSgwLDAsMCwwLjA1KVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICB7dXNlclR5cGV9XHJcbiAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgICA8Qm94IGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyZXk2MFwiIG10PVwic21cIj5cclxuICAgICAgICAgICAgICAgICAgICDguYDguJvguYfguJnguKrguKHguLLguIrguLTguIHguYDguKHguLfguYjguK06IHtjcmVhdGVkQXR9XHJcbiAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgZ3JpZEdhcD1cIm1kXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YC9hZG1pbi9yZXNvdXJjZXMvVXNlci9yZWNvcmRzLyR7aWR9L3Nob3dgfSB2YXJpYW50PVwicHJpbWFyeVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIOC4lOC4uVxyXG4gICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBhcz1cImFcIiBocmVmPXtgL2FkbWluL3Jlc291cmNlcy9Vc2VyL3JlY29yZHMvJHtpZH0vZWRpdGB9PlxyXG4gICAgICAgICAgICAgICAgICAgIOC5geC4geC5ieC5hOC4glxyXG4gICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICA8L0NhcmQ+XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pfVxyXG4gICAgICA8L0JveD5cclxuICAgIDwvQm94PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBVc2VyQ2FyZExpc3Q7XHJcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlY29yZHMgfSBmcm9tICdhZG1pbmpzJztcclxuaW1wb3J0IHsgQm94LCBIMiwgSDUsIExvYWRlciwgUGxhY2Vob2xkZXIsIEJ1dHRvbiB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xyXG5cclxuLy8gSGVscGVyIEZ1bmN0aW9uc1xyXG5jb25zdCBpc0VtcHR5VmFsdWUgPSAodikgPT4gdiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQgfHwgU3RyaW5nKHYpLnRyaW0oKSA9PT0gXCJcIjtcclxuY29uc3QgZGlzcGxheVZhbHVlID0gKHYsIGZhbGxiYWNrID0gXCLguKfguYjguLLguIdcIikgPT4gKGlzRW1wdHlWYWx1ZSh2KSA/IGZhbGxiYWNrIDogdik7XHJcbmNvbnN0IHRydW5jYXRlID0gKHRleHQsIG4gPSAzNSkgPT4gdGV4dCAmJiB0ZXh0Lmxlbmd0aCA+IG4gPyB0ZXh0LnNsaWNlKDAsIG4gLSAxKSArICfigKYnIDogdGV4dDtcclxuXHJcbmNvbnN0IENhcmQgPSAoeyBjaGlsZHJlbiB9KSA9PiAoXHJcbiAgICA8Qm94XHJcbiAgICAgICAgdmFyaWFudD1cIndoaXRlXCJcclxuICAgICAgICBib3hTaGFkb3c9XCJjYXJkXCJcclxuICAgICAgICBib3JkZXJSYWRpdXM9XCJ4bFwiXHJcbiAgICAgICAgcD1cInhsXCJcclxuICAgICAgICBtYj1cIjJ4bFwiXHJcbiAgICAgICAgc3R5bGU9e3sgdHJhbnNpdGlvbjogXCJib3gtc2hhZG93IDAuMnMgZWFzZSwgdHJhbnNmb3JtIDAuMnMgZWFzZVwiIH19XHJcbiAgICAgICAgX2hvdmVyPXt7IGJveFNoYWRvdzogXCIwIDRweCAyMHB4IHJnYmEoMCwwLDAsMC4wOClcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoLTJweClcIiB9fVxyXG4gICAgPlxyXG4gICAgICAgIHtjaGlsZHJlbn1cclxuICAgIDwvQm94PlxyXG4pO1xyXG5cclxuY29uc3QgRG9jdW1lbnRDYXJkTGlzdCA9ICgpID0+IHtcclxuICAgIGNvbnN0IHsgcmVjb3JkcywgbG9hZGluZywgZXJyb3IgfSA9IHVzZVJlY29yZHMoJ0RvY3VtZW50VXBsb2FkJyk7XHJcblxyXG4gICAgaWYgKGxvYWRpbmcpIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxMb2FkZXIgLz48L0JveD47XHJcbiAgICBpZiAoZXJyb3IpIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxQbGFjZWhvbGRlcj48SDU+4LmA4LiB4Li04LiU4LiC4LmJ4Lit4Lic4Li04LiU4Lie4Lil4Liy4LiUPC9INT48cD7guYTguKHguYjguKrguLLguKHguLLguKPguJbguJTguLbguIfguILguYnguK3guKHguLnguKXguYDguK3guIHguKrguLLguKPguYTguJTguYk8L3A+PC9QbGFjZWhvbGRlcj48L0JveD47XHJcbiAgICBpZiAoIXJlY29yZHMgfHwgcmVjb3Jkcy5sZW5ndGggPT09IDApIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxQbGFjZWhvbGRlcj48SDU+4LmE4Lih4LmI4Lih4Li14LmA4Lit4LiB4Liq4Liy4LijPC9INT48cD7guYTguKHguYjguJ7guJrguILguYnguK3guKHguLnguKXguYDguK3guIHguKrguLLguKPguJfguLXguYjguJXguKPguIfguIHguLHguJrguYDguIfguLfguYjguK3guJnguYTguII8L3A+PC9QbGFjZWhvbGRlcj48L0JveD47XHJcblxyXG4gICAgcmV0dXJuIChcclxuICAgICAgICA8Qm94IHA9XCIyeGxcIj5cclxuICAgICAgICAgICAgPEJveFxyXG4gICAgICAgICAgICAgICAgZGlzcGxheT1cImdyaWRcIlxyXG4gICAgICAgICAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1ucz17WycxZnInLCAncmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDM0MHB4LCAxZnIpKSddfVxyXG4gICAgICAgICAgICAgICAgc3R5bGU9e3sgZ2FwOiBcIjIwcHhcIiB9fVxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICB7cmVjb3Jkcy5tYXAoKHIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJhbXMgPSByLnBhcmFtcyA/PyB7fTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyUGFyYW1zID0gci5wb3B1bGF0ZWQ/LlVzZXI/LnBhcmFtcyA/PyB7fTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHIuaWQgPz8gcGFyYW1zLmlkO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkb2N1bWVudE5hbWUgPSBkaXNwbGF5VmFsdWUocGFyYW1zLkRvY3VtZW50TmFtZSwgJ+C5hOC4oeC5iOC4oeC4teC4iuC4t+C5iOC4reC5gOC4reC4geC4quC4suC4oycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvY3VtZW50VXJsID0gcGFyYW1zLkRvY3VtZW50VXJsO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IGRpc3BsYXlWYWx1ZShwYXJhbXMuUmV2aWV3X1N0YXR1cyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlck5hbWUgPSBgJHtkaXNwbGF5VmFsdWUodXNlclBhcmFtcy5GaXJzdF9uYW1lLCAnJyl9ICR7ZGlzcGxheVZhbHVlKHVzZXJQYXJhbXMuTGFzdF9uYW1lLCAnJyl9YC50cmltKCkgfHwgXCLguYTguKHguYjguKHguLXguILguYnguK3guKHguLnguKVcIjtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjcmVhdGVkQXQgPSBwYXJhbXMuY3JlYXRlZEF0ID8gbmV3IERhdGUocGFyYW1zLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwidGgtVEhcIiwgeyB5ZWFyOiAnbnVtZXJpYycsIG1vbnRoOiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJyB9KSA6ICdOL0EnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBiYWRnZVN0eWxlcyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUEVORElORzogeyBiZzogXCIjZmZmYmU2XCIsIGNvbG9yOiBcIiNmYWFkMTRcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBBUFBST1ZFRDogeyBiZzogXCIjZjZmZmVkXCIsIGNvbG9yOiBcIiM1MmM0MWFcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRUpFQ1RFRDogeyBiZzogXCIjZmZmMWYwXCIsIGNvbG9yOiBcIiNmNTIyMmRcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBISURERU46IHsgYmc6IFwiI2YyZjJmMlwiLCBjb2xvcjogXCIjNTU1XCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDogeyBiZzogXCIjZjJmMmYyXCIsIGNvbG9yOiBcIiM1NTVcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBiYWRnZVN0eWxlc1tzdGF0dXNdIHx8IGJhZGdlU3R5bGVzLmRlZmF1bHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1c1RyYW5zbGF0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgUEVORElORzogJ+C4o+C4reC4leC4o+C4p+C4iOC4quC4reC4micsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQUFJPVkVEOiAn4Lit4LiZ4Li44Lih4Lix4LiV4Li04LmB4Lil4LmJ4LinJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUkVKRUNURUQ6ICfguJbguLnguIHguJvguI/guLTguYDguKrguJgnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBISURERU46IFwi4Liq4Liz4LmA4Lij4LmH4LiIXCJcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1c1RleHQgPSBzdGF0dXNUcmFuc2xhdGlvbnNbc3RhdHVzXSB8fCBzdGF0dXM7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDYXJkIGtleT17aWR9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBIZWFkZXIgPT09ICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIOKchSDguKrguYjguKfguJnguILguK3guIfguKPguLnguJvguYTguK3guITguK3guJnguJbguLnguIHguKXguJrguK3guK3guIHguYTguJvguYHguKXguYnguKcgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxIMiBtPXswfSBmb250U2l6ZT1cImxcIiB0aXRsZT17ZG9jdW1lbnROYW1lfT57dHJ1bmNhdGUoZG9jdW1lbnROYW1lKX08L0gyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3ggY29sb3I9XCJncmV5ODBcIiBtdD1cInhzXCI+PHN0cm9uZz7guJzguLnguYnguK3guLHguJvguYLguKvguKXguJQ6PC9zdHJvbmc+IHt1c2VyTmFtZX08L0JveD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogRm9vdGVyID09PSAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3hcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJUb3A9XCIxcHggc29saWRcIiBib3JkZXJDb2xvcj1cImdyZXkyMFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbXQ9XCJ4bFwiIHB0PVwibGdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk9XCJmbGV4XCIganVzdGlmeUNvbnRlbnQ9XCJzcGFjZS1iZXR3ZWVuXCIgYWxpZ25JdGVtcz1cImNlbnRlclwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXM9XCJzcGFuXCIgcHg9XCJtZFwiIHB5PVwic21cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzPVwibGdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiBzdHlsZS5iZywgY29sb3I6IHN0eWxlLmNvbG9yLCBmb250V2VpZ2h0OiBcImJvbGRcIiwgZm9udFNpemU6IFwiMC45cmVtXCIgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3N0YXR1c1RleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyZXk2MFwiIG10PVwic21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIOC4reC4seC4m+C5guC4q+C4peC4lOC5gOC4oeC4t+C5iOC4rToge2NyZWF0ZWRBdH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXM9XCJhXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY9e2RvY3VtZW50VXJsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJwcmltYXJ5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkPXshZG9jdW1lbnRVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIOC4lOC4ueC5hOC4n+C4peC5jFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0NhcmQ+XHJcbiAgICAgICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgICAgIH0pfVxyXG4gICAgICAgICAgICA8L0JveD5cclxuICAgICAgICA8L0JveD5cclxuICAgICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEb2N1bWVudENhcmRMaXN0OyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHVzZVJlY29yZHMgfSBmcm9tICdhZG1pbmpzJztcclxuaW1wb3J0IHsgQm94LCBIMiwgSDUsIExvYWRlciwgUGxhY2Vob2xkZXIsIEJ1dHRvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xyXG5cclxuLy8gSGVscGVyIEZ1bmN0aW9uc1xyXG5jb25zdCBpc0VtcHR5VmFsdWUgPSAodikgPT4gdiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQgfHwgU3RyaW5nKHYpLnRyaW0oKSA9PT0gXCJcIjtcclxuY29uc3QgZGlzcGxheVZhbHVlID0gKHYsIGZhbGxiYWNrID0gXCLguKfguYjguLLguIdcIikgPT4gKGlzRW1wdHlWYWx1ZSh2KSA/IGZhbGxiYWNrIDogdik7XHJcblxyXG5jb25zdCBDYXJkID0gKHsgY2hpbGRyZW4gfSkgPT4gKFxyXG4gIDxCb3hcclxuICAgIHZhcmlhbnQ9XCJ3aGl0ZVwiXHJcbiAgICBib3hTaGFkb3c9XCJjYXJkXCJcclxuICAgIGJvcmRlclJhZGl1cz1cInhsXCJcclxuICAgIHA9XCJ4bFwiXHJcbiAgICBtYj1cIjJ4bFwiXHJcbiAgICBzdHlsZT17eyB0cmFuc2l0aW9uOiBcImJveC1zaGFkb3cgMC4ycyBlYXNlLCB0cmFuc2Zvcm0gMC4ycyBlYXNlXCIgfX1cclxuICAgIF9ob3Zlcj17eyBib3hTaGFkb3c6IFwiMCA0cHggMjBweCByZ2JhKDAsMCwwLDAuMDgpXCIsIHRyYW5zZm9ybTogXCJ0cmFuc2xhdGVZKC0ycHgpXCIgfX1cclxuICA+XHJcbiAgICB7Y2hpbGRyZW59XHJcbiAgPC9Cb3g+XHJcbik7XHJcblxyXG5jb25zdCBQYXltZW50Q2FyZExpc3QgPSAoKSA9PiB7XHJcbiAgY29uc3QgeyByZWNvcmRzLCBsb2FkaW5nLCBlcnJvciB9ID0gdXNlUmVjb3JkcygnUGF5bWVudCcpO1xyXG5cclxuICBpZiAobG9hZGluZykgcmV0dXJuIDxCb3ggcD1cImxnXCI+PExvYWRlciAvPjwvQm94PjtcclxuICBpZiAoZXJyb3IpIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxQbGFjZWhvbGRlcj48SDU+4LmA4LiB4Li04LiU4LiC4LmJ4Lit4Lic4Li04LiU4Lie4Lil4Liy4LiUPC9INT48cD7guYTguKHguYjguKrguLLguKHguLLguKPguJbguJTguLbguIfguILguYnguK3guKHguLnguKXguIHguLLguKPguIrguLPguKPguLDguYDguIfguLTguJnguYTguJTguYk8L3A+PC9QbGFjZWhvbGRlcj48L0JveD47XHJcbiAgaWYgKCFyZWNvcmRzIHx8IHJlY29yZHMubGVuZ3RoID09PSAwKSByZXR1cm4gPEJveCBwPVwibGdcIj48UGxhY2Vob2xkZXI+PEg1PuC5hOC4oeC5iOC4oeC4teC4guC5ieC4reC4oeC4ueC4peC4geC4suC4o+C4iuC4s+C4o+C4sOC5gOC4h+C4tOC4mTwvSDU+PHA+4LmE4Lih4LmI4Lie4Lia4LiC4LmJ4Lit4Lih4Li54Lil4LiX4Li14LmI4LiV4Lij4LiH4LiB4Lix4Lia4LmA4LiH4Li34LmI4Lit4LiZ4LmE4LiCPC9wPjwvUGxhY2Vob2xkZXI+PC9Cb3g+O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPEJveCBwPVwiMnhsXCI+XHJcbiAgICAgIDxCb3hcclxuICAgICAgICBkaXNwbGF5PVwiZ3JpZFwiXHJcbiAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1ucz17WycxZnInLCAncmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDM0MHB4LCAxZnIpKSddfVxyXG4gICAgICAgIHN0eWxlPXt7IGdhcDogXCIyMHB4XCIgfX0gXHJcbiAgICAgID5cclxuICAgICAgICB7cmVjb3Jkcy5tYXAoKHIpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHIucGFyYW1zID8/IHt9O1xyXG4gICAgICAgICAgY29uc3QgdXNlclBhcmFtcyA9IHIucG9wdWxhdGVkPy5Vc2VyPy5wYXJhbXMgPz8ge307XHJcbiAgICAgICAgICBjb25zdCBwb3N0UGFyYW1zID0gci5wb3B1bGF0ZWQ/LlByb3BlcnR5UG9zdD8ucGFyYW1zID8/IHt9O1xyXG4gICAgICAgICAgY29uc3QgaWQgPSByLmlkID8/IHBhcmFtcy5pZDtcclxuXHJcbiAgICAgICAgICBjb25zdCBwYXltZW50QW1vdW50ID0gcGFyYW1zLlBheW1lbnRfQW1vdW50ICE9IG51bGwgPyBgJHtOdW1iZXIocGFyYW1zLlBheW1lbnRfQW1vdW50KS50b0xvY2FsZVN0cmluZygpfSDguJrguLLguJdgIDogXCJOL0FcIjtcclxuICAgICAgICAgIGNvbnN0IHBheW1lbnRTbGlwVXJsID0gcGFyYW1zLlBheW1lbnRfU2xpcDtcclxuICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IGRpc3BsYXlWYWx1ZShwYXJhbXMuU3RhdHVzKTtcclxuICAgICAgICAgIGNvbnN0IHVzZXJOYW1lID0gYCR7ZGlzcGxheVZhbHVlKHVzZXJQYXJhbXMuRmlyc3RfbmFtZSwgJycpfSAke2Rpc3BsYXlWYWx1ZSh1c2VyUGFyYW1zLkxhc3RfbmFtZSwgJycpfWAudHJpbSgpIHx8IFwi4LmE4Lih4LmI4Lih4Li14LiC4LmJ4Lit4Lih4Li54LilXCI7XHJcbiAgICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBkaXNwbGF5VmFsdWUocG9zdFBhcmFtcy5Qcm9wZXJ0eV9OYW1lLCAnTi9BJyk7XHJcbiAgICAgICAgICBjb25zdCBjcmVhdGVkQXQgPSBwYXJhbXMuY3JlYXRlZEF0ID8gbmV3IERhdGUocGFyYW1zLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwidGgtVEhcIiwgeyB5ZWFyOiAnbnVtZXJpYycsIG1vbnRoOiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJ30pIDogJ04vQSc7XHJcblxyXG4gICAgICAgICAgY29uc3QgYmFkZ2VTdHlsZXMgPSB7XHJcbiAgICAgICAgICAgIFBFTkRJTkc6IHsgYmc6IFwiI2ZmZmJlNlwiLCBjb2xvcjogXCIjZmFhZDE0XCIgfSxcclxuICAgICAgICAgICAgQ09ORklSTUVEOiB7IGJnOiBcIiNmNmZmZWRcIiwgY29sb3I6IFwiIzUyYzQxYVwiIH0sXHJcbiAgICAgICAgICAgIEZBSUxFRDogeyBiZzogXCIjZmZmMWYwXCIsIGNvbG9yOiBcIiNmNTIyMmRcIiB9LFxyXG4gICAgICAgICAgICBkZWZhdWx0OiB7IGJnOiBcIiNmMmYyZjJcIiwgY29sb3I6IFwiIzU1NVwiIH0sXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgY29uc3Qgc3R5bGUgPSBiYWRnZVN0eWxlc1tzdGF0dXNdIHx8IGJhZGdlU3R5bGVzLmRlZmF1bHQ7XHJcblxyXG4gICAgICAgICAgY29uc3Qgc3RhdHVzVHJhbnNsYXRpb25zID0ge1xyXG4gICAgICAgICAgICBQRU5ESU5HOiAn4Lij4Lit4LiV4Lij4Lin4LiI4Liq4Lit4LiaJyxcclxuICAgICAgICAgICAgQ09ORklSTUVEOiAn4Lii4Li34LiZ4Lii4Lix4LiZ4LmB4Lil4LmJ4LinJyxcclxuICAgICAgICAgICAgRkFJTEVEOiAn4Lil4LmJ4Lih4LmA4Lir4Lil4LinJyxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBjb25zdCBzdGF0dXNUZXh0ID0gc3RhdHVzVHJhbnNsYXRpb25zW3N0YXR1c10gfHwgc3RhdHVzO1xyXG5cclxuICAgICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxDYXJkIGtleT17aWR9PlxyXG4gICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogSGVhZGVyID09PSAqL31cclxuICAgICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIHN0eWxlPXt7IGdhcDogJzE2cHgnIH19PlxyXG4gICAgICAgICAgICAgICAgPEJveCBcclxuICAgICAgICAgICAgICAgICAgd2lkdGg9ezgwfSBoZWlnaHQ9ezgwfSBib3JkZXJSYWRpdXM9XCI1MCVcIiBcclxuICAgICAgICAgICAgICAgICAgYmc9XCJwcmltYXJ5MjBcIiBjb2xvcj1cInByaW1hcnkxMDBcIlxyXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiIGZsZXhTaHJpbms9ezB9XHJcbiAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgIDxUZXh0IGZvbnRTaXplPXsyNH0gZm9udFdlaWdodD1cImJvbGRcIj7guL88L1RleHQ+XHJcbiAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgIDxCb3g+XHJcbiAgICAgICAgICAgICAgICAgIDxIMiBtPXswfSBmb250U2l6ZT1cInhsXCI+e3BheW1lbnRBbW91bnR9PC9IMj5cclxuICAgICAgICAgICAgICAgICAgPFRleHQgY29sb3I9XCJncmV5ODBcIiBtdD1cInhzXCI+PHN0cm9uZz7guJzguLnguYnguIrguLPguKPguLA6PC9zdHJvbmc+IHt1c2VyTmFtZX08L1RleHQ+XHJcbiAgICAgICAgICAgICAgICAgIDxUZXh0IGNvbG9yPVwiZ3JleTgwXCI+PHN0cm9uZz7guKrguLPguKvguKPguLHguJrguYLguJ7guKrguJXguYw6PC9zdHJvbmc+IHtwcm9wZXJ0eU5hbWV9PC9UZXh0PlxyXG4gICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgPC9Cb3g+XHJcblxyXG4gICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogU2xpcCBCdXR0b24gPT09ICovfVxyXG4gICAgICAgICAgICAgIDxCb3ggYm9yZGVyVG9wPVwiMXB4IHNvbGlkXCIgYm9yZGVyQ29sb3I9XCJncmV5MjBcIiBtdD1cImxnXCIgcHQ9XCJsZ1wiPlxyXG4gICAgICAgICAgICAgICAgPEJ1dHRvbiBcclxuICAgICAgICAgICAgICAgICAgYXM9XCJhXCIgXHJcbiAgICAgICAgICAgICAgICAgIGhyZWY9e3BheW1lbnRTbGlwVXJsfSBcclxuICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCIgXHJcbiAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJwcmltYXJ5XCJcclxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFwYXltZW50U2xpcFVybH1cclxuICAgICAgICAgICAgICAgICAgd2lkdGg9XCIxMDAlXCJcclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAg4LiU4Li54Liq4Lil4Li04LibXHJcbiAgICAgICAgICAgICAgICA8L0J1dHRvbj5cclxuICAgICAgICAgICAgICA8L0JveD5cclxuXHJcbiAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBGb290ZXIgKFN0YXR1cyBPbmx5KSA9PT0gKi99XHJcbiAgICAgICAgICAgICAgPEJveFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyVG9wPVwiMXB4IHNvbGlkXCIgYm9yZGVyQ29sb3I9XCJncmV5MjBcIlxyXG4gICAgICAgICAgICAgICAgbXQ9XCJsZ1wiIHB0PVwibGdcIlxyXG4gICAgICAgICAgICAgICAgZGlzcGxheT1cImZsZXhcIiBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8Qm94PlxyXG4gICAgICAgICAgICAgICAgICA8Qm94XHJcbiAgICAgICAgICAgICAgICAgICAgYXM9XCJzcGFuXCIgcHg9XCJtZFwiIHB5PVwic21cIlxyXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1cz1cImxnXCJcclxuICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kQ29sb3I6IHN0eWxlLmJnLCBjb2xvcjogc3R5bGUuY29sb3IsIGZvbnRXZWlnaHQ6IFwiYm9sZFwiLCBmb250U2l6ZTogXCIwLjlyZW1cIiB9fVxyXG4gICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAge3N0YXR1c1RleHR9XHJcbiAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgICA8Qm94IGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyZXk2MFwiIG10PVwic21cIj5cclxuICAgICAgICAgICAgICAgICAgICDguIrguLPguKPguLDguYDguKHguLfguYjguK06IHtjcmVhdGVkQXR9XHJcbiAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgIDwvQ2FyZD5cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSl9XHJcbiAgICAgIDwvQm94PlxyXG4gICAgPC9Cb3g+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBheW1lbnRDYXJkTGlzdDsiLCJBZG1pbkpTLlVzZXJDb21wb25lbnRzID0ge31cbmltcG9ydCBQcm9wZXJ0eUNhcmRMaXN0IGZyb20gJy4uL0FkbWluL2NvbXBvbmVudHMvUHJvcGVydHlDYXJkTGlzdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvcGVydHlDYXJkTGlzdCA9IFByb3BlcnR5Q2FyZExpc3RcbmltcG9ydCBTZWxsZXJDYXJkTGlzdCBmcm9tICcuLi9BZG1pbi9jb21wb25lbnRzL1NlbGxlckNhcmRMaXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5TZWxsZXJDYXJkTGlzdCA9IFNlbGxlckNhcmRMaXN0XG5pbXBvcnQgUHJvcGVydHlVbml0TGlzdENvbXBvbmVudCBmcm9tICcuLi9BZG1pbi9jb21wb25lbnRzL1Byb3BlcnR5VW5pdENhcmRMaXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9wZXJ0eVVuaXRMaXN0Q29tcG9uZW50ID0gUHJvcGVydHlVbml0TGlzdENvbXBvbmVudFxuaW1wb3J0IERlcG9zaXRDYXJkTGlzdCBmcm9tICcuLi9BZG1pbi9jb21wb25lbnRzL0RlcG9zaXRDYXJkTGlzdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRGVwb3NpdENhcmRMaXN0ID0gRGVwb3NpdENhcmRMaXN0XG5pbXBvcnQgVGVzdERlcG9zaXQgZnJvbSAnLi4vQWRtaW4vY29tcG9uZW50cy9UZXN0RGVwb3NpdENvbXBvbmVudCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVGVzdERlcG9zaXQgPSBUZXN0RGVwb3NpdFxuaW1wb3J0IFVzZXJDYXJkTGlzdCBmcm9tICcuLi9BZG1pbi9jb21wb25lbnRzL1VzZXJDYXJkTGlzdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuVXNlckNhcmRMaXN0ID0gVXNlckNhcmRMaXN0XG5pbXBvcnQgRG9jdW1lbnRDYXJkTGlzdCBmcm9tICcuLi9BZG1pbi9jb21wb25lbnRzL0RvY3VtZW50Q2FyZExpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRvY3VtZW50Q2FyZExpc3QgPSBEb2N1bWVudENhcmRMaXN0XG5pbXBvcnQgUGF5bWVudENhcmRMaXN0IGZyb20gJy4uL0FkbWluL2NvbXBvbmVudHMvUGF5bWVudENhcmRMaXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5QYXltZW50Q2FyZExpc3QgPSBQYXltZW50Q2FyZExpc3QiXSwibmFtZXMiOlsiaXNFbXB0eVZhbHVlIiwidiIsInVuZGVmaW5lZCIsIlN0cmluZyIsInRyaW0iLCJkaXNwbGF5VmFsdWUiLCJmYWxsYmFjayIsInRydW5jYXRlIiwidGV4dCIsIm4iLCJsZW5ndGgiLCJzbGljZSIsIkRldGFpbEl0ZW0iLCJsYWJlbCIsInZhbHVlIiwiUmVhY3QiLCJjcmVhdGVFbGVtZW50IiwiQm94IiwiTGFiZWwiLCJjb2xvciIsInN0eWxlIiwidGV4dFRyYW5zZm9ybSIsImZvbnRTaXplIiwiVGV4dCIsImZvbnRXZWlnaHQiLCJDYXJkIiwiY2hpbGRyZW4iLCJ2YXJpYW50IiwiYm94U2hhZG93IiwiYm9yZGVyUmFkaXVzIiwicCIsIm1iIiwiUHJvcGVydHlDYXJkTGlzdCIsInJlY29yZHMiLCJsb2FkaW5nIiwiZXJyb3IiLCJ1c2VSZWNvcmRzIiwiZXhwYW5kZWQiLCJzZXRFeHBhbmRlZCIsInVzZVN0YXRlIiwiTG9hZGVyIiwiUGxhY2Vob2xkZXIiLCJINSIsImJhZGdlU3R5bGVzIiwiUEVORElORyIsImJnIiwiQ09ORklSTUVEIiwiU09MRCIsIkhJRERFTiIsIlJFSkVDVEVEIiwiZGVmYXVsdCIsImRpc3BsYXkiLCJncmlkVGVtcGxhdGVDb2x1bW5zIiwiZ2FwIiwibWFwIiwiciIsInBhcmFtcyIsImlkIiwiaXNFeHBhbmRlZCIsIm5hbWUiLCJQcm9wZXJ0eV9OYW1lIiwiZGVzY3JpcHRpb24iLCJEZXNjcmlwdGlvbiIsInByaWNlIiwiUHJpY2UiLCJOdW1iZXIiLCJ0b0xvY2FsZVN0cmluZyIsInNlbGxSZW50IiwiU2VsbF9SZW50Iiwic3RhdHVzIiwiU3RhdHVzX3Bvc3QiLCJjcmVhdGVkQXQiLCJEYXRlIiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwieWVhciIsIm1vbnRoIiwiZGF5IiwiaW1nVXJsIiwiX2ZpcnN0SW1hZ2UiLCJjYXRlZ29yeU5hbWUiLCJfY2F0ZWdvcnlOYW1lIiwiY2F0ZWdvcnlUcmFuc2xhdGlvbnMiLCJjb25kbyIsImhvdXNlIiwibGFuZCIsInZpbGxhIiwidG93bmhvdXNlIiwiYXBhcnRtZW50IiwicGVudGhvdXNlIiwicmVzb3J0IiwiaG90ZWwiLCJvZmZpY2UiLCJmYWN0b3J5Iiwid2FyZWhvdXNlIiwiY2F0ZWdvcnlUZXh0IiwidG9Mb3dlckNhc2UiLCJzdGF0dXNUcmFuc2xhdGlvbnMiLCJzdGF0dXNUZXh0Iiwia2V5Iiwid2lkdGgiLCJoZWlnaHQiLCJvdmVyZmxvdyIsInNyYyIsImFsdCIsIm9iamVjdEZpdCIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsIkgyIiwibSIsImZsZXhXcmFwIiwiRGlzdHJpY3QiLCJQcm92aW5jZSIsIkJhZGdlIiwibXkiLCJCdXR0b24iLCJvbkNsaWNrIiwicHJldiIsIm1sIiwiYm9yZGVyVG9wIiwiYm9yZGVyQ29sb3IiLCJtdCIsInB0IiwiZ3JpZEdhcCIsIlVzYWJsZV9BcmVhIiwiTGFuZF9TaXplIiwiQmVkcm9vbXMiLCJCYXRocm9vbSIsImZsb29yIiwiUGFya2luZ19TcGFjZSIsIk51bWJlck9mVW5pdHMiLCJZZWFyX0J1aWx0IiwiVG90YWxfUm9vbXMiLCJBZGRpdGlvbmFsX0FtZW5pdGllcyIsImpvaW4iLCJOZWFyYnlfTGFuZG1hcmtzIiwiTmFtZSIsIlBob25lIiwiTGlua01hcCIsImFzIiwiaHJlZiIsInRhcmdldCIsInNpemUiLCJMaW5rX2xpbmUiLCJMaW5rX2ZhY2Jvb2siLCJmbGV4RGlyZWN0aW9uIiwidHJhbnNpdGlvbiIsIl9ob3ZlciIsInRyYW5zZm9ybSIsIlNlbGxlckNhcmRMaXN0IiwidXNlclBhcmFtcyIsInBvcHVsYXRlZCIsInVzZXIiLCJmdWxsTmFtZSIsIkZpcnN0X25hbWUiLCJMYXN0X25hbWUiLCJpbWFnZVVybCIsIm5hdGlvbmFsSWRJbWFnZSIsImNvbXBhbnlOYW1lIiwiQ29tcGFueV9OYW1lIiwibGljZW5zZSIsIlJlYWxFc3RhdGVfTGljZW5zZSIsIlN0YXR1cyIsIkFQUFJPVkVEIiwiZmxleFNocmluayIsInB4IiwicHkiLCJiYWNrZ3JvdW5kQ29sb3IiLCJQcm9wZXJ0eVVuaXRDYXJkTGlzdCIsInByb3BlcnR5UG9zdFBhcmFtcyIsInByb3BlcnR5UG9zdCIsInVuaXROdW1iZXIiLCJVbml0X051bWJlciIsInByb3BlcnR5TmFtZSIsIkFWQUlMQUJMRSIsIkJPT0tFRCIsIkRlcG9zaXRDYXJkTGlzdCIsIlVzZXIiLCJwb3N0UGFyYW1zIiwiUG9zdCIsInVuaXRQYXJhbXMiLCJVbml0IiwidXNlck5hbWUiLCJkZXBvc2l0QW1vdW50IiwiRGVwb3NpdF9BbW91bnQiLCJEZXBvc2l0X1N0YXR1cyIsIlRlc3REZXBvc2l0Q29tcG9uZW50IiwicGFnZSIsInBlclBhZ2UiLCJ0b3RhbCIsImhhbmRsZUNoYW5nZVBhZ2UiLCJjb25zb2xlIiwibG9nIiwiUGFnaW5hdGlvbiIsIm9uQ2hhbmdlIiwiVXNlckNhcmRMaXN0IiwiZW1haWwiLCJFbWFpbCIsInBob25lIiwidXNlclR5cGUiLCJpbWFnZSIsIkFkbWluIiwiU2VsbGVyIiwiQnV5ZXIiLCJEb2N1bWVudENhcmRMaXN0IiwiZG9jdW1lbnROYW1lIiwiRG9jdW1lbnROYW1lIiwiZG9jdW1lbnRVcmwiLCJEb2N1bWVudFVybCIsIlJldmlld19TdGF0dXMiLCJ0aXRsZSIsImRpc2FibGVkIiwiUGF5bWVudENhcmRMaXN0IiwiUHJvcGVydHlQb3N0IiwicGF5bWVudEFtb3VudCIsIlBheW1lbnRfQW1vdW50IiwicGF5bWVudFNsaXBVcmwiLCJQYXltZW50X1NsaXAiLCJGQUlMRUQiLCJBZG1pbkpTIiwiVXNlckNvbXBvbmVudHMiLCJQcm9wZXJ0eVVuaXRMaXN0Q29tcG9uZW50IiwiVGVzdERlcG9zaXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7SUFBQTtJQUlBO0lBQ0EsTUFBTUEsY0FBWSxHQUFJQyxDQUFDLElBQUtBLENBQUMsS0FBSyxJQUFJLElBQUlBLENBQUMsS0FBS0MsU0FBUyxJQUFJQyxNQUFNLENBQUNGLENBQUMsQ0FBQyxDQUFDRyxJQUFJLEVBQUUsS0FBSyxFQUFFO0lBQ3BGLE1BQU1DLGNBQVksR0FBR0EsQ0FBQ0osQ0FBQyxFQUFFSyxRQUFRLEdBQUcsS0FBSyxLQUFNTixjQUFZLENBQUNDLENBQUMsQ0FBQyxHQUFHSyxRQUFRLEdBQUdMLENBQUU7SUFFOUUsTUFBTU0sVUFBUSxHQUFHQSxDQUFDQyxJQUFJLEVBQUVDLENBQUMsR0FBRyxHQUFHLEtBQUs7SUFDaEMsRUFBQSxJQUFJLENBQUNELElBQUksRUFBRSxPQUFPLEVBQUU7SUFDcEIsRUFBQSxJQUFJQSxJQUFJLENBQUNFLE1BQU0sSUFBSUQsQ0FBQyxFQUFFLE9BQU9ELElBQUk7TUFDakMsT0FBT0EsSUFB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
