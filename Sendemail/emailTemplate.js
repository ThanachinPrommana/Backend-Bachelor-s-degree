// ฟังก์ชันนี้รับ 'link' เข้ามา แล้วส่ง HTML ทั้งหมดกลับไป
export const getVerifyEmailHtml = (link) => {
  return `
    <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      
      <div style="background-color: #2C3E50; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">ยืนยันอีเมลของคุณ</h1>
      </div>

      <div style="padding: 30px; line-height: 1.6; color: #333;">
        <p style="font-size: 16px;">สวัสดี,</p>
        <p style="font-size: 14px;">
          ขอบคุณที่ลงทะเบียน กรุณาคลิกปุ่มด้านล่างเพื่อยืนยันที่อยู่อีเมลของคุณและดำเนินการลงทะเบียนให้เสร็จสมบูรณ์
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${link}" target="_blank" style="background-color: #2C3E50; color: #ffffff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold; display: inline-block;">
            ยืนยันอีเมล
          </a>
        </div>

        <p style="font-size: 14px;">
          หากปุ่มไม่ทำงาน คุณยังสามารถคัดลอกและวางลิงก์ต่อไปนี้ลงในเบราว์เซอร์ของคุณได้:
        </p>
        <p style="font-size: 12px; color: #555; word-break: break-all;">
          ${link}
        </p>

        <hr style="border: 0; border-top: 1px solid #eee; margin-top: 20px;">

        <p style="font-size: 14px; color: #888;">
          หากคุณไม่ได้ร้องขอ โปรดเพิกเฉยต่ออีเมลฉบับนี้ ลิงก์นี้มีอายุใช้งาน 10 นาที
        </p>
      </div>

      <div style="background-color: #f9f9f9; padding: 20px; text-align: center; font-size: 12px; color: #aaa;">
        <p style="margin: 0;">© 2024 Yuu Yenn Property สงวนลิขสิทธิ์</p>
      </div>

    </div>
  `;
};