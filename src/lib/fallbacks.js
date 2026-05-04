// Symptom-to-specialist mapping for intelligent offline recommendations
const specialistMap = [
  {
    specialist: 'Gastroenterologist',
    keywords: ['stomach', 'abdomen', 'abdominal', 'digestion', 'digestive', 'nausea', 'vomiting', 'diarrhoea', 'diarrhea', 'constipation', 'bloating', 'acid', 'reflux', 'heartburn', 'acidity', 'stool', 'stools', 'excretion', 'bowel', 'gas', 'flatulence', 'ulcer', 'liver', 'jaundice', 'food poisoning', 'indigestion', 'ibs', 'cramps after eating', 'blood in stool', 'loose motion', 'loose motions', 'gastric', 'colitis', 'crohn'],
    reason: 'Your symptoms point to a digestive or gastrointestinal issue. A Gastroenterologist is a specialist trained specifically in disorders of the stomach, intestines, liver, and the entire digestive system.',
    redFlags: ['Blood in stool or black tarry stools', 'Severe abdominal pain that does not reduce within 2 hours', 'Inability to keep any food or water down for more than 12 hours', 'Sudden sharp pain in the lower right abdomen (possible appendicitis)', 'High fever with severe stomach cramping and dehydration'],
  },
  {
    specialist: 'Cardiologist',
    keywords: ['chest', 'heart', 'palpitation', 'palpitations', 'blood pressure', 'bp', 'breathless', 'breathlessness', 'shortness of breath', 'heartbeat', 'irregular heartbeat', 'pulse', 'cardiac', 'cholesterol', 'angina', 'chest pain', 'chest tightness', 'swollen ankles', 'fatigue climbing stairs'],
    reason: 'Your symptoms suggest a possible cardiovascular concern. A Cardiologist specialises in the heart and blood vessels, and can perform tests like ECG, echocardiogram, and stress tests to assess your heart health.',
    redFlags: ['Sudden crushing chest pain radiating to jaw, arm, or back — call an ambulance immediately', 'Severe breathlessness even at rest', 'Loss of consciousness or fainting', 'Sudden cold sweat with chest discomfort', 'Heart racing above 150 bpm that does not stop'],
  },
  {
    specialist: 'Orthopedist',
    keywords: ['joint', 'joints', 'bone', 'bones', 'fracture', 'back pain', 'spine', 'spinal', 'knee', 'shoulder', 'hip', 'ankle', 'wrist', 'elbow', 'arthritis', 'swelling joint', 'stiffness', 'muscle pain', 'ligament', 'sports injury', 'slipped disc', 'sciatica', 'neck pain', 'frozen shoulder', 'osteoporosis'],
    reason: 'Your symptoms relate to the musculoskeletal system — bones, joints, ligaments, or spine. An Orthopedist is trained to diagnose and treat these issues, from sports injuries to chronic conditions like arthritis.',
    redFlags: ['Inability to move or bear weight on a limb after injury', 'Visible deformity of a bone or joint', 'Severe back pain with loss of bladder or bowel control', 'Numbness or tingling spreading to arms or legs rapidly', 'Swelling and redness in a joint with high fever (possible septic arthritis)'],
  },
  {
    specialist: 'Dermatologist',
    keywords: ['skin', 'rash', 'acne', 'pimple', 'pimples', 'itching', 'itch', 'eczema', 'psoriasis', 'fungal', 'ringworm', 'hair loss', 'hair fall', 'dandruff', 'patches', 'white patches', 'mole', 'wart', 'boil', 'allergy skin', 'hives', 'urticaria', 'pigmentation', 'dark spots', 'dry skin', 'nail infection'],
    reason: 'Your symptoms suggest a skin, hair, or nail condition. A Dermatologist specialises in diagnosing and treating all skin disorders, from infections and allergies to chronic conditions like eczema and psoriasis.',
    redFlags: ['Rapidly spreading rash with fever and joint pain', 'A mole that has changed shape, colour, or is bleeding', 'Severe allergic reaction with face or throat swelling', 'Blistering skin with peeling (possible drug reaction)', 'Sudden widespread hair loss in patches'],
  },
  {
    specialist: 'Neurologist',
    keywords: ['headache', 'migraine', 'dizziness', 'dizzy', 'vertigo', 'numbness', 'tingling', 'seizure', 'seizures', 'tremor', 'tremors', 'memory loss', 'forgetfulness', 'brain', 'nerve', 'paralysis', 'weakness one side', 'blackout', 'convulsion', 'epilepsy', 'stroke', 'confusion', 'fainting', 'blurred vision'],
    reason: 'Your symptoms suggest a neurological concern involving the brain, spinal cord, or peripheral nerves. A Neurologist is trained to diagnose conditions like migraines, epilepsy, neuropathy, and more.',
    redFlags: ['Sudden severe headache described as the worst of your life', 'Sudden weakness or numbness on one side of the body (possible stroke)', 'Difficulty speaking or understanding speech suddenly', 'Multiple seizures in a short period', 'Sudden vision loss in one or both eyes'],
  },
  {
    specialist: 'Psychiatrist',
    keywords: ['anxiety', 'depression', 'depressed', 'mood', 'mood swings', 'insomnia', 'sleep', 'suicidal', 'panic', 'panic attack', 'stress', 'ocd', 'obsessive', 'compulsive', 'hallucination', 'voices', 'mania', 'bipolar', 'eating disorder', 'addiction', 'substance', 'anger', 'irritability'],
    reason: 'Your symptoms suggest a mental health concern. A Psychiatrist is a medical doctor specialising in mental health who can both prescribe medication and recommend therapy. There is no stigma in seeking mental health care.',
    redFlags: ['Thoughts of self-harm or suicide — call a helpline immediately (iCall: 9152987821, Vandrevala Foundation: 1860-2662-345)', 'Hearing voices or seeing things others cannot see', 'Unable to perform daily activities due to overwhelming emotions', 'Not eating or sleeping for multiple days', 'Aggressive or violent behaviour that feels uncontrollable'],
  },
  {
    specialist: 'ENT Specialist',
    keywords: ['ear', 'ears', 'hearing', 'hearing loss', 'tinnitus', 'ringing', 'nose', 'nasal', 'sinus', 'sinusitis', 'sore throat', 'throat', 'tonsil', 'tonsils', 'voice', 'hoarse', 'hoarseness', 'snoring', 'sleep apnea', 'nosebleed', 'ear pain', 'ear discharge', 'blocked nose', 'smell loss'],
    reason: 'Your symptoms involve the ear, nose, or throat. An ENT Specialist (Otolaryngologist) is trained to diagnose and treat conditions ranging from sinus infections and hearing loss to tonsillitis and voice disorders.',
    redFlags: ['Sudden complete hearing loss in one or both ears', 'Severe ear pain with high fever and discharge', 'Difficulty breathing due to throat swelling', 'Blood from the ear after head injury', 'Persistent hoarseness for more than 3 weeks (needs cancer screening)'],
  },
  {
    specialist: 'Gynaecologist',
    keywords: ['menstrual', 'period', 'periods', 'menstruation', 'pregnancy', 'pregnant', 'pcos', 'pcod', 'ovary', 'ovarian', 'uterus', 'vaginal', 'discharge', 'fertility', 'infertility', 'menopause', 'hot flashes', 'cramps menstrual', 'irregular periods', 'missed period', 'heavy bleeding', 'breast lump', 'pap smear'],
    reason: 'Your symptoms relate to the female reproductive system. A Gynaecologist specialises in women\'s health including menstrual disorders, pregnancy, hormonal issues, and reproductive conditions.',
    redFlags: ['Severe abdominal pain during early pregnancy with bleeding (possible ectopic pregnancy)', 'Extremely heavy bleeding soaking a pad every hour', 'Sudden severe pelvic pain with fever', 'A new breast lump that is hard and painless', 'Foul-smelling discharge with high fever'],
  },
  {
    specialist: 'Pulmonologist',
    keywords: ['cough', 'coughing', 'breathing', 'breath', 'lungs', 'lung', 'asthma', 'wheeze', 'wheezing', 'bronchitis', 'pneumonia', 'tuberculosis', 'tb', 'chest congestion', 'phlegm', 'sputum', 'blood cough', 'copd', 'respiratory', 'oxygen'],
    reason: 'Your symptoms relate to the respiratory system. A Pulmonologist specialises in diseases of the lungs and airways, including asthma, bronchitis, pneumonia, and other breathing disorders.',
    redFlags: ['Coughing up blood or blood-tinged sputum', 'Severe difficulty breathing that is worsening rapidly', 'Blue discolouration of lips or fingertips', 'Chest pain that worsens with breathing', 'Persistent fever with cough for more than 2 weeks (get tested for TB)'],
  },
  {
    specialist: 'Urologist',
    keywords: ['urine', 'urination', 'urinary', 'kidney', 'kidneys', 'bladder', 'burning urination', 'frequent urination', 'blood urine', 'kidney stone', 'prostate', 'uti', 'urinary infection', 'incontinence', 'bedwetting'],
    reason: 'Your symptoms suggest a urinary tract or kidney-related issue. A Urologist specialises in conditions affecting the urinary system in both men and women, and the male reproductive system.',
    redFlags: ['Severe flank pain radiating to groin (kidney stone)', 'Complete inability to pass urine', 'Blood in urine with no pain', 'High fever with burning urination and back pain (kidney infection)', 'Sudden testicular pain and swelling'],
  },
  {
    specialist: 'Endocrinologist',
    keywords: ['diabetes', 'sugar', 'thyroid', 'hormonal', 'hormone', 'weight gain', 'weight loss unexplained', 'fatigue', 'tired', 'excessive thirst', 'excessive urination', 'pcod hormonal', 'adrenal', 'calcium', 'growth', 'metabolism'],
    reason: 'Your symptoms may be linked to a hormonal or metabolic disorder. An Endocrinologist specialises in the endocrine system — thyroid, diabetes, adrenal glands, and hormonal imbalances.',
    redFlags: ['Blood sugar reading above 400 mg/dL with confusion or vomiting', 'Sudden extreme weight loss with excessive thirst (possible undiagnosed diabetes)', 'Severe muscle weakness with high or low calcium levels', 'Thyroid storm symptoms: rapid heart rate, fever, confusion', 'Adrenal crisis: severe weakness, low BP, abdominal pain'],
  },
  {
    specialist: 'Ophthalmologist',
    keywords: ['eye', 'eyes', 'vision', 'blurry', 'blurred', 'redness eye', 'eye pain', 'watery eyes', 'dry eyes', 'floaters', 'double vision', 'glaucoma', 'cataract', 'specs', 'glasses', 'night blindness', 'itchy eyes', 'swollen eyelid'],
    reason: 'Your symptoms involve your eyes or vision. An Ophthalmologist is a medical doctor specialising in eye diseases and can perform comprehensive eye examinations and surgical procedures if needed.',
    redFlags: ['Sudden vision loss in one or both eyes', 'Sudden onset of floaters with flashes of light (possible retinal detachment)', 'Severe eye pain with nausea and halos around lights (possible acute glaucoma)', 'Eye injury with object stuck in the eye', 'Chemical exposure to the eye — flush with water and go to ER immediately'],
  },
];

function matchSpecialist(symptoms) {
  const lower = symptoms.toLowerCase();
  const scores = specialistMap.map(spec => {
    let score = 0;
    for (const kw of spec.keywords) {
      if (lower.includes(kw)) score += kw.includes(' ') ? 3 : 2; // multi-word matches score higher
    }
    return { ...spec, score };
  });
  scores.sort((a, b) => b.score - a.score);
  if (scores[0].score > 0) return scores[0];
  return null;
}

function buildSpecificSymptomResponse(urgency, symptoms) {
  const match = matchSpecialist(symptoms);
  if (!match) {
    return fallbackGenericSymptom(urgency);
  }

  const urgencyAdvice = {
    'Emergency': '**SEEK EMERGENCY CARE IMMEDIATELY.** Go to the nearest hospital A&E department right now. Do not wait for a scheduled appointment. Call 112 for an ambulance if needed.',
    'High': '**Schedule an appointment within 48 hours.** If symptoms worsen before your appointment, go to the nearest emergency department.',
    'Moderate': '**Schedule an appointment this week.** Monitor your symptoms and note any changes to share with the doctor.',
    'Low': '**Schedule an appointment at your convenience within the next 1-2 weeks.** This does not appear urgent but should still be professionally evaluated.',
  };

  return `**Recommended Specialist: ${match.specialist}**

${urgencyAdvice[urgency] || urgencyAdvice['Moderate']}

**Why ${match.specialist}**
${match.reason}

**What to Tell the Receptionist When Booking**
"I need an appointment with a ${match.specialist}. I am experiencing ${symptoms.substring(0, 150)}. My urgency level is ${urgency}."

**What to Bring to Your Appointment**
- A valid photo ID (Aadhaar card, PAN card, or driving licence)
- Any previous medical reports or test results from the last 12 months
- A list of all medicines you are currently taking, including dosage and frequency
- Your health insurance card if applicable
- A written note of all your symptoms: when they started, what triggers them, and what makes them better or worse

**Red Flags — Seek Emergency Care Immediately If You Experience**
${match.redFlags.map(f => `- ${f}`).join('\n')}

**What You Must Not Do**
- Do not self-medicate based on internet searches or pharmacy advice
- Do not ignore symptoms that persist for more than a few days or worsen
- Do not rely on home remedies if your urgency level is High or Emergency
- Do not take antibiotics without a doctor's prescription
- Do not delay the visit — early diagnosis leads to better outcomes`;
}

function fallbackGenericSymptom(urgency) {
  return `**Recommended Specialist: General Physician (as a starting point)**

Based on the symptoms you described, I recommend starting with a General Physician who can conduct an initial assessment and refer you to the appropriate specialist if needed.

**Why a General Physician**
Your symptoms may overlap across multiple specialities. A General Physician is trained to evaluate a wide range of conditions, run preliminary tests like blood work and imaging, and determine the best specialist for your case. This prevents unnecessary specialist visits.

**What to Bring**
- Valid photo ID (Aadhaar, PAN, or driving licence)
- Previous medical reports from the last 12 months
- List of current medicines with dosage
- Health insurance card if applicable
- Written notes on symptoms, when they started, and what affects them

**Red Flags — Seek Emergency Care Immediately**
- Sudden severe chest pain or pressure
- Difficulty breathing at rest
- Loss of consciousness
- High fever above 103°F not responding to paracetamol
- Severe abdominal pain with vomiting blood

**What You Must Not Do**
- Do not self-medicate from the internet
- Do not ignore worsening symptoms
- Do not skip the appointment because symptoms improved temporarily`;
}

function buildSpecificChecklistResponse(urgency, condition) {
  const match = matchSpecialist(condition);
  const specName = match ? match.specialist : 'your doctor';
  const condDesc = condition.substring(0, 100);

  return `1. What exactly is causing my ${condDesc.toLowerCase().includes('pain') ? 'pain' : 'symptoms'}, and can you explain the diagnosis in simple terms?

2. Based on my specific symptoms — ${condDesc} — what are all the treatment options available to me, including non-medication approaches?

3. How long will the treatment take before I should expect improvement, and what does the complete recovery timeline look like for my condition?

4. What are the side effects of the medicines you are prescribing for this condition, and which side effects need immediate medical attention?

5. Are there specific dietary restrictions or lifestyle changes I should follow for my condition? What foods or activities should I avoid?

6. When should I return for a follow-up, and what specific improvements or worsening signs should I track between now and then?

7. What warning signs specific to my condition mean I should come back immediately or go to an emergency room without waiting?

8. Given my condition and its severity, would you recommend getting a second opinion from another ${specName}?

9. What is the estimated total cost of the full treatment — including tests, medicines, follow-up visits, and any procedures — so I can plan financially?

10. What are the risks of delaying or not treating my specific condition? How quickly could it progress if left untreated?`;
}

export const fallbackResponses = {
  symptomChecker: buildSpecificSymptomResponse,
  checklist: buildSpecificChecklistResponse,

  prescriptionDecoder: `**Prescription Analysis**

Please paste your specific prescription details (medicine names, dosages, and instructions) so I can explain each one.

If no AI provider is configured, here is general guidance:

**For any prescription you receive:**
- Take each medicine exactly as prescribed — correct dose, correct time, correct duration
- Do not stop any medicine early, even if you feel better
- Take medicines with food unless specifically told otherwise
- Space out different medicines by at least 30 minutes unless told they can be taken together
- Store medicines in a cool, dry place away from sunlight
- Never share your prescription medicines with anyone else

**Important Questions to Ask Your Pharmacist:**
- Are there any food interactions I should know about?
- Can I take this with my existing medicines?
- What should I do if I miss a dose?
- Are there any generic alternatives available at a lower cost?

**Disclaimer:** This is general guidance only. For specific medicine explanations, please configure an AI provider (Gemini or Claude) in your .env file, or consult your pharmacist.`,

  billBreakdown: `**Bill Analysis**

Please enter your specific bill details so I can analyse each charge.

If no AI provider is configured, here is general guidance for understanding medical bills:

**Standard Charges You Should See:**
- Consultation fee (Rs 300-1500 depending on specialist and city)
- Registration/file charges (Rs 50-200, usually one-time)
- Diagnostic tests at published rates
- Applicable GST (usually 5% on healthcare services)

**Charges You Should Always Question:**
- Any unnamed or vaguely described charge
- Separate charges for items that should be included in the consultation
- Duplicate entries for the same service
- Charges significantly higher than published rate cards
- PPE or COVID surcharges (no longer applicable)

**Your Rights as a Patient:**
- You have the right to receive an itemised bill before payment
- You can ask for a rate card to compare charges
- You can dispute any charge you do not understand
- Keep all receipts for insurance claims and tax deductions

**Tip:** Always ask for an itemised receipt. Compare charges with the hospital's published rate card, which they are required to display.`,
};
