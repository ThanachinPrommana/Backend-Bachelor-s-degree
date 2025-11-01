import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const categories = [
  { id: "cmegzfdya0006w2bwq5d8alc7", name: "condo" },
  { id: "cmegzfhx70007w2bwp63cbc1w", name: "house" },
  { id: "cmegzfov30009w2bwrxjpt7xn", name: "villa" },
  { id: "cmegzft08000aw2bwx91l68z9", name: "townhouse" },
];


const propertyPost = [
  {
    "idx": 0,
    "id": "cmh7f5uks0008w2ugskyopq9j",
    "Property_Name": "คอนโดหรู",
    "Price": 2500000,
    "Usable_Area": 100,
    "Land_Size": 0,
    "Bedrooms": 1,
    "Bathroom": 1,
    "Description": "ขาย คอนโดตกแต่งพร้อมอยู่ 2 ห้องนอน 2 ห้องน้ำ ขนาด 53.21 ตารางเมตร ชั้น 19, โครงการ เดอะ คราวน์ เรสซิเดนท์เซส ซึ่งตั้งอยู่ในเขตปทุมวัน ใกล้ MRT คลองเตยติดต่อเราเพื่อนัดหมายเข้าชมรายการที่คุณต้องการ\r\nข้อมูลสิ่งอำนวยความสะดวกต่างๆ:\r\nตู้เย็น\r\nไมโครเวฟ\r\nเตาไฟฟ้า\r\nระเบียง\r\nทีวี\r\nพื้นที่ส่วนกลาง:\r\nสร้างเสร็จในปี 2023\r\nฟิตเนส\r\nสระว่ายน้ำ\r\nสวน\r\nสนามเด็กเล่น\r\nกล้องวงจรปิด\r\nระบบรักษาความปลอดภัย 24 ชม.\r\nลานจอดรถในร่ม\r\nเซาว์น่า\r\nห้องสัมนา",
    "Deposit_Amount": 125000,
    "LinkMap": "https://www.google.com/maps/place/%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%B1%E0%B8%A5+%E0%B8%99%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%98%E0%B8%A7%E0%B8%B4%E0%B8%A5%E0%B8%A5%E0%B9%8C/@13.8661637,100.4618168,13z/data=!4m6!3m5!1s0x30e29b31e80e515d:0x4891c519dbbcf698!8m2!3d13.8661695!4d100.4968337!16s%2Fm%2F0jw_2r6?entry=ttu&g_ep=EgoyMDI1MDgxOS4wIKXMDSoASAFQAw%3D%3D",
    "Province": "กรุงเทพมหานคร",
    "District": "เขตพระนคร",
    "Subdistrict": "พระบรมมหาราชวัง",
    "Address": "20/7 หมู่ 1 ถนนราไวย์ 83000",
    "Total_Rooms": null,
    "Year_Built": "2003",
    "Nearby_Landmarks": [
      "BTS_MRT",
      "School",
      "Hospital",
      "Mall_Market",
      "Park"
    ],
    "Additional_Amenities": [
      "Swimming_Pool",
      "Fitness_Center",
      "Co_working_Space",
      "Pet_Friendly"
    ],
    "Parking_Space": 3,
    "Sell_Rent": "SALE",
    "Other_related_expenses": [
      "ค่าส่วนกลาง",
      "ค่าเช่าที่จอดรถรายเดือน",
      "ค่าสมาชิกฟิตเนส/สระว่ายน้ำ",
      "ค่าบริการอินเทอร์เน็ต/เคเบิล/ทีวี"
    ],
    "Link_line": "https://www.facebook.com/ThailandLiverpoolFC",
    "Link_facbook": "https://www.facebook.com/ThailandLiverpoolFC",
    "Name": "Dexter Morgan",
    "Phone": "0940891122",
    "floor": null,
    "NumberOfUnits": 6,
    "Status_post": "CONFIRMED",
    "userId": "cmhgjeqk20000vkdw5uq4d8oq",
    "sellerId": "cmh7ehjks0001w2uga25haifw",
    "categoryId": "cmegzfdya0006w2bwq5d8alc7",
    "createdAt": "2025-10-26 08:00:40.144",
    "updatedAt": "2025-10-29 09:46:58.207",
    "Deposit_Percent": 5
  },
  {
    "idx": 1,
    "id": "cmh8qdw6f0001w2po7peowlql",
    "Property_Name": "คอนโดนนทบุรี",
    "Price": 5000000,
    "Usable_Area": 30,
    "Land_Size": 0,
    "Bedrooms": 3,
    "Bathroom": 2,
    "Description": "ให้เช่า คอนโด Politan Aqua\r\n\r\nราคาประหยัด\r\n\r\nวิวแม่น้ำ สวนส่วนกลาง\r\n\r\nริมแม่น้ำเจ้าพระยา ใกล้รถไฟฟ้า\r\n\r\nห้องขนาด 30 ตร.ม. ชั้น 12A\r\n\r\nวิวแม่น้ำ มีเฟอร์นิเจอร์ ตามภาพ\r\n\r\nฟรีค่าส่วนกลางริมแม่น้ำ ฟิตเนต จุดชมวิวสูงและสวยที่สุดในนนทบุรี\r\n\r\nสัญญาเช่า 12 เดือน ขึ้นไป\r\n\r\nประกัน 2 เดือน ล่วงหน้า 1 เดือน\r\n\r\nนัดหมายชมห้อง\r\n\r\nโทร 092-7546444\r\n\r\nline id : wan.politan\r\n\r\nhttps://line.me/ti/p/7fYeZaWteN\r\n\r\n-ใกล้mrtสะพานพระนั่งเกล้า\r\n\r\n-เซ็นทรัล รัตนาธิเบศร์\r\n\r\n-กระทรวงพาณิชย\r\n\r\n-ศูนย์ราชการนนทบุรี\r\n\r\n-ริมแม่น้ำเจ้าพระยา\r\n\r\n-ส่วนกลางดีที่สุดในนนทบุรี",
    "Deposit_Amount": 20000,
    "LinkMap": "https://maps.app.goo.gl/oxDfoRwWdNVYn1HK8",
    "Province": "กรุงเทพมหานคร",
    "District": "เขตบางเขน",
    "Subdistrict": "ท่าแร้ง\t",
    "Address": "เดอะ โพลิแทน อควา เมืองนนทบุรี นนทบุรี",
    "Total_Rooms": 3,
    "Year_Built": "2000",
    "Nearby_Landmarks": [
      "BTS_MRT"
    ],
    "Additional_Amenities": [
      "Swimming_Pool"
    ],
    "Parking_Space": 3,
    "Sell_Rent": "SALE",
    "Other_related_expenses": [
      "Ownership_transfer_fee"
    ],
    "Link_line": null,
    "Link_facbook": null,
    "Name": "CHIN",
    "Phone": "0962637728",
    "floor": null,
    "NumberOfUnits": 3,
    "Status_post": "CONFIRMED",
    "userId": "cmh7ebmu90000w2tgtucbc65c",
    "sellerId": "cmh7ehjks0001w2uga25haifw",
    "categoryId": "cmegzfdya0006w2bwq5d8alc7",
    "createdAt": "2025-10-27 06:02:37.439",
    "updatedAt": "2025-10-27 06:02:37.439",
    "Deposit_Percent": 5
  },
  {
    "idx": 2,
    "id": "cmh8r2lxd000fw2poy6tcdy0w",
    "Property_Name": "คอนโด ม.มหิดล ศาลายา",
    "Price": 2800000,
    "Usable_Area": 40,
    "Land_Size": 0,
    "Bedrooms": 2,
    "Bathroom": 1,
    "Description": "ใกล้ราชมงคลรัตนโกสินทร์ ศาลายา\r\n\r\n\r\n\r\nตั้งอยู่ในซอยตั้งสิน ต.ศาลายา อ.พุทธมณฑล นครปฐม\r\n\r\n\r\n\r\nบริเวณใกล้เคียงมีสถานีตำรวจ ปั๊มน้ำมัน ร้าน 7-Eleven สถานที่อ่านหนังสือ too fast too sleep ร้านอาหาร ร้านอินเตอร์เน็ต Cafe และอื่นๆอีก\r\n\r\nใต้ตึกมี Too Fast Too Sleep เลย\r\n\r\nมากมาย\r\n\r\n\r\n\r\nห้องขนาด 30 ตร.ม. ชั้น 3\r\n\r\nห้องนอน 1 ห้องน้ำ 1 ห้องนั่งเล่น แบ่งโซนชัดเจน\r\n\r\n\r\n\r\nเครื่องใช้ไฟฟ้า\r\n\r\n- แอร์ 2 ตัว\r\n\r\n- TV\r\n\r\n- ตู้เย็น\r\n\r\n- ไมโครเวฟ\r\n\r\n- เครื่องทำน้ำอุ่น\r\n\r\n-เครื่องซักผ้า\r\n\r\nสิ่งอำนวยความสะดวกอื่นๆ เช่น\r\n\r\n- Lobby\r\n\r\n- ห้องฟิตเนส\r\n\r\n- สระว่ายน้ำ\r\n\r\n- ที่จอดรถ\r\n\r\n- ระบบรักษาความปลอดภัย CCTV/รปภ. 24 ชม.",
    "Deposit_Amount": 140000,
    "LinkMap": "https://maps.app.goo.gl/oxDfoRwWdNVYn1HK8",
    "Province": "นครปฐม",
    "District": "เมืองนครปฐม",
    "Subdistrict": "ธรรมศาลา",
    "Address": "ไอคอนโด เดอะแคมปัส ศาลายา 2",
    "Total_Rooms": 3,
    "Year_Built": "2000",
    "Nearby_Landmarks": [
      "BTS_MRT"
    ],
    "Additional_Amenities": [
      "Swimming_Pool"
    ],
    "Parking_Space": 3,
    "Sell_Rent": "SALE",
    "Other_related_expenses": [
      "Ownership_transfer_fee"
    ],
    "Link_line": "https://www.facebook.com/khobsanam",
    "Link_facbook": "https://www.facebook.com/khobsanam",
    "Name": "Travis",
    "Phone": "0962637728",
    "floor": null,
    "NumberOfUnits": 3,
    "Status_post": "CONFIRMED",
    "userId": "cmh7ebmu90000w2tgtucbc65c",
    "sellerId": "cmh7ehjks0001w2uga25haifw",
    "categoryId": "cmegzfdya0006w2bwq5d8alc7",
    "createdAt": "2025-10-27 06:21:50.256",
    "updatedAt": "2025-10-27 06:21:50.256",
    "Deposit_Percent": 5
  },
  {
    "idx": 3,
    "id": "cmh8rztl9000tw2poooqe7d3p",
    "Property_Name": "บ้านปทุมธานี",
    "Price": 4390000,
    "Usable_Area": 134,
    "Land_Size": 152,
    "Bedrooms": 4,
    "Bathroom": 4,
    "Description": "ความสุขออกแบบได้…ในทุกฟังก์ชันชีวิต\r\nอณาสิริ รังสิต - คลอง 3\r\n\"ฤดูแห่งความสุขมีได้ทุกวัน\"\r\n\"บ้าน\" ที่ออกแบบอย่างเรียบง่าย แต่เปี่ยมไปด้วยองค์ประกอบที่ช่วยเติมเต็มความอบอุ่น และความสุขให้กับทุกคนในครอบครัว กับบ้าน สไตล์ \"Modern Japanese Style\" ที่โดดเด่นด้วยการวาง Façade บ้านให้ไม่ซ้ำกัน พร้อมฟังก์ชันพิเศษที่ออกแบบมาเพื่อวิถีชีวิตยุคใหม่ เหมือนได้ยกหมู่บ้านชาวญี่ปุ่นมาไว้ที่นี่ พร้อมสิ่งอำนวยความสะดวกครบครัน\r\n\r\nนี่แหละ...ชีวิตที่สมดุลที่หลายคนมองหา บนทำเล ใจกลางรังสิต เข้าออกเมืองได้ 2 เส้นทาง",
    "Deposit_Amount": 219400,
    "LinkMap": "https://maps.app.goo.gl/oxDfoRwWdNVYn1HK8",
    "Province": "ปทุมธานี",
    "District": "คลองหลวง",
    "Subdistrict": "คลองสาม",
    "Address": "อณาสิริ รังสิต-คลอง 3, ปทุมธานี",
    "Total_Rooms": 8,
    "Year_Built": "2019",
    "Nearby_Landmarks": [
      "BTS_MRT"
    ],
    "Additional_Amenities": [
      "Swimming_Pool"
    ],
    "Parking_Space": 2,
    "Sell_Rent": "SALE",
    "Other_related_expenses": [
      "Ownership_transfer_fee"
    ],
    "Link_line": "https://www.facebook.com/khobsanam",
    "Link_facbook": "https://www.facebook.com/khobsanam",
    "Name": "Scott",
    "Phone": "0962637728",
    "floor": 2,
    "NumberOfUnits": 3,
    "Status_post": "CONFIRMED",
    "userId": "cmh7ebmu90000w2tgtucbc65c",
    "sellerId": "cmh7ehjks0001w2uga25haifw",
    "categoryId": "cmegzfhx70007w2bwp63cbc1w",
    "createdAt": "2025-10-27 06:47:40.137",
    "updatedAt": "2025-10-27 06:47:40.137",
    "Deposit_Percent": 5
  },
  {
    "idx": 4,
    "id": "cmh8sjm4c0017w2podcxyz14i",
    "Property_Name": "คณาสิริ บางนา",
    "Price": 3790000,
    "Usable_Area": 113,
    "Land_Size": 166,
    "Bedrooms": 4,
    "Bathroom": 4,
    "Description": "บ้านเดี่ยวบนทำเลติดถนนแพรกษา ใกล้ BTS สายสีเขียวเพียง 2.3 กิโลเมตร โดยโครงการถือเป็นเฟสที่ 2 จาก Project ของ Sansiri ที่ต้องการพัฒนาพื้นที่ย่านนี้ให้เป็น “สังคมแสนสิริ ศรีนครินทร์ – แพรกษา” เปิดตัวมาในราคาเริ่มต้น 7.59 – 10 ล้านบาท* โดย Highlight ที่น่าสนใจจะมีอะไรบ้าง ไปชมกันค่ะ\r\n\r\nทำเลใกล้ถนนใหญ่และรถไฟฟ้า : ที่ตั้งของโครงการจัดว่าอยู่ติดถนนแพรกษา ซึ่งเป็นถนนที่สามารถเชื่อมต่อโซนสุขุมวิท – บางนาได้ง่าย ใกล้ BTS สถานีแพรกษาเพียง 2.3 กิโลเมตร ถือเป็นจุดเด่นไม่ค่อยได้เห็นในโครงการแนวราบโซนนี้เท่าไรนะคะ\r\nใกล้แหล่งงานขนาดใหญ่ : โครงการใกล้นิคมอุตสาหกรรมถึง 2 แห่ง ทั้งนิคมอุตสาหกรรมบางพลีและนิคมอุตสาหกรรมบางปู เหมาะกับพนักงานหรือเจ้าของธุรกิจที่กำลังมองหาบ้านเดี่ยวบนทำเลแพรกษา สามารถเดินทางไปทำงาน หาของกิน ของใช้ได้ง่าย\r\nบ้านหน้ากว้าง ได้ 4 ห้องนอน : Product ของโครงการเป็นบ้านเดี่ยวทั้งหมด จำนวน 157 ยูนิต ออกแบบมาในสไตล์ Modern Farmhouse แปลนบ้านได้เป็นแบบหน้ากว้าง มาพร้อมฟังก์ชัน 4 ห้องนอนทุกหลัง เหมาะกับครอบครัวขนาดกลาง – ใหญ่ที่กำลังมองหาบ้านเดี่ยวในงบไม่เกิน 10 ล้านบาท*\r\nSolar Panel ทุกยูนิต : สำหรับเรามองว่าความคุ้มค่าของโครงการนี้อยู่ที่วัสดุและเทคโนโลยีในบ้านที่แถมมาให้ โดยจุดเด่นจะอยู่ที่ Solar Panel ที่ติดตั้งมาให้ทุกยูนิต มีระบบรักษาความปลอดภัยอย่าง Magnetic Sensor และภายในครัวยังได้เคาน์เตอร์แบบครบชุด พร้อมใช้งานได้เลย",
    "Deposit_Amount": 189500,
    "LinkMap": "https://maps.app.goo.gl/oxDfoRwWdNVYn1HK8",
    "Province": "สมุทรปราการ",
    "District": "เมืองสมุทรปราการ",
    "Subdistrict": "ปากนํ้า",
    "Address": "คณาสิริ บางนา, สมุทรปราการ",
    "Total_Rooms": 8,
    "Year_Built": "2017",
    "Nearby_Landmarks": [
      "BTS_MRT"
    ],
    "Additional_Amenities": [
      "Swimming_Pool"
    ],
    "Parking_Space": 2,
    "Sell_Rent": "SALE",
    "Other_related_expenses": [
      "Ownership_transfer_fee"
    ],
    "Link_line": "https://www.facebook.com/khobsanam",
    "Link_facbook": "https://www.facebook.com/khobsanam",
    "Name": "Scott",
    "Phone": "0962637728",
    "floor": 1,
    "NumberOfUnits": 3,
    "Status_post": "CONFIRMED",
    "userId": "cmh7ebmu90000w2tgtucbc65c",
    "sellerId": "cmh7ehjks0001w2uga25haifw",
    "categoryId": "cmegzfhx70007w2bwp63cbc1w",
    "createdAt": "2025-10-27 07:03:03.579",
    "updatedAt": "2025-10-27 07:03:03.579",
    "Deposit_Percent": null
  },
  {
    "idx": 5,
    "id": "cmh8tpr0h001lw2pohblta6o5",
    "Property_Name": "วิลลาเรส พระราม 2 - เอกชัย",
    "Price": 14000000,
    "Usable_Area": 308,
    "Land_Size": 86.5,
    "Bedrooms": 2,
    "Bathroom": 2,
    "Description": "อสังหาริมทรัพย์นี้เป็น บ้านเดี่ยว สำหรับขาย ขนาด 4 ห้องนอน มีพื้นที่ใช้สอย 308 ตรม. ซึ่งยูนิตนี้อยู่ในโครงการ วิลลาเรส พระราม 2 - เอกชัย บนทำเลของ โคกขาม, สมุทรสาคร และสร้างเสร็จแล้วเมื่อ ม.ค. 2568 ซึ่งคุณสามารถซื้อ บ้านเดี่ยว นี้ได้ที่ราคา ฿14,000,000 ",
    "Deposit_Amount": 700000,
    "LinkMap": "https://maps.app.goo.gl/oxDfoRwWdNVYn1HK8",
    "Province": "สมุทรสาคร",
    "District": "เมืองสมุทรสาคร",
    "Subdistrict": "มหาชัย",
    "Address": "โคกขาม, สมุทรสาคร",
    "Total_Rooms": 4,
    "Year_Built": "2025",
    "Nearby_Landmarks": [
      "BTS_MRT"
    ],
    "Additional_Amenities": [
      "Swimming_Pool"
    ],
    "Parking_Space": 2,
    "Sell_Rent": "SALE",
    "Other_related_expenses": [
      "Ownership_transfer_fee"
    ],
    "Link_line": "https://www.facebook.com/khobsanam",
    "Link_facbook": "https://www.facebook.com/khobsanam",
    "Name": "Jully",
    "Phone": "0962637728",
    "floor": 2,
    "NumberOfUnits": 3,
    "Status_post": "CONFIRMED",
    "userId": "cmh7ebmu90000w2tgtucbc65c",
    "sellerId": "cmh7ehjks0001w2uga25haifw",
    "categoryId": "cmegzfov30009w2bwrxjpt7xn",
    "createdAt": "2025-10-27 07:35:49.215",
    "updatedAt": "2025-10-27 07:35:49.215",
    "Deposit_Percent": null
  },
  {
    "idx": 6,
    "id": "cmh8u6hdi001zw2pokp90fgb9",
    "Property_Name": "วิลล่า บางหลวง",
    "Price": 11900000,
    "Usable_Area": 360,
    "Land_Size": 360,
    "Bedrooms": 3,
    "Bathroom": 4,
    "Description": "อสังหาริมทรัพย์นี้เป็น วิลล่า สำหรับขาย ขนาด 3 ห้องนอน มีพื้นที่ใช้สอย 360 ตรม. อยู่ในทำเล บางหลวง, นครปฐม ซึ่งคุณสามารถซื้อ วิลล่า นี้ได้ที่ราคา ฿11,900,000",
    "Deposit_Amount": 595000,
    "LinkMap": "https://maps.app.goo.gl/oxDfoRwWdNVYn1HK8",
    "Province": "นครปฐม",
    "District": "บางเลน",
    "Subdistrict": "บางหลวง",
    "Address": "บางหลวง,บางเลน,นครปฐม",
    "Total_Rooms": 7,
    "Year_Built": "2025",
    "Nearby_Landmarks": [
      "BTS_MRT"
    ],
    "Additional_Amenities": [
      "Swimming_Pool"
    ],
    "Parking_Space": 10,
    "Sell_Rent": "SALE",
    "Other_related_expenses": [
      "Ownership_transfer_fee"
    ],
    "Link_line": "https://www.facebook.com/khobsanam",
    "Link_facbook": "https://www.facebook.com/khobsanam",
    "Name": "Jane",
    "Phone": "0962637728",
    "floor": 1,
    "NumberOfUnits": 3,
    "Status_post": "CONFIRMED",
    "userId": "cmh7ebmu90000w2tgtucbc65c",
    "sellerId": "cmh7ehjks0001w2uga25haifw",
    "categoryId": "cmegzfov30009w2bwrxjpt7xn",
    "createdAt": "2025-10-27 07:48:50.166",
    "updatedAt": "2025-10-27 07:48:50.166",
    "Deposit_Percent": null
  },
  {
    "idx": 7,
    "id": "cmh8uuv82002dw2porligkmsx",
    "Property_Name": "ทาวน์เฮ้าส์ หัวหมาก",
    "Price": 3990000,
    "Usable_Area": 132,
    "Land_Size": 132,
    "Bedrooms": 4,
    "Bathroom": 1,
    "Description": "อสังหาริมทรัพย์นี้เป็น ทาวน์เฮ้าส์ สำหรับขาย ขนาด 4 ห้องนอน มีพื้นที่ใช้สอย 132 ตรม. อยู่ในทำเล หัวหมาก, กรุงเทพมหานคร ซึ่งคุณสามารถซื้อ ทาวน์เฮ้าส์ นี้ได้ที่ราคา ฿3,990,000 ",
    "Deposit_Amount": 199500,
    "LinkMap": "https://maps.app.goo.gl/oxDfoRwWdNVYn1HK8",
    "Province": "กรุงเทพมหานคร",
    "District": "เขตบางกะปิ",
    "Subdistrict": "หัวหมาก",
    "Address": "หัวหมาก, กรุงเทพมหานคร",
    "Total_Rooms": 5,
    "Year_Built": "2025",
    "Nearby_Landmarks": [
      "BTS_MRT"
    ],
    "Additional_Amenities": [],
    "Parking_Space": 1,
    "Sell_Rent": "SALE",
    "Other_related_expenses": [
      "Ownership_transfer_fee"
    ],
    "Link_line": "https://www.facebook.com/khobsanam",
    "Link_facbook": "https://www.facebook.com/khobsanam",
    "Name": "John",
    "Phone": "0962637728",
    "floor": 2,
    "NumberOfUnits": 3,
    "Status_post": "CONFIRMED",
    "userId": "cmh7ebmu90000w2tgtucbc65c",
    "sellerId": "cmh7ehjks0001w2uga25haifw",
    "categoryId": "cmegzft08000aw2bwx91l68z9",
    "createdAt": "2025-10-27 08:07:47.858",
    "updatedAt": "2025-10-27 08:07:47.858",
    "Deposit_Percent": null
  },
  {
    "idx": 8,
    "id": "cmh8w96xo002rw2ponldx0pvt",
    "Property_Name": "ทาวน์เฮ้าส์ นครปฐม",
    "Price": 2900000,
    "Usable_Area": 100,
    "Land_Size": 100,
    "Bedrooms": 4,
    "Bathroom": 1,
    "Description": "อสังหาริมทรัพย์นี้เป็น ทาวน์เฮ้าส์ สำหรับขาย ขนาด 4 ห้องนอน มีพื้นที่ใช้สอย 100ตรม. อยู่ในทำเล กำแพงแสน, นครปฐมซึ่งคุณสามารถซื้อ ทาวน์เฮ้าส์ นี้ได้ที่ราคา ฿2900000",
    "Deposit_Amount": 145000,
    "LinkMap": "https://maps.app.goo.gl/oxDfoRwWdNVYn1HK8",
    "Province": "นครปฐม",
    "District": "กำแพงแสน",
    "Subdistrict": "กำแพงแสน",
    "Address": "กำแพงแสน, นครปฐม",
    "Total_Rooms": 5,
    "Year_Built": "2025",
    "Nearby_Landmarks": [
      "BTS_MRT"
    ],
    "Additional_Amenities": [],
    "Parking_Space": 1,
    "Sell_Rent": "SALE",
    "Other_related_expenses": [
      "Ownership_transfer_fee"
    ],
    "Link_line": "https://www.facebook.com/khobsanam",
    "Link_facbook": "https://www.facebook.com/khobsanam",
    "Name": "John",
    "Phone": "0962637728",
    "floor": 2,
    "NumberOfUnits": 3,
    "Status_post": "CONFIRMED",
    "userId": "cmh7ebmu90000w2tgtucbc65c",
    "sellerId": "cmh7ehjks0001w2uga25haifw",
    "categoryId": "cmegzft08000aw2bwx91l68z9",
    "createdAt": "2025-10-27 08:46:55.804",
    "updatedAt": "2025-10-27 08:46:55.804",
    "Deposit_Percent": null
  },
  {
    "idx": 9,
    "id": "cmh9c823t0000w278trkuxxoe",
    "Property_Name": "คอนโด สีส้ม",
    "Price": 3790000,
    "Usable_Area": 30,
    "Land_Size": 0,
    "Bedrooms": 1,
    "Bathroom": 1,
    "Description": "คอนโดสีส้มเหมาะกับวัยรุ่นสมัยนี้ สวยเรียบหรูมีราคา",
    "Deposit_Amount": 189500,
    "LinkMap": "https://www.google.com/maps/place/%E0%B9%80%E0%B8%8B%E0%B9%87%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%B1%E0%B8%A5+%E0%B8%99%E0%B8%AD%E0%B8%A3%E0%B9%8C%E0%B8%98%E0%B8%A7%E0%B8%B4%E0%B8%A5%E0%B8%A5%E0%B9%8C/@13.8661637,100.4618168,13z/data=!4m6!3m5!1s0x30e29b31e80e515d:0x4891c519dbbcf698!8m2!3d13.8661695!4d100.4968337!16s%2Fm%2F0jw_2r6?entry=ttu&g_ep=EgoyMDI1MDgxOS4wIKXMDSoASAFQAw%3D%3D",
    "Province": "นครปฐม",
    "District": "สามพราน",
    "Subdistrict": "ท่าข้าม",
    "Address": "90/290 นครปฐม สามพราน",
    "Total_Rooms": 2,
    "Year_Built": "2003",
    "Nearby_Landmarks": [
      "BTS_MRT",
      "Park",
      "School",
      "Hospital",
      "Mall_Market"
    ],
    "Additional_Amenities": [
      "Pet_Friendly",
      "Co_working_Space",
      "Fitness_Center",
      "Swimming_Pool"
    ],
    "Parking_Space": 3,
    "Sell_Rent": "SALE",
    "Other_related_expenses": [
      "ค่าส่วนกลาง",
      "ค่าเช่าที่จอดรถรายเดือน",
      "ค่าบริการอินเทอร์เน็ต/เคเบิล/ทีวี",
      "ค่าสมาชิกฟิตเนส/สระว่ายน้ำ"
    ],
    "Link_line": "https://www.facebook.com/profile.php?id=100018453368077",
    "Link_facbook": "https://www.facebook.com/profile.php?id=100018453368077",
    "Name": "Chin",
    "Phone": "0940891122",
    "floor": null,
    "NumberOfUnits": 3,
    "Status_post": "CONFIRMED",
    "userId": "cmh7ebmu90000w2tgtucbc65c",
    "sellerId": "cmh7ehjks0001w2uga25haifw",
    "categoryId": "cmegzfdya0006w2bwq5d8alc7",
    "createdAt": "2025-10-27 16:13:56.606",
    "updatedAt": "2025-10-27 16:13:56.606",
    "Deposit_Percent": 5
  },
  {
    "idx": 10,
    "id": "cmhbionmi000aw2ok12ly0245",
    "Property_Name": "คอนโดนสดตล์ญีปุ่น",
    "Price": 2900000,
    "Usable_Area": 30,
    "Land_Size": 0,
    "Bedrooms": 2,
    "Bathroom": 1,
    "Description": "อสังหาริมทรัพย์นี้เป็น ทาวน์เฮ้าส์ สำหรับขาย ขนาด 4 ห้องนอน มีพื้นที่ใช้สอย 100ตรม. อยู่ในทำเล กำแพงแสน, นครปฐมซึ่งคุณสามารถซื้อ ทาวน์เฮ้าส์ นี้ได้ที่ราคา ฿2900000",
    "Deposit_Amount": 145000,
    "LinkMap": "https://maps.app.goo.gl/oxDfoRwWdNVYn1HK8",
    "Province": "ปทุมธานี",
    "District": "เมืองปทุมธานี",
    "Subdistrict": "บางปรอก",
    "Address": "112,ม.3",
    "Total_Rooms": 3,
    "Year_Built": "2025",
    "Nearby_Landmarks": [
      "BTS_MRT"
    ],
    "Additional_Amenities": [],
    "Parking_Space": 1,
    "Sell_Rent": "SALE",
    "Other_related_expenses": [
      "Ownership_transfer_fee"
    ],
    "Link_line": "https://www.facebook.com/khobsanam",
    "Link_facbook": "https://www.facebook.com/khobsanam",
    "Name": "John",
    "Phone": "0962637728",
    "floor": null,
    "NumberOfUnits": 3,
    "Status_post": "CONFIRMED",
    "userId": "cmh7ebmu90000w2tgtucbc65c",
    "sellerId": "cmh7ehjks0001w2uga25haifw",
    "categoryId": "cmegzfdya0006w2bwq5d8alc7",
    "createdAt": "2025-10-29 04:50:21.142",
    "updatedAt": "2025-10-29 04:50:21.142",
    "Deposit_Percent": null
  },
  {
    "idx": 11,
    "id": "cmhbsf1de0004vk9kfe6mrd4h",
    "Property_Name": "บ้านสไตล์ใหม่ นนทบุรี",
    "Price": 5900000,
    "Usable_Area": 182,
    "Land_Size": 199,
    "Bedrooms": 1,
    "Bathroom": 1,
    "Description": "ฮาบิเทีย ชัยพฤกษ์ – วงแหวน บ้านเดี่ยวโครงการใหม่ จาก แสนสิริ ได้ความเป็นส่วนตัวสูงเพียง 15 \r\nครอบครัว พร้อมแบบบ้านให้เลือก 4 แบบ พื้นที่ใช้สอย 162 – 200 ตร.ม. 3-4 \r\nห้องนอน 3-5 ห้องน้ำ 2 ที่จอดรถ ในราคาเริ่มต้น 5.99 – 8 ล้านบาท*",
    "Deposit_Amount": 295000,
    "LinkMap": "https://maps.app.goo.gl/rspM7yexHC2PZHvcA",
    "Province": "นนทบุรี",
    "District": "บางกรวย",
    "Subdistrict": "บางกรวย",
    "Address": "111 ม. 11 ถ.บางกรวย-ไทรน้อย ,นนทบุรี",
    "Total_Rooms": 2,
    "Year_Built": "1800",
    "Nearby_Landmarks": [
      "BTS_MRT",
      "Park"
    ],
    "Additional_Amenities": [
      "Fitness_Center",
      "Co_working_Space"
    ],
    "Parking_Space": 3,
    "Sell_Rent": "SALE",
    "Other_related_expenses": [
      "ค่าส่วนกลางหมู่บ้าน",
      "ค่าบำรุงถนน/ไฟสาธารณะ",
      "ค่าดูแลสวนส่วนกลาง",
      "ค่าที่จอดรถนอกตัวบ้าน",
      "ค่าซ่อมบำรุงระบบไฟ/น้ำ",
      "ค่ากำจัดปลวกหรือแมลงประจำปี"
    ],
    "Link_line": "https://line.me/ti/p/RyNGeNwlSY",
    "Link_facbook": "https://www.facebook.com/KasetsartUniversity",
    "Name": "สันคม ทองหล่อ",
    "Phone": "0940891122",
    "floor": 2,
    "NumberOfUnits": 3,
    "Status_post": "CONFIRMED",
    "userId": "cmhbs1w7x0000vk9knbcjtu9l",
    "sellerId": "cmhbs6vzp0003vk9kgid4n6aq",
    "categoryId": "cmegzfhx70007w2bwp63cbc1w",
    "createdAt": "2025-10-29 09:22:48.594",
    "updatedAt": "2025-10-29 09:22:48.594",
    "Deposit_Percent": 5
  }
]

async function main() {
  console.log("Start seeding categories...");
  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
  }
  console.log("Seeding finished.");
  console.log("Start seeding property posts...");
  for (const postData of propertyPost) {

    // (สำคัญ) 1. ลบ 'idx' ที่ไม่มีใน Model
    const { idx, ...dataForPrisma } = postData;

    // (สำคัญ) 2. แปลง String เป็น Date Object
    dataForPrisma.createdAt = new Date(dataForPrisma.createdAt);
    dataForPrisma.updatedAt = new Date(dataForPrisma.updatedAt);

    // 3. ใช้ upsert (เหมือน categories)
    await prisma.propertyPost.upsert({
      where: { id: dataForPrisma.id },
      update: dataForPrisma, // อัปเดตข้อมูลเป็นของใหม่
      create: dataForPrisma, // สร้างใหม่ถ้ายังไม่มี
    });
  }
  console.log("Property post seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
