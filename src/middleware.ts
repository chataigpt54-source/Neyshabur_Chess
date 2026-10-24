import { NextResponse } from 'next/server';

export function middleware() {
  const maintenanceMode = true; // برای فعال‌سازی حالت تعمیر روی true و برای غیرفعال‌سازی روی false بگذارید

  if (maintenanceMode) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>سایت در حال به‌روزرسانی است | هیأت شطرنج نیشابور</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Tahoma, Vazirmatn, sans-serif; background: #0a1220; color: #fff; display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; text-align: center; }
            .box { max-width: 500px; width: 100%; padding: 40px 30px; border: 1px solid rgba(212,160,23,0.3); border-radius: 24px; background: rgba(15,27,43,0.9); box-shadow: 0 20px 50px rgba(0,0,0,0.5); backdrop-filter: blur(10px); }
            .icon { font-size: 48px; margin-bottom: 20px; display: block; }
            h1 { color: #d4a017; font-size: 22px; margin-bottom: 16px; font-weight: bold; }
            p { color: #94a3b8; font-size: 14px; line-height: 1.8; }
          </style>
        </head>
        <body>
          <div class="box">
            <span class="icon">♟️</span>
            <h1>سایت در حال به‌روزرسانی است</h1>
            <p>وب‌سایت رسمی هیأت شطرنج شهرستان نیشابور جهت ارتقا و بهبود خدمات در حال به‌روزرسانی می‌باشد. لطفاً شکیبا باشید، به‌زودی برمی‌گردیم.</p>
          </div>
        </body>
      </html>
      `,
      {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
