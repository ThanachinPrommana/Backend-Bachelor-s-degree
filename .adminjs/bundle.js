(function (React, adminjs, reactRouterDom, designSystem) {
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
        error,
        total,
        perPage,
        page,
        direction,
        sortBy
      } = adminjs.useRecords('PropertyPost');
      const [expanded, setExpanded] = React.useState({});
      const navigate = reactRouterDom.useNavigate();
      const location = reactRouterDom.useLocation();
      React.useEffect(() => {
        const searchParams = new URLSearchParams(location.search);

        // ถ้าใน URL ยังไม่มี 'pageSize' (ค่า default คือ 10)
        // และเรามี 'total' (16)
        if (!searchParams.has('pageSize') && total > 0) {
          // สั่งให้มันใช้ 100 รายการต่อหน้า
          searchParams.set('pageSize', '100');

          // สั่งเปลี่ยน URL (เช่น /admin/.../list?pageSize=100)
          // การเปลี่ยน URL นี้จะบังคับให้ useRecords โหลดข้อมูลใหม่
          navigate({
            search: searchParams.toString()
          });
        }
      }, [total, perPage, location.search, navigate]);
      const searchParams = new URLSearchParams(location.search);
      if (!searchParams.has('pageSize') && total > 0) {
        // ถ้ารู้ว่ามี 16 แต่ยังไม่ได้สั่ง pageSize=100 ให้รอโหลดก่อน
        return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          p: "lg"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null));
      }
      console.log('--- DEBUG: useRecords (FRONTEND) ---');
      console.log('Total from hook:', total);
      console.log('Per Page from hook:', perPage);
      console.log('Records in hook:', records?.length);
      console.log('Loading:', loading);
      console.log('------------------------------------');
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
      })), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        mt: "xl",
        display: "flex",
        justifyContent: "center"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Pagination, {
        page: page,
        perPage: perPage,
        total: total,
        onChange: pageNumber => {
          const search = new URLSearchParams(window.location.search);
          search.set('page', String(pageNumber));

          // คงค่า pageSize ที่เราตั้งไว้ (100)
          if (!search.has('pageSize')) search.set('pageSize', '100');
          if (sortBy) search.set('sortBy', sortBy);
          if (direction) search.set('direction', direction);
          navigate({
            search: search.toString()
          });
        }
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
        error,
        total,
        perPage,
        page,
        direction,
        sortBy
      } = adminjs.useRecords('Seller');
      const navigate = reactRouterDom.useNavigate();
      const location = reactRouterDom.useLocation();
      React.useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        // ถ้ายังไม่มี pageSize ใน URL และมี total (รู้จำนวนทั้งหมดแล้ว)
        if (!searchParams.has('pageSize') && total > 0) {
          searchParams.set('pageSize', '100'); // บังคับโหลด 100 รายการ
          navigate({
            search: searchParams.toString()
          });
        }
      }, [total, perPage, location.search, navigate]); // <-- ใช้ navigate

      const searchParams = new URLSearchParams(location.search);
      if (!searchParams.has('pageSize') && total > 0) {
        return /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
          p: "lg"
        }, /*#__PURE__*/React__default.default.createElement(designSystem.Loader, null));
      }
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
      })), /*#__PURE__*/React__default.default.createElement(designSystem.Box, {
        mt: "xl",
        display: "flex",
        justifyContent: "center"
      }, /*#__PURE__*/React__default.default.createElement(designSystem.Pagination, {
        page: page,
        perPage: perPage,
        total: total,
        onChange: pageNumber => {
          const search = new URLSearchParams(window.location.search);
          search.set('page', String(pageNumber));
          // คงค่า pageSize ที่เราตั้งไว้ (100)
          if (!search.has('pageSize')) search.set('pageSize', '100');
          if (sortBy) search.set('sortBy', sortBy);
          if (direction) search.set('direction', direction);

          // ใช้ navigate (v6)
          navigate({
            search: search.toString()
          });
        }
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

})(React, AdminJS, ReactRouterDOM, AdminJSDesignSystem);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlcyI6WyIuLi9BZG1pbi9jb21wb25lbnRzL1Byb3BlcnR5Q2FyZExpc3QuanN4IiwiLi4vQWRtaW4vY29tcG9uZW50cy9TZWxsZXJDYXJkTGlzdC5qc3giLCIuLi9BZG1pbi9jb21wb25lbnRzL1Byb3BlcnR5VW5pdENhcmRMaXN0LmpzeCIsIi4uL0FkbWluL2NvbXBvbmVudHMvRGVwb3NpdENhcmRMaXN0LmpzeCIsIi4uL0FkbWluL2NvbXBvbmVudHMvVGVzdERlcG9zaXRDb21wb25lbnQuanN4IiwiLi4vQWRtaW4vY29tcG9uZW50cy9Vc2VyQ2FyZExpc3QuanN4IiwiLi4vQWRtaW4vY29tcG9uZW50cy9Eb2N1bWVudENhcmRMaXN0LmpzeCIsIi4uL0FkbWluL2NvbXBvbmVudHMvUGF5bWVudENhcmRMaXN0LmpzeCIsImVudHJ5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNlcnZlci9BZG1pbi9jb21wb25lbnRzL1Byb3BlcnR5Q2FyZExpc3QuanN4XG5pbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVJlY29yZHMgfSBmcm9tICdhZG1pbmpzJzsgLy8gPC0tIEZyb20gYWRtaW5qc1xuaW1wb3J0IHsgdXNlTmF2aWdhdGUsIHVzZUxvY2F0aW9uIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XG5pbXBvcnQgeyBCb3gsIEgyLCBINSwgTG9hZGVyLCBQbGFjZWhvbGRlciwgQnV0dG9uLCBCYWRnZSwgTGFiZWwsIFRleHQsIFBhZ2luYXRpb24gfSBmcm9tICdAYWRtaW5qcy9kZXNpZ24tc3lzdGVtJztcbi8vIEhlbHBlciBGdW5jdGlvbnNcbmNvbnN0IGlzRW1wdHlWYWx1ZSA9ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCB8fCBTdHJpbmcodikudHJpbSgpID09PSBcIlwiO1xuY29uc3QgZGlzcGxheVZhbHVlID0gKHYsIGZhbGxiYWNrID0gXCJOL0FcIikgPT4gKGlzRW1wdHlWYWx1ZSh2KSA/IGZhbGxiYWNrIDogdik7XG5cbmNvbnN0IHRydW5jYXRlID0gKHRleHQsIG4gPSAxODApID0+IHtcbiAgICBpZiAoIXRleHQpIHJldHVybiBcIlwiO1xuICAgIGlmICh0ZXh0Lmxlbmd0aCA8PSBuKSByZXR1cm4gdGV4dDtcbiAgICByZXR1cm4gdGV4dC5zbGljZSgwLCBuKSArIFwiLi4uXCI7XG59O1xuXG5jb25zdCBEZXRhaWxJdGVtID0gKHsgbGFiZWwsIHZhbHVlIH0pID0+IChcbiAgICA8Qm94PlxuICAgICAgICA8TGFiZWwgY29sb3I9XCJncmV5NjBcIiBzdHlsZT17eyB0ZXh0VHJhbnNmb3JtOiAndXBwZXJjYXNlJywgZm9udFNpemU6ICcxMXB4JyB9fT57bGFiZWx9PC9MYWJlbD5cbiAgICAgICAgPFRleHQgZm9udFdlaWdodD1cImJvbGRcIj57ZGlzcGxheVZhbHVlKHZhbHVlKX08L1RleHQ+XG4gICAgPC9Cb3g+XG4pO1xuY29uc3QgQ2FyZCA9ICh7IGNoaWxkcmVuIH0pID0+IChcbiAgICA8Qm94IHZhcmlhbnQ9XCJ3aGl0ZVwiIGJveFNoYWRvdz1cImNhcmRcIiBib3JkZXJSYWRpdXM9XCJ4bFwiIHA9XCJ4bFwiIG1iPVwiMnhsXCI+XG4gICAgICAgIHtjaGlsZHJlbn1cbiAgICA8L0JveD5cbik7XG5cbi8vIGNvbnN0IExhYmVsID0gKHsgY2hpbGRyZW4gfSkgPT4gPEJveCBjb2xvcj1cImdyZXk2MFwiIGZvbnRTaXplPVwic21cIj57Y2hpbGRyZW59PC9Cb3g+O1xuXG5jb25zdCBQcm9wZXJ0eUNhcmRMaXN0ID0gKCkgPT4ge1xuICAgIGNvbnN0IHtcbiAgICAgICAgcmVjb3JkcyxcbiAgICAgICAgbG9hZGluZyxcbiAgICAgICAgZXJyb3IsXG4gICAgICAgIHRvdGFsLFxuICAgICAgICBwZXJQYWdlLFxuICAgICAgICBwYWdlLFxuICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgIHNvcnRCeVxuICAgIH0gPSB1c2VSZWNvcmRzKCdQcm9wZXJ0eVBvc3QnKTtcbiAgICBjb25zdCBbZXhwYW5kZWQsIHNldEV4cGFuZGVkXSA9IHVzZVN0YXRlKHt9KTtcblxuICAgIGNvbnN0IG5hdmlnYXRlID0gdXNlTmF2aWdhdGUoKTtcbiAgICBjb25zdCBsb2NhdGlvbiA9IHVzZUxvY2F0aW9uKCk7XG5cbiAgICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgICAgICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaCk7XG5cbiAgICAgICAgLy8g4LiW4LmJ4Liy4LmD4LiZIFVSTCDguKLguLHguIfguYTguKHguYjguKHguLUgJ3BhZ2VTaXplJyAo4LiE4LmI4LiyIGRlZmF1bHQg4LiE4Li34LitIDEwKVxuICAgICAgICAvLyDguYHguKXguLDguYDguKPguLLguKHguLUgJ3RvdGFsJyAoMTYpXG4gICAgICAgIGlmICghc2VhcmNoUGFyYW1zLmhhcygncGFnZVNpemUnKSAmJiB0b3RhbCA+IDApIHtcbiAgICAgICAgICAgIC8vIOC4quC4seC5iOC4h+C5g+C4q+C5ieC4oeC4seC4meC5g+C4iuC5iSAxMDAg4Lij4Liy4Lii4LiB4Liy4Lij4LiV4LmI4Lit4Lir4LiZ4LmJ4LiyXG4gICAgICAgICAgICBzZWFyY2hQYXJhbXMuc2V0KCdwYWdlU2l6ZScsICcxMDAnKTtcblxuICAgICAgICAgICAgLy8g4Liq4Lix4LmI4LiH4LmA4Lib4Lil4Li14LmI4Lii4LiZIFVSTCAo4LmA4LiK4LmI4LiZIC9hZG1pbi8uLi4vbGlzdD9wYWdlU2l6ZT0xMDApXG4gICAgICAgICAgICAvLyDguIHguLLguKPguYDguJvguKXguLXguYjguKLguJkgVVJMIOC4meC4teC5ieC4iOC4sOC4muC4seC4h+C4hOC4seC4muC5g+C4q+C5iSB1c2VSZWNvcmRzIOC5guC4q+C4peC4lOC4guC5ieC4reC4oeC4ueC4peC5g+C4q+C4oeC5iFxuICAgICAgICAgICAgbmF2aWdhdGUoeyBzZWFyY2g6IHNlYXJjaFBhcmFtcy50b1N0cmluZygpIH0pO1xuICAgICAgICB9XG4gICAgfSwgW3RvdGFsLCBwZXJQYWdlLCBsb2NhdGlvbi5zZWFyY2gsIG5hdmlnYXRlXSk7XG5cbiAgICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaCk7XG4gICAgaWYgKCFzZWFyY2hQYXJhbXMuaGFzKCdwYWdlU2l6ZScpICYmIHRvdGFsID4gMCkge1xuICAgICAgICAvLyDguJbguYnguLLguKPguLnguYnguKfguYjguLLguKHguLUgMTYg4LmB4LiV4LmI4Lii4Lix4LiH4LmE4Lih4LmI4LmE4LiU4LmJ4Liq4Lix4LmI4LiHIHBhZ2VTaXplPTEwMCDguYPguKvguYnguKPguK3guYLguKvguKXguJTguIHguYjguK3guJlcbiAgICAgICAgcmV0dXJuIDxCb3ggcD1cImxnXCI+PExvYWRlciAvPjwvQm94PjtcbiAgICB9XG4gICAgY29uc29sZS5sb2coJy0tLSBERUJVRzogdXNlUmVjb3JkcyAoRlJPTlRFTkQpIC0tLScpO1xuICAgIGNvbnNvbGUubG9nKCdUb3RhbCBmcm9tIGhvb2s6JywgdG90YWwpO1xuICAgIGNvbnNvbGUubG9nKCdQZXIgUGFnZSBmcm9tIGhvb2s6JywgcGVyUGFnZSk7XG4gICAgY29uc29sZS5sb2coJ1JlY29yZHMgaW4gaG9vazonLCByZWNvcmRzPy5sZW5ndGgpO1xuICAgIGNvbnNvbGUubG9nKCdMb2FkaW5nOicsIGxvYWRpbmcpO1xuICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcblxuICAgIGlmIChsb2FkaW5nKSByZXR1cm4gPEJveCBwPVwibGdcIj48TG9hZGVyIC8+PC9Cb3g+O1xuICAgIGlmIChlcnJvcikgcmV0dXJuIDxCb3ggcD1cImxnXCI+PFBsYWNlaG9sZGVyPjxINT7guYDguIHguLTguJTguILguYnguK3guJzguLTguJTguJ7guKXguLLguJTguYPguJnguIHguLLguKPguYLguKvguKXguJTguILguYnguK3guKHguLnguKXguYLguJ7guKrguJXguYw8L0g1PjwvUGxhY2Vob2xkZXI+PC9Cb3g+O1xuICAgIGlmICghcmVjb3JkcyB8fCByZWNvcmRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDxCb3ggcD1cImxnXCI+PFBsYWNlaG9sZGVyPjxINT7guYTguKHguYjguJ7guJrguYLguJ7guKrguJXguYzguJfguLXguYjguJXguKPguIfguIHguLHguJrguYDguIfguLfguYjguK3guJnguYTguII8L0g1PjwvUGxhY2Vob2xkZXI+PC9Cb3g+O1xuXG4gICAgLy8g4pyFIOC4quC4teC4quC4s+C4q+C4o+C4seC4muC5geC4leC5iOC4peC4sOC4quC4luC4suC4meC4sFxuICAgIGNvbnN0IGJhZGdlU3R5bGVzID0ge1xuICAgICAgICBQRU5ESU5HOiB7IGJnOiBcIiNGRkY3RTBcIiwgY29sb3I6IFwiI0I1ODEwMFwiIH0sICAvLyDguYDguKvguKXguLfguK3guIdcbiAgICAgICAgQ09ORklSTUVEOiB7IGJnOiBcIiNFNkY3RTZcIiwgY29sb3I6IFwiIzBDN0EwQ1wiIH0sICAvLyDguYDguILguLXguKLguKdcbiAgICAgICAgU09MRDogeyBiZzogXCIjRTBFMEUwXCIsIGNvbG9yOiBcIiM1NTU1NTVcIiB9LCAgLy8g4LmA4LiX4LiyXG4gICAgICAgIEhJRERFTjogeyBiZzogXCIjRjJGMkYyXCIsIGNvbG9yOiBcIiM2NjY2NjZcIiB9LCAgLy8g4LmA4LiX4Liy4Lit4LmI4Lit4LiZXG4gICAgICAgIFJFSkVDVEVEOiB7IGJnOiBcIiNGRkU2RTZcIiwgY29sb3I6IFwiI0QxMDAwMFwiIH0sICAvLyDguYHguJTguIdcbiAgICAgICAgZGVmYXVsdDogeyBiZzogXCIjRjJGMkYyXCIsIGNvbG9yOiBcIiM2NjY2NjZcIiB9LFxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgICA8Qm94IHA9XCIyeGxcIj5cbiAgICAgICAgICAgIDxCb3ggZGlzcGxheT1cImdyaWRcIiBncmlkVGVtcGxhdGVDb2x1bW5zPXtbJzFmcicsICdyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMzgwcHgsIDFmcikpJ119IHN0eWxlPXt7IGdhcDogXCIyMHB4XCIgfX0+XG4gICAgICAgICAgICAgICAge3JlY29yZHMubWFwKChyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHIucGFyYW1zID8/IHt9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHIuaWQgPz8gcGFyYW1zLmlkO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpc0V4cGFuZGVkID0gISFleHBhbmRlZFtpZF07XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g4pyFIOC4lOC4tuC4h+C4guC5ieC4reC4oeC4ueC4peC4l+C4seC5ieC4h+C4q+C4oeC4lOC4iOC4suC4gSBwYXJhbXNcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmFtZSA9IGRpc3BsYXlWYWx1ZShwYXJhbXMuUHJvcGVydHlfTmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlc2NyaXB0aW9uID0gZGlzcGxheVZhbHVlKHBhcmFtcy5EZXNjcmlwdGlvbiwgXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHByaWNlID0gcGFyYW1zLlByaWNlICE9IG51bGwgPyBOdW1iZXIocGFyYW1zLlByaWNlKS50b0xvY2FsZVN0cmluZygpIDogXCJOL0FcIjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsbFJlbnQgPSBkaXNwbGF5VmFsdWUocGFyYW1zLlNlbGxfUmVudCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IHBhcmFtcy5TdGF0dXNfcG9zdDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlZEF0ID0gbmV3IERhdGUocGFyYW1zLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwidGgtVEhcIiwgeyB5ZWFyOiAnbnVtZXJpYycsIG1vbnRoOiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJyB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW1nVXJsID0gcGFyYW1zLl9maXJzdEltYWdlIHx8IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNhdGVnb3J5TmFtZSA9IHBhcmFtcy5fY2F0ZWdvcnlOYW1lIHx8ICdOL0EnO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZXBvc2l0ID0gcGFyYW1zLkRlcG9zaXRfQW1vdW50ICE9IG51bGwgPyBOdW1iZXIocGFyYW1zLkRlcG9zaXRfQW1vdW50KS50b0xvY2FsZVN0cmluZygpIDogbnVsbDtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBjYXRlZ29yeVRyYW5zbGF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRvOiAn4LiE4Lit4LiZ4LmC4LiUJywgaG91c2U6ICfguJrguYnguLLguJknLCBsYW5kOiAn4LiX4Li14LmI4LiU4Li04LiZJywgdmlsbGE6ICfguKfguLTguKXguKXguYjguLInLCB0b3duaG91c2U6ICfguJfguLLguKfguJnguYzguYDguK7guLLguKrguYwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ3Nob3AgaG91c2UnOiAn4Lit4Liy4LiE4Liy4Lij4Lie4Liy4LiT4Li04LiK4Lii4LmMJywgYXBhcnRtZW50OiAn4Lit4Lie4Liy4Lij4LmM4LiX4LmA4Lih4LiZ4LiX4LmMJywgcGVudGhvdXNlOiAn4LmA4Lie4LiZ4LiX4LmM4LmA4Liu4Liy4Liq4LmMJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29ydDogJ+C4o+C4teC4quC4reC4o+C5jOC4lycsIGhvdGVsOiAn4LmC4Lij4LiH4LmB4Lij4LihJywgb2ZmaWNlOiAn4Liq4Liz4LiZ4Lix4LiB4LiH4Liy4LiZJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdjb21tZXJjaWFsIGJ1aWxkaW5nJzogJ+C4leC4tuC4geC4nuC4suC4k+C4tOC4iuC4ouC5jCcsIGZhY3Rvcnk6ICfguYLguKPguIfguIfguLLguJknLCB3YXJlaG91c2U6ICfguYLguIHguJTguLHguIcv4LiE4Lil4Lix4LiH4Liq4Li04LiZ4LiE4LmJ4LiyJyxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY2F0ZWdvcnlUZXh0ID0gY2F0ZWdvcnlUcmFuc2xhdGlvbnNbU3RyaW5nKGNhdGVnb3J5TmFtZSkudG9Mb3dlckNhc2UoKV0gfHwgY2F0ZWdvcnlOYW1lO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1c1RyYW5zbGF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFBFTkRJTkc6ICfguKPguK3guJXguKPguKfguIjguKrguK3guJonLFxuICAgICAgICAgICAgICAgICAgICAgICAgQ09ORklSTUVEOiAn4Lit4LiZ4Li44Lih4Lix4LiV4Li04LmB4Lil4LmJ4LinJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFNPTEQ6ICfguILguLLguKLguYHguKXguYnguKcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgSElEREVOOiAn4LiL4LmI4Lit4LiZJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFSkVDVEVEOiAn4LiW4Li54LiB4Lib4LiP4Li04LmA4Liq4LiYJyxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc2VsbFJlbnRUcmFuc2xhdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBTQUxFOiAn4LiC4Liy4LiiJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFJFTlQ6ICfguYDguIrguYjguLInLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWxsUmVudFRleHQgPSBzZWxsUmVudFRyYW5zbGF0aW9uc1tzZWxsUmVudF0gfHwgc2VsbFJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1c1RleHQgPSBzdGF0dXNUcmFuc2xhdGlvbnNbc3RhdHVzXSB8fCBzdGF0dXM7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0eWxlID0gYmFkZ2VTdHlsZXNbc3RhdHVzXSB8fCBiYWRnZVN0eWxlcy5kZWZhdWx0O1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q2FyZCBrZXk9e2lkfT5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aW1nVXJsID8gKDxCb3ggd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PXsyMDB9IG92ZXJmbG93PVwiaGlkZGVuXCIgYm9yZGVyUmFkaXVzPVwibGdcIiBtYj1cImxnXCI+PGltZyBzcmM9e2ltZ1VybH0gYWx0PVwidGh1bWJcIiBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogXCIxMDAlXCIsIG9iamVjdEZpdDogXCJjb3ZlclwiIH19IC8+PC9Cb3g+KSA6ICg8Qm94IHdpZHRoPVwiMTAwJVwiIGhlaWdodD17MTIwfSBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiIGJnPVwiZ3JleTIwXCIgY29sb3I9XCJncmV5NjBcIiBib3JkZXJSYWRpdXM9XCJsZ1wiIG1iPVwibGdcIj7guYTguKHguYjguKHguLXguKPguLnguJs8L0JveD4pfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBNYWluIEluZm8gPT09ICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxIMiBtPXswfSBmb250U2l6ZT1cInhsXCIgbWI9XCJzbVwiPntuYW1lfTwvSDI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGZsZXhXcmFwPVwid3JhcFwiIGFsaWduSXRlbXM9XCJmbGV4LXN0YXJ0XCIgbWI9XCJtZFwiIHN0eWxlPXt7IGdhcDogJzEycHgnIH19PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiAxLiDguKvguLjguYnguKHguKPguLLguITguLLguYHguKXguLDguKHguLHguJTguIjguLPguYTguKfguYnguJTguYnguKfguKLguIHguLHguJkgKi99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3g+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGV4dCBmb250V2VpZ2h0PVwiYm9sZFwiIGZvbnRTaXplPVwibGdcIiBjb2xvcj1cInByaW1hcnkxMDBcIj57cHJpY2V9IOC4muC4suC4lzwvVGV4dD5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIDIuIOC5gOC4nuC4tOC5iOC4oeC4quC5iOC4p+C4meC5geC4quC4lOC4h+C4oeC4seC4lOC4iOC4syAo4LiI4Liw4LmB4Liq4LiU4LiH4LmA4LiJ4Lie4Liy4Liw4LmA4Lih4Li34LmI4Lit4Lih4Li14LiC4LmJ4Lit4Lih4Li54LilKSAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtkZXBvc2l0ICYmIChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8VGV4dCBmb250U2l6ZT1cIm1kXCIgY29sb3I9XCJncmV5ODBcIiBtdD1cInhzXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICjguKHguLHguJTguIjguLM6IHtkZXBvc2l0fSDguJrguLLguJcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qIDMuICjguYHguJnguLDguJnguLMpIOC5gOC4nuC4tOC5iOC4oSBtdD1cIjZweFwiIOC5gOC4nuC4t+C5iOC4reC4iOC4seC4lOC5geC4meC4p+C5g+C4q+C5ieC4quC4p+C4ouC4h+C4suC4oSAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPFRleHQgY29sb3I9XCJncmV5ODBcIiBtdD1cIjZweFwiPntgJHtkaXNwbGF5VmFsdWUocGFyYW1zLkRpc3RyaWN0LCAnJyl9LCAke2Rpc3BsYXlWYWx1ZShwYXJhbXMuUHJvdmluY2UsICcnKX1gfTwvVGV4dD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJhZGdlIHZhcmlhbnQ9XCJwcmltYXJ5XCIgbXQ9XCI2cHhcIj57c2VsbFJlbnRUZXh0fTwvQmFkZ2U+IHsvKiDirIXvuI8g4LmB4LiB4LmJ4LmE4LiC4Lia4Lij4Lij4LiX4Lix4LiU4LiZ4Li14LmJICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBEZXNjcmlwdGlvbiA9PT0gKi99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveCBteT1cImxnXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxUZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2lzRXhwYW5kZWQgPyBkZXNjcmlwdGlvbiA6IHRydW5jYXRlKGRlc2NyaXB0aW9uLCAxMjApfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2Rlc2NyaXB0aW9uLmxlbmd0aCA+IDEyMCAmJiAoPEJ1dHRvbiB2YXJpYW50PVwidGV4dFwiIG9uQ2xpY2s9eygpID0+IHNldEV4cGFuZGVkKHByZXYgPT4gKHsgLi4ucHJldiwgW2lkXTogIXByZXZbaWRdIH0pKX0gbWw9XCJzbVwiPntpc0V4cGFuZGVkID8gXCLguKLguYjguK1cIiA6IFwi4Lit4LmI4Liy4LiZ4LiV4LmI4LitXCJ9PC9CdXR0b24+KX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9UZXh0PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBQcm9wZXJ0eSBEZXRhaWxzID09PSAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGJvcmRlclRvcD1cIjFweCBzb2xpZFwiIGJvcmRlckNvbG9yPVwiZ3JleTIwXCIgbXQ9XCJsZ1wiIHB0PVwibGdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEg1IG1iPVwibWRcIj7guKPguLLguKLguKXguLDguYDguK3guLXguKLguJTguJfguKPguLHguJ7guKLguYzguKrguLTguJk8L0g1PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJncmlkXCIgZ3JpZFRlbXBsYXRlQ29sdW1ucz1cInJlcGVhdCgzLCAxZnIpXCIgZ3JpZEdhcD1cIm1kXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RGV0YWlsSXRlbSBsYWJlbD1cIuC4nuC4t+C5ieC4meC4l+C4teC5iOC5g+C4iuC5ieC4quC4reC4olwiIHZhbHVlPXtwYXJhbXMuVXNhYmxlX0FyZWEgPyBgJHtwYXJhbXMuVXNhYmxlX0FyZWF9IOC4leC4oy7guKEuYCA6IG51bGx9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RGV0YWlsSXRlbSBsYWJlbD1cIuC4guC4meC4suC4lOC4l+C4teC5iOC4lOC4tOC4mVwiIHZhbHVlPXtwYXJhbXMuTGFuZF9TaXplID8gYCR7cGFyYW1zLkxhbmRfU2l6ZX0g4LiV4LijLuC4py5gIDogbnVsbH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxEZXRhaWxJdGVtIGxhYmVsPVwi4Lir4LmJ4Lit4LiH4LiZ4Lit4LiZXCIgdmFsdWU9e3BhcmFtcy5CZWRyb29tc30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxEZXRhaWxJdGVtIGxhYmVsPVwi4Lir4LmJ4Lit4LiH4LiZ4LmJ4LizXCIgdmFsdWU9e3BhcmFtcy5CYXRocm9vbX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxEZXRhaWxJdGVtIGxhYmVsPVwi4LiK4Lix4LmJ4LiZXCIgdmFsdWU9e3BhcmFtcy5mbG9vcn0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxEZXRhaWxJdGVtIGxhYmVsPVwi4LiX4Li14LmI4LiI4Lit4LiU4Lij4LiWXCIgdmFsdWU9e3BhcmFtcy5QYXJraW5nX1NwYWNlfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPERldGFpbEl0ZW0gbGFiZWw9XCLguIjguLPguJnguKfguJnguKLguLnguJnguLTguJVcIiB2YWx1ZT17cGFyYW1zLk51bWJlck9mVW5pdHN9IC8+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RGV0YWlsSXRlbSBsYWJlbD1cIuC4m+C4teC4l+C4teC5iOC4quC4o+C5ieC4suC4h1wiIHZhbHVlPXtwYXJhbXMuWWVhcl9CdWlsdH0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxEZXRhaWxJdGVtIGxhYmVsPVwi4LiI4Liz4LiZ4Lin4LiZ4Lir4LmJ4Lit4LiH4LiX4Lix4LmJ4LiH4Lir4Lih4LiUXCIgdmFsdWU9e3BhcmFtcy5Ub3RhbF9Sb29tc30gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7LyogPT09IFNlY3Rpb246IEZlYXR1cmVzID09PSAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGJvcmRlclRvcD1cIjFweCBzb2xpZFwiIGJvcmRlckNvbG9yPVwiZ3JleTIwXCIgbXQ9XCJsZ1wiIHB0PVwibGdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEg1IG1iPVwibWRcIj7guKrguLTguYjguIfguK3guLPguJnguKfguKLguITguKfguLLguKHguKrguLDguJTguKfguIHguYHguKXguLDguKrguJbguLLguJnguJfguLXguYjguYPguIHguKXguYnguYDguITguLXguKLguIc8L0g1PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7KHBhcmFtcy5BZGRpdGlvbmFsX0FtZW5pdGllcz8ubGVuZ3RoID4gMCkgJiYgPERldGFpbEl0ZW0gbGFiZWw9XCLguKrguLTguYjguIfguK3guLPguJnguKfguKLguITguKfguLLguKHguKrguLDguJTguKfguIHguYDguJ7guLTguYjguKHguYDguJXguLTguKFcIiB2YWx1ZT17cGFyYW1zLkFkZGl0aW9uYWxfQW1lbml0aWVzLmpvaW4oJywgJyl9IC8+fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7KHBhcmFtcy5OZWFyYnlfTGFuZG1hcmtzPy5sZW5ndGggPiAwKSAmJiA8RGV0YWlsSXRlbSBsYWJlbD1cIuC4quC4luC4suC4meC4l+C4teC5iOC5g+C4geC4peC5ieC5gOC4hOC4teC4ouC4h1wiIHZhbHVlPXtwYXJhbXMuTmVhcmJ5X0xhbmRtYXJrcy5qb2luKCcsICcpfSAvPn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogQ29udGFjdCAmIExpbmtzID09PSAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGJvcmRlclRvcD1cIjFweCBzb2xpZFwiIGJvcmRlckNvbG9yPVwiZ3JleTIwXCIgbXQ9XCJsZ1wiIHB0PVwibGdcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEg1IG1iPVwibWRcIj7guILguYnguK3guKHguLnguKXguJXguLTguJTguJXguYjguK3guYHguKXguLDguKXguLTguIfguIHguYw8L0g1PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8RGV0YWlsSXRlbSBsYWJlbD1cIuC4nOC4ueC5ieC4peC4h+C4m+C4o+C4sOC4geC4suC4qFwiIHZhbHVlPXtwYXJhbXMuTmFtZX0gLz5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPERldGFpbEl0ZW0gbGFiZWw9XCLguYDguJrguK3guKPguYzguYLguJfguKPguKjguLHguJ7guJfguYxcIiB2YWx1ZT17cGFyYW1zLlBob25lfSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgZ3JpZEdhcD1cIm1kXCIgbXQ9XCJtZFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3BhcmFtcy5MaW5rTWFwICYmIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17cGFyYW1zLkxpbmtNYXB9IHRhcmdldD1cIl9ibGFua1wiIHNpemU9XCJzbVwiPuC5geC4nOC4meC4l+C4teC5iDwvQnV0dG9uPn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwYXJhbXMuTGlua19saW5lICYmIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17cGFyYW1zLkxpbmtfbGluZX0gdGFyZ2V0PVwiX2JsYW5rXCIgc2l6ZT1cInNtXCI+TElORTwvQnV0dG9uPn1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtwYXJhbXMuTGlua19mYWNib29rICYmIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17cGFyYW1zLkxpbmtfZmFjYm9va30gdGFyZ2V0PVwiX2JsYW5rXCIgc2l6ZT1cInNtXCI+RmFjZWJvb2s8L0J1dHRvbj59XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBNZXRhICYgQWN0aW9ucyA9PT0gKi99XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveCBib3JkZXJUb3A9XCIxcHggc29saWRcIiBib3JkZXJDb2xvcj1cImdyZXkyMFwiIG10PVwibGdcIiBwdD1cImxnXCIgZGlzcGxheT1cImZsZXhcIiBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIiBhbGlnbkl0ZW1zPVwiZmxleC1lbmRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGZsZXhEaXJlY3Rpb249XCJjb2x1bW5cIiBnYXA9XCJzbVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPExhYmVsPjxzdHJvbmc+4Lir4Lih4Lin4LiU4Lir4Lih4Li54LmIOjwvc3Ryb25nPiB7Y2F0ZWdvcnlUZXh0fTwvTGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGFiZWw+PHN0cm9uZz7guKrguJbguLLguJnguLA6PC9zdHJvbmc+IDxCYWRnZSB2YXJpYW50PVwiZGVmYXVsdFwiIGJnPXtzdHlsZS5iZ30gY29sb3I9e3N0eWxlLmNvbG9yfSBtbD1cIm1kXCI+e3N0YXR1c1RleHR9PC9CYWRnZT48L0xhYmVsPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPExhYmVsPjxzdHJvbmc+4Liq4Lij4LmJ4Liy4LiH4LmA4Lih4Li34LmI4LitOjwvc3Ryb25nPiB7Y3JlYXRlZEF0fTwvTGFiZWw+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgZ3JpZEdhcD1cIm1kXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e2AvYWRtaW4vcmVzb3VyY2VzL1Byb3BlcnR5UG9zdC9yZWNvcmRzLyR7aWR9L3Nob3dgfSBzaXplPVwic21cIj7guJTguLk8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YC9hZG1pbi9yZXNvdXJjZXMvUHJvcGVydHlQb3N0L3JlY29yZHMvJHtpZH0vZWRpdGB9IHZhcmlhbnQ9XCJwcmltYXJ5XCIgc2l6ZT1cInNtXCI+4LmB4LiB4LmJ4LmE4LiCPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ2FyZD5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgPEJveCBtdD1cInhsXCIgZGlzcGxheT1cImZsZXhcIiBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiPlxuICAgICAgICAgICAgICAgIDxQYWdpbmF0aW9uXG4gICAgICAgICAgICAgICAgICAgIHBhZ2U9e3BhZ2V9XG4gICAgICAgICAgICAgICAgICAgIHBlclBhZ2U9e3BlclBhZ2V9XG4gICAgICAgICAgICAgICAgICAgIHRvdGFsPXt0b3RhbH1cbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9eyhwYWdlTnVtYmVyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBzZWFyY2ggPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoLnNldCgncGFnZScsIFN0cmluZyhwYWdlTnVtYmVyKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIOC4hOC4h+C4hOC5iOC4siBwYWdlU2l6ZSDguJfguLXguYjguYDguKPguLLguJXguLHguYnguIfguYTguKfguYkgKDEwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghc2VhcmNoLmhhcygncGFnZVNpemUnKSkgc2VhcmNoLnNldCgncGFnZVNpemUnLCAnMTAwJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc29ydEJ5KSBzZWFyY2guc2V0KCdzb3J0QnknLCBzb3J0QnkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbikgc2VhcmNoLnNldCgnZGlyZWN0aW9uJywgZGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGUoeyBzZWFyY2g6IHNlYXJjaC50b1N0cmluZygpIH0pO1xuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8L0JveD5cblxuICAgICAgICA8L0JveD5cbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUHJvcGVydHlDYXJkTGlzdDtcbiIsIi8vIHNlcnZlci9BZG1pbi9jb21wb25lbnRzL1NlbGxlckNhcmRMaXN0LmpzeFxuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVJlY29yZHMgfSBmcm9tICdhZG1pbmpzJztcbmltcG9ydCB7IHVzZU5hdmlnYXRlLCB1c2VMb2NhdGlvbiB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xuaW1wb3J0IHsgQm94LCBIMiwgTG9hZGVyLCBQbGFjZWhvbGRlciwgSDUsIEJ1dHRvbiwgUGFnaW5hdGlvbiB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuXG4vLyBIZWxwZXIgRnVuY3Rpb25zXG5jb25zdCBpc0VtcHR5VmFsdWUgPSAodikgPT4gdiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQgfHwgU3RyaW5nKHYpLnRyaW0oKSA9PT0gXCJcIjtcbmNvbnN0IGRpc3BsYXlWYWx1ZSA9ICh2LCBmYWxsYmFjayA9IFwi4Lin4LmI4Liy4LiHXCIpID0+IChpc0VtcHR5VmFsdWUodikgPyBmYWxsYmFjayA6IHYpO1xuXG5jb25zdCBDYXJkID0gKHsgY2hpbGRyZW4gfSkgPT4gKFxuICA8Qm94XG4gICAgdmFyaWFudD1cIndoaXRlXCJcbiAgICBib3hTaGFkb3c9XCJjYXJkXCJcbiAgICBib3JkZXJSYWRpdXM9XCJ4bFwiXG4gICAgcD1cInhsXCJcbiAgICBtYj1cIjJ4bFwiXG4gICAgc3R5bGU9e3sgdHJhbnNpdGlvbjogXCJib3gtc2hhZG93IDAuMnMgZWFzZSwgdHJhbnNmb3JtIDAuMnMgZWFzZVwiIH19XG4gICAgX2hvdmVyPXt7IGJveFNoYWRvdzogXCIwIDRweCAyMHB4IHJnYmEoMCwwLDAsMC4wOClcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoLTJweClcIiB9fVxuICA+XG4gICAge2NoaWxkcmVufVxuICA8L0JveD5cbik7XG5cbmNvbnN0IFNlbGxlckNhcmRMaXN0ID0gKCkgPT4ge1xuICBjb25zdCB7XG4gICAgcmVjb3JkcyxcbiAgICBsb2FkaW5nLFxuICAgIGVycm9yLFxuICAgIHRvdGFsLFxuICAgIHBlclBhZ2UsXG4gICAgcGFnZSxcbiAgICBkaXJlY3Rpb24sXG4gICAgc29ydEJ5XG4gIH0gPSB1c2VSZWNvcmRzKCdTZWxsZXInKTtcblxuXG4gIGNvbnN0IG5hdmlnYXRlID0gdXNlTmF2aWdhdGUoKTtcbiAgY29uc3QgbG9jYXRpb24gPSB1c2VMb2NhdGlvbigpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc2VhcmNoUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyhsb2NhdGlvbi5zZWFyY2gpO1xuICAgIC8vIOC4luC5ieC4suC4ouC4seC4h+C5hOC4oeC5iOC4oeC4tSBwYWdlU2l6ZSDguYPguJkgVVJMIOC5geC4peC4sOC4oeC4tSB0b3RhbCAo4Lij4Li54LmJ4LiI4Liz4LiZ4Lin4LiZ4LiX4Lix4LmJ4LiH4Lir4Lih4LiU4LmB4Lil4LmJ4LinKVxuICAgIGlmICghc2VhcmNoUGFyYW1zLmhhcygncGFnZVNpemUnKSAmJiB0b3RhbCA+IDApIHtcbiAgICAgIHNlYXJjaFBhcmFtcy5zZXQoJ3BhZ2VTaXplJywgJzEwMCcpOyAvLyDguJrguLHguIfguITguLHguJrguYLguKvguKXguJQgMTAwIOC4o+C4suC4ouC4geC4suC4o1xuICAgICAgbmF2aWdhdGUoeyBzZWFyY2g6IHNlYXJjaFBhcmFtcy50b1N0cmluZygpIH0pO1xuICAgIH1cbiAgfSwgW3RvdGFsLCBwZXJQYWdlLCBsb2NhdGlvbi5zZWFyY2gsIG5hdmlnYXRlXSk7IC8vIDwtLSDguYPguIrguYkgbmF2aWdhdGVcblxuICBjb25zdCBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaCk7XG4gIGlmICghc2VhcmNoUGFyYW1zLmhhcygncGFnZVNpemUnKSAmJiB0b3RhbCA+IDApIHtcbiAgICByZXR1cm4gPEJveCBwPVwibGdcIj48TG9hZGVyIC8+PC9Cb3g+O1xuICB9XG5cbiAgaWYgKGxvYWRpbmcpIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxMb2FkZXIgLz48L0JveD47XG4gIGlmIChlcnJvcikgcmV0dXJuIDxCb3ggcD1cImxnXCI+PFBsYWNlaG9sZGVyPjxINT7guYDguIHguLTguJTguILguYnguK3guJzguLTguJTguJ7guKXguLLguJQ8L0g1PjxwPuC5hOC4oeC5iOC4quC4suC4oeC4suC4o+C4luC4lOC4tuC4h+C4guC5ieC4reC4oeC4ueC4peC4nOC4ueC5ieC4guC4suC4ouC5hOC4lOC5iTwvcD48L1BsYWNlaG9sZGVyPjwvQm94PjtcbiAgaWYgKCFyZWNvcmRzIHx8IHJlY29yZHMubGVuZ3RoID09PSAwKSByZXR1cm4gPEJveCBwPVwibGdcIj48UGxhY2Vob2xkZXI+PEg1PuC5hOC4oeC5iOC4oeC4teC4nOC4ueC5ieC4guC4suC4ojwvSDU+PHA+4LmE4Lih4LmI4Lie4Lia4Lic4Li54LmJ4LiC4Liy4Lii4LiX4Li14LmI4LiV4Lij4LiH4LiB4Lix4Lia4LmA4LiH4Li34LmI4Lit4LiZ4LmE4LiC4LiB4Liy4Lij4LiB4Lij4Lit4LiH4LiC4Lit4LiH4LiE4Li44LiTPC9wPjwvUGxhY2Vob2xkZXI+PC9Cb3g+O1xuXG4gIHJldHVybiAoXG4gICAgPEJveCBwPVwiMnhsXCI+XG4gICAgICA8Qm94XG4gICAgICAgIGRpc3BsYXk9XCJncmlkXCJcbiAgICAgICAgZ3JpZFRlbXBsYXRlQ29sdW1ucz17WycxZnInLCAncmVwZWF0KGF1dG8tZmlsbCwgbWlubWF4KDM0MHB4LCAxZnIpKSddfVxuICAgICAgICBzdHlsZT17eyBnYXA6IFwiMjBweFwiIH19XG4gICAgICA+XG4gICAgICAgIHtyZWNvcmRzLm1hcCgocikgPT4ge1xuICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHIucGFyYW1zID8/IHt9O1xuICAgICAgICAgIGNvbnN0IHVzZXJQYXJhbXMgPSByLnBvcHVsYXRlZD8udXNlcj8ucGFyYW1zID8/IHt9O1xuICAgICAgICAgIGNvbnN0IGlkID0gci5pZCA/PyBwYXJhbXMuaWQ7XG5cbiAgICAgICAgICBjb25zdCBmdWxsTmFtZSA9IGAke2Rpc3BsYXlWYWx1ZSh1c2VyUGFyYW1zLkZpcnN0X25hbWUsICcnKX0gJHtkaXNwbGF5VmFsdWUodXNlclBhcmFtcy5MYXN0X25hbWUsICcnKX1gLnRyaW0oKSB8fCBcIuC5hOC4oeC5iOC4oeC4teC4iuC4t+C5iOC4rVwiO1xuICAgICAgICAgIGNvbnN0IGltYWdlVXJsID0gcGFyYW1zLm5hdGlvbmFsSWRJbWFnZSB8fCBudWxsO1xuXG4gICAgICAgICAgY29uc3QgY29tcGFueU5hbWUgPSBkaXNwbGF5VmFsdWUocGFyYW1zLkNvbXBhbnlfTmFtZSk7XG4gICAgICAgICAgY29uc3QgbGljZW5zZSA9IGRpc3BsYXlWYWx1ZShwYXJhbXMuUmVhbEVzdGF0ZV9MaWNlbnNlKTtcbiAgICAgICAgICBjb25zdCBzdGF0dXMgPSBkaXNwbGF5VmFsdWUocGFyYW1zLlN0YXR1cyk7XG4gICAgICAgICAgY29uc3QgY3JlYXRlZEF0ID0gbmV3IERhdGUocGFyYW1zLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwidGgtVEhcIiwge1xuICAgICAgICAgICAgeWVhcjogJ251bWVyaWMnLCBtb250aDogJ3Nob3J0JywgZGF5OiAnbnVtZXJpYydcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGNvbnN0IGJhZGdlU3R5bGVzID0ge1xuICAgICAgICAgICAgUEVORElORzogeyBiZzogXCIjZmZmYmU2XCIsIGNvbG9yOiBcIiNmYWFkMTRcIiB9LFxuICAgICAgICAgICAgQVBQUk9WRUQ6IHsgYmc6IFwiI2Y2ZmZlZFwiLCBjb2xvcjogXCIjNTJjNDFhXCIgfSxcbiAgICAgICAgICAgIFJFSkVDVEVEOiB7IGJnOiBcIiNmZmYxZjBcIiwgY29sb3I6IFwiI2Y1MjIyZFwiIH0sXG4gICAgICAgICAgICBkZWZhdWx0OiB7IGJnOiBcIiNmMmYyZjJcIiwgY29sb3I6IFwiIzU1NVwiIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb25zdCBzdHlsZSA9IGJhZGdlU3R5bGVzW3N0YXR1c10gfHwgYmFkZ2VTdHlsZXMuZGVmYXVsdDtcblxuICAgICAgICAgIC8vIOKchSDguKrguKPguYnguLLguIcgT2JqZWN0IOC4quC4s+C4q+C4o+C4seC4muC5geC4m+C4peC4quC4luC4suC4meC4sFxuICAgICAgICAgIGNvbnN0IHN0YXR1c1RyYW5zbGF0aW9ucyA9IHtcbiAgICAgICAgICAgIFBFTkRJTkc6ICfguKPguK3guJXguKPguKfguIjguKrguK3guJonLFxuICAgICAgICAgICAgQVBQUk9WRUQ6ICfguK3guJnguLjguKHguLHguJXguLTguYHguKXguYnguKcnLFxuICAgICAgICAgICAgUkVKRUNURUQ6ICfguJbguLnguIHguJvguI/guLTguYDguKrguJgnLFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICAvLyDinIUg4LiU4Li24LiH4LiE4Liz4LmB4Lib4Lil4Lig4Liy4Lip4Liy4LmE4LiX4LiiXG4gICAgICAgICAgY29uc3Qgc3RhdHVzVGV4dCA9IHN0YXR1c1RyYW5zbGF0aW9uc1tzdGF0dXNdIHx8IHN0YXR1cztcblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Q2FyZCBrZXk9e2lkfT5cbiAgICAgICAgICAgICAgPEJveCBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBncmlkR2FwPVwibGdcIj5cbiAgICAgICAgICAgICAgICA8Qm94IHdpZHRoPXs4MH0gaGVpZ2h0PXs4MH0gYm9yZGVyUmFkaXVzPVwiNTAlXCIgb3ZlcmZsb3c9XCJoaWRkZW5cIiBiZz1cImdyZXkyMFwiIGZsZXhTaHJpbms9ezB9PlxuICAgICAgICAgICAgICAgICAge2ltYWdlVXJsID8gKFxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17aW1hZ2VVcmx9IGFsdD1cInByb2ZpbGVcIiBzdHlsZT17eyB3aWR0aDogXCIxMDAlXCIsIGhlaWdodDogXCIxMDAlXCIsIG9iamVjdEZpdDogXCJjb3ZlclwiIH19IC8+XG4gICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICA8Qm94IHdpZHRoPVwiMTAwJVwiIGhlaWdodD1cIjEwMCVcIiBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiIGNvbG9yPVwiZ3JleTYwXCI+XG4gICAgICAgICAgICAgICAgICAgICAgTm8gSW1nXG4gICAgICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgICAgPEgyIG09ezB9IGZvbnRTaXplPVwieGxcIj57ZnVsbE5hbWV9PC9IMj5cbiAgICAgICAgICAgICAgICAgIDxCb3ggY29sb3I9XCJncmV5ODBcIiBtdD1cInhzXCI+PHN0cm9uZz7guJrguKPguLTguKnguLHguJc6PC9zdHJvbmc+IHtjb21wYW55TmFtZX08L0JveD5cbiAgICAgICAgICAgICAgICAgIDxCb3ggY29sb3I9XCJncmV5ODBcIj48c3Ryb25nPuC5g+C4muC4reC4meC4uOC4jeC4suC4lTo8L3N0cm9uZz4ge2xpY2Vuc2V9PC9Cb3g+XG4gICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAgICBib3JkZXJUb3A9XCIxcHggc29saWRcIiBib3JkZXJDb2xvcj1cImdyZXkyMFwiIG10PVwieGxcIiBwdD1cImxnXCJcbiAgICAgICAgICAgICAgICBkaXNwbGF5PVwiZmxleFwiIGp1c3RpZnlDb250ZW50PVwic3BhY2UtYmV0d2VlblwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAgICAgICAgYXM9XCJzcGFuXCIgcHg9XCJtZFwiIHB5PVwic21cIiBib3JkZXJSYWRpdXM9XCJsZ1wiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogc3R5bGUuYmcsIGNvbG9yOiBzdHlsZS5jb2xvciwgZm9udFdlaWdodDogXCJib2xkXCIsIGZvbnRTaXplOiBcIjAuOXJlbVwiIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHsvKiDinIUg4LmA4Lib4Lil4Li14LmI4Lii4LiZ4Lih4Liy4LmD4LiK4LmJIHN0YXR1c1RleHQg4LmA4Lie4Li34LmI4Lit4LmB4Liq4LiU4LiH4Lic4LilICovfVxuICAgICAgICAgICAgICAgICAgICB7c3RhdHVzVGV4dH1cbiAgICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgICAgPEJveCBmb250U2l6ZT1cInNtXCIgY29sb3I9XCJncmV5NjBcIiBtdD1cInNtXCI+XG4gICAgICAgICAgICAgICAgICAgIOC5gOC4m+C5h+C4meC4nOC4ueC5ieC4guC4suC4ouC5gOC4oeC4t+C5iOC4rToge2NyZWF0ZWRBdH1cbiAgICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBncmlkR2FwPVwibWRcIj5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YC9hZG1pbi9yZXNvdXJjZXMvU2VsbGVyL3JlY29yZHMvJHtpZH0vc2hvd2B9IHZhcmlhbnQ9XCJwcmltYXJ5XCI+4LiU4Li5PC9CdXR0b24+XG4gICAgICAgICAgICAgICAgICA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e2AvYWRtaW4vcmVzb3VyY2VzL1NlbGxlci9yZWNvcmRzLyR7aWR9L2VkaXRgfT7guYHguIHguYnguYTguII8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICA8L0NhcmQ+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L0JveD5cbiAgICAgIDxCb3ggbXQ9XCJ4bFwiIGRpc3BsYXk9XCJmbGV4XCIganVzdGlmeUNvbnRlbnQ9XCJjZW50ZXJcIj5cbiAgICAgICAgPFBhZ2luYXRpb25cbiAgICAgICAgICBwYWdlPXtwYWdlfVxuICAgICAgICAgIHBlclBhZ2U9e3BlclBhZ2V9XG4gICAgICAgICAgdG90YWw9e3RvdGFsfVxuICAgICAgICAgIG9uQ2hhbmdlPXsocGFnZU51bWJlcikgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2VhcmNoID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgICAgICAgICAgIHNlYXJjaC5zZXQoJ3BhZ2UnLCBTdHJpbmcocGFnZU51bWJlcikpO1xuICAgICAgICAgICAgLy8g4LiE4LiH4LiE4LmI4LiyIHBhZ2VTaXplIOC4l+C4teC5iOC5gOC4o+C4suC4leC4seC5ieC4h+C5hOC4p+C5iSAoMTAwKVxuICAgICAgICAgICAgaWYgKCFzZWFyY2guaGFzKCdwYWdlU2l6ZScpKSBzZWFyY2guc2V0KCdwYWdlU2l6ZScsICcxMDAnKTtcbiAgICAgICAgICAgIGlmIChzb3J0QnkpIHNlYXJjaC5zZXQoJ3NvcnRCeScsIHNvcnRCeSk7XG4gICAgICAgICAgICBpZiAoZGlyZWN0aW9uKSBzZWFyY2guc2V0KCdkaXJlY3Rpb24nLCBkaXJlY3Rpb24pO1xuXG4gICAgICAgICAgICAvLyDguYPguIrguYkgbmF2aWdhdGUgKHY2KVxuICAgICAgICAgICAgbmF2aWdhdGUoeyBzZWFyY2g6IHNlYXJjaC50b1N0cmluZygpIH0pO1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNlbGxlckNhcmRMaXN0OyIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VSZWNvcmRzIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgeyBCb3gsIEgyLCBINSwgTG9hZGVyLCBQbGFjZWhvbGRlciwgQnV0dG9uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5cbi8vIEhlbHBlciBGdW5jdGlvbnNcbmNvbnN0IGlzRW1wdHlWYWx1ZSA9ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCB8fCBTdHJpbmcodikudHJpbSgpID09PSBcIlwiO1xuY29uc3QgZGlzcGxheVZhbHVlID0gKHYsIGZhbGxiYWNrID0gXCLguKfguYjguLLguIdcIikgPT4gKGlzRW1wdHlWYWx1ZSh2KSA/IGZhbGxiYWNrIDogdik7XG5cbmNvbnN0IENhcmQgPSAoeyBjaGlsZHJlbiB9KSA9PiAoXG4gIDxCb3hcbiAgICB2YXJpYW50PVwid2hpdGVcIlxuICAgIGJveFNoYWRvdz1cImNhcmRcIlxuICAgIGJvcmRlclJhZGl1cz1cInhsXCJcbiAgICBwPVwieGxcIlxuICAgIG1iPVwiMnhsXCJcbiAgICBzdHlsZT17eyB0cmFuc2l0aW9uOiBcImJveC1zaGFkb3cgMC4ycyBlYXNlLCB0cmFuc2Zvcm0gMC4ycyBlYXNlXCIgfX1cbiAgICBfaG92ZXI9e3sgYm94U2hhZG93OiBcIjAgNHB4IDIwcHggcmdiYSgwLDAsMCwwLjA4KVwiLCB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWSgtMnB4KVwiIH19XG4gID5cbiAgICB7Y2hpbGRyZW59XG4gIDwvQm94PlxuKTtcblxuY29uc3QgUHJvcGVydHlVbml0Q2FyZExpc3QgPSAoKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkcywgbG9hZGluZywgZXJyb3IgfSA9IHVzZVJlY29yZHMoJ1Byb3BlcnR5VW5pdCcpO1xuXG4gIGlmIChsb2FkaW5nKSByZXR1cm4gPEJveCBwPVwibGdcIj48TG9hZGVyIC8+PC9Cb3g+O1xuICBpZiAoZXJyb3IpIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxQbGFjZWhvbGRlcj48SDU+4LmA4LiB4Li04LiU4LiC4LmJ4Lit4Lic4Li04LiU4Lie4Lil4Liy4LiUPC9INT48cD7guYTguKHguYjguKrguLLguKHguLLguKPguJbguJTguLbguIfguILguYnguK3guKHguLnguKXguKLguLnguJnguLTguJXguYTguJTguYk8L3A+PC9QbGFjZWhvbGRlcj48L0JveD47XG4gIGlmICghcmVjb3JkcyB8fCByZWNvcmRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDxCb3ggcD1cImxnXCI+PFBsYWNlaG9sZGVyPjxINT7guYTguKHguYjguKHguLXguKLguLnguJnguLTguJU8L0g1PjxwPuC5hOC4oeC5iOC4nuC4muC4guC5ieC4reC4oeC4ueC4peC4ouC4ueC4meC4tOC4leC4l+C4teC5iOC4leC4o+C4h+C4geC4seC4muC5gOC4h+C4t+C5iOC4reC4meC5hOC4gjwvcD48L1BsYWNlaG9sZGVyPjwvQm94PjtcblxuICByZXR1cm4gKFxuICAgIDxCb3ggcD1cIjJ4bFwiPlxuICAgICAgPEJveFxuICAgICAgICBkaXNwbGF5PVwiZ3JpZFwiXG4gICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM9e1snMWZyJywgJ3JlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgzNDBweCwgMWZyKSknXX1cbiAgICAgICAgc3R5bGU9e3sgZ2FwOiBcIjIwcHhcIiB9fSBcbiAgICAgID5cbiAgICAgICAge3JlY29yZHMubWFwKChyKSA9PiB7XG4gICAgICAgICAgY29uc3QgcGFyYW1zID0gci5wYXJhbXMgPz8ge307XG4gICAgICAgICAgY29uc3QgcHJvcGVydHlQb3N0UGFyYW1zID0gci5wb3B1bGF0ZWQ/LnByb3BlcnR5UG9zdD8ucGFyYW1zID8/IHt9O1xuICAgICAgICAgIGNvbnN0IGlkID0gci5pZCA/PyBwYXJhbXMuaWQ7XG5cbiAgICAgICAgICBjb25zdCB1bml0TnVtYmVyID0gZGlzcGxheVZhbHVlKHBhcmFtcy5Vbml0X051bWJlcik7XG4gICAgICAgICAgY29uc3QgcHJvcGVydHlOYW1lID0gZGlzcGxheVZhbHVlKHByb3BlcnR5UG9zdFBhcmFtcy5Qcm9wZXJ0eV9OYW1lLCAn4LmE4Lih4LmI4Lih4Li14LiK4Li34LmI4Lit4LmC4LiE4Lij4LiH4LiB4Liy4LijJyk7XG4gICAgICAgICAgY29uc3Qgc3RhdHVzID0gZGlzcGxheVZhbHVlKHBhcmFtcy5TdGF0dXMpO1xuXG4gICAgICAgICAgY29uc3QgYmFkZ2VTdHlsZXMgPSB7XG4gICAgICAgICAgICBBVkFJTEFCTEU6IHsgYmc6IFwiI2Y2ZmZlZFwiLCBjb2xvcjogXCIjNTJjNDFhXCIgfSxcbiAgICAgICAgICAgIEJPT0tFRDogeyBiZzogXCIjZmZmYmU2XCIsIGNvbG9yOiBcIiNmYWFkMTRcIiB9LFxuICAgICAgICAgICAgU09MRDogeyBiZzogXCIjZjJmMmYyXCIsIGNvbG9yOiBcIiM1NTVcIiB9LFxuICAgICAgICAgICAgZGVmYXVsdDogeyBiZzogXCIjZjJmMmYyXCIsIGNvbG9yOiBcIiM1NTVcIiB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgY29uc3Qgc3R5bGUgPSBiYWRnZVN0eWxlc1tzdGF0dXNdIHx8IGJhZGdlU3R5bGVzLmRlZmF1bHQ7XG5cbiAgICAgICAgICBjb25zdCBzdGF0dXNUcmFuc2xhdGlvbnMgPSB7XG4gICAgICAgICAgICBBVkFJTEFCTEU6ICfguKfguYjguLLguIcnLFxuICAgICAgICAgICAgUEVORElORzogJ+C4geC4s+C4peC4seC4h+C4lOC4s+C5gOC4meC4tOC4meC4geC4suC4oycsXG4gICAgICAgICAgICBTT0xEOiAn4LiC4Liy4Lii4LmB4Lil4LmJ4LinJyxcbiAgICAgICAgICB9O1xuICAgICAgICAgIGNvbnN0IHN0YXR1c1RleHQgPSBzdGF0dXNUcmFuc2xhdGlvbnNbc3RhdHVzXSB8fCBzdGF0dXM7XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPENhcmQga2V5PXtpZH0+XG4gICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogSGVhZGVyID09PSAqL31cbiAgICAgICAgICAgICAgey8qIOKchSDguKrguYjguKfguJnguILguK3guIfguKPguLnguJvguYTguK3guITguK3guJnguJbguLnguIHguKXguJrguK3guK3guIHguYTguJvguYHguKXguYnguKcgKi99XG4gICAgICAgICAgICAgIDxCb3g+XG4gICAgICAgICAgICAgICAgPEgyIG09ezB9IGZvbnRTaXplPVwieGxcIj7guKLguLnguJnguLTguJXguYDguKXguILguJfguLXguYg6IHt1bml0TnVtYmVyfTwvSDI+XG4gICAgICAgICAgICAgICAgPEJveCBjb2xvcj1cImdyZXk4MFwiIG10PVwieHNcIj48c3Ryb25nPuC5guC4hOC4o+C4h+C4geC4suC4ozo8L3N0cm9uZz4ge3Byb3BlcnR5TmFtZX08L0JveD5cbiAgICAgICAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBGb290ZXIgPT09ICovfVxuICAgICAgICAgICAgICA8Qm94XG4gICAgICAgICAgICAgICAgYm9yZGVyVG9wPVwiMXB4IHNvbGlkXCJcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcj1cImdyZXkyMFwiXG4gICAgICAgICAgICAgICAgbXQ9XCJ4bFwiIHB0PVwibGdcIlxuICAgICAgICAgICAgICAgIGRpc3BsYXk9XCJmbGV4XCJcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIlxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAgICAgICAgYXM9XCJzcGFuXCIgcHg9XCJtZFwiIHB5PVwic21cIlxuICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM9XCJsZ1wiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogc3R5bGUuYmcsIGNvbG9yOiBzdHlsZS5jb2xvciwgZm9udFdlaWdodDogXCJib2xkXCIsIGZvbnRTaXplOiBcIjAuOXJlbVwiIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtzdGF0dXNUZXh0fVxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgey8qIDxCb3ggZGlzcGxheT1cImZsZXhcIiBnYXA9XCJtZFwiPlxuICAgICAgICAgICAgICAgICAgPEJ1dHRvbiBhcz1cImFcIiBocmVmPXtgL2FkbWluL3Jlc291cmNlcy9Qcm9wZXJ0eVVuaXQvcmVjb3Jkcy8ke2lkfS9zaG93YH0gdmFyaWFudD1cInByaW1hcnlcIj7guJTguLk8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L0JveD4gKi99XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgPC9DYXJkPlxuICAgICAgICAgICk7XG4gICAgICAgIH0pfVxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQcm9wZXJ0eVVuaXRDYXJkTGlzdDsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlUmVjb3JkcyB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IHsgQm94LCBIMiwgSDUsIExvYWRlciwgUGxhY2Vob2xkZXIsIEJhZGdlLCBUZXh0IH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5cbi8vIEhlbHBlciBGdW5jdGlvbnNcbmNvbnN0IGlzRW1wdHlWYWx1ZSA9ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCB8fCBTdHJpbmcodikudHJpbSgpID09PSBcIlwiO1xuY29uc3QgZGlzcGxheVZhbHVlID0gKHYsIGZhbGxiYWNrID0gXCLguKfguYjguLLguIdcIikgPT4gKGlzRW1wdHlWYWx1ZSh2KSA/IGZhbGxiYWNrIDogdik7XG5cbmNvbnN0IENhcmQgPSAoeyBjaGlsZHJlbiB9KSA9PiAoXG4gIDxCb3hcbiAgICB2YXJpYW50PVwid2hpdGVcIlxuICAgIGJveFNoYWRvdz1cImNhcmRcIlxuICAgIGJvcmRlclJhZGl1cz1cInhsXCJcbiAgICBwPVwieGxcIlxuICAgIG1iPVwiMnhsXCJcbiAgICBzdHlsZT17eyB0cmFuc2l0aW9uOiBcImJveC1zaGFkb3cgMC4ycyBlYXNlLCB0cmFuc2Zvcm0gMC4ycyBlYXNlXCIgfX1cbiAgICBfaG92ZXI9e3sgYm94U2hhZG93OiBcIjAgNHB4IDIwcHggcmdiYSgwLDAsMCwwLjA4KVwiLCB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWSgtMnB4KVwiIH19XG4gID5cbiAgICB7Y2hpbGRyZW59XG4gIDwvQm94PlxuKTtcblxuY29uc3QgRGVwb3NpdENhcmRMaXN0ID0gKCkgPT4ge1xuICBjb25zdCB7IHJlY29yZHMsIGxvYWRpbmcsIGVycm9yIH0gPSB1c2VSZWNvcmRzKFwiRGVwb3NpdFwiKTtcblxuICBpZiAobG9hZGluZykgcmV0dXJuIDxCb3ggcD1cImxnXCI+PExvYWRlciAvPjwvQm94PjtcbiAgaWYgKGVycm9yKSByZXR1cm4gPEJveCBwPVwibGdcIj48UGxhY2Vob2xkZXI+PEg1PuC5gOC4geC4tOC4lOC4guC5ieC4reC4nOC4tOC4lOC4nuC4peC4suC4lDwvSDU+PHA+4LmE4Lih4LmI4Liq4Liy4Lih4Liy4Lij4LiW4LiU4Li24LiH4LiC4LmJ4Lit4Lih4Li54Lil4LmA4LiH4Li04LiZ4Lih4Lix4LiU4LiI4Liz4LmE4LiU4LmJPC9wPjwvUGxhY2Vob2xkZXI+PC9Cb3g+O1xuICBpZiAoIXJlY29yZHMgfHwgcmVjb3Jkcy5sZW5ndGggPT09IDApIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxQbGFjZWhvbGRlcj48SDU+4LmE4Lih4LmI4Lih4Li14LiC4LmJ4Lit4Lih4Li54Lil4LmA4LiH4Li04LiZ4Lih4Lix4LiU4LiI4LizPC9INT48cD7guYTguKHguYjguJ7guJrguILguYnguK3guKHguLnguKXguJfguLXguYjguJXguKPguIfguIHguLHguJrguYDguIfguLfguYjguK3guJnguYTguII8L3A+PC9QbGFjZWhvbGRlcj48L0JveD47XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHA9XCIyeGxcIj5cbiAgICAgIDxCb3hcbiAgICAgICAgZGlzcGxheT1cImdyaWRcIlxuICAgICAgICBncmlkVGVtcGxhdGVDb2x1bW5zPXtbJzFmcicsICdyZXBlYXQoYXV0by1maWxsLCBtaW5tYXgoMzQwcHgsIDFmcikpJ119XG4gICAgICAgIHN0eWxlPXt7IGdhcDogXCIyMHB4XCIgfX0gXG4gICAgICA+XG4gICAgICAgIHtyZWNvcmRzLm1hcCgocikgPT4ge1xuICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHIucGFyYW1zID8/IHt9O1xuICAgICAgICAgIGNvbnN0IHVzZXJQYXJhbXMgPSByLnBvcHVsYXRlZD8uVXNlcj8ucGFyYW1zID8/IHt9O1xuICAgICAgICAgIGNvbnN0IHBvc3RQYXJhbXMgPSByLnBvcHVsYXRlZD8uUG9zdD8ucGFyYW1zID8/IHt9O1xuICAgICAgICAgIGNvbnN0IHVuaXRQYXJhbXMgPSByLnBvcHVsYXRlZD8uVW5pdD8ucGFyYW1zID8/IHt9O1xuICAgICAgICAgIGNvbnN0IGlkID0gci5pZCA/PyBwYXJhbXMuaWQ7XG5cbiAgICAgICAgICBjb25zdCB1c2VyTmFtZSA9IGAke2Rpc3BsYXlWYWx1ZSh1c2VyUGFyYW1zLkZpcnN0X25hbWUsICcnKX0gJHtkaXNwbGF5VmFsdWUodXNlclBhcmFtcy5MYXN0X25hbWUsICcnKX1gLnRyaW0oKSB8fCBcIuC5hOC4oeC5iOC4oeC4teC4iuC4t+C5iOC4rVwiO1xuICAgICAgICAgIGNvbnN0IGRlcG9zaXRBbW91bnQgPSBwYXJhbXMuRGVwb3NpdF9BbW91bnQgIT0gbnVsbCA/IGAke051bWJlcihwYXJhbXMuRGVwb3NpdF9BbW91bnQpLnRvTG9jYWxlU3RyaW5nKCl9IOC4muC4suC4l2AgOiBcIk4vQVwiO1xuICAgICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGRpc3BsYXlWYWx1ZShwb3N0UGFyYW1zLlByb3BlcnR5X05hbWUsICdOL0EnKTtcbiAgICAgICAgICBjb25zdCB1bml0TnVtYmVyID0gZGlzcGxheVZhbHVlKHVuaXRQYXJhbXMuVW5pdF9OdW1iZXIsICdOL0EnKTtcbiAgICAgICAgICBjb25zdCBzdGF0dXMgPSBkaXNwbGF5VmFsdWUocGFyYW1zLkRlcG9zaXRfU3RhdHVzLCAnVU5LTk9XTicpO1xuICAgICAgICAgIGNvbnN0IGNyZWF0ZWRBdCA9IHBhcmFtcy5jcmVhdGVkQXQgPyBuZXcgRGF0ZShwYXJhbXMuY3JlYXRlZEF0KS50b0xvY2FsZURhdGVTdHJpbmcoXCJ0aC1USFwiLCB7IHllYXI6ICdudW1lcmljJywgbW9udGg6ICdzaG9ydCcsIGRheTogJ251bWVyaWMnfSkgOiAnTi9BJztcblxuICAgICAgICAgIGNvbnN0IGJhZGdlU3R5bGVzID0ge1xuICAgICAgICAgICAgUEVORElORzogeyBiZzogXCIjZmZmYmU2XCIsIGNvbG9yOiBcIiNmYWFkMTRcIiB9LFxuICAgICAgICAgICAgQ09ORklSTUVEOiB7IGJnOiBcIiNmNmZmZWRcIiwgY29sb3I6IFwiIzUyYzQxYVwiIH0sXG4gICAgICAgICAgICBSRUpFQ1RFRDogeyBiZzogXCIjZmZmMWYwXCIsIGNvbG9yOiBcIiNmNTIyMmRcIiB9LFxuICAgICAgICAgICAgZGVmYXVsdDogeyBiZzogXCIjZjJmMmYyXCIsIGNvbG9yOiBcIiM1NTVcIiB9LFxuICAgICAgICAgIH07XG4gICAgICAgICAgY29uc3Qgc3RhdHVzVHJhbnNsYXRpb25zID0ge1xuICAgICAgICAgICAgUEVORElORzogJ+C4o+C4reC4lOC4s+C5gOC4meC4tOC4meC4geC4suC4oycsXG4gICAgICAgICAgICBDT05GSVJNRUQ6ICfguKLguLfguJnguKLguLHguJnguYHguKXguYnguKcnLFxuICAgICAgICAgICAgUkVKRUNURUQ6ICfguJbguLnguIHguJvguI/guLTguYDguKrguJgnLFxuICAgICAgICAgIH07XG4gICAgICAgICAgXG4gICAgICAgICAgY29uc3Qgc3R5bGUgPSBiYWRnZVN0eWxlc1tzdGF0dXNdIHx8IGJhZGdlU3R5bGVzLmRlZmF1bHQ7XG4gICAgICAgICAgY29uc3Qgc3RhdHVzVGV4dCA9IHN0YXR1c1RyYW5zbGF0aW9uc1tzdGF0dXNdIHx8IHN0YXR1cztcblxuICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8Q2FyZCBrZXk9e2lkfT5cbiAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBIZWFkZXIgPT09ICovfVxuICAgICAgICAgICAgICB7Lyog4pyFIOC4quC5iOC4p+C4meC4guC4reC4h+C4o+C4ueC4m+C5hOC4reC4hOC4reC4meC4luC4ueC4geC4peC4muC4reC4reC4geC5hOC4m+C5geC4peC5ieC4pyAqL31cbiAgICAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICAgICA8SDIgbT17MH0gZm9udFNpemU9XCJ4bFwiPntkZXBvc2l0QW1vdW50fTwvSDI+XG4gICAgICAgICAgICAgICAgPFRleHQgY29sb3I9XCJncmV5ODBcIiBtdD1cInhzXCI+PHN0cm9uZz7guJzguLnguYnguJfguLPguKPguLLguKLguIHguLLguKM6PC9zdHJvbmc+IHt1c2VyTmFtZX08L1RleHQ+XG4gICAgICAgICAgICAgICAgPFRleHQgY29sb3I9XCJncmV5ODBcIj48c3Ryb25nPuC5guC4hOC4o+C4h+C4geC4suC4ozo8L3N0cm9uZz4ge3Byb3BlcnR5TmFtZX0gKOC4ouC4ueC4meC4tOC4lToge3VuaXROdW1iZXJ9KTwvVGV4dD5cbiAgICAgICAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBGb290ZXIgPT09ICovfVxuICAgICAgICAgICAgICA8Qm94XG4gICAgICAgICAgICAgICAgYm9yZGVyVG9wPVwiMXB4IHNvbGlkXCJcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcj1cImdyZXkyMFwiXG4gICAgICAgICAgICAgICAgbXQ9XCJ4bFwiIHB0PVwibGdcIlxuICAgICAgICAgICAgICAgIGRpc3BsYXk9XCJmbGV4XCJcbiAgICAgICAgICAgICAgICBqdXN0aWZ5Q29udGVudD1cInNwYWNlLWJldHdlZW5cIlxuICAgICAgICAgICAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAgICAgICAgYXM9XCJzcGFuXCIgcHg9XCJtZFwiIHB5PVwic21cIlxuICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM9XCJsZ1wiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogc3R5bGUuYmcsIGNvbG9yOiBzdHlsZS5jb2xvciwgZm9udFdlaWdodDogXCJib2xkXCIsIGZvbnRTaXplOiBcIjAuOXJlbVwiIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtzdGF0dXNUZXh0fVxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgICA8Qm94IGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyZXk2MFwiIG10PVwic21cIj5cbiAgICAgICAgICAgICAgICAgICAg4LiX4Liz4Lij4Liy4Lii4LiB4Liy4Lij4LmA4Lih4Li34LmI4LitOiB7Y3JlYXRlZEF0fVxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgPC9DYXJkPlxuICAgICAgICAgICk7XG4gICAgICAgIH0pfVxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBEZXBvc2l0Q2FyZExpc3Q7IiwiLy8gc2VydmVyL0FkbWluL2NvbXBvbmVudHMvVGVzdFBhZ2luYXRpb24uanN4XG5pbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlUmVjb3JkcyB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IHsgQm94LCBINSwgTG9hZGVyLCBQbGFjZWhvbGRlciwgVGV4dCwgUGFnaW5hdGlvbiB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuXG5jb25zdCBUZXN0RGVwb3NpdENvbXBvbmVudCA9ICgpID0+IHtcbiAgY29uc3QgeyByZWNvcmRzLCBsb2FkaW5nLCBwYWdlLCBwZXJQYWdlLCB0b3RhbCwgaGFuZGxlQ2hhbmdlUGFnZSB9ID0gdXNlUmVjb3JkcygnVXNlcicpO1xuXG4gIGNvbnNvbGUubG9nKFwiVEVTVCBQQUdJTkFUSU9OIERBVEE6XCIsIHsgcGFnZSwgcGVyUGFnZSwgdG90YWwgfSk7XG5cbiAgaWYgKGxvYWRpbmcpIHJldHVybiA8TG9hZGVyIC8+O1xuICBpZiAoIXJlY29yZHMpIHJldHVybiA8UGxhY2Vob2xkZXI+PEg1Pk5vIHJlY29yZHM8L0g1PjwvUGxhY2Vob2xkZXI+O1xuXG4gIHJldHVybiAoXG4gICAgPEJveCBwPVwibGdcIiB2YXJpYW50PVwid2hpdGVcIj5cbiAgICAgIDxINT5QYWdpbmF0aW9uIFRlc3QgQ29tcG9uZW50PC9INT5cbiAgICAgIDxUZXh0PlRvdGFsOiB7dG90YWx9LCBQZXJQYWdlOiB7cGVyUGFnZX0sIEN1cnJlbnQgUGFnZToge3BhZ2V9PC9UZXh0PlxuICAgICAgPHVsPlxuICAgICAgICB7cmVjb3Jkcy5tYXAociA9PiA8bGkga2V5PXtyLmlkfT5Vc2VyIElEOiB7ci5pZH08L2xpPil9XG4gICAgICA8L3VsPlxuICAgICAgPFBhZ2luYXRpb24gcGFnZT17cGFnZX0gcGVyUGFnZT17cGVyUGFnZX0gdG90YWw9e3RvdGFsfSBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlUGFnZX0gLz5cbiAgICA8L0JveD5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFRlc3REZXBvc2l0Q29tcG9uZW50OyIsIi8vIHNlcnZlci9BZG1pbi9jb21wb25lbnRzL1VzZXJDYXJkTGlzdC5qc3hcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VSZWNvcmRzIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgeyBCb3gsIEgyLCBMb2FkZXIsIFBsYWNlaG9sZGVyLCBINSwgQnV0dG9uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5cbi8vIEhlbHBlciBGdW5jdGlvbnNcbmNvbnN0IGlzRW1wdHlWYWx1ZSA9ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCB8fCBTdHJpbmcodikudHJpbSgpID09PSBcIlwiO1xuY29uc3QgZGlzcGxheVZhbHVlID0gKHYpID0+IChpc0VtcHR5VmFsdWUodikgPyBcIk4vQVwiIDogdik7XG5cbmNvbnN0IENhcmQgPSAoeyBjaGlsZHJlbiB9KSA9PiAoXG4gIDxCb3hcbiAgICB2YXJpYW50PVwid2hpdGVcIlxuICAgIGJveFNoYWRvdz1cImNhcmRcIlxuICAgIGJvcmRlclJhZGl1cz1cInhsXCJcbiAgICBwPVwieGxcIlxuICAgIG1iPVwieGxcIlxuICAgIF9ob3Zlcj17eyBib3hTaGFkb3c6IFwiMCAwIDEwcHggcmdiYSgwLDAsMCwwLjEpXCIgfX1cbiAgPlxuICAgIHtjaGlsZHJlbn1cbiAgPC9Cb3g+XG4pO1xuXG5jb25zdCBVc2VyQ2FyZExpc3QgPSAoKSA9PiB7XG4gIGNvbnN0IHsgcmVjb3JkcywgbG9hZGluZywgZXJyb3IgfSA9IHVzZVJlY29yZHMoJ1VzZXInKTtcblxuICBpZiAobG9hZGluZykge1xuICAgIHJldHVybiAoXG4gICAgICA8Qm94IHA9XCJsZ1wiPlxuICAgICAgICA8TG9hZGVyIC8+XG4gICAgICA8L0JveD5cbiAgICApO1xuICB9XG5cbiAgaWYgKGVycm9yKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCb3ggcD1cImxnXCI+XG4gICAgICAgIDxQbGFjZWhvbGRlcj5cbiAgICAgICAgICA8SDU+4LmA4LiB4Li04LiU4LiC4LmJ4Lit4Lic4Li04LiU4Lie4Lil4Liy4LiUPC9INT5cbiAgICAgICAgICA8cD7guYTguKHguYjguKrguLLguKHguLLguKPguJbguJTguLbguIfguILguYnguK3guKHguLnguKXguJzguLnguYnguYPguIrguYnguIfguLLguJnguYTguJTguYk8L3A+XG4gICAgICAgIDwvUGxhY2Vob2xkZXI+XG4gICAgICA8L0JveD5cbiAgICApO1xuICB9XG5cbiAgaWYgKCFyZWNvcmRzIHx8IHJlY29yZHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxCb3ggcD1cImxnXCI+XG4gICAgICAgIDxQbGFjZWhvbGRlcj5cbiAgICAgICAgICA8SDU+4LmE4Lih4LmI4Lih4Li14Lic4Li54LmJ4LmD4LiK4LmJ4LiH4Liy4LiZPC9INT5cbiAgICAgICAgICA8cD7guYTguKHguYjguJ7guJrguJzguLnguYnguYPguIrguYnguIfguLLguJnguJfguLXguYjguJXguKPguIfguIHguLHguJrguYDguIfguLfguYjguK3guJnguYTguILguIHguLLguKPguIHguKPguK3guIfguILguK3guIfguITguLjguJM8L3A+XG4gICAgICAgIDwvUGxhY2Vob2xkZXI+XG4gICAgICA8L0JveD5cbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8Qm94IHA9XCJ4bFwiPlxuICAgICAgPEJveFxuICAgICAgICBkaXNwbGF5PVwiZ3JpZFwiXG4gICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM9e1snMWZyJywgJ3JlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgzNDBweCwgMWZyKSknXX1cbiAgICAgICAgZ2FwPVwieGxcIlxuICAgICAgPlxuICAgICAgICB7cmVjb3Jkcy5tYXAoKHIpID0+IHtcbiAgICAgICAgICBjb25zdCBwYXJhbXMgPSByLnBhcmFtcyA/PyB7fTtcbiAgICAgICAgICBjb25zdCBpZCA9IHIuaWQgPz8gcGFyYW1zLmlkO1xuXG4gICAgICAgICAgY29uc3QgZnVsbE5hbWUgPSBgJHtkaXNwbGF5VmFsdWUocGFyYW1zLkZpcnN0X25hbWUpfSAke2Rpc3BsYXlWYWx1ZShwYXJhbXMuTGFzdF9uYW1lKX1gO1xuICAgICAgICAgIGNvbnN0IGVtYWlsID0gZGlzcGxheVZhbHVlKHBhcmFtcy5FbWFpbCk7XG4gICAgICAgICAgY29uc3QgcGhvbmUgPSBkaXNwbGF5VmFsdWUocGFyYW1zLlBob25lKTtcbiAgICAgICAgICBjb25zdCB1c2VyVHlwZSA9IGRpc3BsYXlWYWx1ZShwYXJhbXMudXNlclR5cGUpO1xuICAgICAgICAgIGNvbnN0IGltYWdlVXJsID0gcGFyYW1zLmltYWdlIHx8IG51bGw7XG4gICAgICAgICAgY29uc3QgY3JlYXRlZEF0ID0gbmV3IERhdGUocGFyYW1zLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwidGgtVEhcIiwge1xuICAgICAgICAgICAgeWVhcjogJ251bWVyaWMnLFxuICAgICAgICAgICAgbW9udGg6ICdzaG9ydCcsXG4gICAgICAgICAgICBkYXk6ICdudW1lcmljJ1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8g4pyFIOC5gOC4nuC4tOC5iOC4oeC4quC4teC4leC4suC4oeC4m+C4o+C4sOC5gOC4oOC4l1xuICAgICAgICAgIGNvbnN0IGJhZGdlU3R5bGVzID0ge1xuICAgICAgICAgICAgQWRtaW46IHtcbiAgICAgICAgICAgICAgYmc6IFwiI2U2ZjBmZlwiLCAvLyDguJ/guYnguLLguK3guYjguK3guJlcbiAgICAgICAgICAgICAgY29sb3I6IFwiIzAwNDdhYlwiLCAvLyDguJnguYnguLPguYDguIfguLTguJnguYDguILguYnguKFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBTZWxsZXI6IHtcbiAgICAgICAgICAgICAgYmc6IFwiI2VhZmZlYVwiLCAvLyDguYDguILguLXguKLguKfguK3guYjguK3guJlcbiAgICAgICAgICAgICAgY29sb3I6IFwiIzAwODAwMFwiLCAvLyDguYDguILguLXguKLguKfguYDguILguYnguKFcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBCdXllcjoge1xuICAgICAgICAgICAgICBiZzogXCIjZWFmZmVhXCIsIC8vIOC5gOC4guC4teC4ouC4p+C4reC5iOC4reC4mVxuICAgICAgICAgICAgICBjb2xvcjogXCIjMDA4MDAwXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVmYXVsdDoge1xuICAgICAgICAgICAgICBiZzogXCIjZjJmMmYyXCIsXG4gICAgICAgICAgICAgIGNvbG9yOiBcIiM1NTVcIixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGNvbnN0IHN0eWxlID0gYmFkZ2VTdHlsZXNbdXNlclR5cGVdIHx8IGJhZGdlU3R5bGVzLmRlZmF1bHQ7XG5cbiAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPENhcmQga2V5PXtpZH0+XG4gICAgICAgICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCIgZ3JpZEdhcD1cImxnXCI+XG4gICAgICAgICAgICAgICAgPEJveFxuICAgICAgICAgICAgICAgICAgd2lkdGg9ezgwfVxuICAgICAgICAgICAgICAgICAgaGVpZ2h0PXs4MH1cbiAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1cz1cIjUwJVwiXG4gICAgICAgICAgICAgICAgICBvdmVyZmxvdz1cImhpZGRlblwiXG4gICAgICAgICAgICAgICAgICBiZz1cImdyZXkyMFwiXG4gICAgICAgICAgICAgICAgICBmbGV4U2hyaW5rPXswfVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIHtpbWFnZVVybCA/IChcbiAgICAgICAgICAgICAgICAgICAgPGltZ1xuICAgICAgICAgICAgICAgICAgICAgIHNyYz17aW1hZ2VVcmx9XG4gICAgICAgICAgICAgICAgICAgICAgYWx0PVwicHJvZmlsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiBcIjEwMCVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogXCIxMDAlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RGaXQ6IFwiY292ZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICAgICAgPEJveFxuICAgICAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMTAwJVwiXG4gICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0PVwiMTAwJVwiXG4gICAgICAgICAgICAgICAgICAgICAgZGlzcGxheT1cImZsZXhcIlxuICAgICAgICAgICAgICAgICAgICAgIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50PVwiY2VudGVyXCJcbiAgICAgICAgICAgICAgICAgICAgICBjb2xvcj1cImdyZXk2MFwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICBObyBJbWdcbiAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgIDxCb3g+XG4gICAgICAgICAgICAgICAgICA8SDIgbT17MH0gZm9udFNpemU9XCJ4bFwiPntmdWxsTmFtZX08L0gyPlxuICAgICAgICAgICAgICAgICAgPEJveCBjb2xvcj1cImdyZXk4MFwiIG10PVwieHNcIj57ZW1haWx9PC9Cb3g+XG4gICAgICAgICAgICAgICAgICA8Qm94IGNvbG9yPVwiZ3JleTgwXCI+e3Bob25lfTwvQm94PlxuICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICA8L0JveD5cblxuICAgICAgICAgICAgICA8Qm94XG4gICAgICAgICAgICAgICAgYm9yZGVyVG9wPVwiMXB4IHNvbGlkXCJcbiAgICAgICAgICAgICAgICBib3JkZXJDb2xvcj1cImdyZXkyMFwiXG4gICAgICAgICAgICAgICAgbXQ9XCJsZ1wiXG4gICAgICAgICAgICAgICAgcHQ9XCJsZ1wiXG4gICAgICAgICAgICAgICAgZGlzcGxheT1cImZsZXhcIlxuICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50PVwic3BhY2UtYmV0d2VlblwiXG4gICAgICAgICAgICAgICAgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgICAgPEJveFxuICAgICAgICAgICAgICAgICAgICBhcz1cInNwYW5cIlxuICAgICAgICAgICAgICAgICAgICBweD1cIm1kXCJcbiAgICAgICAgICAgICAgICAgICAgcHk9XCJzbVwiXG4gICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1cz1cImxnXCJcbiAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHN0eWxlLmJnLFxuICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBzdHlsZS5jb2xvcixcbiAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiBcImJvbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogXCIwLjg1cmVtXCIsXG4gICAgICAgICAgICAgICAgICAgICAgYm94U2hhZG93OiBcIjAgMCA0cHggcmdiYSgwLDAsMCwwLjA1KVwiLFxuICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7dXNlclR5cGV9XG4gICAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICAgIDxCb3ggZm9udFNpemU9XCJzbVwiIGNvbG9yPVwiZ3JleTYwXCIgbXQ9XCJzbVwiPlxuICAgICAgICAgICAgICAgICAgICDguYDguJvguYfguJnguKrguKHguLLguIrguLTguIHguYDguKHguLfguYjguK06IHtjcmVhdGVkQXR9XG4gICAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICA8Qm94IGRpc3BsYXk9XCJmbGV4XCIgZ3JpZEdhcD1cIm1kXCI+XG4gICAgICAgICAgICAgICAgICA8QnV0dG9uIGFzPVwiYVwiIGhyZWY9e2AvYWRtaW4vcmVzb3VyY2VzL1VzZXIvcmVjb3Jkcy8ke2lkfS9zaG93YH0gdmFyaWFudD1cInByaW1hcnlcIj5cbiAgICAgICAgICAgICAgICAgICAg4LiU4Li5XG4gICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxCdXR0b24gYXM9XCJhXCIgaHJlZj17YC9hZG1pbi9yZXNvdXJjZXMvVXNlci9yZWNvcmRzLyR7aWR9L2VkaXRgfT5cbiAgICAgICAgICAgICAgICAgICAg4LmB4LiB4LmJ4LmE4LiCXG4gICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICA8L0NhcmQ+XG4gICAgICAgICAgKTtcbiAgICAgICAgfSl9XG4gICAgICA8L0JveD5cbiAgICA8L0JveD5cbiAgKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFVzZXJDYXJkTGlzdDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VSZWNvcmRzIH0gZnJvbSAnYWRtaW5qcyc7XG5pbXBvcnQgeyBCb3gsIEgyLCBINSwgTG9hZGVyLCBQbGFjZWhvbGRlciwgQnV0dG9uIH0gZnJvbSAnQGFkbWluanMvZGVzaWduLXN5c3RlbSc7XG5cbi8vIEhlbHBlciBGdW5jdGlvbnNcbmNvbnN0IGlzRW1wdHlWYWx1ZSA9ICh2KSA9PiB2ID09PSBudWxsIHx8IHYgPT09IHVuZGVmaW5lZCB8fCBTdHJpbmcodikudHJpbSgpID09PSBcIlwiO1xuY29uc3QgZGlzcGxheVZhbHVlID0gKHYsIGZhbGxiYWNrID0gXCLguKfguYjguLLguIdcIikgPT4gKGlzRW1wdHlWYWx1ZSh2KSA/IGZhbGxiYWNrIDogdik7XG5jb25zdCB0cnVuY2F0ZSA9ICh0ZXh0LCBuID0gMzUpID0+IHRleHQgJiYgdGV4dC5sZW5ndGggPiBuID8gdGV4dC5zbGljZSgwLCBuIC0gMSkgKyAn4oCmJyA6IHRleHQ7XG5cbmNvbnN0IENhcmQgPSAoeyBjaGlsZHJlbiB9KSA9PiAoXG4gICAgPEJveFxuICAgICAgICB2YXJpYW50PVwid2hpdGVcIlxuICAgICAgICBib3hTaGFkb3c9XCJjYXJkXCJcbiAgICAgICAgYm9yZGVyUmFkaXVzPVwieGxcIlxuICAgICAgICBwPVwieGxcIlxuICAgICAgICBtYj1cIjJ4bFwiXG4gICAgICAgIHN0eWxlPXt7IHRyYW5zaXRpb246IFwiYm94LXNoYWRvdyAwLjJzIGVhc2UsIHRyYW5zZm9ybSAwLjJzIGVhc2VcIiB9fVxuICAgICAgICBfaG92ZXI9e3sgYm94U2hhZG93OiBcIjAgNHB4IDIwcHggcmdiYSgwLDAsMCwwLjA4KVwiLCB0cmFuc2Zvcm06IFwidHJhbnNsYXRlWSgtMnB4KVwiIH19XG4gICAgPlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgPC9Cb3g+XG4pO1xuXG5jb25zdCBEb2N1bWVudENhcmRMaXN0ID0gKCkgPT4ge1xuICAgIGNvbnN0IHsgcmVjb3JkcywgbG9hZGluZywgZXJyb3IgfSA9IHVzZVJlY29yZHMoJ0RvY3VtZW50VXBsb2FkJyk7XG5cbiAgICBpZiAobG9hZGluZykgcmV0dXJuIDxCb3ggcD1cImxnXCI+PExvYWRlciAvPjwvQm94PjtcbiAgICBpZiAoZXJyb3IpIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxQbGFjZWhvbGRlcj48SDU+4LmA4LiB4Li04LiU4LiC4LmJ4Lit4Lic4Li04LiU4Lie4Lil4Liy4LiUPC9INT48cD7guYTguKHguYjguKrguLLguKHguLLguKPguJbguJTguLbguIfguILguYnguK3guKHguLnguKXguYDguK3guIHguKrguLLguKPguYTguJTguYk8L3A+PC9QbGFjZWhvbGRlcj48L0JveD47XG4gICAgaWYgKCFyZWNvcmRzIHx8IHJlY29yZHMubGVuZ3RoID09PSAwKSByZXR1cm4gPEJveCBwPVwibGdcIj48UGxhY2Vob2xkZXI+PEg1PuC5hOC4oeC5iOC4oeC4teC5gOC4reC4geC4quC4suC4ozwvSDU+PHA+4LmE4Lih4LmI4Lie4Lia4LiC4LmJ4Lit4Lih4Li54Lil4LmA4Lit4LiB4Liq4Liy4Lij4LiX4Li14LmI4LiV4Lij4LiH4LiB4Lix4Lia4LmA4LiH4Li34LmI4Lit4LiZ4LmE4LiCPC9wPjwvUGxhY2Vob2xkZXI+PC9Cb3g+O1xuXG4gICAgcmV0dXJuIChcbiAgICAgICAgPEJveCBwPVwiMnhsXCI+XG4gICAgICAgICAgICA8Qm94XG4gICAgICAgICAgICAgICAgZGlzcGxheT1cImdyaWRcIlxuICAgICAgICAgICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM9e1snMWZyJywgJ3JlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgzNDBweCwgMWZyKSknXX1cbiAgICAgICAgICAgICAgICBzdHlsZT17eyBnYXA6IFwiMjBweFwiIH19XG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAge3JlY29yZHMubWFwKChyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtcyA9IHIucGFyYW1zID8/IHt9O1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB1c2VyUGFyYW1zID0gci5wb3B1bGF0ZWQ/LlVzZXI/LnBhcmFtcyA/PyB7fTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaWQgPSByLmlkID8/IHBhcmFtcy5pZDtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBkb2N1bWVudE5hbWUgPSBkaXNwbGF5VmFsdWUocGFyYW1zLkRvY3VtZW50TmFtZSwgJ+C5hOC4oeC5iOC4oeC4teC4iuC4t+C5iOC4reC5gOC4reC4geC4quC4suC4oycpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkb2N1bWVudFVybCA9IHBhcmFtcy5Eb2N1bWVudFVybDtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgc3RhdHVzID0gZGlzcGxheVZhbHVlKHBhcmFtcy5SZXZpZXdfU3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdXNlck5hbWUgPSBgJHtkaXNwbGF5VmFsdWUodXNlclBhcmFtcy5GaXJzdF9uYW1lLCAnJyl9ICR7ZGlzcGxheVZhbHVlKHVzZXJQYXJhbXMuTGFzdF9uYW1lLCAnJyl9YC50cmltKCkgfHwgXCLguYTguKHguYjguKHguLXguILguYnguK3guKHguLnguKVcIjtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgY3JlYXRlZEF0ID0gcGFyYW1zLmNyZWF0ZWRBdCA/IG5ldyBEYXRlKHBhcmFtcy5jcmVhdGVkQXQpLnRvTG9jYWxlRGF0ZVN0cmluZyhcInRoLVRIXCIsIHsgeWVhcjogJ251bWVyaWMnLCBtb250aDogJ3Nob3J0JywgZGF5OiAnbnVtZXJpYycgfSkgOiAnTi9BJztcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBiYWRnZVN0eWxlcyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFBFTkRJTkc6IHsgYmc6IFwiI2ZmZmJlNlwiLCBjb2xvcjogXCIjZmFhZDE0XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEFQUFJPVkVEOiB7IGJnOiBcIiNmNmZmZWRcIiwgY29sb3I6IFwiIzUyYzQxYVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBSRUpFQ1RFRDogeyBiZzogXCIjZmZmMWYwXCIsIGNvbG9yOiBcIiNmNTIyMmRcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSElEREVOOiB7IGJnOiBcIiNmMmYyZjJcIiwgY29sb3I6IFwiIzU1NVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZhdWx0OiB7IGJnOiBcIiNmMmYyZjJcIiwgY29sb3I6IFwiIzU1NVwiIH0sXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0eWxlID0gYmFkZ2VTdHlsZXNbc3RhdHVzXSB8fCBiYWRnZVN0eWxlcy5kZWZhdWx0O1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1c1RyYW5zbGF0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFBFTkRJTkc6ICfguKPguK3guJXguKPguKfguIjguKrguK3guJonLFxuICAgICAgICAgICAgICAgICAgICAgICAgQVBQUk9WRUQ6ICfguK3guJnguLjguKHguLHguJXguLTguYHguKXguYnguKcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgUkVKRUNURUQ6ICfguJbguLnguIHguJvguI/guLTguYDguKrguJgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgSElEREVOOiBcIuC4quC4s+C5gOC4o+C5h+C4iFwiXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHN0YXR1c1RleHQgPSBzdGF0dXNUcmFuc2xhdGlvbnNbc3RhdHVzXSB8fCBzdGF0dXM7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDYXJkIGtleT17aWR9PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogSGVhZGVyID09PSAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Lyog4pyFIOC4quC5iOC4p+C4meC4guC4reC4h+C4o+C4ueC4m+C5hOC4reC4hOC4reC4meC4luC4ueC4geC4peC4muC4reC4reC4geC5hOC4m+C5geC4peC5ieC4pyAqL31cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SDIgbT17MH0gZm9udFNpemU9XCJsXCIgdGl0bGU9e2RvY3VtZW50TmFtZX0+e3RydW5jYXRlKGRvY3VtZW50TmFtZSl9PC9IMj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveCBjb2xvcj1cImdyZXk4MFwiIG10PVwieHNcIj48c3Ryb25nPuC4nOC4ueC5ieC4reC4seC4m+C5guC4q+C4peC4lDo8L3N0cm9uZz4ge3VzZXJOYW1lfTwvQm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBGb290ZXIgPT09ICovfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyVG9wPVwiMXB4IHNvbGlkXCIgYm9yZGVyQ29sb3I9XCJncmV5MjBcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtdD1cInhsXCIgcHQ9XCJsZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BsYXk9XCJmbGV4XCIganVzdGlmeUNvbnRlbnQ9XCJzcGFjZS1iZXR3ZWVuXCIgYWxpZ25JdGVtcz1cImNlbnRlclwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzPVwic3BhblwiIHB4PVwibWRcIiBweT1cInNtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM9XCJsZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3sgYmFja2dyb3VuZENvbG9yOiBzdHlsZS5iZywgY29sb3I6IHN0eWxlLmNvbG9yLCBmb250V2VpZ2h0OiBcImJvbGRcIiwgZm9udFNpemU6IFwiMC45cmVtXCIgfX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7c3RhdHVzVGV4dH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJveCBmb250U2l6ZT1cInNtXCIgY29sb3I9XCJncmV5NjBcIiBtdD1cInNtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAg4Lit4Lix4Lib4LmC4Lir4Lil4LiU4LmA4Lih4Li34LmI4LitOiB7Y3JlYXRlZEF0fVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFzPVwiYVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHJlZj17ZG9jdW1lbnRVcmx9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0PVwiX2JsYW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwicHJpbWFyeVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFkb2N1bWVudFVybH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICDguJTguLnguYTguJ/guKXguYxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQ2FyZD5cbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIDwvQm94PlxuICAgICAgICA8L0JveD5cbiAgICApO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRG9jdW1lbnRDYXJkTGlzdDsiLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlUmVjb3JkcyB9IGZyb20gJ2FkbWluanMnO1xuaW1wb3J0IHsgQm94LCBIMiwgSDUsIExvYWRlciwgUGxhY2Vob2xkZXIsIEJ1dHRvbiwgVGV4dCB9IGZyb20gJ0BhZG1pbmpzL2Rlc2lnbi1zeXN0ZW0nO1xuXG4vLyBIZWxwZXIgRnVuY3Rpb25zXG5jb25zdCBpc0VtcHR5VmFsdWUgPSAodikgPT4gdiA9PT0gbnVsbCB8fCB2ID09PSB1bmRlZmluZWQgfHwgU3RyaW5nKHYpLnRyaW0oKSA9PT0gXCJcIjtcbmNvbnN0IGRpc3BsYXlWYWx1ZSA9ICh2LCBmYWxsYmFjayA9IFwi4Lin4LmI4Liy4LiHXCIpID0+IChpc0VtcHR5VmFsdWUodikgPyBmYWxsYmFjayA6IHYpO1xuXG5jb25zdCBDYXJkID0gKHsgY2hpbGRyZW4gfSkgPT4gKFxuICA8Qm94XG4gICAgdmFyaWFudD1cIndoaXRlXCJcbiAgICBib3hTaGFkb3c9XCJjYXJkXCJcbiAgICBib3JkZXJSYWRpdXM9XCJ4bFwiXG4gICAgcD1cInhsXCJcbiAgICBtYj1cIjJ4bFwiXG4gICAgc3R5bGU9e3sgdHJhbnNpdGlvbjogXCJib3gtc2hhZG93IDAuMnMgZWFzZSwgdHJhbnNmb3JtIDAuMnMgZWFzZVwiIH19XG4gICAgX2hvdmVyPXt7IGJveFNoYWRvdzogXCIwIDRweCAyMHB4IHJnYmEoMCwwLDAsMC4wOClcIiwgdHJhbnNmb3JtOiBcInRyYW5zbGF0ZVkoLTJweClcIiB9fVxuICA+XG4gICAge2NoaWxkcmVufVxuICA8L0JveD5cbik7XG5cbmNvbnN0IFBheW1lbnRDYXJkTGlzdCA9ICgpID0+IHtcbiAgY29uc3QgeyByZWNvcmRzLCBsb2FkaW5nLCBlcnJvciB9ID0gdXNlUmVjb3JkcygnUGF5bWVudCcpO1xuXG4gIGlmIChsb2FkaW5nKSByZXR1cm4gPEJveCBwPVwibGdcIj48TG9hZGVyIC8+PC9Cb3g+O1xuICBpZiAoZXJyb3IpIHJldHVybiA8Qm94IHA9XCJsZ1wiPjxQbGFjZWhvbGRlcj48SDU+4LmA4LiB4Li04LiU4LiC4LmJ4Lit4Lic4Li04LiU4Lie4Lil4Liy4LiUPC9INT48cD7guYTguKHguYjguKrguLLguKHguLLguKPguJbguJTguLbguIfguILguYnguK3guKHguLnguKXguIHguLLguKPguIrguLPguKPguLDguYDguIfguLTguJnguYTguJTguYk8L3A+PC9QbGFjZWhvbGRlcj48L0JveD47XG4gIGlmICghcmVjb3JkcyB8fCByZWNvcmRzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDxCb3ggcD1cImxnXCI+PFBsYWNlaG9sZGVyPjxINT7guYTguKHguYjguKHguLXguILguYnguK3guKHguLnguKXguIHguLLguKPguIrguLPguKPguLDguYDguIfguLTguJk8L0g1PjxwPuC5hOC4oeC5iOC4nuC4muC4guC5ieC4reC4oeC4ueC4peC4l+C4teC5iOC4leC4o+C4h+C4geC4seC4muC5gOC4h+C4t+C5iOC4reC4meC5hOC4gjwvcD48L1BsYWNlaG9sZGVyPjwvQm94PjtcblxuICByZXR1cm4gKFxuICAgIDxCb3ggcD1cIjJ4bFwiPlxuICAgICAgPEJveFxuICAgICAgICBkaXNwbGF5PVwiZ3JpZFwiXG4gICAgICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnM9e1snMWZyJywgJ3JlcGVhdChhdXRvLWZpbGwsIG1pbm1heCgzNDBweCwgMWZyKSknXX1cbiAgICAgICAgc3R5bGU9e3sgZ2FwOiBcIjIwcHhcIiB9fSBcbiAgICAgID5cbiAgICAgICAge3JlY29yZHMubWFwKChyKSA9PiB7XG4gICAgICAgICAgY29uc3QgcGFyYW1zID0gci5wYXJhbXMgPz8ge307XG4gICAgICAgICAgY29uc3QgdXNlclBhcmFtcyA9IHIucG9wdWxhdGVkPy5Vc2VyPy5wYXJhbXMgPz8ge307XG4gICAgICAgICAgY29uc3QgcG9zdFBhcmFtcyA9IHIucG9wdWxhdGVkPy5Qcm9wZXJ0eVBvc3Q/LnBhcmFtcyA/PyB7fTtcbiAgICAgICAgICBjb25zdCBpZCA9IHIuaWQgPz8gcGFyYW1zLmlkO1xuXG4gICAgICAgICAgY29uc3QgcGF5bWVudEFtb3VudCA9IHBhcmFtcy5QYXltZW50X0Ftb3VudCAhPSBudWxsID8gYCR7TnVtYmVyKHBhcmFtcy5QYXltZW50X0Ftb3VudCkudG9Mb2NhbGVTdHJpbmcoKX0g4Lia4Liy4LiXYCA6IFwiTi9BXCI7XG4gICAgICAgICAgY29uc3QgcGF5bWVudFNsaXBVcmwgPSBwYXJhbXMuUGF5bWVudF9TbGlwO1xuICAgICAgICAgIGNvbnN0IHN0YXR1cyA9IGRpc3BsYXlWYWx1ZShwYXJhbXMuU3RhdHVzKTtcbiAgICAgICAgICBjb25zdCB1c2VyTmFtZSA9IGAke2Rpc3BsYXlWYWx1ZSh1c2VyUGFyYW1zLkZpcnN0X25hbWUsICcnKX0gJHtkaXNwbGF5VmFsdWUodXNlclBhcmFtcy5MYXN0X25hbWUsICcnKX1gLnRyaW0oKSB8fCBcIuC5hOC4oeC5iOC4oeC4teC4guC5ieC4reC4oeC4ueC4pVwiO1xuICAgICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IGRpc3BsYXlWYWx1ZShwb3N0UGFyYW1zLlByb3BlcnR5X05hbWUsICdOL0EnKTtcbiAgICAgICAgICBjb25zdCBjcmVhdGVkQXQgPSBwYXJhbXMuY3JlYXRlZEF0ID8gbmV3IERhdGUocGFyYW1zLmNyZWF0ZWRBdCkudG9Mb2NhbGVEYXRlU3RyaW5nKFwidGgtVEhcIiwgeyB5ZWFyOiAnbnVtZXJpYycsIG1vbnRoOiAnc2hvcnQnLCBkYXk6ICdudW1lcmljJ30pIDogJ04vQSc7XG5cbiAgICAgICAgICBjb25zdCBiYWRnZVN0eWxlcyA9IHtcbiAgICAgICAgICAgIFBFTkRJTkc6IHsgYmc6IFwiI2ZmZmJlNlwiLCBjb2xvcjogXCIjZmFhZDE0XCIgfSxcbiAgICAgICAgICAgIENPTkZJUk1FRDogeyBiZzogXCIjZjZmZmVkXCIsIGNvbG9yOiBcIiM1MmM0MWFcIiB9LFxuICAgICAgICAgICAgRkFJTEVEOiB7IGJnOiBcIiNmZmYxZjBcIiwgY29sb3I6IFwiI2Y1MjIyZFwiIH0sXG4gICAgICAgICAgICBkZWZhdWx0OiB7IGJnOiBcIiNmMmYyZjJcIiwgY29sb3I6IFwiIzU1NVwiIH0sXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb25zdCBzdHlsZSA9IGJhZGdlU3R5bGVzW3N0YXR1c10gfHwgYmFkZ2VTdHlsZXMuZGVmYXVsdDtcblxuICAgICAgICAgIGNvbnN0IHN0YXR1c1RyYW5zbGF0aW9ucyA9IHtcbiAgICAgICAgICAgIFBFTkRJTkc6ICfguKPguK3guJXguKPguKfguIjguKrguK3guJonLFxuICAgICAgICAgICAgQ09ORklSTUVEOiAn4Lii4Li34LiZ4Lii4Lix4LiZ4LmB4Lil4LmJ4LinJyxcbiAgICAgICAgICAgIEZBSUxFRDogJ+C4peC5ieC4oeC5gOC4q+C4peC4pycsXG4gICAgICAgICAgfTtcbiAgICAgICAgICBjb25zdCBzdGF0dXNUZXh0ID0gc3RhdHVzVHJhbnNsYXRpb25zW3N0YXR1c10gfHwgc3RhdHVzO1xuXG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxDYXJkIGtleT17aWR9PlxuICAgICAgICAgICAgICB7LyogPT09IFNlY3Rpb246IEhlYWRlciA9PT0gKi99XG4gICAgICAgICAgICAgIDxCb3ggZGlzcGxheT1cImZsZXhcIiBhbGlnbkl0ZW1zPVwiY2VudGVyXCIgc3R5bGU9e3sgZ2FwOiAnMTZweCcgfX0+XG4gICAgICAgICAgICAgICAgPEJveCBcbiAgICAgICAgICAgICAgICAgIHdpZHRoPXs4MH0gaGVpZ2h0PXs4MH0gYm9yZGVyUmFkaXVzPVwiNTAlXCIgXG4gICAgICAgICAgICAgICAgICBiZz1cInByaW1hcnkyMFwiIGNvbG9yPVwicHJpbWFyeTEwMFwiXG4gICAgICAgICAgICAgICAgICBkaXNwbGF5PVwiZmxleFwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIiBqdXN0aWZ5Q29udGVudD1cImNlbnRlclwiIGZsZXhTaHJpbms9ezB9XG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgPFRleHQgZm9udFNpemU9ezI0fSBmb250V2VpZ2h0PVwiYm9sZFwiPuC4vzwvVGV4dD5cbiAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgICA8Qm94PlxuICAgICAgICAgICAgICAgICAgPEgyIG09ezB9IGZvbnRTaXplPVwieGxcIj57cGF5bWVudEFtb3VudH08L0gyPlxuICAgICAgICAgICAgICAgICAgPFRleHQgY29sb3I9XCJncmV5ODBcIiBtdD1cInhzXCI+PHN0cm9uZz7guJzguLnguYnguIrguLPguKPguLA6PC9zdHJvbmc+IHt1c2VyTmFtZX08L1RleHQ+XG4gICAgICAgICAgICAgICAgICA8VGV4dCBjb2xvcj1cImdyZXk4MFwiPjxzdHJvbmc+4Liq4Liz4Lir4Lij4Lix4Lia4LmC4Lie4Liq4LiV4LmMOjwvc3Ryb25nPiB7cHJvcGVydHlOYW1lfTwvVGV4dD5cbiAgICAgICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgICAgPC9Cb3g+XG5cbiAgICAgICAgICAgICAgey8qID09PSBTZWN0aW9uOiBTbGlwIEJ1dHRvbiA9PT0gKi99XG4gICAgICAgICAgICAgIDxCb3ggYm9yZGVyVG9wPVwiMXB4IHNvbGlkXCIgYm9yZGVyQ29sb3I9XCJncmV5MjBcIiBtdD1cImxnXCIgcHQ9XCJsZ1wiPlxuICAgICAgICAgICAgICAgIDxCdXR0b24gXG4gICAgICAgICAgICAgICAgICBhcz1cImFcIiBcbiAgICAgICAgICAgICAgICAgIGhyZWY9e3BheW1lbnRTbGlwVXJsfSBcbiAgICAgICAgICAgICAgICAgIHRhcmdldD1cIl9ibGFua1wiIFxuICAgICAgICAgICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIlxuICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ9eyFwYXltZW50U2xpcFVybH1cbiAgICAgICAgICAgICAgICAgIHdpZHRoPVwiMTAwJVwiXG4gICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAg4LiU4Li54Liq4Lil4Li04LibXG4gICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgIDwvQm94PlxuXG4gICAgICAgICAgICAgIHsvKiA9PT0gU2VjdGlvbjogRm9vdGVyIChTdGF0dXMgT25seSkgPT09ICovfVxuICAgICAgICAgICAgICA8Qm94XG4gICAgICAgICAgICAgICAgYm9yZGVyVG9wPVwiMXB4IHNvbGlkXCIgYm9yZGVyQ29sb3I9XCJncmV5MjBcIlxuICAgICAgICAgICAgICAgIG10PVwibGdcIiBwdD1cImxnXCJcbiAgICAgICAgICAgICAgICBkaXNwbGF5PVwiZmxleFwiIGp1c3RpZnlDb250ZW50PVwic3BhY2UtYmV0d2VlblwiIGFsaWduSXRlbXM9XCJjZW50ZXJcIlxuICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPEJveD5cbiAgICAgICAgICAgICAgICAgIDxCb3hcbiAgICAgICAgICAgICAgICAgICAgYXM9XCJzcGFuXCIgcHg9XCJtZFwiIHB5PVwic21cIlxuICAgICAgICAgICAgICAgICAgICBib3JkZXJSYWRpdXM9XCJsZ1wiXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGJhY2tncm91bmRDb2xvcjogc3R5bGUuYmcsIGNvbG9yOiBzdHlsZS5jb2xvciwgZm9udFdlaWdodDogXCJib2xkXCIsIGZvbnRTaXplOiBcIjAuOXJlbVwiIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIHtzdGF0dXNUZXh0fVxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgICA8Qm94IGZvbnRTaXplPVwic21cIiBjb2xvcj1cImdyZXk2MFwiIG10PVwic21cIj5cbiAgICAgICAgICAgICAgICAgICAg4LiK4Liz4Lij4Liw4LmA4Lih4Li34LmI4LitOiB7Y3JlYXRlZEF0fVxuICAgICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgICAgPC9Cb3g+XG4gICAgICAgICAgICAgIDwvQm94PlxuICAgICAgICAgICAgPC9DYXJkPlxuICAgICAgICAgICk7XG4gICAgICAgIH0pfVxuICAgICAgPC9Cb3g+XG4gICAgPC9Cb3g+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQYXltZW50Q2FyZExpc3Q7IiwiQWRtaW5KUy5Vc2VyQ29tcG9uZW50cyA9IHt9XG5pbXBvcnQgUHJvcGVydHlDYXJkTGlzdCBmcm9tICcuLi9BZG1pbi9jb21wb25lbnRzL1Byb3BlcnR5Q2FyZExpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlByb3BlcnR5Q2FyZExpc3QgPSBQcm9wZXJ0eUNhcmRMaXN0XG5pbXBvcnQgU2VsbGVyQ2FyZExpc3QgZnJvbSAnLi4vQWRtaW4vY29tcG9uZW50cy9TZWxsZXJDYXJkTGlzdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuU2VsbGVyQ2FyZExpc3QgPSBTZWxsZXJDYXJkTGlzdFxuaW1wb3J0IFByb3BlcnR5VW5pdExpc3RDb21wb25lbnQgZnJvbSAnLi4vQWRtaW4vY29tcG9uZW50cy9Qcm9wZXJ0eVVuaXRDYXJkTGlzdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUHJvcGVydHlVbml0TGlzdENvbXBvbmVudCA9IFByb3BlcnR5VW5pdExpc3RDb21wb25lbnRcbmltcG9ydCBEZXBvc2l0Q2FyZExpc3QgZnJvbSAnLi4vQWRtaW4vY29tcG9uZW50cy9EZXBvc2l0Q2FyZExpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLkRlcG9zaXRDYXJkTGlzdCA9IERlcG9zaXRDYXJkTGlzdFxuaW1wb3J0IFRlc3REZXBvc2l0IGZyb20gJy4uL0FkbWluL2NvbXBvbmVudHMvVGVzdERlcG9zaXRDb21wb25lbnQnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlRlc3REZXBvc2l0ID0gVGVzdERlcG9zaXRcbmltcG9ydCBVc2VyQ2FyZExpc3QgZnJvbSAnLi4vQWRtaW4vY29tcG9uZW50cy9Vc2VyQ2FyZExpc3QnXG5BZG1pbkpTLlVzZXJDb21wb25lbnRzLlVzZXJDYXJkTGlzdCA9IFVzZXJDYXJkTGlzdFxuaW1wb3J0IERvY3VtZW50Q2FyZExpc3QgZnJvbSAnLi4vQWRtaW4vY29tcG9uZW50cy9Eb2N1bWVudENhcmRMaXN0J1xuQWRtaW5KUy5Vc2VyQ29tcG9uZW50cy5Eb2N1bWVudENhcmRMaXN0ID0gRG9jdW1lbnRDYXJkTGlzdFxuaW1wb3J0IFBheW1lbnRDYXJkTGlzdCBmcm9tICcuLi9BZG1pbi9jb21wb25lbnRzL1BheW1lbnRDYXJkTGlzdCdcbkFkbWluSlMuVXNlckNvbXBvbmVudHMuUGF5bWVudENhcmRMaXN0ID0gUGF5bWVudENhcmRMaXN0Il0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsInYiLCJ1bmRlZmluZWQiLCJTdHJpbmciLCJ0cmltIiwiZGlzcGxheVZhbHVlIiwiZmFsbGJhY2siLCJ0cnVuY2F0ZSIsInRleHQiLCJuIiwibGVuZ3RoIiwic2xpY2UiLCJEZXRhaWxJdGVtIiwibGFiZWwiLCJ2YWx1ZSIsIlJlYWN0IiwiY3JlYXRlRWxlbWVudCIsIkJveCIsIkxhYmVsIiwiY29sb3IiLCJzdHlsZSIsInRleHRUcmFuc2Zvcm0iLCJmb250U2l6ZSIsIlRleHQiLCJmb250V2VpZ2h0IiwiQ2FyZCIsImNoaWxkcmVuIiwidmFyaWFudCIsImJveFNoYWRvdyIsImJvcmRlclJhZGl1cyIsInAiLCJtYiIsIlByb3BlcnR5Q2FyZExpc3QiLCJyZWNvcmRzIiwibG9hZGluZyIsImVycm9yIiwidG90YWwiLCJwZXJQYWdlIiwicGFnZSIsImRpcmVjdGlvbiIsInNvcnRCeSIsInVzZVJlY29yZHMiLCJleHBhbmRlZCIsInNldEV4cGFuZGVkIiwidXNlU3RhdGUiLCJuYXZpZ2F0ZSIsInVzZU5hdmlnYXRlIiwibG9jYXRpb24iLCJ1c2VMb2NhdGlvbiIsInVzZUVmZmVjdCIsInNlYXJjaFBhcmFtcyIsIlVSTFNlYXJjaFBhcmFtcyIsInNlYXJjaCIsImhhcyIsInNldCIsInRvU3RyaW5nIiwiTG9hZGVyIiwiY29uc29sZSIsImxvZyIsIlBsYWNlaG9sZGVyIiwiSDUiLCJiYWRnZVN0eWxlcyIsIlBFTkRJTkciLCJiZyIsIkNPTkZJUk1FRCIsIlNPTEQiLCJISURERU4iLCJSRUpFQ1RFRCIsImRlZmF1bHQiLCJkaXNwbGF5IiwiZ3JpZFRlbXBsYXRlQ29sdW1ucyIsImdhcCIsIm1hcCIsInIiLCJwYXJhbXMiLCJpZCIsImlzRXhwYW5kZWQiLCJuYW1lIiwiUHJvcGVydHlfTmFtZSIsImRlc2NyaXB0aW9uIiwiRGVzY3JpcHRpb24iLCJwcmljZSIsIlByaWNlIiwiTnVtYmVyIiwidG9Mb2NhbGVTdHJpbmciLCJzZWxsUmVudCIsIlNlbGxfUmVudCIsInN0YXR1cyIsIlN0YXR1c19wb3N0IiwiY3JlYXRlZEF0IiwiRGF0ZSIsInRvTG9jYWxlRGF0ZVN0cmluZyIsInllYXIiLCJtb250aCIsImRheSIsImltZ1VybCIsIl9maXJzdEltYWdlIiwiY2F0ZWdvcnlOYW1lIiwiX2NhdGVnb3J5TmFtZSIsImRlcG9zaXQiLCJEZXBvc2l0X0Ftb3VudCIsImNhdGVnb3J5VHJhbnNsYXRpb25zIiwiY29uZG8iLCJob3VzZSIsImxhbmQiLCJ2aWxsYSIsInRvd25ob3VzZSIsImFwYXJ0bWVudCIsInBlbnRob3VzZSIsInJlc29ydCIsImhvdGVsIiwib2ZmaWNlIiwiZmFjdG9yeSIsIndhcmVob3VzZSIsImNhdGVnb3J5VGV4dCIsInRvTG93ZXJDYXNlIiwic3RhdHVzVHJhbnNsYXRpb25zIiwic2VsbFJlbnRUcmFuc2xhdGlvbnMiLCJTQUxFIiwiUkVOVCIsInNlbGxSZW50VGV4dCIsInN0YXR1c1RleHQiLCJrZXkiLCJ3aWR0aCIsImhlaWdodCIsIm92ZXJmbG93Iiwic3JjIiwiYWx0Iiwib2JqZWN0Rml0IiwiYWxpZ25JdGVtcyIsImp1c3RpZnlDb250ZW50IiwiSDIiLCJtIiwiZmxleFdyYXAiLCJtdCIsIkRpc3RyaWN0IiwiUHJvdmluY2UiLCJCYWRnZSIsIm15IiwiQnV0dG9uIiwib25DbGljayIsInByZXYiLCJtbCIsImJvcmRlclRvcCIsImJvcmRlckNvbG9yIiwicHQiLCJncmlkR2FwIiwiVXNhYmxlX0FyZWEiLCJMYW5kX1NpemUiLCJCZWRyb29tcyIsIkJhdGhyb29tIiwiZmxvb3IiLCJQYXJraW5nX1NwYWNlIiwiTnVtYmVyT2ZVbml0cyIsIlllYXJfQnVpbHQiLCJUb3RhbF9Sb29tcyIsIkFkZGl0aW9uYWxfQW1lbml0aWVzIiwiam9pbiIsIk5lYXJieV9MYW5kbWFya3MiLCJOYW1lIiwiUGhvbmUiLCJMaW5rTWFwIiwiYXMiLCJocmVmIiwidGFyZ2V0Iiwic2l6ZSIsIkxpbmtfbGluZSIsIkxpbmtfZmFjYm9vayIsImZsZXhEaXJlY3Rpb24iLCJQYWdpbmF0aW9uIiwib25DaGFuZ2UiLCJwYWdlTnVtYmVyIiwid2luZG93IiwidHJhbnNpdGlvbiIsIl9ob3ZlciIsInRyYW5zZm9ybSIsIlNlbGxlckNhcmRMaXN0IiwidXNlclBhcmFtcyIsInBvcHVsYXRlZCIsInVzZXIiLCJmdWxsTmFtZSIsIkZpcnN0X25hbWUiLCJMYXN0X25hbWUiLCJpbWFnZVVybCIsIm5hdGlvbmFsSWRJbWFnZSIsImNvbXBhbnlOYW1lIiwiQ29tcGFueV9OYW1lIiwibGljZW5zZSIsIlJlYWxFc3RhdGVfTGljZW5zZSIsIlN0YXR1cyIsIkFQUFJPVkVEIiwiZmxleFNocmluayIsInB4IiwicHkiLCJiYWNrZ3JvdW5kQ29sb3IiLCJQcm9wZXJ0eVVuaXRDYXJkTGlzdCIsInByb3BlcnR5UG9zdFBhcmFtcyIsInByb3BlcnR5UG9zdCIsInVuaXROdW1iZXIiLCJVbml0X051bWJlciIsInByb3BlcnR5TmFtZSIsIkFWQUlMQUJMRSIsIkJPT0tFRCIsIkRlcG9zaXRDYXJkTGlzdCIsIlVzZXIiLCJwb3N0UGFyYW1zIiwiUG9zdCIsInVuaXRQYXJhbXMiLCJVbml0IiwidXNlck5hbWUiLCJkZXBvc2l0QW1vdW50IiwiRGVwb3NpdF9TdGF0dXMiLCJUZXN0RGVwb3NpdENvbXBvbmVudCIsImhhbmRsZUNoYW5nZVBhZ2UiLCJVc2VyQ2FyZExpc3QiLCJlbWFpbCIsIkVtYWlsIiwicGhvbmUiLCJ1c2VyVHlwZSIsImltYWdlIiwiQWRtaW4iLCJTZWxsZXIiLCJCdXllciIsIkRvY3VtZW50Q2FyZExpc3QiLCJkb2N1bWVudE5hbWUiLCJEb2N1bWVudE5hbWUiLCJkb2N1bWVudFVybCIsIkRvY3VtZW50VXJsIiwiUmV2aWV3X1N0YXR1cyIsInRpdGxlIiwiZGlzYWJsZWQiLCJQYXltZW50Q2FyZExpc3QiLCJQcm9wZXJ0eVBvc3QiLCJwYXltZW50QW1vdW50IiwiUGF5bWVudF9BbW91bnQiLCJwYXltZW50U2xpcFVybCIsIlBheW1lbnRfU2xpcCIsIkZBSUxFRCIsIkFkbWluSlMiLCJVc2VyQ29tcG9uZW50cyIsIlByb3BlcnR5VW5pdExpc3RDb21wb25lbnQiLCJUZXN0RGVwb3NpdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztJQUFBO0lBS0E7SUFDQSxNQUFN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
