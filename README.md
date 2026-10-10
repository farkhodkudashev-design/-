# NEXORA

NEXORA is a static multi-page storefront with a separate Express API for local development.

## Talablar

- Node.js 20 yoki undan yangisi
- npm

## Lokal ishga tushirish

1. Loyihada `npm install` buyrug'ini bajaring.
2. `index.html` faylini VS Code Live Server orqali oching. Live Server odatda `http://localhost:5500` manzilidan foydalanadi.
3. API kerak bo'lsa, loyiha ildizida `.env` yarating:

```env
JWT_SECRET=bu_joyga_tasodifiy_secret_qiymatini_qoying
FRONTEND_ORIGIN=http://localhost:5500
```

Haqiqiy secret olish uchun terminalda `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` buyrug'ini bajaring va natijani `.env` ichidagi `JWT_SECRET` qiymati o'rniga kiriting. Placeholder qiymatni ishlatmang va `.env` faylini Git'ga yubormang.

4. Avval `npm run seed`, keyin boshqa terminalda `npm run dev` buyrug'ini bajaring.
5. API holatini `http://localhost:3000/api/health`, mahsulotlarni `http://localhost:3000/api/products` orqali tekshiring.

Frontenddagi ro'yxatdan o'tish va kirish hozircha demo rejimida ishlaydi: profil brauzerning `localStorage` va `sessionStorage` xotirasida saqlanadi. Ular Express API bilan ulanmagan va haqiqiy autentifikatsiya emas. Backend SQLite ma'lumotlar bazasidan foydalanadi; `npm run seed` uni `products.js` dagi 48 mahsulot bilan to'ldiradi. Lokal bazani qayta yaratish yoki ma'lumotlarni saqlash uchun `nexora.sqlite` faylini o'chirmang.

## Vercel'ga chiqarish

GitHub repositoriyasini Vercel'da import qiling. Root Directory loyiha ildizi bo'lsin; `vercel.json` statik HTML/CSS/JS sahifalarini build bosqichisiz chiqaradi. Deploy tugagach, asosiy sahifa `/` manzilida, qolgan sahifalar esa o'z `.html` manzillari bilan ochiladi.

Vercel deployi faqat frontendni chiqaradi. Express API ishga tushmaydi, SQLite fayli Vercel'da doimiy saqlanmaydi va demo profillar faqat foydalanuvchi brauzerida qoladi. Haqiqiy production login va buyurtmalar uchun frontendni API bilan ulash, SQLite'ni boshqariladigan PostgreSQL bazasiga almashtirish hamda API'ni serverless funksiyalar yoki doimiy Node.js hostiga alohida deploy qilish kerak. Vercel environment variables'ga `JWT_SECRET` qo'shishning o'zi bu imkoniyatlarni yoqmaydi.