// ===================================
// Bang Pentol Varian
// Script V3
// ===================================

// ---------- Data ----------
let total = Number(localStorage.getItem("total")) || 0;
let transaksi = Number(localStorage.getItem("transaksi")) || 0;
let riwayat = JSON.parse(localStorage.getItem("riwayat")) || [];

// ---------- Format Rupiah ----------
function rupiah(angka){
    return "Rp " + angka.toLocaleString("id-ID");
}

// ---------- Bunyi Klik ----------
function bunyiKlik(){

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.value = 700;

    gain.gain.value = 0.05;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);

}

// ---------- Simpan ----------
function simpan(){

    localStorage.setItem("total", total);
    localStorage.setItem("transaksi", transaksi);
    localStorage.setItem("riwayat", JSON.stringify(riwayat));

}

// ---------- Update Tampilan ----------
function update(){

    document.getElementById("total").textContent = rupiah(total);
    document.getElementById("transaksi").textContent = transaksi;

    const list = document.getElementById("riwayat");
    list.innerHTML = "";

    [...riwayat].reverse().forEach((item,index)=>{

        const li = document.createElement("li");

        li.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">

            <div>

                <strong>${rupiah(item.nominal)}</strong><br>

                <small>${item.waktu}</small>

            </div>

            <button
            onclick="hapusItem(${riwayat.length-1-index})"
            style="
            border:none;
            background:#D62828;
            color:#fff;
            padding:6px 10px;
            border-radius:10px;
            cursor:pointer;
            ">
            ✕
            </button>

        </div>
        `;

        list.appendChild(li);

    });

    simpan();

}

// ---------- Tambah ----------
function tambah(nominal){

    bunyiKlik();

    total += nominal;
    transaksi++;

    const waktu = new Date().toLocaleTimeString("id-ID",{
        hour:"2-digit",
        minute:"2-digit"
    });

    riwayat.push({

        nominal: nominal,
        waktu: waktu

    });

    update();

}

// ---------- Buka/Tutup Input ----------
function toggleManual(){

    document
    .getElementById("manualBox")
    .classList
    .toggle("hidden");

}

// ---------- Tambah Manual ----------
function tambahManual(){

    const input = document.getElementById("nominal");

    let nominal = Number(input.value);

    if(!nominal || nominal <= 0){

        alert("Masukkan nominal yang benar.");

        return;

    }

    // otomatis ribuan
    nominal *= 1000;

    tambah(nominal);

    input.value = "";

}
// ---------- Hapus Satu Transaksi ----------
function hapusItem(index){

    bunyiKlik();

    const item = riwayat[index];

    if(!item) return;

    total -= item.nominal;
    transaksi--;

    if(total < 0) total = 0;
    if(transaksi < 0) transaksi = 0;

    riwayat.splice(index,1);

    update();

}

// ---------- Undo ----------
function undo(){

    if(riwayat.length === 0){

        alert("Belum ada transaksi.");

        return;

    }

    bunyiKlik();

    const terakhir = riwayat.pop();

    total -= terakhir.nominal;
    transaksi--;

    if(total < 0) total = 0;
    if(transaksi < 0) transaksi = 0;

    update();

}

// ---------- Reset Semua ----------
function resetData(){

    if(!confirm("Yakin ingin mereset semua data?")) return;

    bunyiKlik();

    total = 0;
    transaksi = 0;
    riwayat = [];

    update();

}

// ---------- Hapus Riwayat ----------
function kosongkanRiwayat(){

    if(!confirm("Hapus semua riwayat transaksi?")) return;

    bunyiKlik();

    total = 0;
    transaksi = 0;
    riwayat = [];

    update();

}

// ---------- Tanggal ----------
const sekarang = new Date();

const tanggal = document.getElementById("tanggal");

if(tanggal){

    tanggal.textContent =
    sekarang.toLocaleDateString("id-ID",{

        weekday:"long",
        day:"numeric",
        month:"long",
        year:"numeric"

    });

}

// ---------- Input ----------
const inputNominal = document.getElementById("nominal");

if(inputNominal){

    inputNominal.placeholder = "Contoh: 12 = Rp12.000";

    inputNominal.addEventListener("keypress",function(e){

        if(e.key === "Enter"){

            tambahManual();

        }

    });

}

// ---------- Jalankan Saat Pertama ----------
update();