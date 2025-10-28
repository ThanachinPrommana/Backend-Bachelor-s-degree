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
        const deposit = params.Deposit_Amount != null ? Number(params.Deposit_Amount).toLocaleString() : null;
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
        const sellRentTranslations = {
          SALE: 'ขาย',
          RENT: 'เช่า'
        };
        const sellRentText = sellRentTranslations[sellRent] || sellRent;
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
          alignItems: "flex-start",
          mb: "md",
          style: {
            gap: '12px'
          }
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Box, null, /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
          fontWeight: "bold",
          fontSize: "lg",
          color: "primary100"
        }, price, " \u0E1A\u0E32\u0E17"), deposit && /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
          fontSize: "md",
          color: "grey80",
          mt: "xs"
        }, "(\u0E21\u0E31\u0E14\u0E08\u0E33: ", deposit, " \u0E1A\u0E32\u0E17)")), /*#__PURE__*/React__default.default.createElement(designSystem.Text, {
          color: "grey80",
          mt: "6px"
        }, `${displayValue$6(params.District, '')}, ${displayValue$6(params.Province, '')}`), /*#__PURE__*/React__default.default.createElement(designSystem.Badge, {
          variant: "primary",
          mt: "6px"
        }, sellRentText), " "), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9BZG1pbi9jb21wb25lbnRzL1Byb3BlcnR5Q2FyZExpc3QuanN4IiwiLi4vQWRtaW4vY29tcG9uZW50cy9TZWxsZXJDYXJkTGlzdC5qc3giLCIuLi9BZG1pbi9jb21wb25lbnRzL1Byb3BlcnR5VW5pdENhcmRMaXN0LmpzeCIsIi4uL0FkbWluL2NvbXBvbmVudHMvRGVwb3NpdENhcmRMaXN0LmpzeCIsIi4uL0FkbWluL2NvbXBvbmVudHMvVGVzdERlcG9zaXRDb21wb25lbnQuanN4IiwiLi4vQWRtaW4vY29tcG9uZW50cy9Vc2VyQ2FyZExpc3QuanN4IiwiLi4vQWRtaW4vY29tcG9uZW50cy9Eb2N1bWVudENhcmRMaXN0LmpzeCIsIi4uL0FkbWluL2NvbXBvbmVudHMvUGF5bWVudENhcmRMaXN0LmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNlcnZlci9BZG1pbi9jb21wb25lbnRzL1Byb3BlcnR5Q2FyZExpc3QuanN4XHJcbmltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVjb3JkcyB9IGZyb20gJ2FkbWluanMnO1xyXG5pbXBvcnQgeyBCb3gsIEgyLCBINSwgTG9hZGVyLCBQbGFjZWhvbGRlciwgQnV0dG9uLCBCYWRnZSwgTGFiZWwsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcclxuLy8gSGVscGVyIEZ1bmN0aW9uc1xyXG5jb25zdCBpc0VtcHR5VmFsdWUgPSAodikgPT4gdiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQgfHwgU3RyaW5nKHYpLnRyaW0oKSA9PT0gXCJcIjtcclxuY29uc3QgZGlzcGxheVZhbHVlID0gKHYsIGZhbGxiYWNrID0gXCJOL0FcIikgPT4gKGlzRW1wdHlWYWx1ZSh2KSA/IGZhbGxiYWNrIDogdik7XHJcblxyXG5jb25zdCB0cnVuY2F0ZSA9ICh0ZXh0LCBuID0gMTgwKSA9PiB7XHJcbiAgICBpZiAoIXRleHQpIHJldHVybiBcIlwiO1xyXG4gICAgaWYgKHRleHQubGVuZ3RoIDw9IG4pIHJldHVybiB0ZXh0O1xyXG4gICAgcmV0dXJuIHRleHQuc2xpY2UoMCwgbikgKyBcIi4uLlwiO1xyXG59O1xyXG5cclxuY29uc3QgRGV0YWlsSXRlbSA9ICh7IGxhYmVsLCB2YWx1ZSB9KSA9PiAoXHJcbiAgICA8Qm94PlxyXG4gICAgICAgIDxMYWJlbCBjb2xvcj1cImdyZXk2MFwiIHN0eWxlPXt7IHRleHRUcmFuc2Zvcm06ICd1cHBlcmNhc2UnLCBmb250U2l6ZTogJzExcHgnIH19PntsYWJlbH08L0xhYmVsPlxyXG4gICAgICAgIDxUZXh0IGZvbnRXZWlnaHQ9XCJib2xkXCI+e2Rpc3BsYXlWYWx1ZSh2YWx1ZSl9PC9UZXh0PlxyXG4gICAgPC9Cb3g+XHJcbik7XHJcbmNvbnN0IENhcmQgPSAoeyBjaGlsZHJlbiB9KSA9PiAoXHJcbiAgICA8Qm94IHZhcmlhbnQ9XCJ3aGl0ZVwiIGJveFNoYWRvdz1cImNhcmRcIiBib3JkZXJSYWRpdXM9XCJ4bFwiIHA9XCJ4bFwiIG1iPVwiMnhsXCI+XHJcbiAgICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9Cb3g+XHJcbik7XHJcblxyXG4vLyBjb25zdCBMYWJlbCA9ICh7IGNoaWxkcmVuIH0pID0+IDxCb3ggY29sb3I9XCJncmV5NjBcIiBmb250U2l6ZT1cInNtXCI+e2NoaWxkcmVufTwvQm94PjtcclxuXHJcbmNvbnN0IFByb3BlcnR5Q2FyZExpc3QgPSAoKSA9PiB7XHJcbiAgICBjb25zdCB7IHJlY29yZHMsIGxvYWRpbmcsIGVycm9yIH0gPSB1c2VSZWNvcmRzKCdQcm9wZXJ0eVBvc3QnKTtcclxuICAgIGNvbnN0IFtleHBhbmRlZCwgc2V0RXhwYW5kZWRdID0gdXNlU3RhdGUoe30pO1xyXG5cclxuXHJcbiAgICBpZiAobG9hZGluZykgcmV0dXJuIDxCb3ggcD1cImxnXCI+PExvYWRlciAvPjwvQm94PjtcclxuICAgIGlmIChlcnJvcikgcmV0dXJuIDxCb3ggcD1cImxnXCI+PFBsYWNlaG9sZGVyPjxINT7guYDguIHguLTguJTguILguYnguK3guJzguLTguJTguJ7guKXguLLguJTguYPguJnguIHguLLguKPguYLguKvguKXguJTguILguYnguK3guKHguLnguKXguYLguJ7guKrguJXguYw8L0g1PjwvUGxhY2Vob2xkZXI+PC9Cb3g+O1xyXG4gICAgaWYgKCFyZWNvcmRzIHx8IHJlY29yZHMubGVuZ3RoID09PSAwKSByZXR1cm4gPEJveCBwPVwibGdcIj48UGxhY2Vob2xkZXI+PEg1PuC5hOC4oeC5iOC4nuC4muC5guC4nuC4quC4leC5jOC4l+C4teC5iOC4leC4o+C4h+C4geC4seC4muC5gOC4h+C4t+C5iOC4reC4meC5hOC4gjwvSDU+PC9QbGFjZWhvbGRlcj48L0JveD47XHJcblxyXG4gICAgLy8g4pyFIOC4quC4teC4quC4s+C4q+C4o+C4seC4muC5geC4leC5iOC4peC4sOC4quC4luC4suC4meC4sFxyXG4gICAgY29uc3QgYmFkZ2VTdHlsZXMgPSB7XHJcbiAgICAgICAgUEVORElORzogeyBiZzogXCIjRkZGN0UwXCIsIGNvbG9yOiBcIiNCNTgxMDBcIiB9LCAgLy8g4LmA4Lir4Lil4Li34Lit4LiHXHJcbiAgICAgICAgQ09ORklSTUVEOiB7IGJnOiBcIiNFNkY3RTZcIiwgY29sb3I6IFwiIzBDN0EwQ1wiIH0sICAvLyDguYDguILguLXguKLguKdcclxuICAgICAgICBTT0xEOiB7IGJnOiBcIiNFMEUwRTBcIiwgY29sb3I6IFwiIzU1NTU1NVwiIH0sICAvLyDguYDguJfguLJcclxuICAgICAgICBISURERU46IHsgYmc6IFwiI0YyRjJGMlwiLCBjb2xvcjogXCIjNjY2NjY2XCIgfSwgIC8vIOC5gOC4l+C4suC4reC5iOC4reC4mVxyXG4gICAgICAgIFJFSkVDVEVEOiB7IGJnOiBcIiNGRkU2RTZcIiwgY29sb3I6IFwiI0QxMDAwMFwiIH0sICAvLyDguYHguJTguIdcclxuICAgICAgICBkZWZhdWx0OiB7IGJnOiBcIiNGMkYyRjJcIiwgY29sb3I6IFwiIzY2NjY2NlwiIH0sXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgICAgPEJveCBwPVwiMnhsXCI+XHJcbiAgICAgICAgICAgIDxCb3ggZGlzcGxheT1cImdyaWRcIiBncmlkVGVtcGxhdGVDb2x1bW5zPXtbJzFmcicsICdyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMzgwcHgsIDFmcikpJ119IHN0eWxlPXt7IGdhcDogXCIyMHB4XCIgfX0+XHJcbiAgICAgICAgICAgICAgICB7cmVjb3Jkcy5tYXAoKHIpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXJhbXMgPSByLnBhcmFtcyA/PyB7fTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHIuaWQgPz8gcGFyYW1zLmlkO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlzRXhwYW5kZWQgPSAhIWV4cGFuZGVkW2lkXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g4pyFIOC4lOC4tuC4h+C4guC5ieC4reC4oeC4ueC4peC4l+C4seC5ieC4h+C4q+C4oeC4lOC4iOC4suC4gSBwYXJhbXNcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBuYW1lID0gZGlzcGxheVZhbHVlKHBhcmFtcy5Qcm9wZXJ0eV9OYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXNjcmlwdGlvbiA9IGRpc3BsYXlWYWx1ZShwYXJhbXMuRGVzY3JpcHRpb24sIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByaWNlID0gcGFyYW1zLlByaWNlICE9IG51bGwgPyBOdW1iZXIocGFyYW1zLlByaWNlKS50b0xvY2FsZVN0cmluZygpIDogXCJOL0FcIjtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWxsUmVudCA9IGRpc3BsYXlWYWx1ZShwYXJhbXMuU2VsbF9SZW50KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdGF0dXMgPSBwYXJhbXMuU3RhdHVzX3Bvc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlZEF0ID0gbmV3IERhdGUocGFyYW1zLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwidGgtVEhcIiwgeyB5ZWFyOiAnbnVtZXJpYycsIG1vbnRoOiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJyB9KTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbWdVcmwgPSBwYXJhbXMuX2ZpcnN0SW1hZ2UgfHwgbnVsbDtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXRlZ29yeU5hbWUgPSBwYXJhbXMuX2NhdGVnb3J5TmFtZSB8fCAnTi9BJztcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXBvc2l0ID0gcGFyYW1zLkRlcG9zaXRfQW1vdW50ICE9IG51bGwgPyBOdW1iZXIocGFyYW1zLkRlcG9zaXRfQW1vdW50KS50b0xvY2FsZVN0cmluZygpIDogbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlUcmFuc2xhdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRvOiAn4LiE4Lit4LiZ4LmC4LiUJywgaG91c2U6ICfguJrguYnguLLguJknLCBsYW5kOiAn4LiX4Li14LmI4LiU4Li04LiZJywgdmlsbGE6ICfguKfguLTguKXguKXguYjguLInLCB0b3duaG91c2U6ICfguJfguLLguKfguJnguYzguYDguK7guLLguKrguYwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAnc2hvcCBob3VzZSc6ICfguK3guLLguITguLLguKPguJ7guLLguJPguLTguIrguKLguYwnLCBhcGFydG1lbnQ6ICfguK3guJ7guLLguKPguYzguJfguYDguKHguJnguJfguYwnLCBwZW50aG91c2U6ICfguYDguJ7guJnguJfguYzguYDguK7guLLguKrguYwnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvcnQ6ICfguKPguLXguKrguK3guKPguYzguJcnLCBob3RlbDogJ+C5guC4o+C4h+C5geC4o+C4oScsIG9mZmljZTogJ+C4quC4s+C4meC4seC4geC4h+C4suC4mScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb21tZXJjaWFsIGJ1aWxkaW5nJzogJ+C4leC4tuC4geC4nuC4suC4k+C4tOC4iuC4ouC5jCcsIGZhY3Rvcnk6ICfguYLguKPguIfguIfguLLguJknLCB3YXJlaG91c2U6ICfguYLguIHguJTguLHguIcv4LiE4Lil4Lix4LiH4Liq4Li04LiZ4LiE4LmJ4LiyJyxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhdGVnb3J5VGV4dCA9IGNhdGVnb3J5VHJhbnNsYXRpb25zW1N0cmluZyhjYXRlZ29yeU5hbWUpLnRvTG93ZXJDYXNlKCldIHx8IGNhdGVnb3J5TmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzVHJhbnNsYXRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQRU5ESU5HOiAn4Lij4Lit4LiV4Lij4Lin4LiI4Liq4Lit4LiaJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgQ09ORklSTUVEOiAn4Lit4LiZ4Li44Lih4Lix4LiV4Li04LmB4Lil4LmJ4LinJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgU09MRDogJ+C4guC4suC4ouC5geC4peC5ieC4pycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEhJRERFTjogJ+C4i+C5iOC4reC4mScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFSkVDVEVEOiAn4LiW4Li54LiB4Lib4LiP4Li04LmA4Liq4LiYJyxcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNlbGxSZW50VHJhbnNsYXRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBTQUxFOiAn4LiC4Liy4LiiJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgUkVOVDogJ+C5gOC4iuC5iOC4sicsXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWxsUmVudFRleHQgPSBzZWxsUmVudFRyYW5zbGF0aW9uc1tzZWxsUmVudF0gfHwgc2VsbFJlbnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzVGV4dCA9IHN0YXR1c1RyYW5zbGF0aW9uc1tzdGF0dXNdIHx8IHN0YXR1cztcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHlsZSA9IGJhZGdlU3R5bGVzW3N0YXR1c10gfHwgYmFkZ2VTdHlsZXMuZGVmYXVsdDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPENhcmQga2V5PXtpZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aW1nVXJsID8gKDxCb3ggd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PXsyMDB9IG92ZXJmbG93PVwiaGlkZGVuXCIgYm9yZGVyUmFkaXVzPVwibGdcIiBtYj1cImxnXCI+PGltZyBzcmM9e2ltZ1VybH0gYWx0PVwidGh1bWJcIiBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogXCIxMDAlXCIsIG9iamVjdEZpdDogXCJjb3ZlclwiIH19IC8+PC9Cb3g+KSA6ICg8Qm94IHdpZHRoPVwiMTAwJVwiIGhlaWdodD17MTIwfSBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiIGJnPVwiZ3JleTIwXCIgY29sb3I9XCJncmV5NjBcIiBib3JkZXJSYWRpdXM9XCJsZ1wiIG1iPVwibGdcIj7guYTguKHguYjguKHguLXguKPguLnguJs8L0JveD4pfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogTWFpbiBJbmZvID09PSAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxIMiBtPXswfSBmb250U2l6ZT1cInhsXCIgbWI9XCJzbVwiPntuYW1lfTwvSDI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgZmxleFdyYXA9XCJ3cmFwXCIgYWxpZ25JdGVtcz1cImZsZXgtc3RhcnRcIiBtYj1cIm1kXCIgc3R5bGU9e3sgZ2FwOiAnMTJweCcgfX0+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiAxLiDguKvguLjguYnguKHguKPguLLguITguLLguYHguKXguLDguKHguLHguJTguIjguLPguYTguKfguYnguJTguYnguKfguKLguIHguLHguJkgKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRleHQgZm9udFdlaWdodD1cImJvbGRcIiBmb250U2l6ZT1cImxnXCIgY29sb3I9XCJwcmltYXJ5MTAwXCI+e3ByaWNlfSDguJrguLLguJc8L1RleHQ+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogMi4g4LmA4Lie4Li04LmI4Lih4Liq4LmI4Lin4LiZ4LmB4Liq4LiU4LiH4Lih4Lix4LiU4LiI4LizICjguIjguLDguYHguKrguJTguIfguYDguInguJ7guLLguLDguYDguKHguLfguYjguK3guKHguLXguILguYnguK3guKHguLnguKUpICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZGVwb3NpdCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGV4dCBmb250U2l6ZT1cIm1kXCIgY29sb3I9XCJncmV5ODBcIiBtdD1cInhzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKOC4oeC4seC4lOC4iOC4szoge2RlcG9zaXR9IOC4muC4suC4lylcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvVGV4dD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIDMuICjguYHguJnguLDguJnguLMpIOC5gOC4nuC4tOC5iOC4oSBtdD1cIjZweFwiIOC5gOC4nuC4t+C5iOC4reC4iOC4seC4lOC5geC4meC4p+C5g+C4q+C5ieC4quC4p+C4ouC4h+C4suC4oSAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGV4dCBjb2xvcj1cImdyZXk4MFwiIG10PVwiNnB4XCI+e2Ake2Rpc3BsYXlWYWx1ZShwYXJhbXMuRGlzdHJpY3QsICcnKX0sICR7ZGlzcGxheVZhbHVlKHBhcmFtcy5Qcm92aW5jZSwgJycpfWB9PC9UZXh0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCYWRnZSB2YXJpYW50PVwicHJpbWFyeVwiIG10PVwiNnB4XCI+e3NlbGxSZW50VGV4dH08L0JhZGdlPiB7Lyog4qyF77iPIOC5geC4geC5ieC5hOC4guC4muC4o+C4o+C4l+C4seC4lOC4meC4teC5iSAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogRGVzY3JpcHRpb24gPT09ICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveCBteT1cImxnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtpc0V4cGFuZGVkID8gZGVzY3JpcHRpb24gOiB0cnVuY2F0ZShkZXNjcmlwdGlvbiwgMTIwKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2Rlc2NyaXB0aW9uLmxlbmd0aCA+IDEyMCAmJiAoPEJ1dHRvbiB2YXJpYW50PVwidGV4dFwiIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkKHByZXYgPT4gKHsgLi4ucHJldiwgW2lkXTogIXByZXZbaWRdIH0pKX0gbWw9XCJzbVwiPntpc0V4cGFuZGVkID8gXCLguKLguYjguK1cIiA6IFwi4Lit4LmI4Liy4LiZ4LiV4LmI4LitXCJ9PC9CdXR0b24+KX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1RleHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogPT09IFNlY3Rpb246IFByb3BlcnR5IERldGFpbHMgPT09ICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveCBib3JkZXJUb3A9XCIxcHggc29saWRcIiBib3JkZXJDb2xvcj1cImdyZXkyMFwiIG10PVwibGdcIiBwdD1cImxnXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEg1IG1iPVwibWRcIj7guKPguLLguKLguKXguLDguYDguK3guLXguKLguJTguJfguKPguLHguJ7guKLguYzguKrguLTguJk8L0g1PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3ggZGlzcGxheT1cImdyaWRcIiBncmlkVGVtcGxhdGVDb2x1bW5zPVwicmVwZWF0KDMsIDFmcilcIiBncmlkR2FwPVwibWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPERldGFpbEl0ZW0gbGFiZWw9XCLguJ7guLfguYnguJnguJfguLXguYjguYPguIrguYnguKrguK3guKJcIiB2YWx1ZT17cGFyYW1zLlVzYWJsZV9BcmVhID8gYCR7cGFyYW1zLlVzYWJsZV9BcmVhfSDguJXguKMu4LihLmAgOiBudWxsfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RGV0YWlsSXRlbSBsYWJlbD1cIuC4guC4meC4suC4lOC4l+C4teC5iOC4lOC4tOC4mVwiIHZhbHVlPXtwYXJhbXMuTGFuZF9TaXplID8gYCR7cGFyYW1zLkxhbmRfU2l6ZX0g4LiV4LijLuC4py5gIDogbnVsbH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPERldGFpbEl0ZW0gbGFiZWw9XCLguKvguYnguK3guIfguJnguK3guJlcIiB2YWx1ZT17cGFyYW1zLkJlZHJvb21zfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RGV0YWlsSXRlbSBsYWJlbD1cIuC4q+C5ieC4reC4h+C4meC5ieC4s1wiIHZhbHVlPXtwYXJhbXMuQmF0aHJvb219IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxEZXRhaWxJdGVtIGxhYmVsPVwi4LiK4Lix4LmJ4LiZXCIgdmFsdWU9e3BhcmFtcy5mbG9vcn0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPERldGFpbEl0ZW0gbGFiZWw9XCLguJfguLXguYjguIjguK3guJTguKPguJZcIiB2YWx1ZT17cGFyYW1zLlBhcmtpbmdfU3BhY2V9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxEZXRhaWxJdGVtIGxhYmVsPVwi4LiI4Liz4LiZ4Lin4LiZ4Lii4Li54LiZ4Li04LiVXCIgdmFsdWU9e3BhcmFtcy5OdW1iZXJPZlVuaXRzfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RGV0YWlsSXRlbSBsYWJlbD1cIuC4m+C4teC4l+C4teC5iOC4quC4o+C5ieC4suC4h1wiIHZhbHVlPXtwYXJhbXMuWWVhcl9CdWlsdH0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPERldGFpbEl0ZW0gbGFiZWw9XCLguIjguLPguJnguKfguJnguKvguYnguK3guIfguJfguLHguYnguIfguKvguKHguJRcIiB2YWx1ZT17cGFyYW1zLlRvdGFsX1Jvb21zfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBGZWF0dXJlcyA9PT0gKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGJvcmRlclRvcD1cIjFweCBzb2xpZFwiIGJvcmRlckNvbG9yPVwiZ3JleTIwXCIgbXQ9XCJsZ1wiIHB0PVwibGdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SDUgbWI9XCJtZFwiPuC4quC4tOC5iOC4h+C4reC4s+C4meC4p+C4ouC4hOC4p+C4suC4oeC4quC4sOC4lOC4p+C4geC5geC4peC4sOC4quC4luC4suC4meC4l+C4teC5iOC5g+C4geC4peC5ieC5gOC4hOC4teC4ouC4hzwvSDU+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyhwYXJhbXMuQWRkaXRpb25hbF9BbWVuaXRpZXM/Lmxlbmd0aCA+IDApICYmIDxEZXRhaWxJdGVtIGxhYmVsPVwi4Liq4Li04LmI4LiH4Lit4Liz4LiZ4Lin4Lii4LiE4Lin4Liy4Lih4Liq4Liw4LiU4Lin4LiB4LmA4Lie4Li04LmI4Lih4LmA4LiV4Li04LihXCIgdmFsdWU9e3BhcmFtcy5BZGRpdGlvbmFsX0FtZW5pdGllcy5qb2luKCcsICcpfSAvPn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7KHBhcmFtcy5OZWFyYnlfTGFuZG1hcmtzPy5sZW5ndGggPiAwKSAmJiA8RGV0YWlsSXRlbSBsYWJlbD1cIuC4quC4luC4suC4meC4l+C4teC5iOC5g+C4geC4peC5ieC5gOC4hOC4teC4ouC4h1wiIHZhbHVlPXtwYXJhbXMuTmVhcmJ5X0xhbmRtYXJrcy5qb2luKCcsICcpfSAvPn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogQ29udGFjdCAmIExpbmtzID09PSAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3ggYm9yZGVyVG9wPVwiMXB4IHNvbGlkXCIgYm9yZGVyQ29sb3I9XCJncmV5MjBcIiBtdD1cImxnXCIgcHQ9XCJsZ1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxINSBtYj1cIm1kXCI+4LiC4LmJ4Lit4Lih4Li54Lil4LiV4Li04LiU4LiV4LmI4Lit4LmB4Lil4Liw4Lil4Li04LiH4LiB4LmMPC9INT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RGV0YWlsSXRlbSBsYWJlbD1cIuC4nOC4ueC5ieC4peC4h+C4m+C4o+C4sOC4geC4suC4qFwiIHZhbHVlPXtwYXJhbXMuTmFtZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RGV0YWlsSXRlbSBsYWJlbD1cIuC5gOC4muC4reC4o+C5jOC5guC4l+C4o+C4qOC4seC4nuC4l+C5jFwiIHZhbHVlPXtwYXJhbXMuUGhvbmV9IC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGdyaWRHYXA9XCJtZFwiIG10PVwibWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3BhcmFtcy5MaW5rTWFwICYmIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17cGFyYW1zLkxpbmtNYXB9IHRhcmdldD1cIl9ibGFua1wiIHNpemU9XCJzbVwiPuC5geC4nOC4meC4l+C4teC5iDwvQnV0dG9uPn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3BhcmFtcy5MaW5rX2xpbmUgJiYgPEJ1dHRvbiBhcz1cImFcIiBocmVmPXtwYXJhbXMuTGlua19saW5lfSB0YXJnZXQ9XCJfYmxhbmtcIiBzaXplPVwic21cIj5MSU5FPC9CdXR0b24+fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7cGFyYW1zLkxpbmtfZmFjYm9vayAmJiA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e3BhcmFtcy5MaW5rX2ZhY2Jvb2t9IHRhcmdldD1cIl9ibGFua1wiIHNpemU9XCJzbVwiPkZhY2Vib29rPC9CdXR0b24+fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBNZXRhICYgQWN0aW9ucyA9PT0gKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGJvcmRlclRvcD1cIjFweCBzb2xpZFwiIGJvcmRlckNvbG9yPVwiZ3JleTIwXCIgbXQ9XCJsZ1wiIHB0PVwibGdcIiBkaXNwbGF5PVwiZmxleFwiIGp1c3RpZnlDb250ZW50PVwic3BhY2UtYmV0d2VlblwiIGFsaWduSXRlbXM9XCJmbGV4LWVuZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBmbGV4RGlyZWN0aW9uPVwiY29sdW1uXCIgZ2FwPVwic21cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPExhYmVsPjxzdHJvbmc+4Lir4Lih4Lin4LiU4Lir4Lih4Li54LmIOjwvc3Ryb25nPiB7Y2F0ZWdvcnlUZXh0fTwvTGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMYWJlbD48c3Ryb25nPuC4quC4luC4suC4meC4sDo8L3N0cm9uZz4gPEJhZGdlIHZhcmlhbnQ9XCJkZWZhdWx0XCIgYmc9e3N0eWxlLmJnfSBjb2xvcj17c3R5bGUuY29sb3J9IG1sPVwibWRcIj57c3RhdHVzVGV4dH08L0JhZGdlPjwvTGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMYWJlbD48c3Ryb25nPuC4quC4o+C5ieC4suC4h+C5gOC4oeC4t+C5iOC4rTo8L3N0cm9uZz4ge2NyZWF0ZWRBdH08L0xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBncmlkR2FwPVwibWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBhcz1cImFcIiBocmVmPXtgL2FkbWluL3Jlc291cmNlcy9Qcm9wZXJ0eVBvc3QvcmVjb3Jkcy8ke2lkfS9zaG93YH0gc2l6ZT1cInNtXCI+4LiU4Li5PC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YC9hZG1pbi9yZXNvdXJjZXMvUHJvcGVydHlQb3N0L3JlY29yZHMvJHtpZH0vZWRpdGB9IHZhcmlhbnQ9XCJwcmltYXJ5XCIgc2l6ZT1cInNtXCI+4LmB4LiB4LmJ4LmE4LiCPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9DYXJkPlxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgICAgICB9KX1cclxuICAgICAgICAgICAgPC9Cb3g+XHJcblxyXG4gICAgICAgIDwvQm94PlxyXG4gICAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFByb3BlcnR5Q2FyZExpc3Q7XHJcbiIsIi8vIHNlcnZlci9BZG1pbi9jb21wb25lbnRzL1NlbGxlckNhcmRMaXN0LmpzeFxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWNvcmRzIH0gZnJvbSAnYWRtaW5qcyc7XHJcbmltcG9ydCB7IEJveCwgSDIsIExvYWRlciwgUGxhY2Vob2xkZXIsIEg1LCBCdXR0b24gfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcclxuXHJcbi8vIEhlbHBlciBGdW5jdGlvbnNcclxuY29uc3QgaXNFbXB0eVZhbHVlID0gKHYpID0+IHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkIHx8IFN0cmluZyh2KS50cmltKCkgPT09IFwiXCI7XHJcbmNvbnN0IGRpc3BsYXlWYWx1ZSA9ICh2LCBmYWxsYmFjayA9IFwi4Lin4LmI4Liy4LiHXCIpID0+IChpc0VtcHR5VmFsdWUodikgPyBmYWxsYmFjayA6IHYpO1xyXG5cclxuY29uc3QgQ2FyZCA9ICh7IGNoaWxkcmVuIH0pID0+IChcclxuICA8Qm94XHJcbiAgICB2YXJpYW50PVwid2hpdGVcIlxyXG4gICAgYm94U2hhZG93PVwiY2FyZFwiXHJcbiAgICBib3JkZXJSYWRpdXM9XCJ4bFwiXHJcbiAgICBwPVwieGxcIlxyXG4gICAgbWI9XCIyeGxcIlxyXG4gICAgc3R5bGU9e3sgdHJhbnNpdGlvbjogXCJib3gtc2hhZG93IDAuMnMgZWFzZSwgdHJhbnNmb3JtIDAuMnMgZWFzZVwiIH19XHJcbiAgICBfaG92ZXI9e3sgYm94U2hhZG93OiBcIjAgNHB4IDIwcHggcmdiYSgwLDAsMCwwLjA4KVwiLCB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWSgtMnB4KVwiIH19XHJcbiAgPlxyXG4gICAge2NoaWxkcmVufVxyXG4gIDwvQm94PlxyXG4pO1xyXG5cclxuY29uc3QgU2VsbGVyQ2FyZExpc3QgPSAoKSA9PiB7XHJcbiAgY29uc3QgeyByZWNvcmRzLCBsb2FkaW5nLCBlcnJvciB9ID0gdXNlUmVjb3JkcygnU2VsbGVyJyk7XHJcblxyXG4gIGlmIChsb2FkaW5nKSByZXR1cm4gPEJveCBwPVwibGdcIj48TG9hZGVyIC8+PC9Cb3g+O1xyXG4gIGlmIChlcnJvcikgcmV0dXJuIDxCb3ggcD1cImxnXCI+PFBsYWNlaG9sZGVyPjxINT7guYDguIHguLTguJTguILguYnguK3guJzguLTguJTguJ7guKXguLLguJQ8L0g1PjxwPuC5hOC4oeC5iOC4quC4suC4oeC4suC4o+C4luC4lOC4tuC4h+C4guC5ieC4reC4oeC4ueC4peC4nOC4ueC5ieC4guC4suC4ouC5hOC4lOC5iTwvcD48L1BsYWNlaG9sZGVyPjwvQm94PjtcclxuICBpZiAoIXJlY29yZHMgfHwgcmVjb3Jkcy5sZW5ndGggPT09IDApIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxQbGFjZWhvbGRlcj48SDU+4LmE4Lih4LmI4Lih4Li14Lic4Li54LmJ4LiC4Liy4LiiPC9INT48cD7guYTguKHguYjguJ7guJrguJzguLnguYnguILguLLguKLguJfguLXguYjguJXguKPguIfguIHguLHguJrguYDguIfguLfguYjguK3guJnguYTguILguIHguLLguKPguIHguKPguK3guIfguILguK3guIfguITguLjguJM8L3A+PC9QbGFjZWhvbGRlcj48L0JveD47XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8Qm94IHA9XCIyeGxcIj5cclxuICAgICAgPEJveFxyXG4gICAgICAgIGRpc3BsYXk9XCJncmlkXCJcclxuICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zPXtbJzFmcicsICdyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMzQwcHgsIDFmcikpJ119XHJcbiAgICAgICAgc3R5bGU9e3sgZ2FwOiBcIjIwcHhcIiB9fSBcclxuICAgICAgPlxyXG4gICAgICAgIHtyZWNvcmRzLm1hcCgocikgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcGFyYW1zID0gci5wYXJhbXMgPz8ge307XHJcbiAgICAgICAgICBjb25zdCB1c2VyUGFyYW1zID0gci5wb3B1bGF0ZWQ/LnVzZXI/LnBhcmFtcyA/PyB7fTtcclxuICAgICAgICAgIGNvbnN0IGlkID0gci5pZCA/PyBwYXJhbXMuaWQ7XHJcblxyXG4gICAgICAgICAgY29uc3QgZnVsbE5hbWUgPSBgJHtkaXNwbGF5VmFsdWUodXNlclBhcmFtcy5GaXJzdF9uYW1lLCAnJyl9ICR7ZGlzcGxheVZhbHVlKHVzZXJQYXJhbXMuTGFzdF9uYW1lLCAnJyl9YC50cmltKCkgfHwgXCLguYTguKHguYjguKHguLXguIrguLfguYjguK1cIjtcclxuICAgICAgICAgIGNvbnN0IGltYWdlVXJsID0gcGFyYW1zLm5hdGlvbmFsSWRJbWFnZSB8fCBudWxsO1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBjb25zdCBjb21wYW55TmFtZSA9IGRpc3BsYXlWYWx1ZShwYXJhbXMuQ29tcGFueV9OYW1lKTtcclxuICAgICAgICAgIGNvbnN0IGxpY2Vuc2UgPSBkaXNwbGF5VmFsdWUocGFyYW1zLlJlYWxFc3RhdGVfTGljZW5zZSk7XHJcbiAgICAgICAgICBjb25zdCBzdGF0dXMgPSBkaXNwbGF5VmFsdWUocGFyYW1zLlN0YXR1cyk7XHJcbiAgICAgICAgICBjb25zdCBjcmVhdGVkQXQgPSBuZXcgRGF0ZShwYXJhbXMuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoXCJ0aC1USFwiLCB7XHJcbiAgICAgICAgICAgIHllYXI6ICdudW1lcmljJywgbW9udGg6ICdzaG9ydCcsIGRheTogJ251bWVyaWMnXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICBjb25zdCBiYWRnZVN0eWxlcyA9IHtcclxuICAgICAgICAgICAgUEVORElORzogeyBiZzogXCIjZmZmYmU2XCIsIGNvbG9yOiBcIiNmYWFkMTRcIiB9LFxyXG4gICAgICAgICAgICBBUFBST1ZFRDogeyBiZzogXCIjZjZmZmVkXCIsIGNvbG9yOiBcIiM1MmM0MWFcIiB9LFxyXG4gICAgICAgICAgICBSRUpFQ1RFRDogeyBiZzogXCIjZmZmMWYwXCIsIGNvbG9yOiBcIiNmNTIyMmRcIiB9LFxyXG4gICAgICAgICAgICBkZWZhdWx0OiB7IGJnOiBcIiNmMmYyZjJcIiwgY29sb3I6IFwiIzU1NVwiIH0sXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgY29uc3Qgc3R5bGUgPSBiYWRnZVN0eWxlc1tzdGF0dXNdIHx8IGJhZGdlU3R5bGVzLmRlZmF1bHQ7XHJcblxyXG4gICAgICAgICAgLy8g4pyFIOC4quC4o+C5ieC4suC4hyBPYmplY3Qg4Liq4Liz4Lir4Lij4Lix4Lia4LmB4Lib4Lil4Liq4LiW4Liy4LiZ4LiwXHJcbiAgICAgICAgICBjb25zdCBzdGF0dXNUcmFuc2xhdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIFBFTkRJTkc6ICfguKPguK3guJXguKPguKfguIjguKrguK3guJonLFxyXG4gICAgICAgICAgICBBUFBST1ZFRDogJ+C4reC4meC4uOC4oeC4seC4leC4tOC5geC4peC5ieC4pycsXHJcbiAgICAgICAgICAgIFJFSkVDVEVEOiAn4LiW4Li54LiB4Lib4LiP4Li04LmA4Liq4LiYJyxcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgLy8g4pyFIOC4lOC4tuC4h+C4hOC4s+C5geC4m+C4peC4oOC4suC4qeC4suC5hOC4l+C4olxyXG4gICAgICAgICAgY29uc3Qgc3RhdHVzVGV4dCA9IHN0YXR1c1RyYW5zbGF0aW9uc1tzdGF0dXNdIHx8IHN0YXR1cztcclxuXHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8Q2FyZCBrZXk9e2lkfT5cclxuICAgICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIGdyaWRHYXA9XCJsZ1wiPlxyXG4gICAgICAgICAgICAgICAgPEJveCB3aWR0aD17ODB9IGhlaWdodD17ODB9IGJvcmRlclJhZGl1cz1cIjUwJVwiIG92ZXJmbG93PVwiaGlkZGVuXCIgYmc9XCJncmV5MjBcIiBmbGV4U2hyaW5rPXswfT5cclxuICAgICAgICAgICAgICAgICAge2ltYWdlVXJsID8gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWcgc3JjPXtpbWFnZVVybH0gYWx0PVwicHJvZmlsZVwiIHN0eWxlPXt7IHdpZHRoOiBcIjEwMCVcIiwgaGVpZ2h0OiBcIjEwMCVcIiwgb2JqZWN0Rml0OiBcImNvdmVyXCIgfX0gLz5cclxuICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICA8Qm94IHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiIGNvbG9yPVwiZ3JleTYwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICBObyBJbWdcclxuICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgPEJveD5cclxuICAgICAgICAgICAgICAgICAgPEgyIG09ezB9IGZvbnRTaXplPVwieGxcIj57ZnVsbE5hbWV9PC9IMj5cclxuICAgICAgICAgICAgICAgICAgPEJveCBjb2xvcj1cImdyZXk4MFwiIG10PVwieHNcIj48c3Ryb25nPuC4muC4o+C4tOC4qeC4seC4lzo8L3N0cm9uZz4ge2NvbXBhbnlOYW1lfTwvQm94PlxyXG4gICAgICAgICAgICAgICAgICA8Qm94IGNvbG9yPVwiZ3JleTgwXCI+PHN0cm9uZz7guYPguJrguK3guJnguLjguI3guLLguJU6PC9zdHJvbmc+IHtsaWNlbnNlfTwvQm94PlxyXG4gICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgPC9Cb3g+XHJcblxyXG4gICAgICAgICAgICAgIDxCb3hcclxuICAgICAgICAgICAgICAgIGJvcmRlclRvcD1cIjFweCBzb2xpZFwiIGJvcmRlckNvbG9yPVwiZ3JleTIwXCIgbXQ9XCJ4bFwiIHB0PVwibGdcIlxyXG4gICAgICAgICAgICAgICAgZGlzcGxheT1cImZsZXhcIiBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8Qm94PlxyXG4gICAgICAgICAgICAgICAgICA8Qm94XHJcbiAgICAgICAgICAgICAgICAgICAgYXM9XCJzcGFuXCIgcHg9XCJtZFwiIHB5PVwic21cIiBib3JkZXJSYWRpdXM9XCJsZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiBzdHlsZS5iZywgY29sb3I6IHN0eWxlLmNvbG9yLCBmb250V2VpZ2h0OiBcImJvbGRcIiwgZm9udFNpemU6IFwiMC45cmVtXCIgfX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIHsvKiDinIUg4LmA4Lib4Lil4Li14LmI4Lii4LiZ4Lih4Liy4LmD4LiK4LmJIHN0YXR1c1RleHQg4LmA4Lie4Li34LmI4Lit4LmB4Liq4LiU4LiH4Lic4LilICovfVxyXG4gICAgICAgICAgICAgICAgICAgIHtzdGF0dXNUZXh0fVxyXG4gICAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgICAgPEJveCBmb250U2l6ZT1cInNtXCIgY29sb3I9XCJncmV5NjBcIiBtdD1cInNtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAg4LmA4Lib4LmH4LiZ4Lic4Li54LmJ4LiC4Liy4Lii4LmA4Lih4Li34LmI4LitOiB7Y3JlYXRlZEF0fVxyXG4gICAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGdyaWRHYXA9XCJtZFwiPlxyXG4gICAgICAgICAgICAgICAgICA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e2AvYWRtaW4vcmVzb3VyY2VzL1NlbGxlci9yZWNvcmRzLyR7aWR9L3Nob3dgfSB2YXJpYW50PVwicHJpbWFyeVwiPuC4lOC4uTwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e2AvYWRtaW4vcmVzb3VyY2VzL1NlbGxlci9yZWNvcmRzLyR7aWR9L2VkaXRgfT7guYHguIHguYnguYTguII8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICA8L0NhcmQ+XHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pfVxyXG4gICAgICA8L0JveD5cclxuICAgIDwvQm94PlxyXG4gICk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBTZWxsZXJDYXJkTGlzdDsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWNvcmRzIH0gZnJvbSAnYWRtaW5qcyc7XHJcbmltcG9ydCB7IEJveCwgSDIsIEg1LCBMb2FkZXIsIFBsYWNlaG9sZGVyLCBCdXR0b24gfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcclxuXHJcbi8vIEhlbHBlciBGdW5jdGlvbnNcclxuY29uc3QgaXNFbXB0eVZhbHVlID0gKHYpID0+IHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkIHx8IFN0cmluZyh2KS50cmltKCkgPT09IFwiXCI7XHJcbmNvbnN0IGRpc3BsYXlWYWx1ZSA9ICh2LCBmYWxsYmFjayA9IFwi4Lin4LmI4Liy4LiHXCIpID0+IChpc0VtcHR5VmFsdWUodikgPyBmYWxsYmFjayA6IHYpO1xyXG5cclxuY29uc3QgQ2FyZCA9ICh7IGNoaWxkcmVuIH0pID0+IChcclxuICA8Qm94XHJcbiAgICB2YXJpYW50PVwid2hpdGVcIlxyXG4gICAgYm94U2hhZG93PVwiY2FyZFwiXHJcbiAgICBib3JkZXJSYWRpdXM9XCJ4bFwiXHJcbiAgICBwPVwieGxcIlxyXG4gICAgbWI9XCIyeGxcIlxyXG4gICAgc3R5bGU9e3sgdHJhbnNpdGlvbjogXCJib3gtc2hhZG93IDAuMnMgZWFzZSwgdHJhbnNmb3JtIDAuMnMgZWFzZVwiIH19XHJcbiAgICBfaG92ZXI9e3sgYm94U2hhZG93OiBcIjAgNHB4IDIwcHggcmdiYSgwLDAsMCwwLjA4KVwiLCB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWSgtMnB4KVwiIH19XHJcbiAgPlxyXG4gICAge2NoaWxkcmVufVxyXG4gIDwvQm94PlxyXG4pO1xyXG5cclxuY29uc3QgUHJvcGVydHlVbml0Q2FyZExpc3QgPSAoKSA9PiB7XHJcbiAgY29uc3QgeyByZWNvcmRzLCBsb2FkaW5nLCBlcnJvciB9ID0gdXNlUmVjb3JkcygnUHJvcGVydHlVbml0Jyk7XHJcblxyXG4gIGlmIChsb2FkaW5nKSByZXR1cm4gPEJveCBwPVwibGdcIj48TG9hZGVyIC8+PC9Cb3g+O1xyXG4gIGlmIChlcnJvcikgcmV0dXJuIDxCb3ggcD1cImxnXCI+PFBsYWNlaG9sZGVyPjxINT7guYDguIHguLTguJTguILguYnguK3guJzguLTguJTguJ7guKXguLLguJQ8L0g1PjxwPuC5hOC4oeC5iOC4quC4suC4oeC4suC4o+C4luC4lOC4tuC4h+C4guC5ieC4reC4oeC4ueC4peC4ouC4ueC4meC4tOC4leC5hOC4lOC5iTwvcD48L1BsYWNlaG9sZGVyPjwvQm94PjtcclxuICBpZiAoIXJlY29yZHMgfHwgcmVjb3Jkcy5sZW5ndGggPT09IDApIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxQbGFjZWhvbGRlcj48SDU+4LmE4Lih4LmI4Lih4Li14Lii4Li54LiZ4Li04LiVPC9INT48cD7guYTguKHguYjguJ7guJrguILguYnguK3guKHguLnguKXguKLguLnguJnguLTguJXguJfguLXguYjguJXguKPguIfguIHguLHguJrguYDguIfguLfguYjguK3guJnguYTguII8L3A+PC9QbGFjZWhvbGRlcj48L0JveD47XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8Qm94IHA9XCIyeGxcIj5cclxuICAgICAgPEJveFxyXG4gICAgICAgIGRpc3BsYXk9XCJncmlkXCJcclxuICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zPXtbJzFmcicsICdyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMzQwcHgsIDFmcikpJ119XHJcbiAgICAgICAgc3R5bGU9e3sgZ2FwOiBcIjIwcHhcIiB9fSBcclxuICAgICAgPlxyXG4gICAgICAgIHtyZWNvcmRzLm1hcCgocikgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcGFyYW1zID0gci5wYXJhbXMgPz8ge307XHJcbiAgICAgICAgICBjb25zdCBwcm9wZXJ0eVBvc3RQYXJhbXMgPSByLnBvcHVsYXRlZD8ucHJvcGVydHlQb3N0Py5wYXJhbXMgPz8ge307XHJcbiAgICAgICAgICBjb25zdCBpZCA9IHIuaWQgPz8gcGFyYW1zLmlkO1xyXG5cclxuICAgICAgICAgIGNvbnN0IHVuaXROdW1iZXIgPSBkaXNwbGF5VmFsdWUocGFyYW1zLlVuaXRfTnVtYmVyKTtcclxuICAgICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGRpc3BsYXlWYWx1ZShwcm9wZXJ0eVBvc3RQYXJhbXMuUHJvcGVydHlfTmFtZSwgJ+C5hOC4oeC5iOC4oeC4teC4iuC4t+C5iOC4reC5guC4hOC4o+C4h+C4geC4suC4oycpO1xyXG4gICAgICAgICAgY29uc3Qgc3RhdHVzID0gZGlzcGxheVZhbHVlKHBhcmFtcy5TdGF0dXMpO1xyXG5cclxuICAgICAgICAgIGNvbnN0IGJhZGdlU3R5bGVzID0ge1xyXG4gICAgICAgICAgICBBVkFJTEFCTEU6IHsgYmc6IFwiI2Y2ZmZlZFwiLCBjb2xvcjogXCIjNTJjNDFhXCIgfSxcclxuICAgICAgICAgICAgQk9PS0VEOiB7IGJnOiBcIiNmZmZiZTZcIiwgY29sb3I6IFwiI2ZhYWQxNFwiIH0sXHJcbiAgICAgICAgICAgIFNPTEQ6IHsgYmc6IFwiI2YyZjJmMlwiLCBjb2xvcjogXCIjNTU1XCIgfSxcclxuICAgICAgICAgICAgZGVmYXVsdDogeyBiZzogXCIjZjJmMmYyXCIsIGNvbG9yOiBcIiM1NTVcIiB9LFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGNvbnN0IHN0eWxlID0gYmFkZ2VTdHlsZXNbc3RhdHVzXSB8fCBiYWRnZVN0eWxlcy5kZWZhdWx0O1xyXG5cclxuICAgICAgICAgIGNvbnN0IHN0YXR1c1RyYW5zbGF0aW9ucyA9IHtcclxuICAgICAgICAgICAgQVZBSUxBQkxFOiAn4Lin4LmI4Liy4LiHJyxcclxuICAgICAgICAgICAgUEVORElORzogJ+C4geC4s+C4peC4seC4h+C4lOC4s+C5gOC4meC4tOC4meC4geC4suC4oycsXHJcbiAgICAgICAgICAgIFNPTEQ6ICfguILguLLguKLguYHguKXguYnguKcnLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGNvbnN0IHN0YXR1c1RleHQgPSBzdGF0dXNUcmFuc2xhdGlvbnNbc3RhdHVzXSB8fCBzdGF0dXM7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPENhcmQga2V5PXtpZH0+XHJcbiAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBIZWFkZXIgPT09ICovfVxyXG4gICAgICAgICAgICAgIHsvKiDinIUg4Liq4LmI4Lin4LiZ4LiC4Lit4LiH4Lij4Li54Lib4LmE4Lit4LiE4Lit4LiZ4LiW4Li54LiB4Lil4Lia4Lit4Lit4LiB4LmE4Lib4LmB4Lil4LmJ4LinICovfVxyXG4gICAgICAgICAgICAgIDxCb3g+XHJcbiAgICAgICAgICAgICAgICA8SDIgbT17MH0gZm9udFNpemU9XCJ4bFwiPuC4ouC4ueC4meC4tOC4leC5gOC4peC4guC4l+C4teC5iDoge3VuaXROdW1iZXJ9PC9IMj5cclxuICAgICAgICAgICAgICAgIDxCb3ggY29sb3I9XCJncmV5ODBcIiBtdD1cInhzXCI+PHN0cm9uZz7guYLguITguKPguIfguIHguLLguKM6PC9zdHJvbmc+IHtwcm9wZXJ0eU5hbWV9PC9Cb3g+XHJcbiAgICAgICAgICAgICAgPC9Cb3g+XHJcblxyXG4gICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogRm9vdGVyID09PSAqL31cclxuICAgICAgICAgICAgICA8Qm94XHJcbiAgICAgICAgICAgICAgICBib3JkZXJUb3A9XCIxcHggc29saWRcIlxyXG4gICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I9XCJncmV5MjBcIlxyXG4gICAgICAgICAgICAgICAgbXQ9XCJ4bFwiIHB0PVwibGdcIlxyXG4gICAgICAgICAgICAgICAgZGlzcGxheT1cImZsZXhcIlxyXG4gICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ9XCJzcGFjZS1iZXR3ZWVuXCJcclxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxCb3g+XHJcbiAgICAgICAgICAgICAgICAgIDxCb3hcclxuICAgICAgICAgICAgICAgICAgICBhcz1cInNwYW5cIiBweD1cIm1kXCIgcHk9XCJzbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzPVwibGdcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogc3R5bGUuYmcsIGNvbG9yOiBzdHlsZS5jb2xvciwgZm9udFdlaWdodDogXCJib2xkXCIsIGZvbnRTaXplOiBcIjAuOXJlbVwiIH19XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICB7c3RhdHVzVGV4dH1cclxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgIHsvKiA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgZ2FwPVwibWRcIj5cclxuICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBhcz1cImFcIiBocmVmPXtgL2FkbWluL3Jlc291cmNlcy9Qcm9wZXJ0eVVuaXQvcmVjb3Jkcy8ke2lkfS9zaG93YH0gdmFyaWFudD1cInByaW1hcnlcIj7guJTguLk8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgIDwvQm94PiAqL31cclxuICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgPC9DYXJkPlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KX1cclxuICAgICAgPC9Cb3g+XHJcbiAgICA8L0JveD5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUHJvcGVydHlVbml0Q2FyZExpc3Q7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVjb3JkcyB9IGZyb20gJ2FkbWluanMnO1xyXG5pbXBvcnQgeyBCb3gsIEgyLCBINSwgTG9hZGVyLCBQbGFjZWhvbGRlciwgQmFkZ2UsIFRleHQgfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcclxuXHJcbi8vIEhlbHBlciBGdW5jdGlvbnNcclxuY29uc3QgaXNFbXB0eVZhbHVlID0gKHYpID0+IHYgPT09IG51bGwgfHwgdiA9PT0gdW5kZWZpbmVkIHx8IFN0cmluZyh2KS50cmltKCkgPT09IFwiXCI7XHJcbmNvbnN0IGRpc3BsYXlWYWx1ZSA9ICh2LCBmYWxsYmFjayA9IFwi4Lin4LmI4Liy4LiHXCIpID0+IChpc0VtcHR5VmFsdWUodikgPyBmYWxsYmFjayA6IHYpO1xyXG5cclxuY29uc3QgQ2FyZCA9ICh7IGNoaWxkcmVuIH0pID0+IChcclxuICA8Qm94XHJcbiAgICB2YXJpYW50PVwid2hpdGVcIlxyXG4gICAgYm94U2hhZG93PVwiY2FyZFwiXHJcbiAgICBib3JkZXJSYWRpdXM9XCJ4bFwiXHJcbiAgICBwPVwieGxcIlxyXG4gICAgbWI9XCIyeGxcIlxyXG4gICAgc3R5bGU9e3sgdHJhbnNpdGlvbjogXCJib3gtc2hhZG93IDAuMnMgZWFzZSwgdHJhbnNmb3JtIDAuMnMgZWFzZVwiIH19XHJcbiAgICBfaG92ZXI9e3sgYm94U2hhZG93OiBcIjAgNHB4IDIwcHggcmdiYSgwLDAsMCwwLjA4KVwiLCB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWSgtMnB4KVwiIH19XHJcbiAgPlxyXG4gICAge2NoaWxkcmVufVxyXG4gIDwvQm94PlxyXG4pO1xyXG5cclxuY29uc3QgRGVwb3NpdENhcmRMaXN0ID0gKCkgPT4ge1xyXG4gIGNvbnN0IHsgcmVjb3JkcywgbG9hZGluZywgZXJyb3IgfSA9IHVzZVJlY29yZHMoXCJEZXBvc2l0XCIpO1xyXG5cclxuICBpZiAobG9hZGluZykgcmV0dXJuIDxCb3ggcD1cImxnXCI+PExvYWRlciAvPjwvQm94PjtcclxuICBpZiAoZXJyb3IpIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxQbGFjZWhvbGRlcj48SDU+4LmA4LiB4Li04LiU4LiC4LmJ4Lit4Lic4Li04LiU4Lie4Lil4Liy4LiUPC9INT48cD7guYTguKHguYjguKrguLLguKHguLLguKPguJbguJTguLbguIfguILguYnguK3guKHguLnguKXguYDguIfguLTguJnguKHguLHguJTguIjguLPguYTguJTguYk8L3A+PC9QbGFjZWhvbGRlcj48L0JveD47XHJcbiAgaWYgKCFyZWNvcmRzIHx8IHJlY29yZHMubGVuZ3RoID09PSAwKSByZXR1cm4gPEJveCBwPVwibGdcIj48UGxhY2Vob2xkZXI+PEg1PuC5hOC4oeC5iOC4oeC4teC4guC5ieC4reC4oeC4ueC4peC5gOC4h+C4tOC4meC4oeC4seC4lOC4iOC4szwvSDU+PHA+4LmE4Lih4LmI4Lie4Lia4LiC4LmJ4Lit4Lih4Li54Lil4LiX4Li14LmI4LiV4Lij4LiH4LiB4Lix4Lia4LmA4LiH4Li34LmI4Lit4LiZ4LmE4LiCPC9wPjwvUGxhY2Vob2xkZXI+PC9Cb3g+O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPEJveCBwPVwiMnhsXCI+XHJcbiAgICAgIDxCb3hcclxuICAgICAgICBkaXNwbGF5PVwiZ3JpZFwiXHJcbiAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1ucz17WycxZnInLCAncmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDM0MHB4LCAxZnIpKSddfVxyXG4gICAgICAgIHN0eWxlPXt7IGdhcDogXCIyMHB4XCIgfX0gXHJcbiAgICAgID5cclxuICAgICAgICB7cmVjb3Jkcy5tYXAoKHIpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHIucGFyYW1zID8/IHt9O1xyXG4gICAgICAgICAgY29uc3QgdXNlclBhcmFtcyA9IHIucG9wdWxhdGVkPy5Vc2VyPy5wYXJhbXMgPz8ge307XHJcbiAgICAgICAgICBjb25zdCBwb3N0UGFyYW1zID0gci5wb3B1bGF0ZWQ/LlBvc3Q/LnBhcmFtcyA/PyB7fTtcclxuICAgICAgICAgIGNvbnN0IHVuaXRQYXJhbXMgPSByLnBvcHVsYXRlZD8uVW5pdD8ucGFyYW1zID8/IHt9O1xyXG4gICAgICAgICAgY29uc3QgaWQgPSByLmlkID8/IHBhcmFtcy5pZDtcclxuXHJcbiAgICAgICAgICBjb25zdCB1c2VyTmFtZSA9IGAke2Rpc3BsYXlWYWx1ZSh1c2VyUGFyYW1zLkZpcnN0X25hbWUsICcnKX0gJHtkaXNwbGF5VmFsdWUodXNlclBhcmFtcy5MYXN0X25hbWUsICcnKX1gLnRyaW0oKSB8fCBcIuC5hOC4oeC5iOC4oeC4teC4iuC4t+C5iOC4rVwiO1xyXG4gICAgICAgICAgY29uc3QgZGVwb3NpdEFtb3VudCA9IHBhcmFtcy5EZXBvc2l0X0Ftb3VudCAhPSBudWxsID8gYCR7TnVtYmVyKHBhcmFtcy5EZXBvc2l0X0Ftb3VudCkudG9Mb2NhbGVTdHJpbmcoKX0g4Lia4Liy4LiXYCA6IFwiTi9BXCI7XHJcbiAgICAgICAgICBjb25zdCBwcm9wZXJ0eU5hbWUgPSBkaXNwbGF5VmFsdWUocG9zdFBhcmFtcy5Qcm9wZXJ0eV9OYW1lLCAnTi9BJyk7XHJcbiAgICAgICAgICBjb25zdCB1bml0TnVtYmVyID0gZGlzcGxheVZhbHVlKHVuaXRQYXJhbXMuVW5pdF9OdW1iZXIsICdOL0EnKTtcclxuICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IGRpc3BsYXlWYWx1ZShwYXJhbXMuRGVwb3NpdF9TdGF0dXMsICdVTktOT1dOJyk7XHJcbiAgICAgICAgICBjb25zdCBjcmVhdGVkQXQgPSBwYXJhbXMuY3JlYXRlZEF0ID8gbmV3IERhdGUocGFyYW1zLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwidGgtVEhcIiwgeyB5ZWFyOiAnbnVtZXJpYycsIG1vbnRoOiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJ30pIDogJ04vQSc7XHJcblxyXG4gICAgICAgICAgY29uc3QgYmFkZ2VTdHlsZXMgPSB7XHJcbiAgICAgICAgICAgIFBFTkRJTkc6IHsgYmc6IFwiI2ZmZmJlNlwiLCBjb2xvcjogXCIjZmFhZDE0XCIgfSxcclxuICAgICAgICAgICAgQ09ORklSTUVEOiB7IGJnOiBcIiNmNmZmZWRcIiwgY29sb3I6IFwiIzUyYzQxYVwiIH0sXHJcbiAgICAgICAgICAgIFJFSkVDVEVEOiB7IGJnOiBcIiNmZmYxZjBcIiwgY29sb3I6IFwiI2Y1MjIyZFwiIH0sXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHsgYmc6IFwiI2YyZjJmMlwiLCBjb2xvcjogXCIjNTU1XCIgfSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBjb25zdCBzdGF0dXNUcmFuc2xhdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIFBFTkRJTkc6ICfguKPguK3guJTguLPguYDguJnguLTguJnguIHguLLguKMnLFxyXG4gICAgICAgICAgICBDT05GSVJNRUQ6ICfguKLguLfguJnguKLguLHguJnguYHguKXguYnguKcnLFxyXG4gICAgICAgICAgICBSRUpFQ1RFRDogJ+C4luC4ueC4geC4m+C4j+C4tOC5gOC4quC4mCcsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgXHJcbiAgICAgICAgICBjb25zdCBzdHlsZSA9IGJhZGdlU3R5bGVzW3N0YXR1c10gfHwgYmFkZ2VTdHlsZXMuZGVmYXVsdDtcclxuICAgICAgICAgIGNvbnN0IHN0YXR1c1RleHQgPSBzdGF0dXNUcmFuc2xhdGlvbnNbc3RhdHVzXSB8fCBzdGF0dXM7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPENhcmQga2V5PXtpZH0+XHJcbiAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBIZWFkZXIgPT09ICovfVxyXG4gICAgICAgICAgICAgIHsvKiDinIUg4Liq4LmI4Lin4LiZ4LiC4Lit4LiH4Lij4Li54Lib4LmE4Lit4LiE4Lit4LiZ4LiW4Li54LiB4Lil4Lia4Lit4Lit4LiB4LmE4Lib4LmB4Lil4LmJ4LinICovfVxyXG4gICAgICAgICAgICAgIDxCb3g+XHJcbiAgICAgICAgICAgICAgICA8SDIgbT17MH0gZm9udFNpemU9XCJ4bFwiPntkZXBvc2l0QW1vdW50fTwvSDI+XHJcbiAgICAgICAgICAgICAgICA8VGV4dCBjb2xvcj1cImdyZXk4MFwiIG10PVwieHNcIj48c3Ryb25nPuC4nOC4ueC5ieC4l+C4s+C4o+C4suC4ouC4geC4suC4ozo8L3N0cm9uZz4ge3VzZXJOYW1lfTwvVGV4dD5cclxuICAgICAgICAgICAgICAgIDxUZXh0IGNvbG9yPVwiZ3JleTgwXCI+PHN0cm9uZz7guYLguITguKPguIfguIHguLLguKM6PC9zdHJvbmc+IHtwcm9wZXJ0eU5hbWV9ICjguKLguLnguJnguLTguJU6IHt1bml0TnVtYmVyfSk8L1RleHQ+XHJcbiAgICAgICAgICAgICAgPC9Cb3g+XHJcblxyXG4gICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogRm9vdGVyID09PSAqL31cclxuICAgICAgICAgICAgICA8Qm94XHJcbiAgICAgICAgICAgICAgICBib3JkZXJUb3A9XCIxcHggc29saWRcIlxyXG4gICAgICAgICAgICAgICAgYm9yZGVyQ29sb3I9XCJncmV5MjBcIlxyXG4gICAgICAgICAgICAgICAgbXQ9XCJ4bFwiIHB0PVwibGdcIlxyXG4gICAgICAgICAgICAgICAgZGlzcGxheT1cImZsZXhcIlxyXG4gICAgICAgICAgICAgICAganVzdGlmeUNvbnRlbnQ9XCJzcGFjZS1iZXR3ZWVuXCJcclxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxCb3g+XHJcbiAgICAgICAgICAgICAgICAgIDxCb3hcclxuICAgICAgICAgICAgICAgICAgICBhcz1cInNwYW5cIiBweD1cIm1kXCIgcHk9XCJzbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzPVwibGdcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogc3R5bGUuYmcsIGNvbG9yOiBzdHlsZS5jb2xvciwgZm9udFdlaWdodDogXCJib2xkXCIsIGZvbnRTaXplOiBcIjAuOXJlbVwiIH19XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICB7c3RhdHVzVGV4dH1cclxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgIDxCb3ggZm9udFNpemU9XCJzbVwiIGNvbG9yPVwiZ3JleTYwXCIgbXQ9XCJzbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIOC4l+C4s+C4o+C4suC4ouC4geC4suC4o+C5gOC4oeC4t+C5iOC4rToge2NyZWF0ZWRBdH1cclxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgPC9DYXJkPlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KX1cclxuICAgICAgPC9Cb3g+XHJcbiAgICA8L0JveD5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGVwb3NpdENhcmRMaXN0OyIsIi8vIHNlcnZlci9BZG1pbi9jb21wb25lbnRzL1Rlc3RQYWdpbmF0aW9uLmpzeFxyXG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyB1c2VSZWNvcmRzIH0gZnJvbSAnYWRtaW5qcyc7XHJcbmltcG9ydCB7IEJveCwgSDUsIExvYWRlciwgUGxhY2Vob2xkZXIsIFRleHQsIFBhZ2luYXRpb24gfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcclxuXHJcbmNvbnN0IFRlc3REZXBvc2l0Q29tcG9uZW50ID0gKCkgPT4ge1xyXG4gIGNvbnN0IHsgcmVjb3JkcywgbG9hZGluZywgcGFnZSwgcGVyUGFnZSwgdG90YWwsIGhhbmRsZUNoYW5nZVBhZ2UgfSA9IHVzZVJlY29yZHMoJ1VzZXInKTtcclxuXHJcbiAgY29uc29sZS5sb2coXCJURVNUIFBBR0lOQVRJT04gREFUQTpcIiwgeyBwYWdlLCBwZXJQYWdlLCB0b3RhbCB9KTtcclxuXHJcbiAgaWYgKGxvYWRpbmcpIHJldHVybiA8TG9hZGVyIC8+O1xyXG4gIGlmICghcmVjb3JkcykgcmV0dXJuIDxQbGFjZWhvbGRlcj48SDU+Tm8gcmVjb3JkczwvSDU+PC9QbGFjZWhvbGRlcj47XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8Qm94IHA9XCJsZ1wiIHZhcmlhbnQ9XCJ3aGl0ZVwiPlxyXG4gICAgICA8SDU+UGFnaW5hdGlvbiBUZXN0IENvbXBvbmVudDwvSDU+XHJcbiAgICAgIDxUZXh0PlRvdGFsOiB7dG90YWx9LCBQZXJQYWdlOiB7cGVyUGFnZX0sIEN1cnJlbnQgUGFnZToge3BhZ2V9PC9UZXh0PlxyXG4gICAgICA8dWw+XHJcbiAgICAgICAge3JlY29yZHMubWFwKHIgPT4gPGxpIGtleT17ci5pZH0+VXNlciBJRDoge3IuaWR9PC9saT4pfVxyXG4gICAgICA8L3VsPlxyXG4gICAgICA8UGFnaW5hdGlvbiBwYWdlPXtwYWdlfSBwZXJQYWdlPXtwZXJQYWdlfSB0b3RhbD17dG90YWx9IG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2VQYWdlfSAvPlxyXG4gICAgPC9Cb3g+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFRlc3REZXBvc2l0Q29tcG9uZW50OyIsIi8vIHNlcnZlci9BZG1pbi9jb21wb25lbnRzL1VzZXJDYXJkTGlzdC5qc3hcclxuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVjb3JkcyB9IGZyb20gJ2FkbWluanMnO1xyXG5pbXBvcnQgeyBCb3gsIEgyLCBMb2FkZXIsIFBsYWNlaG9sZGVyLCBINSwgQnV0dG9uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XHJcblxyXG4vLyBIZWxwZXIgRnVuY3Rpb25zXHJcbmNvbnN0IGlzRW1wdHlWYWx1ZSA9ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCB8fCBTdHJpbmcodikudHJpbSgpID09PSBcIlwiO1xyXG5jb25zdCBkaXNwbGF5VmFsdWUgPSAodikgPT4gKGlzRW1wdHlWYWx1ZSh2KSA/IFwiTi9BXCIgOiB2KTtcclxuXHJcbmNvbnN0IENhcmQgPSAoeyBjaGlsZHJlbiB9KSA9PiAoXHJcbiAgPEJveFxyXG4gICAgdmFyaWFudD1cIndoaXRlXCJcclxuICAgIGJveFNoYWRvdz1cImNhcmRcIlxyXG4gICAgYm9yZGVyUmFkaXVzPVwieGxcIlxyXG4gICAgcD1cInhsXCJcclxuICAgIG1iPVwieGxcIlxyXG4gICAgX2hvdmVyPXt7IGJveFNoYWRvdzogXCIwIDAgMTBweCByZ2JhKDAsMCwwLDAuMSlcIiB9fVxyXG4gID5cclxuICAgIHtjaGlsZHJlbn1cclxuICA8L0JveD5cclxuKTtcclxuXHJcbmNvbnN0IFVzZXJDYXJkTGlzdCA9ICgpID0+IHtcclxuICBjb25zdCB7IHJlY29yZHMsIGxvYWRpbmcsIGVycm9yIH0gPSB1c2VSZWNvcmRzKCdVc2VyJyk7XHJcblxyXG4gIGlmIChsb2FkaW5nKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8Qm94IHA9XCJsZ1wiPlxyXG4gICAgICAgIDxMb2FkZXIgLz5cclxuICAgICAgPC9Cb3g+XHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgaWYgKGVycm9yKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICA8Qm94IHA9XCJsZ1wiPlxyXG4gICAgICAgIDxQbGFjZWhvbGRlcj5cclxuICAgICAgICAgIDxINT7guYDguIHguLTguJTguILguYnguK3guJzguLTguJTguJ7guKXguLLguJQ8L0g1PlxyXG4gICAgICAgICAgPHA+4LmE4Lih4LmI4Liq4Liy4Lih4Liy4Lij4LiW4LiU4Li24LiH4LiC4LmJ4Lit4Lih4Li54Lil4Lic4Li54LmJ4LmD4LiK4LmJ4LiH4Liy4LiZ4LmE4LiU4LmJPC9wPlxyXG4gICAgICAgIDwvUGxhY2Vob2xkZXI+XHJcbiAgICAgIDwvQm94PlxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGlmICghcmVjb3JkcyB8fCByZWNvcmRzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgPEJveCBwPVwibGdcIj5cclxuICAgICAgICA8UGxhY2Vob2xkZXI+XHJcbiAgICAgICAgICA8SDU+4LmE4Lih4LmI4Lih4Li14Lic4Li54LmJ4LmD4LiK4LmJ4LiH4Liy4LiZPC9INT5cclxuICAgICAgICAgIDxwPuC5hOC4oeC5iOC4nuC4muC4nOC4ueC5ieC5g+C4iuC5ieC4h+C4suC4meC4l+C4teC5iOC4leC4o+C4h+C4geC4seC4muC5gOC4h+C4t+C5iOC4reC4meC5hOC4guC4geC4suC4o+C4geC4o+C4reC4h+C4guC4reC4h+C4hOC4uOC4kzwvcD5cclxuICAgICAgICA8L1BsYWNlaG9sZGVyPlxyXG4gICAgICA8L0JveD5cclxuICAgICk7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPEJveCBwPVwieGxcIj5cclxuICAgICAgPEJveFxyXG4gICAgICAgIGRpc3BsYXk9XCJncmlkXCJcclxuICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zPXtbJzFmcicsICdyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMzQwcHgsIDFmcikpJ119XHJcbiAgICAgICAgZ2FwPVwieGxcIlxyXG4gICAgICA+XHJcbiAgICAgICAge3JlY29yZHMubWFwKChyKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBwYXJhbXMgPSByLnBhcmFtcyA/PyB7fTtcclxuICAgICAgICAgIGNvbnN0IGlkID0gci5pZCA/PyBwYXJhbXMuaWQ7XHJcblxyXG4gICAgICAgICAgY29uc3QgZnVsbE5hbWUgPSBgJHtkaXNwbGF5VmFsdWUocGFyYW1zLkZpcnN0X25hbWUpfSAke2Rpc3BsYXlWYWx1ZShwYXJhbXMuTGFzdF9uYW1lKX1gO1xyXG4gICAgICAgICAgY29uc3QgZW1haWwgPSBkaXNwbGF5VmFsdWUocGFyYW1zLkVtYWlsKTtcclxuICAgICAgICAgIGNvbnN0IHBob25lID0gZGlzcGxheVZhbHVlKHBhcmFtcy5QaG9uZSk7XHJcbiAgICAgICAgICBjb25zdCB1c2VyVHlwZSA9IGRpc3BsYXlWYWx1ZShwYXJhbXMudXNlclR5cGUpO1xyXG4gICAgICAgICAgY29uc3QgaW1hZ2VVcmwgPSBwYXJhbXMuaW1hZ2UgfHwgbnVsbDtcclxuICAgICAgICAgIGNvbnN0IGNyZWF0ZWRBdCA9IG5ldyBEYXRlKHBhcmFtcy5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInRoLVRIXCIsIHtcclxuICAgICAgICAgICAgeWVhcjogJ251bWVyaWMnLFxyXG4gICAgICAgICAgICBtb250aDogJ3Nob3J0JyxcclxuICAgICAgICAgICAgZGF5OiAnbnVtZXJpYydcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgIC8vIOKchSDguYDguJ7guLTguYjguKHguKrguLXguJXguLLguKHguJvguKPguLDguYDguKDguJdcclxuICAgICAgICAgIGNvbnN0IGJhZGdlU3R5bGVzID0ge1xyXG4gICAgICAgICAgICBBZG1pbjoge1xyXG4gICAgICAgICAgICAgIGJnOiBcIiNlNmYwZmZcIiwgLy8g4Lif4LmJ4Liy4Lit4LmI4Lit4LiZXHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiIzAwNDdhYlwiLCAvLyDguJnguYnguLPguYDguIfguLTguJnguYDguILguYnguKFcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgU2VsbGVyOiB7XHJcbiAgICAgICAgICAgICAgYmc6IFwiI2VhZmZlYVwiLCAvLyDguYDguILguLXguKLguKfguK3guYjguK3guJlcclxuICAgICAgICAgICAgICBjb2xvcjogXCIjMDA4MDAwXCIsIC8vIOC5gOC4guC4teC4ouC4p+C5gOC4guC5ieC4oVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBCdXllcjoge1xyXG4gICAgICAgICAgICAgIGJnOiBcIiNlYWZmZWFcIiwgLy8g4LmA4LiC4Li14Lii4Lin4Lit4LmI4Lit4LiZXHJcbiAgICAgICAgICAgICAgY29sb3I6IFwiIzAwODAwMFwiLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgICAgICAgYmc6IFwiI2YyZjJmMlwiLFxyXG4gICAgICAgICAgICAgIGNvbG9yOiBcIiM1NTVcIixcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgY29uc3Qgc3R5bGUgPSBiYWRnZVN0eWxlc1t1c2VyVHlwZV0gfHwgYmFkZ2VTdHlsZXMuZGVmYXVsdDtcclxuXHJcbiAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8Q2FyZCBrZXk9e2lkfT5cclxuICAgICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIGdyaWRHYXA9XCJsZ1wiPlxyXG4gICAgICAgICAgICAgICAgPEJveFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aD17ODB9XHJcbiAgICAgICAgICAgICAgICAgIGhlaWdodD17ODB9XHJcbiAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1cz1cIjUwJVwiXHJcbiAgICAgICAgICAgICAgICAgIG92ZXJmbG93PVwiaGlkZGVuXCJcclxuICAgICAgICAgICAgICAgICAgYmc9XCJncmV5MjBcIlxyXG4gICAgICAgICAgICAgICAgICBmbGV4U2hyaW5rPXswfVxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICB7aW1hZ2VVcmwgPyAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgc3JjPXtpbWFnZVVybH1cclxuICAgICAgICAgICAgICAgICAgICAgIGFsdD1cInByb2ZpbGVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RGaXQ6IFwiY292ZXJcIixcclxuICAgICAgICAgICAgICAgICAgICAgIH19XHJcbiAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgKSA6IChcclxuICAgICAgICAgICAgICAgICAgICA8Qm94XHJcbiAgICAgICAgICAgICAgICAgICAgICB3aWR0aD1cIjEwMCVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiMTAwJVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBkaXNwbGF5PVwiZmxleFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yPVwiZ3JleTYwXCJcclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICBObyBJbWdcclxuICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgPEJveD5cclxuICAgICAgICAgICAgICAgICAgPEgyIG09ezB9IGZvbnRTaXplPVwieGxcIj57ZnVsbE5hbWV9PC9IMj5cclxuICAgICAgICAgICAgICAgICAgPEJveCBjb2xvcj1cImdyZXk4MFwiIG10PVwieHNcIj57ZW1haWx9PC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgIDxCb3ggY29sb3I9XCJncmV5ODBcIj57cGhvbmV9PC9Cb3g+XHJcbiAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICA8L0JveD5cclxuXHJcbiAgICAgICAgICAgICAgPEJveFxyXG4gICAgICAgICAgICAgICAgYm9yZGVyVG9wPVwiMXB4IHNvbGlkXCJcclxuICAgICAgICAgICAgICAgIGJvcmRlckNvbG9yPVwiZ3JleTIwXCJcclxuICAgICAgICAgICAgICAgIG10PVwibGdcIlxyXG4gICAgICAgICAgICAgICAgcHQ9XCJsZ1wiXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5PVwiZmxleFwiXHJcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIlxyXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXHJcbiAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgPEJveD5cclxuICAgICAgICAgICAgICAgICAgPEJveFxyXG4gICAgICAgICAgICAgICAgICAgIGFzPVwic3BhblwiXHJcbiAgICAgICAgICAgICAgICAgICAgcHg9XCJtZFwiXHJcbiAgICAgICAgICAgICAgICAgICAgcHk9XCJzbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzPVwibGdcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHN0eWxlLmJnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgY29sb3I6IHN0eWxlLmNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogXCJib2xkXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIwLjg1cmVtXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICBib3hTaGFkb3c6IFwiMCAwIDRweCByZ2JhKDAsMCwwLDAuMDUpXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIHt1c2VyVHlwZX1cclxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgIDxCb3ggZm9udFNpemU9XCJzbVwiIGNvbG9yPVwiZ3JleTYwXCIgbXQ9XCJzbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIOC5gOC4m+C5h+C4meC4quC4oeC4suC4iuC4tOC4geC5gOC4oeC4t+C5iOC4rToge2NyZWF0ZWRBdH1cclxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBncmlkR2FwPVwibWRcIj5cclxuICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBhcz1cImFcIiBocmVmPXtgL2FkbWluL3Jlc291cmNlcy9Vc2VyL3JlY29yZHMvJHtpZH0vc2hvd2B9IHZhcmlhbnQ9XCJwcmltYXJ5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAg4LiU4Li5XHJcbiAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e2AvYWRtaW4vcmVzb3VyY2VzL1VzZXIvcmVjb3Jkcy8ke2lkfS9lZGl0YH0+XHJcbiAgICAgICAgICAgICAgICAgICAg4LmB4LiB4LmJ4LmE4LiCXHJcbiAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgIDwvQ2FyZD5cclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSl9XHJcbiAgICAgIDwvQm94PlxyXG4gICAgPC9Cb3g+XHJcbiAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IFVzZXJDYXJkTGlzdDtcclxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVjb3JkcyB9IGZyb20gJ2FkbWluanMnO1xyXG5pbXBvcnQgeyBCb3gsIEgyLCBINSwgTG9hZGVyLCBQbGFjZWhvbGRlciwgQnV0dG9uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XHJcblxyXG4vLyBIZWxwZXIgRnVuY3Rpb25zXHJcbmNvbnN0IGlzRW1wdHlWYWx1ZSA9ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCB8fCBTdHJpbmcodikudHJpbSgpID09PSBcIlwiO1xyXG5jb25zdCBkaXNwbGF5VmFsdWUgPSAodiwgZmFsbGJhY2sgPSBcIuC4p+C5iOC4suC4h1wiKSA9PiAoaXNFbXB0eVZhbHVlKHYpID8gZmFsbGJhY2sgOiB2KTtcclxuY29uc3QgdHJ1bmNhdGUgPSAodGV4dCwgbiA9IDM1KSA9PiB0ZXh0ICYmIHRleHQubGVuZ3RoID4gbiA/IHRleHQuc2xpY2UoMCwgbiAtIDEpICsgJ+KApicgOiB0ZXh0O1xyXG5cclxuY29uc3QgQ2FyZCA9ICh7IGNoaWxkcmVuIH0pID0+IChcclxuICAgIDxCb3hcclxuICAgICAgICB2YXJpYW50PVwid2hpdGVcIlxyXG4gICAgICAgIGJveFNoYWRvdz1cImNhcmRcIlxyXG4gICAgICAgIGJvcmRlclJhZGl1cz1cInhsXCJcclxuICAgICAgICBwPVwieGxcIlxyXG4gICAgICAgIG1iPVwiMnhsXCJcclxuICAgICAgICBzdHlsZT17eyB0cmFuc2l0aW9uOiBcImJveC1zaGFkb3cgMC4ycyBlYXNlLCB0cmFuc2Zvcm0gMC4ycyBlYXNlXCIgfX1cclxuICAgICAgICBfaG92ZXI9e3sgYm94U2hhZG93OiBcIjAgNHB4IDIwcHggcmdiYSgwLDAsMCwwLjA4KVwiLCB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWSgtMnB4KVwiIH19XHJcbiAgICA+XHJcbiAgICAgICAge2NoaWxkcmVufVxyXG4gICAgPC9Cb3g+XHJcbik7XHJcblxyXG5jb25zdCBEb2N1bWVudENhcmRMaXN0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgeyByZWNvcmRzLCBsb2FkaW5nLCBlcnJvciB9ID0gdXNlUmVjb3JkcygnRG9jdW1lbnRVcGxvYWQnKTtcclxuXHJcbiAgICBpZiAobG9hZGluZykgcmV0dXJuIDxCb3ggcD1cImxnXCI+PExvYWRlciAvPjwvQm94PjtcclxuICAgIGlmIChlcnJvcikgcmV0dXJuIDxCb3ggcD1cImxnXCI+PFBsYWNlaG9sZGVyPjxINT7guYDguIHguLTguJTguILguYnguK3guJzguLTguJTguJ7guKXguLLguJQ8L0g1PjxwPuC5hOC4oeC5iOC4quC4suC4oeC4suC4o+C4luC4lOC4tuC4h+C4guC5ieC4reC4oeC4ueC4peC5gOC4reC4geC4quC4suC4o+C5hOC4lOC5iTwvcD48L1BsYWNlaG9sZGVyPjwvQm94PjtcclxuICAgIGlmICghcmVjb3JkcyB8fCByZWNvcmRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDxCb3ggcD1cImxnXCI+PFBsYWNlaG9sZGVyPjxINT7guYTguKHguYjguKHguLXguYDguK3guIHguKrguLLguKM8L0g1PjxwPuC5hOC4oeC5iOC4nuC4muC4guC5ieC4reC4oeC4ueC4peC5gOC4reC4geC4quC4suC4o+C4l+C4teC5iOC4leC4o+C4h+C4geC4seC4muC5gOC4h+C4t+C5iOC4reC4meC5hOC4gjwvcD48L1BsYWNlaG9sZGVyPjwvQm94PjtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICAgIDxCb3ggcD1cIjJ4bFwiPlxyXG4gICAgICAgICAgICA8Qm94XHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5PVwiZ3JpZFwiXHJcbiAgICAgICAgICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zPXtbJzFmcicsICdyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMzQwcHgsIDFmcikpJ119XHJcbiAgICAgICAgICAgICAgICBzdHlsZT17eyBnYXA6IFwiMjBweFwiIH19XHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIHtyZWNvcmRzLm1hcCgocikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHIucGFyYW1zID8/IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHVzZXJQYXJhbXMgPSByLnBvcHVsYXRlZD8uVXNlcj8ucGFyYW1zID8/IHt9O1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlkID0gci5pZCA/PyBwYXJhbXMuaWQ7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRvY3VtZW50TmFtZSA9IGRpc3BsYXlWYWx1ZShwYXJhbXMuRG9jdW1lbnROYW1lLCAn4LmE4Lih4LmI4Lih4Li14LiK4Li34LmI4Lit4LmA4Lit4LiB4Liq4Liy4LijJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZG9jdW1lbnRVcmwgPSBwYXJhbXMuRG9jdW1lbnRVcmw7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzID0gZGlzcGxheVZhbHVlKHBhcmFtcy5SZXZpZXdfU3RhdHVzKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyTmFtZSA9IGAke2Rpc3BsYXlWYWx1ZSh1c2VyUGFyYW1zLkZpcnN0X25hbWUsICcnKX0gJHtkaXNwbGF5VmFsdWUodXNlclBhcmFtcy5MYXN0X25hbWUsICcnKX1gLnRyaW0oKSB8fCBcIuC5hOC4oeC5iOC4oeC4teC4guC5ieC4reC4oeC4ueC4pVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNyZWF0ZWRBdCA9IHBhcmFtcy5jcmVhdGVkQXQgPyBuZXcgRGF0ZShwYXJhbXMuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoXCJ0aC1USFwiLCB7IHllYXI6ICdudW1lcmljJywgbW9udGg6ICdzaG9ydCcsIGRheTogJ251bWVyaWMnIH0pIDogJ04vQSc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGJhZGdlU3R5bGVzID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQRU5ESU5HOiB7IGJnOiBcIiNmZmZiZTZcIiwgY29sb3I6IFwiI2ZhYWQxNFwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQUFJPVkVEOiB7IGJnOiBcIiNmNmZmZWRcIiwgY29sb3I6IFwiIzUyYzQxYVwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFSkVDVEVEOiB7IGJnOiBcIiNmZmYxZjBcIiwgY29sb3I6IFwiI2Y1MjIyZFwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEhJRERFTjogeyBiZzogXCIjZjJmMmYyXCIsIGNvbG9yOiBcIiM1NTVcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB7IGJnOiBcIiNmMmYyZjJcIiwgY29sb3I6IFwiIzU1NVwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBzdHlsZSA9IGJhZGdlU3R5bGVzW3N0YXR1c10gfHwgYmFkZ2VTdHlsZXMuZGVmYXVsdDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzVHJhbnNsYXRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBQRU5ESU5HOiAn4Lij4Lit4LiV4Lij4Lin4LiI4Liq4Lit4LiaJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgQVBQUk9WRUQ6ICfguK3guJnguLjguKHguLHguJXguLTguYHguKXguYnguKcnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBSRUpFQ1RFRDogJ+C4luC4ueC4geC4m+C4j+C4tOC5gOC4quC4mCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEhJRERFTjogXCLguKrguLPguYDguKPguYfguIhcIlxyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzVGV4dCA9IHN0YXR1c1RyYW5zbGF0aW9uc1tzdGF0dXNdIHx8IHN0YXR1cztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPENhcmQga2V5PXtpZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogPT09IFNlY3Rpb246IEhlYWRlciA9PT0gKi99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Lyog4pyFIOC4quC5iOC4p+C4meC4guC4reC4h+C4o+C4ueC4m+C5hOC4reC4hOC4reC4meC4luC4ueC4geC4peC4muC4reC4reC4geC5hOC4m+C5geC4peC5ieC4pyAqL31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3g+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEgyIG09ezB9IGZvbnRTaXplPVwibFwiIHRpdGxlPXtkb2N1bWVudE5hbWV9Pnt0cnVuY2F0ZShkb2N1bWVudE5hbWUpfTwvSDI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveCBjb2xvcj1cImdyZXk4MFwiIG10PVwieHNcIj48c3Ryb25nPuC4nOC4ueC5ieC4reC4seC4m+C5guC4q+C4peC4lDo8L3N0cm9uZz4ge3VzZXJOYW1lfTwvQm94PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBGb290ZXIgPT09ICovfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclRvcD1cIjFweCBzb2xpZFwiIGJvcmRlckNvbG9yPVwiZ3JleTIwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdD1cInhsXCIgcHQ9XCJsZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGxheT1cImZsZXhcIiBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcz1cInNwYW5cIiBweD1cIm1kXCIgcHk9XCJzbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM9XCJsZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17eyBiYWNrZ3JvdW5kQ29sb3I6IHN0eWxlLmJnLCBjb2xvcjogc3R5bGUuY29sb3IsIGZvbnRXZWlnaHQ6IFwiYm9sZFwiLCBmb250U2l6ZTogXCIwLjlyZW1cIiB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c3RhdHVzVGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3ggZm9udFNpemU9XCJzbVwiIGNvbG9yPVwiZ3JleTYwXCIgbXQ9XCJzbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4Lit4Lix4Lib4LmC4Lir4Lil4LiU4LmA4Lih4Li34LmI4LitOiB7Y3JlYXRlZEF0fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcz1cImFcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHJlZj17ZG9jdW1lbnRVcmx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFkb2N1bWVudFVybH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4LiU4Li54LmE4Lif4Lil4LmMXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ2FyZD5cclxuICAgICAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgICAgfSl9XHJcbiAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgIDwvQm94PlxyXG4gICAgKTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IERvY3VtZW50Q2FyZExpc3Q7IiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgdXNlUmVjb3JkcyB9IGZyb20gJ2FkbWluanMnO1xyXG5pbXBvcnQgeyBCb3gsIEgyLCBINSwgTG9hZGVyLCBQbGFjZWhvbGRlciwgQnV0dG9uLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XHJcblxyXG4vLyBIZWxwZXIgRnVuY3Rpb25zXHJcbmNvbnN0IGlzRW1wdHlWYWx1ZSA9ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCB8fCBTdHJpbmcodikudHJpbSgpID09PSBcIlwiO1xyXG5jb25zdCBkaXNwbGF5VmFsdWUgPSAodiwgZmFsbGJhY2sgPSBcIuC4p+C5iOC4suC4h1wiKSA9PiAoaXNFbXB0eVZhbHVlKHYpID8gZmFsbGJhY2sgOiB2KTtcclxuXHJcbmNvbnN0IENhcmQgPSAoeyBjaGlsZHJlbiB9KSA9PiAoXHJcbiAgPEJveFxyXG4gICAgdmFyaWFudD1cIndoaXRlXCJcclxuICAgIGJveFNoYWRvdz1cImNhcmRcIlxyXG4gICAgYm9yZGVyUmFkaXVzPVwieGxcIlxyXG4gICAgcD1cInhsXCJcclxuICAgIG1iPVwiMnhsXCJcclxuICAgIHN0eWxlPXt7IHRyYW5zaXRpb246IFwiYm94LXNoYWRvdyAwLjJzIGVhc2UsIHRyYW5zZm9ybSAwLjJzIGVhc2VcIiB9fVxyXG4gICAgX2hvdmVyPXt7IGJveFNoYWRvdzogXCIwIDRweCAyMHB4IHJnYmEoMCwwLDAsMC4wOClcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoLTJweClcIiB9fVxyXG4gID5cclxuICAgIHtjaGlsZHJlbn1cclxuICA8L0JveD5cclxuKTtcclxuXHJcbmNvbnN0IFBheW1lbnRDYXJkTGlzdCA9ICgpID0+IHtcclxuICBjb25zdCB7IHJlY29yZHMsIGxvYWRpbmcsIGVycm9yIH0gPSB1c2VSZWNvcmRzKCdQYXltZW50Jyk7XHJcblxyXG4gIGlmIChsb2FkaW5nKSByZXR1cm4gPEJveCBwPVwibGdcIj48TG9hZGVyIC8+PC9Cb3g+O1xyXG4gIGlmIChlcnJvcikgcmV0dXJuIDxCb3ggcD1cImxnXCI+PFBsYWNlaG9sZGVyPjxINT7guYDguIHguLTguJTguILguYnguK3guJzguLTguJTguJ7guKXguLLguJQ8L0g1PjxwPuC5hOC4oeC5iOC4quC4suC4oeC4suC4o+C4luC4lOC4tuC4h+C4guC5ieC4reC4oeC4ueC4peC4geC4suC4o+C4iuC4s+C4o+C4sOC5gOC4h+C4tOC4meC5hOC4lOC5iTwvcD48L1BsYWNlaG9sZGVyPjwvQm94PjtcclxuICBpZiAoIXJlY29yZHMgfHwgcmVjb3Jkcy5sZW5ndGggPT09IDApIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxQbGFjZWhvbGRlcj48SDU+4LmE4Lih4LmI4Lih4Li14LiC4LmJ4Lit4Lih4Li54Lil4LiB4Liy4Lij4LiK4Liz4Lij4Liw4LmA4LiH4Li04LiZPC9INT48cD7guYTguKHguYjguJ7guJrguILguYnguK3guKHguLnguKXguJfguLXguYjguJXguKPguIfguIHguLHguJrguYDguIfguLfguYjguK3guJnguYTguII8L3A+PC9QbGFjZWhvbGRlcj48L0JveD47XHJcblxyXG4gIHJldHVybiAoXHJcbiAgICA8Qm94IHA9XCIyeGxcIj5cclxuICAgICAgPEJveFxyXG4gICAgICAgIGRpc3BsYXk9XCJncmlkXCJcclxuICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zPXtbJzFmcicsICdyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMzQwcHgsIDFmcikpJ119XHJcbiAgICAgICAgc3R5bGU9e3sgZ2FwOiBcIjIwcHhcIiB9fSBcclxuICAgICAgPlxyXG4gICAgICAgIHtyZWNvcmRzLm1hcCgocikgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcGFyYW1zID0gci5wYXJhbXMgPz8ge307XHJcbiAgICAgICAgICBjb25zdCB1c2VyUGFyYW1zID0gci5wb3B1bGF0ZWQ/LlVzZXI/LnBhcmFtcyA/PyB7fTtcclxuICAgICAgICAgIGNvbnN0IHBvc3RQYXJhbXMgPSByLnBvcHVsYXRlZD8uUHJvcGVydHlQb3N0Py5wYXJhbXMgPz8ge307XHJcbiAgICAgICAgICBjb25zdCBpZCA9IHIuaWQgPz8gcGFyYW1zLmlkO1xyXG5cclxuICAgICAgICAgIGNvbnN0IHBheW1lbnRBbW91bnQgPSBwYXJhbXMuUGF5bWVudF9BbW91bnQgIT0gbnVsbCA/IGAke051bWJlcihwYXJhbXMuUGF5bWVudF9BbW91bnQpLnRvTG9jYWxlU3RyaW5nKCl9IOC4muC4suC4l2AgOiBcIk4vQVwiO1xyXG4gICAgICAgICAgY29uc3QgcGF5bWVudFNsaXBVcmwgPSBwYXJhbXMuUGF5bWVudF9TbGlwO1xyXG4gICAgICAgICAgY29uc3Qgc3RhdHVzID0gZGlzcGxheVZhbHVlKHBhcmFtcy5TdGF0dXMpO1xyXG4gICAgICAgICAgY29uc3QgdXNlck5hbWUgPSBgJHtkaXNwbGF5VmFsdWUodXNlclBhcmFtcy5GaXJzdF9uYW1lLCAnJyl9ICR7ZGlzcGxheVZhbHVlKHVzZXJQYXJhbXMuTGFzdF9uYW1lLCAnJyl9YC50cmltKCkgfHwgXCLguYTguKHguYjguKHguLXguILguYnguK3guKHguLnguKVcIjtcclxuICAgICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGRpc3BsYXlWYWx1ZShwb3N0UGFyYW1zLlByb3BlcnR5X05hbWUsICdOL0EnKTtcclxuICAgICAgICAgIGNvbnN0IGNyZWF0ZWRBdCA9IHBhcmFtcy5jcmVhdGVkQXQgPyBuZXcgRGF0ZShwYXJhbXMuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoXCJ0aC1USFwiLCB7IHllYXI6ICdudW1lcmljJywgbW9udGg6ICdzaG9ydCcsIGRheTogJ251bWVyaWMnfSkgOiAnTi9BJztcclxuXHJcbiAgICAgICAgICBjb25zdCBiYWRnZVN0eWxlcyA9IHtcclxuICAgICAgICAgICAgUEVORElORzogeyBiZzogXCIjZmZmYmU2XCIsIGNvbG9yOiBcIiNmYWFkMTRcIiB9LFxyXG4gICAgICAgICAgICBDT05GSVJNRUQ6IHsgYmc6IFwiI2Y2ZmZlZFwiLCBjb2xvcjogXCIjNTJjNDFhXCIgfSxcclxuICAgICAgICAgICAgRkFJTEVEOiB7IGJnOiBcIiNmZmYxZjBcIiwgY29sb3I6IFwiI2Y1MjIyZFwiIH0sXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHsgYmc6IFwiI2YyZjJmMlwiLCBjb2xvcjogXCIjNTU1XCIgfSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgICBjb25zdCBzdHlsZSA9IGJhZGdlU3R5bGVzW3N0YXR1c10gfHwgYmFkZ2VTdHlsZXMuZGVmYXVsdDtcclxuXHJcbiAgICAgICAgICBjb25zdCBzdGF0dXNUcmFuc2xhdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIFBFTkRJTkc6ICfguKPguK3guJXguKPguKfguIjguKrguK3guJonLFxyXG4gICAgICAgICAgICBDT05GSVJNRUQ6ICfguKLguLfguJnguKLguLHguJnguYHguKXguYnguKcnLFxyXG4gICAgICAgICAgICBGQUlMRUQ6ICfguKXguYnguKHguYDguKvguKXguKcnLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGNvbnN0IHN0YXR1c1RleHQgPSBzdGF0dXNUcmFuc2xhdGlvbnNbc3RhdHVzXSB8fCBzdGF0dXM7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPENhcmQga2V5PXtpZH0+XHJcbiAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBIZWFkZXIgPT09ICovfVxyXG4gICAgICAgICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCIgc3R5bGU9e3sgZ2FwOiAnMTZweCcgfX0+XHJcbiAgICAgICAgICAgICAgICA8Qm94IFxyXG4gICAgICAgICAgICAgICAgICB3aWR0aD17ODB9IGhlaWdodD17ODB9IGJvcmRlclJhZGl1cz1cIjUwJVwiIFxyXG4gICAgICAgICAgICAgICAgICBiZz1cInByaW1hcnkyMFwiIGNvbG9yPVwicHJpbWFyeTEwMFwiXHJcbiAgICAgICAgICAgICAgICAgIGRpc3BsYXk9XCJmbGV4XCIgYWxpZ25JdGVtcz1cImNlbnRlclwiIGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCIgZmxleFNocmluaz17MH1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPFRleHQgZm9udFNpemU9ezI0fSBmb250V2VpZ2h0PVwiYm9sZFwiPuC4vzwvVGV4dD5cclxuICAgICAgICAgICAgICAgIDwvQm94PlxyXG4gICAgICAgICAgICAgICAgPEJveD5cclxuICAgICAgICAgICAgICAgICAgPEgyIG09ezB9IGZvbnRTaXplPVwieGxcIj57cGF5bWVudEFtb3VudH08L0gyPlxyXG4gICAgICAgICAgICAgICAgICA8VGV4dCBjb2xvcj1cImdyZXk4MFwiIG10PVwieHNcIj48c3Ryb25nPuC4nOC4ueC5ieC4iuC4s+C4o+C4sDo8L3N0cm9uZz4ge3VzZXJOYW1lfTwvVGV4dD5cclxuICAgICAgICAgICAgICAgICAgPFRleHQgY29sb3I9XCJncmV5ODBcIj48c3Ryb25nPuC4quC4s+C4q+C4o+C4seC4muC5guC4nuC4quC4leC5jDo8L3N0cm9uZz4ge3Byb3BlcnR5TmFtZX08L1RleHQ+XHJcbiAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICA8L0JveD5cclxuXHJcbiAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBTbGlwIEJ1dHRvbiA9PT0gKi99XHJcbiAgICAgICAgICAgICAgPEJveCBib3JkZXJUb3A9XCIxcHggc29saWRcIiBib3JkZXJDb2xvcj1cImdyZXkyMFwiIG10PVwibGdcIiBwdD1cImxnXCI+XHJcbiAgICAgICAgICAgICAgICA8QnV0dG9uIFxyXG4gICAgICAgICAgICAgICAgICBhcz1cImFcIiBcclxuICAgICAgICAgICAgICAgICAgaHJlZj17cGF5bWVudFNsaXBVcmx9IFxyXG4gICAgICAgICAgICAgICAgICB0YXJnZXQ9XCJfYmxhbmtcIiBcclxuICAgICAgICAgICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIlxyXG4gICAgICAgICAgICAgICAgICBkaXNhYmxlZD17IXBheW1lbnRTbGlwVXJsfVxyXG4gICAgICAgICAgICAgICAgICB3aWR0aD1cIjEwMCVcIlxyXG4gICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICDguJTguLnguKrguKXguLTguJtcclxuICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxyXG4gICAgICAgICAgICAgIDwvQm94PlxyXG5cclxuICAgICAgICAgICAgICB7LyogPT09IFNlY3Rpb246IEZvb3RlciAoU3RhdHVzIE9ubHkpID09PSAqL31cclxuICAgICAgICAgICAgICA8Qm94XHJcbiAgICAgICAgICAgICAgICBib3JkZXJUb3A9XCIxcHggc29saWRcIiBib3JkZXJDb2xvcj1cImdyZXkyMFwiXHJcbiAgICAgICAgICAgICAgICBtdD1cImxnXCIgcHQ9XCJsZ1wiXHJcbiAgICAgICAgICAgICAgICBkaXNwbGF5PVwiZmxleFwiIGp1c3RpZnlDb250ZW50PVwic3BhY2UtYmV0d2VlblwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgIDxCb3g+XHJcbiAgICAgICAgICAgICAgICAgIDxCb3hcclxuICAgICAgICAgICAgICAgICAgICBhcz1cInNwYW5cIiBweD1cIm1kXCIgcHk9XCJzbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzPVwibGdcIlxyXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogc3R5bGUuYmcsIGNvbG9yOiBzdHlsZS5jb2xvciwgZm9udFdlaWdodDogXCJib2xkXCIsIGZvbnRTaXplOiBcIjAuOXJlbVwiIH19XHJcbiAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICB7c3RhdHVzVGV4dH1cclxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICAgIDxCb3ggZm9udFNpemU9XCJzbVwiIGNvbG9yPVwiZ3JleTYwXCIgbXQ9XCJzbVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIOC4iuC4s+C4o+C4sOC5gOC4oeC4t+C5iOC4rToge2NyZWF0ZWRBdH1cclxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XHJcbiAgICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgICA8L0JveD5cclxuICAgICAgICAgICAgPC9DYXJkPlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9KX1cclxuICAgICAgPC9Cb3g+XHJcbiAgICA8L0JveD5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUGF5bWVudENhcmRMaXN0OyIsIkFkbWluSlMuVXNlckNvbXBvbmVudHMgPSB7fVxuaW1wb3J0IFByb3BlcnR5Q2FyZExpc3QgZnJvbSAnLi4vQWRtaW4vY29tcG9uZW50cy9Qcm9wZXJ0eUNhcmRMaXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Qcm9wZXJ0eUNhcmRMaXN0ID0gUHJvcGVydHlDYXJkTGlzdFxuaW1wb3J0IFNlbGxlckNhcmRMaXN0IGZyb20gJy4uL0FkbWluL2NvbXBvbmVudHMvU2VsbGVyQ2FyZExpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlNlbGxlckNhcmRMaXN0ID0gU2VsbGVyQ2FyZExpc3RcbmltcG9ydCBQcm9wZXJ0eVVuaXRMaXN0Q29tcG9uZW50IGZyb20gJy4uL0FkbWluL2NvbXBvbmVudHMvUHJvcGVydHlVbml0Q2FyZExpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb3BlcnR5VW5pdExpc3RDb21wb25lbnQgPSBQcm9wZXJ0eVVuaXRMaXN0Q29tcG9uZW50XG5pbXBvcnQgRGVwb3NpdENhcmRMaXN0IGZyb20gJy4uL0FkbWluL2NvbXBvbmVudHMvRGVwb3NpdENhcmRMaXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5EZXBvc2l0Q2FyZExpc3QgPSBEZXBvc2l0Q2FyZExpc3RcbmltcG9ydCBUZXN0RGVwb3NpdCBmcm9tICcuLi9BZG1pbi9jb21wb25lbnRzL1Rlc3REZXBvc2l0Q29tcG9uZW50J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5UZXN0RGVwb3NpdCA9IFRlc3REZXBvc2l0XG5pbXBvcnQgVXNlckNhcmRMaXN0IGZyb20gJy4uL0FkbWluL2NvbXBvbmVudHMvVXNlckNhcmRMaXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Vc2VyQ2FyZExpc3QgPSBVc2VyQ2FyZExpc3RcbmltcG9ydCBEb2N1bWVudENhcmRMaXN0IGZyb20gJy4uL0FkbWluL2NvbXBvbmVudHMvRG9jdW1lbnRDYXJkTGlzdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuRG9jdW1lbnRDYXJkTGlzdCA9IERvY3VtZW50Q2FyZExpc3RcbmltcG9ydCBQYXltZW50Q2FyZExpc3QgZnJvbSAnLi4vQWRtaW4vY29tcG9uZW50cy9QYXltZW50Q2FyZExpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlBheW1lbnRDYXJkTGlzdCA9IFBheW1lbnRDYXJkTGlzdCJdLCJuYW1lcyI6WyJpc0VtcHR5VmFsdWUiLCJ2IiwidW5kZWZpbmVkIiwiU3RyaW5nIiwidHJpbSIsImRpc3BsYXlWYWx1ZSIsImZhbGxiYWNrIiwidHJ1bmNhdGUiLCJ0ZXh0IiwibiIsImxlbmd0aCIsInNsaWNlIiwiRGV0YWlsSXRlbSIsImxhYmVsIiwidmFsdWUiLCJSZWFjdCIsImNyZWF0ZUVsZW1lbnQiLCJCb3giLCJMYWJlbCIsImNvbG9yIiwic3R5bGUiLCJ0ZXh0VHJhbnNmb3JtIiwiZm9udFNpemUiLCJUZXh0IiwiZm9udFdlaWdodCIsIkNhcmQiLCJjaGlsZHJlbiIsInZhcmlhbnQiLCJib3hTaGFkb3ciLCJib3JkZXJSYWRpdXMiLCJwIiwibWIiLCJQcm9wZXJ0eUNhcmRMaXN0IiwicmVjb3JkcyIsImxvYWRpbmciLCJlcnJvciIsInVzZVJlY29yZHMiLCJleHBhbmRlZCIsInNldEV4cGFuZGVkIiwidXNlU3RhdGUiLCJMb2FkZXIiLCJQbGFjZWhvbGRlciIsIkg1IiwiYmFkZ2VTdHlsZXMiLCJQRU5ESU5HIiwiYmciLCJDT05GSVJNRUQiLCJTT0xEIiwiSElEREVOIiwiUkVKRUNURUQiLCJkZWZhdWx0IiwiZGlzcGxheSIsImdyaWRUZW1wbGF0ZUNvbHVtbnMiLCJnYXAiLCJtYXAiLCJyIiwicGFyYW1zIiwiaWQiLCJpc0V4cGFuZGVkIiwibmFtZSIsIlByb3BlcnR5X05hbWUiLCJkZXNjcmlwdGlvbiIsIkRlc2NyaXB0aW9uIiwicHJpY2UiLCJQcmljZSIsIk51bWJlciIsInRvTG9jYWxlU3RyaW5nIiwic2VsbFJlbnQiLCJTZWxsX1JlbnQiLCJzdGF0dXMiLCJTdGF0dXNfcG9zdCIsImNyZWF0ZWRBdCIsIkRhdGUiLCJ0b0xvY2FsZURhdGVTdHJpbmciLCJ5ZWFyIiwibW9udGgiLCJkYXkiLCJpbWdVcmwiLCJfZmlyc3RJbWFnZSIsImNhdGVnb3J5TmFtZSIsIl9jYXRlZ29yeU5hbWUiLCJkZXBvc2l0IiwiRGVwb3NpdF9BbW91bnQiLCJjYXRlZ29yeVRyYW5zbGF0aW9ucyIsImNvbmRvIiwiaG91c2UiLCJsYW5kIiwidmlsbGEiLCJ0b3duaG91c2UiLCJhcGFydG1lbnQiLCJwZW50aG91c2UiLCJyZXNvcnQiLCJob3RlbCIsIm9mZmljZSIsImZhY3RvcnkiLCJ3YXJlaG91c2UiLCJjYXRlZ29yeVRleHQiLCJ0b0xvd2VyQ2FzZSIsInN0YXR1c1RyYW5zbGF0aW9ucyIsInNlbGxSZW50VHJhbnNsYXRpb25zIiwiU0FMRSIsIlJFTlQiLCJzZWxsUmVudFRleHQiLCJzdGF0dXNUZXh0Iiwia2V5Iiwid2lkdGgiLCJoZWlnaHQiLCJvdmVyZmxvdyIsInNyYyIsImFsdCIsIm9iamVjdEZpdCIsImFsaWduSXRlbXMiLCJqdXN0aWZ5Q29udGVudCIsIkgyIiwibSIsImZsZXhXcmFwIiwibXQiLCJEaXN0cmljdCIsIlByb3ZpbmNlIiwiQmFkZ2UiLCJteSIsIkJ1dHRvbiIsIm9uQ2xpY2siLCJwcmV2IiwibWwiLCJib3JkZXJUb3AiLCJib3JkZXJDb2xvciIsInB0IiwiZ3JpZEdhcCIsIlVzYWJsZV9BcmVhIiwiTGFuZF9TaXplIiwiQmVkcm9vbXMiLCJCYXRocm9vbSIsImZsb29yIiwiUGFya2luZ19TcGFjZSIsIk51bWJlck9mVW5pdHMiLCJZZWFyX0J1aWx0IiwiVG90YWxfUm9vbXMiLCJBZGRpdGlvbmFsX0FtZW5pdGllcyIsImpvaW4iLCJOZWFyYnlfTGFuZG1hcmtzIiwiTmFtZSIsIlBob25lIiwiTGlua01hcCIsImFzIiwiaHJlZiIsInRhcmdldCIsInNpemUiLCJMaW5rX2xpbmUiLCJMaW5rX2ZhY2Jvb2siLCJmbGV4RGlyZWN0aW9uIiwidHJhbnNpdGlvbiIsIl9ob3ZlciIsInRyYW5zZm9ybSIsIlNlbGxlckNhcmRMaXN0IiwidXNlclBhcmFtcyIsInBvcHVsYXRlZCIsInVzZXIiLCJmdWxsTmFtZSIsIkZpcnN0X25hbWUiLCJMYXN0X25hbWUiLCJpbWFnZVVybCIsIm5hdGlvbmFsSWRJbWFnZSIsImNvbXBhbnlOYW1lIiwiQ29tcGFueV9OYW1lIiwibGljZW5zZSIsIlJlYWxFc3RhdGVfTGljZW5zZSIsIlN0YXR1cyIsIkFQUFJPVkVEIiwiZmxleFNocmluayIsInB4IiwicHkiLCJiYWNrZ3JvdW5kQ29sb3IiLCJQcm9wZXJ0eVVuaXRDYXJkTGlzdCIsInByb3BlcnR5UG9zdFBhcmFtcyIsInByb3BlcnR5UG9zdCIsInVuaXROdW1iZXIiLCJVbml0X051bWJlciIsInByb3BlcnR5TmFtZSIsIkFWQUlMQUJMRSIsIkJPT0tFRCIsIkRlcG9zaXRDYXJkTGlzdCIsIlVzZXIiLCJwb3N0UGFyYW1zIiwiUG9zdCIsInVuaXRQYXJhbXMiLCJVbml0IiwidXNlck5hbWUiLCJkZXBvc2l0QW1vdW50IiwiRGVwb3NpdF9TdGF0dXMiLCJUZXN0RGVwb3NpdENvbXBvbmVudCIsInBhZ2UiLCJwZXJQYWdlIiwidG90YWwiLCJoYW5kbGVDaGFuZ2VQYWdlIiwiY29uc29sZSIsImxvZyIsIlBhZ2luYXRpb24iLCJvbkNoYW5nZSIsIlVzZXJDYXJkTGlzdCIsImVtYWlsIiwiRW1haWwiLCJwaG9uZSIsInVzZXJUeXBlIiwiaW1hZ2UiLCJBZG1pbiIsIlNlbGxlciIsIkJ1eWVyIiwiRG9jdW1lbnRDYXJkTGlzdCIsImRvY3VtZW50TmFtZSIsIkRvY3VtZW50TmFtZSIsImRvY3VtZW50VXJsIiwiRG9jdW1lbnRVcmwiLCJSZXZpZXdfU3RhdHVzIiwidGl0bGUiLCJkaXNhYmxlZCIsIlBheW1lbnRDYXJkTGlzdCIsIlByb3BlcnR5UG9zdCIsInBheW1lbnRBbW91bnQiLCJQYXltZW50X0Ftb3VudCIsInBheW1lbnRTbGlwVXJsIiwiUGF5bWVudF9TbGlwIiwiRkFJTEVEIiwiQWRtaW5KUyIsIlVzZXJDb21wb25lbnRzIiwiUHJvcGVydHlVbml0TGlzdENvbXBvbmVudCIsIlRlc3REZXBvc2l0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0lBQUE7SUFJQTtJQUNBLE1BQU1BLGNBQVksR0FBSUMsQ0FBQyxJQUFLQSxDQUFDLEtBQUssSUFBSSxJQUFJQSxDQUFDLEtBQUtDLFNBQVMsSUFBSUMsTUFBTSxDQUFDRixDQUFDLENBQUMsQ0FBQ0csSUFBSSxFQUFFLEtBQUssRUFBRTtJQUNwRixNQUFNQyxjQUFZLEdBQUdBLENBQUNKLENBQUMsRUFBRUssUUFBUSxHQUFHLEtBQUssS0FBTU4sY0FBWSxDQUFDQyxDQUFDLENBQUMsR0FBR0ssUUFBUSxHQUFHTCxDQUFFO0lBRTlFLE1BQU1NLFVBQVEsR0FBR0EsQ0FBQ0MsSUFBSSxFQUFFQyxDQUFDLEdBQUcsR0FBRyxLQUFLO0lBQ2hDLEVBQUEsSUFBSSxDQUFDRCxJQUFJLEVBQUUsT0FBTyxFQUFFO0lBQ3BCLEVBQUEsSUFBSUEsSUFBSSxDQUFDRSxNQUFNLElBQUlELENBQUMsRUFBRSxPQUFPRCxJQUFJO01BQ2pDLE9BQU9BLElBQUksQ0FBQ0csS0FBSyxDQUFDLENBQUMsRUFBRUYsQ0FBQyxDQUFDLEdBQUcsS0FBSztJQUNuQyxDQUFDO0lBRUQsTUFBTUcsVUFBVSxHQUFHQSxDQUFDO01BQUVDLEtBQUs7SUFBRUMsRUFBQUE7SUFBTSxDQUFDLGtCQUNoQ0Msc0JBQUEsQ0FBQUMsYUFBQSxDQUFDQyxnQkFBRyxFQUFBLElBQUEsZUFDQUYsc0JBQUEsQ0FBQUMsYUFBQSxDQUFDRSxrQkFBSyxFQUFBO0lBQUNDLEVBQUFBLEtBQUssRUFBQyxRQUFRO0lBQUNDLEVBQUFBLEtBQUssRUFBRTtJQUFFQyxJQUFBQSxhQUFhLEVBQUUsV0FBVztJQUFFQyxJQUFBQSxRQUFRLEVBQUU7SUFBTztJQUFFLENBQUEsRUFBRVQsS0FBYSxDQUFDLGVBQzlGRSxzQkFBQSxDQUFBQyxhQUFBLENBQUNPLGlCQUFJLEVBQUE7SUFB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
