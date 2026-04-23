/**
 * Severity result configurations for safe, clinic, and emergency levels.
 * Contains bilingual (EN/BM) labels, explanations, timeline guidance,
 * warning signs, and risk escalation data used by ResultScreen.
 *
 * Each severity level maps to a complete result card configuration
 * that drives the entire result display without additional API calls.
 */

import type { Severity, ResultConfig } from '../../types';

export const RESULTS: Record<Severity, ResultConfig> = {
  // -------------------------------------------------------------------------
  // Safe — low risk, monitor at home
  // -------------------------------------------------------------------------
  safe: {
    label: {
      en: 'SAFE TO MONITOR',
      bm: 'SELAYAKNYA DIPANTAU',
    },
    subLabel: {
      en: 'Low Risk • Confidence: High',
      bm: 'Risiko Rendah • Keyakinan Tinggi',
    },
    color: '#2D8A3E',
    action: {
      en: 'Monitor at home',
      bm: 'Pantau di rumah',
    },
    explanation: {
      en: 'Your selected symptoms do not currently show major warning signs, but they should still be monitored closely.',
      bm: 'Simptom yang dipilih pada masa ini tidak menunjukkan tanda amaran utama, tetapi masih perlu dipantau dengan teliti.',
    },
    timeline: {
      morning: {
        en: ['Drink water regularly', 'Rest and avoid heavy activity'],
        bm: ['Minum air secukupnya', 'Berehat dan elakkan aktiviti berat'],
      },
      afternoon: {
        en: ['Eat light meals if tolerated', 'Notice any symptom changes'],
        bm: ['Ambil makanan ringan jika sesuai', 'Perhatikan sebarang perubahan simptom'],
      },
      night: {
        en: ['Reassess symptoms before sleep', 'Seek care if symptoms worsen'],
        bm: ['Nilai semula simptom sebelum tidur', 'Dapatkan rawatan jika simptom bertambah teruk'],
      },
    },
    whenToAct: {
      en: [
        'Symptoms become significantly worse',
        'New severe symptoms appear',
        'You are unable to drink or eat properly',
      ],
      bm: [
        'Simptom menjadi semakin teruk',
        'Tanda simptom serius yang baru muncul',
        'Anda tidak mampu makan atau minum dengan baik',
      ],
    },
    waitRisk: {
      en: [
        { time: 'Now', level: 'Low concern', desc: 'Your symptoms can be monitored at home for now.' },
        { time: '+24 Hours', level: 'Reassess', desc: 'If symptoms remain the same, reassess your condition and continue monitoring closely.' },
        { time: '+48 Hours', level: 'Consider clinic visit', desc: 'If symptoms persist or worsen, a clinic visit may be more appropriate.' },
      ],
      bm: [
        { time: 'Sekarang', level: 'Risiko rendah', desc: 'Simptom anda boleh dipantau di rumah buat masa ini.' },
        { time: '+24 Jam', level: 'Nilai semula', desc: 'Jika simptom kekal sama, nilai semula keadaan anda dan teruskan pemantauan.' },
        { time: '+48 Jam', level: 'Pertimbangkan klinik', desc: 'Jika simptom berterusan atau bertambah teruk, lawatan ke klinik mungkin lebih sesuai.' },
      ],
    },
  },

  // -------------------------------------------------------------------------
  // Clinic — moderate risk, visit within 24 hours
  // -------------------------------------------------------------------------
  clinic: {
    label: {
      en: 'VISIT CLINIC',
      bm: 'PERGI KE KLINIK',
    },
    subLabel: {
      en: 'Moderate Risk • Confidence: High',
      bm: 'Risiko Sederhana • Keyakinan Tinggi',
    },
    color: '#E67700',
    action: {
      en: 'Visit a clinic within 24 hours',
      bm: 'Kunjungi klinik dalam masa 24 jam',
    },
    explanation: {
      en: 'Your symptoms suggest you should be assessed by a healthcare provider soon rather than continuing to monitor at home.',
      bm: 'Simptom anda menunjukkan bahawa anda perlu diperiksa oleh petugas kesihatan secepat mungkin dan tidak hanya dipantau di rumah.',
    },
    timeline: {
      morning: {
        en: ['Schedule a clinic visit', 'Prepare a short symptom summary'],
        bm: ['Atur lawatan ke klinik', 'Sediakan ringkasan simptom yang dialami'],
      },
      afternoon: {
        en: ['Attend the appointment if available', 'Keep monitoring symptom changes'],
        bm: ['Hadir temu janji jika tersedia', 'Teruskan memantau perubahan simptom'],
      },
      night: {
        en: ['Follow advice given by the clinic', 'Escalate if symptoms worsen quickly'],
        bm: ['Ikut nasihat yang diberi klinik', 'Dapatkan rawatan segera jika simptom cepat bertambah teruk'],
      },
    },
    whenToAct: {
      en: [
        'Breathing becomes difficult',
        'Severe chest pain develops',
        'Confusion or extreme weakness appears',
      ],
      bm: [
        'Pernafasan menjadi sukar',
        'Sakit dada yang teruk berlaku',
        'Kekeliruan atau kelemahan melampau berlaku',
      ],
    },
    waitRisk: {
      en: [
        { time: 'Now', level: 'Clinic advised', desc: 'A clinic visit is recommended based on your current symptom pattern.' },
        { time: '+24 Hours', level: 'Higher concern', desc: 'If symptoms remain the same or worsen, urgent medical review may be needed sooner.' },
        { time: '+48 Hours', level: 'Urgent escalation', desc: 'Delaying care further may increase the chance of complications.' },
      ],
      bm: [
        { time: 'Sekarang', level: 'Klinik disyorkan', desc: 'Lawatan ke klinik disyorkan berdasarkan corak simptom semasa anda.' },
        { time: '+24 Jam', level: 'Kebimbangan lebih tinggi', desc: 'Jika simptom kekal sama atau bertambah teruk, semakan perubatan segera mungkin diperlukan.' },
        { time: '+48 Jam', level: 'Perlu tindakan segera', desc: 'Menangguhkan rawatan lebih lama boleh meningkatkan risiko komplikasi.' },
      ],
    },
  },

  // -------------------------------------------------------------------------
  // Emergency — high risk, seek care immediately
  // -------------------------------------------------------------------------
  emergency: {
    label: {
      en: 'SEEK EMERGENCY CARE',
      bm: 'DAPATKAN RAWATAN KECEMASAN',
    },
    subLabel: {
      en: 'High Risk • Confidence: High',
      bm: 'Risiko Tinggi • Keyakinan Tinggi',
    },
    color: '#C92A2A',
    action: {
      en: 'Go to emergency care now',
      bm: 'Pergi ke rawatan kecemasan sekarang',
    },
    explanation: {
      en: 'Your selected symptoms include serious warning signs that should not be monitored at home.',
      bm: 'Simptom yang dipilih termasuk tanda amaran serius yang tidak sepatutnya dipantau di rumah.',
    },
    timeline: {
      morning: {
        en: ['Go to the emergency department immediately', 'Get help from someone nearby if needed'],
        bm: ['Pergi ke jabatan kecemasan dengan segera', 'Dapatkan bantuan orang berdekatan jika perlu'],
      },
      afternoon: {
        en: ['Do not delay treatment', 'Bring your medication list if possible'],
        bm: ['Jangan tangguhkan rawatan', 'Bawa senarai ubat jika boleh'],
      },
      night: {
        en: ['Do not drive yourself if unsafe', 'Escalate immediately if symptoms intensify'],
        bm: ['Jangan memandu sendiri jika tidak selamat', 'Dapatkan bantuan segera jika simptom semakin teruk'],
      },
    },
    whenToAct: {
      en: [
        'Loss of consciousness',
        'Severe difficulty breathing',
        'Uncontrolled bleeding',
      ],
      bm: [
        'Hilang kesedaran',
        'Kesukaran bernafas yang teruk',
        'Pendarahan yang tidak terkawal',
      ],
    },
    waitRisk: {
      en: [
        { time: 'Now', level: 'Immediate action', desc: 'Emergency evaluation is needed right away.' },
        { time: '+24 Hours', level: 'Severe risk', desc: 'Waiting may significantly worsen the situation and increase danger.' },
        { time: '+48 Hours', level: 'Critical risk', desc: 'Delaying care further may lead to life-threatening complications.' },
      ],
      bm: [
        { time: 'Sekarang', level: 'Tindakan segera', desc: 'Penilaian kecemasan diperlukan dengan segera.' },
        { time: '+24 Jam', level: 'Risiko serius', desc: 'Menunggu boleh memburukkan keadaan dan meningkatkan bahaya.' },
        { time: '+48 Jam', level: 'Risiko kritikal', desc: 'Menangguhkan rawatan lebih lama boleh membawa kepada komplikasi yang mengancam nyawa.' },
      ],
    },
  },
};
