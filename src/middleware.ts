import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // اگر خواستید خودتان با آی‌پی یا یک مسیر خاص سایت را ببینید، می‌توانید استثنا قائل شوید
  const maintenanceMode = true; // بعد از اتمام کار، این را روی false بگذارید

  if (maintenanceMode) {
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="fa" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>به‌زودی برمی‌گردیم | هیأت شطرنج نیشابور</title>
          <style>
            body { font-family: Tahoma, sans-serif; background: #0a1220; color: #fff; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; text-align: center; }
            .box { max-width: 500px; padding: 30px; border: 1px solid rgba(212,160,23,0.3); border-radius: 20px; background: rgba(15,27,43,0.8); }
            h1 { color: #d4a017; margin-bottom: 15px; }
            p { color: #94a3b8; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>سایت در حال به‌روزرسانی است</h1>
            <p>سایت هیأت شطرنج شهرستان نیشابور برای ارتقای سیستم در حال به‌روزرسانی است. لطفاً دقایقی دیگر مراجعه فرمایید.</p>
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
