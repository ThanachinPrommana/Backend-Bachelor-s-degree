https://nodejs.org/en/download/package-manager/current
https://www.postman.com/downloads/
https://dev.mysql.com/downloads/workbench/
https://code.visualstudio.com/download


-----------Server---------------
npm init -y
npm install express morgan cors nodemon bcryptjs jsonwebtoken

npm install prisma
npx prisma init
npm install @prisma/client

// Doc ใช้ในการสร้างและอัพเดตฐานข้อมูล SQL
npx prisma migrate dev --name ecom
npx prisma migrate reset --force
!!!npx prisma db push --force-reset


// Doc ใช้ในการสร้างและอัพเดตฐานข้อมูล mongodb
npx prisma db push

//
อัพเดต Prisma schema
npx prisma migrate dev

//
Download session cookie
npm install express-session
npm install cookie-parser

//
Download multer
npm install multer
npm install cloudinary

//
Download node-cron จับเวลา
npm install node-cron


//
Download nodemailer การส่ง verify ตัวตนไปยังอีเมล ผ่าน App Passwords
npm install nodemailer

//
Download stripe ระบบ payment auto
npm install stripe
//
Download adminJs connect with express and prisma
npm install adminjs @adminjs/express @adminjs/prisma express-formidable
------------Client--------------
npm create vite@latest
or
npm create vite@latest .
- client
- javascript

>cd client
>npm install
>npm run dev


npm i react-router-dom
npm i axios
npm i zustand axios

npm i react-image-file-resizer
npm i react-toastify
npm i react-icons
npm i lucide-react
npm i lodash
npm i rc-slider
npm i numeral
npm install moment
--------------------------
