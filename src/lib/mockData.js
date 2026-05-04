import { generateDoctors } from './doctorGenerator';

// Generate dates relative to today
const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };
const subDays = (d, n) => addDays(d, -n);

// Available slot generator
const generateSlots = (startOffset, count) => {
  const slots = [];
  for (let i = startOffset; i < startOffset + count; i++) {
    const d = addDays(today, i);
    if (d.getDay() === 0) continue;
    const times = d.getDay() === 6
      ? ['10:00', '10:30', '11:00', '11:30']
      : ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];
    slots.push({ date: fmt(d), times });
  }
  return slots;
};

const coreDoctors = [
  {
    id: 'doc-001', name: 'Dr. Aarav Mehta', specialisation: 'Cardiologist',
    clinicName: 'HeartCare Clinic', location: 'Sonipat',
    address: '45, Model Town, Near Civil Hospital, Sonipat, Haryana 131001',
    phone: '+91 98765 43210', email: 'aarav.mehta@healthid.in',
    acceptingPatients: true, overallRating: 4.7,
    ratings: { hygiene: 4.8, qualification: 4.9, communication: 4.5, waitTime: 4.3, outcomes: 4.8 },
    evaluationCount: 14, verified: true,
    bio: 'Dr. Aarav Mehta is a senior cardiologist with 18 years of experience in interventional cardiology. He completed his DM from AIIMS Delhi and has performed over 3,000 cardiac procedures. He specialises in preventive cardiology and heart failure management.',
    availableSlots: generateSlots(1, 14),
  },
  {
    id: 'doc-002', name: 'Dr. Priya Sharma', specialisation: 'Gastroenterologist',
    clinicName: 'DigestWell Centre', location: 'Delhi NCR',
    address: '12, Sector 18, Noida, Uttar Pradesh 201301',
    phone: '+91 98765 43211', email: 'priya.sharma@healthid.in',
    acceptingPatients: true, overallRating: 4.5,
    ratings: { hygiene: 4.6, qualification: 4.7, communication: 4.4, waitTime: 4.2, outcomes: 4.6 },
    evaluationCount: 11, verified: true,
    bio: 'Dr. Priya Sharma is a gastroenterologist with 12 years of clinical practice. She trained at PGI Chandigarh and specialises in liver diseases, IBD, and advanced endoscopic procedures. She is known for her patient-first approach.',
    availableSlots: generateSlots(1, 14),
  },
  {
    id: 'doc-003', name: 'Dr. Vikram Singh', specialisation: 'Orthopedist',
    clinicName: 'BonePlus Ortho Clinic', location: 'Sonipat',
    address: '78, Gohana Road, Near Khubi Ram Park, Sonipat, Haryana 131001',
    phone: '+91 98765 43212', email: 'vikram.singh@healthid.in',
    acceptingPatients: true, overallRating: 4.3,
    ratings: { hygiene: 4.2, qualification: 4.5, communication: 4.1, waitTime: 4.0, outcomes: 4.6 },
    evaluationCount: 9, verified: true,
    bio: 'Dr. Vikram Singh is an orthopaedic surgeon with 15 years of experience in joint replacement and sports medicine. He completed his MS from Safdarjung Hospital and has performed over 2,000 knee and hip replacements.',
    availableSlots: generateSlots(1, 14),
  },
  {
    id: 'doc-004', name: 'Dr. Ananya Reddy', specialisation: 'Dermatologist',
    clinicName: 'SkinFirst Derma Clinic', location: 'Delhi NCR',
    address: '34, Defence Colony, New Delhi 110024',
    phone: '+91 98765 43213', email: 'ananya.reddy@healthid.in',
    acceptingPatients: true, overallRating: 4.8,
    ratings: { hygiene: 4.9, qualification: 4.8, communication: 4.9, waitTime: 4.5, outcomes: 4.7 },
    evaluationCount: 16, verified: true,
    bio: 'Dr. Ananya Reddy is a board-certified dermatologist with expertise in clinical and cosmetic dermatology. She trained at JIPMER Puducherry and has 10 years of experience treating complex skin conditions, acne, and autoimmune disorders.',
    availableSlots: generateSlots(1, 14),
  },
  {
    id: 'doc-005', name: 'Dr. Rajesh Patel', specialisation: 'Neurologist',
    clinicName: 'NeuroLife Clinic', location: 'Delhi NCR',
    address: '56, Rajouri Garden, New Delhi 110027',
    phone: '+91 98765 43214', email: 'rajesh.patel@healthid.in',
    acceptingPatients: false, overallRating: 4.6,
    ratings: { hygiene: 4.5, qualification: 4.9, communication: 4.4, waitTime: 4.3, outcomes: 4.7 },
    evaluationCount: 12, verified: true,
    bio: 'Dr. Rajesh Patel is a neurologist specialising in epilepsy, stroke, and neurodegenerative diseases. With a DM from NIMHANS Bangalore and 20 years of practice, he is one of the most experienced neurologists in the NCR region.',
    availableSlots: generateSlots(2, 14),
  },
  {
    id: 'doc-006', name: 'Dr. Kavita Nair', specialisation: 'Psychiatrist',
    clinicName: 'MindWell Psychiatry', location: 'Delhi NCR',
    address: '23, Greater Kailash II, New Delhi 110048',
    phone: '+91 98765 43215', email: 'kavita.nair@healthid.in',
    acceptingPatients: true, overallRating: 4.4,
    ratings: { hygiene: 4.5, qualification: 4.6, communication: 4.8, waitTime: 4.0, outcomes: 4.2 },
    evaluationCount: 10, verified: true,
    bio: 'Dr. Kavita Nair is a psychiatrist with 14 years of experience in mood disorders, anxiety, and addiction medicine. She completed her MD Psychiatry from KEM Mumbai and provides both pharmacological and therapeutic treatment plans.',
    availableSlots: generateSlots(1, 14),
  },
  {
    id: 'doc-007', name: 'Dr. Suresh Kumar', specialisation: 'ENT Specialist',
    clinicName: 'ClearENT Clinic', location: 'Sonipat',
    address: '91, Subhash Chowk, Sonipat, Haryana 131001',
    phone: '+91 98765 43216', email: 'suresh.kumar@healthid.in',
    acceptingPatients: true, overallRating: 4.1,
    ratings: { hygiene: 4.0, qualification: 4.3, communication: 4.0, waitTime: 3.8, outcomes: 4.2 },
    evaluationCount: 8, verified: true,
    bio: 'Dr. Suresh Kumar is an ENT specialist with 11 years of experience in ear, nose, and throat disorders. He trained at Maulana Azad Medical College and specialises in sinus surgeries and hearing loss management.',
    availableSlots: generateSlots(1, 14),
  },
  {
    id: 'doc-008', name: 'Dr. Meera Iyer', specialisation: 'Gynaecologist',
    clinicName: 'WomenFirst Clinic', location: 'Delhi NCR',
    address: '67, Saket, New Delhi 110017',
    phone: '+91 98765 43217', email: 'meera.iyer@healthid.in',
    acceptingPatients: true, overallRating: 4.9,
    ratings: { hygiene: 4.9, qualification: 4.9, communication: 4.8, waitTime: 4.7, outcomes: 4.9 },
    evaluationCount: 18, verified: true,
    bio: 'Dr. Meera Iyer is a senior gynaecologist and obstetrician with 22 years of experience. She trained at Lady Hardinge Medical College and specialises in high-risk pregnancies, fertility issues, and minimally invasive gynaecological surgery.',
    availableSlots: generateSlots(1, 14),
  },
  {
    id: 'doc-009', name: 'Dr. Arjun Desai', specialisation: 'Cardiologist',
    clinicName: 'PulsePoint Heart Centre', location: 'Delhi NCR',
    address: '102, Dwarka Sector 12, New Delhi 110078',
    phone: '+91 98765 43218', email: 'arjun.desai@healthid.in',
    acceptingPatients: true, overallRating: 4.2,
    ratings: { hygiene: 4.3, qualification: 4.4, communication: 4.0, waitTime: 3.9, outcomes: 4.3 },
    evaluationCount: 7, verified: true,
    bio: 'Dr. Arjun Desai is a cardiologist with 8 years of experience in cardiac imaging and preventive cardiology. He completed his DM from Grant Medical College Mumbai and focuses on early detection and management of cardiovascular risk factors.',
    availableSlots: generateSlots(1, 14),
  },
  {
    id: 'doc-010', name: 'Dr. Sneha Gupta', specialisation: 'Dermatologist',
    clinicName: 'DermaCare Solutions', location: 'Sonipat',
    address: '15, Kakroi, Near Atlas Road, Sonipat, Haryana 131001',
    phone: '+91 98765 43219', email: 'sneha.gupta@healthid.in',
    acceptingPatients: true, overallRating: 3.9,
    ratings: { hygiene: 4.0, qualification: 4.1, communication: 3.8, waitTime: 3.6, outcomes: 3.9 },
    evaluationCount: 6, verified: true,
    bio: 'Dr. Sneha Gupta is a dermatologist with 7 years of clinical experience. She completed her MD from SMS Medical College Jaipur and treats a range of conditions from eczema and psoriasis to hair loss and fungal infections.',
    availableSlots: generateSlots(1, 14),
  },
  {
    id: 'doc-011', name: 'Dr. Rohit Verma', specialisation: 'Orthopedist',
    clinicName: 'JointFlex Ortho Centre', location: 'Delhi NCR',
    address: '88, Pitampura, New Delhi 110034',
    phone: '+91 98765 43220', email: 'rohit.verma@healthid.in',
    acceptingPatients: false, overallRating: 4.5,
    ratings: { hygiene: 4.4, qualification: 4.7, communication: 4.3, waitTime: 4.2, outcomes: 4.6 },
    evaluationCount: 13, verified: true,
    bio: 'Dr. Rohit Verma is an orthopaedic surgeon specialising in spine surgery and trauma care. He trained at AIIMS Delhi and has 16 years of experience. He is currently not accepting new patients due to a full appointment schedule.',
    availableSlots: generateSlots(3, 14),
  },
  {
    id: 'doc-012', name: 'Dr. Pooja Choudhary', specialisation: 'Neurologist',
    clinicName: 'BrainHealth Neurology', location: 'Sonipat',
    address: '30, Sector 14, Sonipat, Haryana 131001',
    phone: '+91 98765 43221', email: 'pooja.choudhary@healthid.in',
    acceptingPatients: true, overallRating: 3.4,
    ratings: { hygiene: 3.5, qualification: 3.8, communication: 3.4, waitTime: 3.0, outcomes: 3.4 },
    evaluationCount: 5, verified: true,
    bio: 'Dr. Pooja Choudhary is a neurologist with 6 years of clinical experience. She completed her DM from BHU Varanasi and focuses on headache disorders, neuropathies, and movement disorders. She is building a growing practice in Sonipat.',
    availableSlots: generateSlots(1, 14),
  },
];

// Merge hand-crafted + 1050 generated doctors = 1062 total
const generatedDoctors = generateDoctors(1050);
export const doctors = [...coreDoctors, ...generatedDoctors];

export const adminUsers = [
  { id: 'admin-001', doctorId: 'doc-001', email: 'aarav.mehta@healthid.in', password: 'HealthID2025', name: 'Dr. Aarav Mehta', specialisation: 'Cardiologist' },
  { id: 'admin-002', doctorId: 'doc-002', email: 'priya.sharma@healthid.in', password: 'HealthID2025', name: 'Dr. Priya Sharma', specialisation: 'Gastroenterologist' },
  { id: 'admin-003', doctorId: 'doc-004', email: 'ananya.reddy@healthid.in', password: 'HealthID2025', name: 'Dr. Ananya Reddy', specialisation: 'Dermatologist' },
  { id: 'admin-004', doctorId: 'doc-008', email: 'meera.iyer@healthid.in', password: 'HealthID2025', name: 'Dr. Meera Iyer', specialisation: 'Gynaecologist' },
];

const appointmentData = [
  { doctorId: 'doc-001', patientName: 'Rahul Kapoor', phone: '+91 99887 76601', email: 'rahul.k@email.com', urgency: 'High', reason: 'Experiencing chest pain and shortness of breath during light exercise', notes: 'Pain has been recurring for two weeks. History of high blood pressure.', status: 'Confirmed', dayOffset: -45 },
  { doctorId: 'doc-001', patientName: 'Sunita Devi', phone: '+91 99887 76602', email: '', urgency: 'Moderate', reason: 'Follow-up for hypertension medication review', notes: 'Currently on Amlodipine 5mg. Blood pressure readings have been slightly elevated.', status: 'Completed', dayOffset: -38 },
  { doctorId: 'doc-001', patientName: 'Manoj Tiwari', phone: '+91 99887 76603', email: 'manoj.t@email.com', urgency: 'Low', reason: 'Annual cardiac check-up and ECG', notes: 'No current symptoms. Family history of heart disease.', status: 'Completed', dayOffset: -30 },
  { doctorId: 'doc-001', patientName: 'Deepa Joshi', phone: '+91 99887 76604', email: 'deepa.j@email.com', urgency: 'Emergency', reason: 'Sudden severe chest pain with sweating and nausea', notes: 'Patient reported feeling dizzy and faint. Called from home.', status: 'Completed', dayOffset: -15 },
  { doctorId: 'doc-001', patientName: 'Amit Saxena', phone: '+91 99887 76605', email: '', urgency: 'Moderate', reason: 'Palpitations and irregular heartbeat for one week', notes: 'No previous cardiac history. Recently started new job, reports high stress.', status: 'Pending', dayOffset: 3 },
  { doctorId: 'doc-001', patientName: 'Neha Bhatt', phone: '+91 99887 76606', email: 'neha.b@email.com', urgency: 'Low', reason: 'Routine cholesterol and lipid profile review', notes: 'Was advised to check after three months of dietary changes.', status: 'Confirmed', dayOffset: 7 },
  { doctorId: 'doc-001', patientName: 'Ravi Shankar', phone: '+91 99887 76607', email: '', urgency: 'High', reason: 'Severe breathlessness while lying down at night', notes: 'Episodes started two days ago. History of mild heart valve issue.', status: 'Pending', dayOffset: 2 },
  { doctorId: 'doc-002', patientName: 'Anjali Mishra', phone: '+91 99887 76608', email: 'anjali.m@email.com', urgency: 'Moderate', reason: 'Persistent acid reflux and stomach pain after meals', notes: 'Symptoms have been present for three weeks. Over-the-counter antacids not helping.', status: 'Confirmed', dayOffset: -20 },
  { doctorId: 'doc-002', patientName: 'Vikrant Chauhan', phone: '+91 99887 76609', email: '', urgency: 'High', reason: 'Blood in stool for two days with abdominal cramping', notes: 'First occurrence. No previous GI issues. Very concerned.', status: 'Completed', dayOffset: -12 },
  { doctorId: 'doc-002', patientName: 'Pooja Yadav', phone: '+91 99887 76610', email: 'pooja.y@email.com', urgency: 'Low', reason: 'Routine follow-up for IBS management', notes: 'Currently managing with dietary changes. Wants to discuss probiotics.', status: 'Pending', dayOffset: 5 },
  { doctorId: 'doc-002', patientName: 'Sanjay Rawat', phone: '+91 99887 76611', email: '', urgency: 'Moderate', reason: 'Chronic constipation and bloating for over a month', notes: 'Tried home remedies without improvement. Diet is high in processed food.', status: 'Confirmed', dayOffset: 4 },
  { doctorId: 'doc-002', patientName: 'Kavya Nanda', phone: '+91 99887 76612', email: 'kavya.n@email.com', urgency: 'Emergency', reason: 'Severe vomiting with blood, unable to keep food down', notes: 'Started this morning. History of peptic ulcer. Extremely weak.', status: 'Confirmed', dayOffset: -5 },
  { doctorId: 'doc-002', patientName: 'Arun Prakash', phone: '+91 99887 76613', email: '', urgency: 'Low', reason: 'Liver function test review after hepatitis B treatment', notes: 'Completed six-month antiviral course. Needs confirmation of viral load status.', status: 'Completed', dayOffset: -40 },
  { doctorId: 'doc-002', patientName: 'Divya Malhotra', phone: '+91 99887 76614', email: 'divya.m@email.com', urgency: 'Moderate', reason: 'Recurring stomach cramps and loose stools', notes: 'Has been avoiding dairy. Suspects lactose intolerance.', status: 'Cancelled', dayOffset: -8 },
  { doctorId: 'doc-002', patientName: 'Harsh Agarwal', phone: '+91 99887 76615', email: '', urgency: 'High', reason: 'Sudden weight loss with loss of appetite over two weeks', notes: 'Lost about 4 kg without trying. No change in diet or activity.', status: 'Pending', dayOffset: 6 },
  { doctorId: 'doc-004', patientName: 'Nisha Oberoi', phone: '+91 99887 76616', email: 'nisha.o@email.com', urgency: 'Low', reason: 'Persistent acne on face and back not responding to creams', notes: 'Has tried benzoyl peroxide and salicylic acid. Wants prescription options.', status: 'Confirmed', dayOffset: -25 },
  { doctorId: 'doc-004', patientName: 'Karan Bhatia', phone: '+91 99887 76617', email: '', urgency: 'Moderate', reason: 'Spreading rash on arms and legs with itching', notes: 'Rash started one week ago. No known allergies. Using new laundry detergent.', status: 'Completed', dayOffset: -18 },
  { doctorId: 'doc-004', patientName: 'Shruti Menon', phone: '+91 99887 76618', email: 'shruti.m@email.com', urgency: 'High', reason: 'Sudden hair loss in patches with scalp irritation', notes: 'Lost hair in two coin-sized patches in the last week. Very anxious.', status: 'Pending', dayOffset: 4 },
  { doctorId: 'doc-004', patientName: 'Vivek Thakur', phone: '+91 99887 76619', email: '', urgency: 'Low', reason: 'Mole that has changed colour and grown in size', notes: 'Mole on upper back. Wife noticed it has darkened. Wants evaluation.', status: 'Confirmed', dayOffset: 8 },
  { doctorId: 'doc-004', patientName: 'Pallavi Jain', phone: '+91 99887 76620', email: 'pallavi.j@email.com', urgency: 'Moderate', reason: 'Eczema flare-up on hands that cracks and bleeds', notes: 'Chronic eczema patient. Current flare-up is the worst in two years.', status: 'Completed', dayOffset: -35 },
  { doctorId: 'doc-004', patientName: 'Gaurav Sinha', phone: '+91 99887 76621', email: '', urgency: 'Low', reason: 'White patches on skin spreading slowly', notes: 'First noticed six months ago. Patches are on forearms and neck.', status: 'Cancelled', dayOffset: -10 },
  { doctorId: 'doc-004', patientName: 'Isha Kapoor', phone: '+91 99887 76622', email: 'isha.k@email.com', urgency: 'Moderate', reason: 'Fungal infection on feet recurring after treatment', notes: 'Third recurrence in six months. Previous antifungal course was two weeks.', status: 'Pending', dayOffset: 10 },
  { doctorId: 'doc-008', patientName: 'Meghna Roy', phone: '+91 99887 76623', email: 'meghna.r@email.com', urgency: 'High', reason: 'Severe menstrual pain and very heavy bleeding this cycle', notes: 'Pain is much worse than usual. Soaking through pads every hour. History of fibroids.', status: 'Confirmed', dayOffset: -7 },
  { doctorId: 'doc-008', patientName: 'Lakshmi Pillai', phone: '+91 99887 76624', email: '', urgency: 'Moderate', reason: 'Missed periods for two months, negative pregnancy test', notes: 'Regular cycles previously. Recently started intense exercise routine.', status: 'Completed', dayOffset: -22 },
  { doctorId: 'doc-008', patientName: 'Swati Dubey', phone: '+91 99887 76625', email: 'swati.d@email.com', urgency: 'Low', reason: 'Routine annual gynaecological check-up and Pap smear', notes: 'No current symptoms. Last check-up was 14 months ago.', status: 'Pending', dayOffset: 9 },
  { doctorId: 'doc-008', patientName: 'Rekha Pandey', phone: '+91 99887 76626', email: '', urgency: 'Emergency', reason: 'Severe lower abdominal pain with spotting during early pregnancy', notes: 'Eight weeks pregnant. Pain started two hours ago. Extremely worried.', status: 'Completed', dayOffset: -3 },
  { doctorId: 'doc-008', patientName: 'Aditi Sharma', phone: '+91 99887 76627', email: 'aditi.s@email.com', urgency: 'Moderate', reason: 'Consultation for PCOS management and fertility planning', notes: 'Diagnosed with PCOS three years ago. Planning pregnancy within next year.', status: 'Confirmed', dayOffset: 5 },
  { doctorId: 'doc-008', patientName: 'Tanvi Bansal', phone: '+91 99887 76628', email: '', urgency: 'Low', reason: 'Follow-up after laparoscopic ovarian cyst removal', notes: 'Surgery was four weeks ago. Recovery going well. Needs clearance.', status: 'Completed', dayOffset: -28 },
  { doctorId: 'doc-008', patientName: 'Prerna Saxena', phone: '+91 99887 76629', email: 'prerna.s@email.com', urgency: 'High', reason: 'Unusual vaginal discharge with discomfort for five days', notes: 'Discharge is yellowish with odour. Mild burning sensation.', status: 'Pending', dayOffset: 3 },
  { doctorId: 'doc-008', patientName: 'Geeta Rani', phone: '+91 99887 76630', email: '', urgency: 'Moderate', reason: 'Discussing hormone replacement therapy options for menopause', notes: 'Age 52. Experiencing hot flashes, mood swings, and sleep disturbance for six months.', status: 'Cancelled', dayOffset: -14 },
];

export const appointments = appointmentData.map((a, i) => {
  const d = addDays(today, a.dayOffset);
  const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '15:30'];
  return {
    id: `APT-${String(1001 + i)}`,
    doctorId: a.doctorId,
    patientName: a.patientName,
    patientPhone: a.phone,
    patientEmail: a.email,
    date: fmt(d),
    time: times[i % times.length],
    urgency: a.urgency,
    reason: a.reason,
    notes: a.notes,
    status: a.status,
    createdAt: fmt(subDays(d, Math.floor(Math.random() * 5) + 1)),
  };
});

export const specialistTypes = [
  { name: 'Cardiologist', keywords: ['chest pain', 'palpitations', 'blood pressure', 'heart'] },
  { name: 'Gastroenterologist', keywords: ['stomach pain', 'acid reflux', 'bloating', 'liver'] },
  { name: 'Orthopedist', keywords: ['joint pain', 'fracture', 'back pain', 'knee'] },
  { name: 'Dermatologist', keywords: ['rash', 'acne', 'hair loss', 'skin patches'] },
  { name: 'Neurologist', keywords: ['headache', 'dizziness', 'numbness', 'seizures'] },
  { name: 'Psychiatrist', keywords: ['anxiety', 'depression', 'insomnia', 'mood swings'] },
  { name: 'ENT Specialist', keywords: ['ear pain', 'hearing loss', 'sinusitis', 'sore throat'] },
  { name: 'Gynaecologist', keywords: ['menstrual pain', 'pregnancy', 'PCOS', 'fertility'] },
];
