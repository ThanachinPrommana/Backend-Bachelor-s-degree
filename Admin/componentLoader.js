// server/Admin/componentLoader.js
import { ComponentLoader } from "adminjs"; // 👈 1. Import Class 'ComponentLoader' (C พิมพ์ใหญ่)
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ 2. สร้าง instance ใหม่ขึ้นมาใช้งาน (เหมือนที่คุณเคยทำ)
const componentLoader = new ComponentLoader();

const Components = {
  PropertyCardList: componentLoader.add(
    "PropertyCardList",
    path.join(__dirname, "./components/PropertyCardList.jsx")
  ),
  SellerCardList: componentLoader.add(
    'SellerCardList',
    path.join(__dirname, './components/SellerCardList.jsx')
  ),
  PropertyUnitListComponent: componentLoader.add(
    'PropertyUnitListComponent',
    path.join(__dirname, './components/PropertyUnitCardList.jsx'),
  ),
  DepositCardList: componentLoader.add(
    'DepositCardList',
    path.join(__dirname, './components/DepositCardList.jsx')
  ),
  TestDeposit: componentLoader.add(
    'TestDeposit',
    path.join(__dirname, './components/TestDepositComponent.jsx') // Path ไปยังไฟล์ใหม่
  ),
  UserCardList: componentLoader.add(
    "UserCardList",
    path.join(__dirname, './components/UserCardList.jsx')
  ),
  DocumentCardList: componentLoader.add(
    'DocumentCardList',
    path.join(__dirname, './components/DocumentCardList.jsx')
  ),
  PaymentCardList: componentLoader.add(
    'PaymentCardList',
    path.join(__dirname, './components/PaymentCardList.jsx')
  ),
};

export { componentLoader, Components };