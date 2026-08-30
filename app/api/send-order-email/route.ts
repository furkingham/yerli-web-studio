import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { orderCode, total, customerEmail, customerName, paymentMethod, items } = body;

    // TODO: Gerçek bir e-posta servisi entegre edilecek (Örn: Resend, SendGrid, Nodemailer)
    
    // MÜŞTERİYE GİDECEK MAİL SİMÜLASYONU
    const customerMailTemplate = `
      Sayın ${customerName || 'Müşterimiz'},
      
      ${orderCode} numaralı siparişiniz başarıyla alınmıştır.
      Ödeme Yöntemi: ${paymentMethod === 'bank_transfer' ? 'Havale/EFT' : 'Kredi Kartı'}
      Sipariş Tutarı: ${total}
      
      Bizi tercih ettiğiniz için teşekkür ederiz.
      Kaswa Makine Destek Ekibi
    `;
    console.log("-----------------------------------------");
    console.log(`[EMAIL GÖNDERİLİYOR] -> Kime: ${customerEmail || 'Müşteri'}`);
    console.log(customerMailTemplate);
    console.log("-----------------------------------------");

    // PATRONA/YÖNETİCİYE GİDECEK MAİL SİMÜLASYONU
    const adminMailTemplate = `
      Yeni bir sipariş alındı!
      
      Sipariş Kodu: ${orderCode}
      Müşteri: ${customerName || 'Bilinmiyor'} (${customerEmail || 'Bilinmiyor'})
      Ödeme Yöntemi: ${paymentMethod === 'bank_transfer' ? 'Havale/EFT' : 'Kredi Kartı'}
      Sipariş Tutarı: ${total}
      
      Detayları yönetici panelinden kontrol edebilirsiniz.
    `;
    console.log(`[EMAIL GÖNDERİLİYOR] -> Kime: patron@kaswamakine.com`);
    console.log(adminMailTemplate);
    console.log("-----------------------------------------");

    // Gerçek otomasyonda burada fetch isteği atılır, başarılıysa 200 dönülür.
    return NextResponse.json({ success: true, message: 'Bilgilendirme mailleri başarıyla gönderildi.' });
    
  } catch (error) {
    console.error('Mail gönderme hatası:', error);
    return NextResponse.json({ success: false, message: 'Mail gönderilirken hata oluştu.' }, { status: 500 });
  }
}
