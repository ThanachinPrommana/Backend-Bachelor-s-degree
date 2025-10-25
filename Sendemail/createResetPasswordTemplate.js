/**
 * ฟังก์ชันสร้าง Template HTML สำหรับอีเมลรีเซ็ตรหัสผ่าน
 * @param {string} link - ลิงก์สำหรับรีเซ็ตรหัสผ่าน
 * @returns {string} - โค้ด HTML สำหรับส่งอีเมล
 */
export const createResetPasswordTemplate = (link) => {
  // --- สไตล์แบบ Inline (จำเป็นสำหรับอีเมล) ---
  const bodyStyle = "background-color: #f4f4f4; margin: 0; padding: 0; font-family: Arial, sans-serif;";
  const containerStyle = "width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; border: 1px solid #e0e0e0; overflow: hidden;";
  const headerStyle = "padding: 30px 30px 20px 30px; text-align: center;";
  const headingStyle = "margin: 0; font-size: 24px; font-weight: bold; color: #333333;";
  const contentStyle = "padding: 0 30px 30px 30px;";
  const textStyle = "margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #555555;";
  const buttonWrapperStyle = "padding: 20px 0; text-align: center;";
  const buttonStyle = "display: inline-block; padding: 12px 25px; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; background-color: #2c3e50; border-radius: 5px;";
  const footerStyle = "background-color: #f9f9f9; padding: 20px 30px; border-top: 1px solid #e0e0e0; text-align: center;";
  const footerTextStyle = "margin: 0; font-size: 12px; color: #999999;";

  // --- Template HTML ---
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password</title>
</head>
<body style="${bodyStyle}">
  <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4;">
    <tr>
      <td align="center" style="padding: 20px;">
        <table border="0" cellpadding="0" cellspacing="0" style="${containerStyle}">
          <tr>
            <td style="${headerStyle}">
              <h1 style="${headingStyle}">Yuu Yenn Property</h1>
            </td>
          </tr>
          <tr>
            <td style="${contentStyle}">
              <p style="${textStyle}">สวัสดีครับ</p>
              <p style="${textStyle}">เราได้รับคำขอรีเซ็ตรหัสผ่านสำหรับบัญชีของคุณ กรุณาคลิกปุ่มด้านล่างเพื่อตั้งรหัสผ่านใหม่</p>
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="${buttonWrapperStyle}">
                    <a href="${link}" target="_blank" style="${buttonStyle}">
                      รีเซ็ตรหัสผ่าน
                    </a>
                  </td>
                </tr>
              </table>
              <p style="${textStyle}">หากคุณไม่ได้เป็นผู้ส่งคำขอนี้ กรุณาเพิกเฉยอีเมลฉบับนี้</p>
            </td>
          </tr>
          <tr>
            <td style="${footerStyle}">
              <p style="${footerTextStyle}">© 2025 Yuu Yenn Property LIMITED</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};