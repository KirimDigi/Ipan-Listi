/**
 * Google Apps Script untuk Menghubungkan Form Undangan (RSVP & Ucapan) ke Google Sheets.
 * 
 * CARA MENGKOREKSI / UPDATE:
 * 1. Buka kembali Google Sheets Anda: https://docs.google.com/spreadsheets/d/1pQJrFVEhobOQoZZz0onkFzYGHvkmuiRMKEM_e308O-g/edit
 * 2. Klik menu "Ekstensi" (Extensions) -> "Apps Script".
 * 3. HAPUS seluruh kode lama di sana, dan PASTE-kan kode baru di bawah ini.
 *    (Fungsi doPost disederhanakan agar membaca parameter form-urlencoded secara langsung tanpa parsing JSON).
 * 4. Simpan proyek (ikon disket).
 * 5. Klik "Terapkan" (Deploy) -> "Kelola Penerapan" (Manage deployments).
 * 6. Klik ikon Pensil (Edit) di penerapan Aplikasi Web Anda.
 * 7. Pada bagian "Versi" (Version), pilih "Versi Baru" (New version).
 * 8. Klik "Terapkan" (Deploy).
 */

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var data = [];
  
  // Baca seluruh baris di Sheet mulai dari baris ke-2 (mengabaikan header)
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    if (row[1]) { 
      data.push({
        timestamp: row[0],
        name: row[1],
        attendance: row[2],
        guest: row[3],
        wish: row[4]
      });
    }
  }
  
  // Urutkan ucapan dari yang terbaru (DESC)
  data.reverse();
  
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Buat header secara otomatis jika sheet masih kosong
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["Tanggal & Jam", "Nama", "Konfirmasi Kehadiran", "Jumlah Tamu", "Ucapan / Doa Restu"]);
  }
  
  try {
    // Baca parameter yang dikirim secara form-urlencoded
    var name = e.parameter.name || "";
    var attendance = e.parameter.attendance || "";
    var guest = e.parameter.guest || "1";
    var wish = e.parameter.wish || "";
    
    // Simpan data ke baris baru di sheet
    sheet.appendRow([new Date(), name, attendance, guest, wish]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
