// Deterministic seed-based random for consistent generation
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

const maleFirst = ['Aarav','Arjun','Vikram','Rajesh','Suresh','Rohit','Amit','Manoj','Sanjay','Ravi','Gaurav','Vivek','Karan','Harsh','Arun','Deepak','Nitin','Pradeep','Rakesh','Mukesh','Ashish','Vishal','Sachin','Rahul','Ajay','Vijay','Naresh','Mahesh','Dinesh','Ganesh','Ramesh','Pankaj','Yogesh','Umesh','Sunil','Anil','Kapil','Manish','Tushar','Hemant','Bharat','Tarun','Varun','Kunal','Anand','Naveen','Mohan','Rohan','Saurabh','Shivam','Abhishek','Pranav','Dhruv','Ishaan','Kabir','Lakshay','Neeraj','Prasad','Sandeep','Harish','Jayesh','Kishore','Lalit','Pramod','Rajiv','Sameer','Vikas','Yogendra','Chandra','Dev','Girish','Hitesh','Jatin','Mihir','Nilesh','Omkar','Paresh','Ritesh','Shekhar','Tanmay','Uday','Vinay','Akhil','Bhuvan','Chirag','Darshan','Eshan','Farhan','Gautam','Ishan','Jay','Krish','Madhav','Nakul','Ojas','Parth','Reyansh','Siddharth','Tejas','Utkarsh','Veer','Yash','Zubin','Arnav','Atharv','Deven','Harsh','Jai','Kartik','Manas','Nikhil','Om','Pinak','Raghav','Shreyas','Tanish','Ved','Aditya','Akshay','Ankur','Atul','Balaji','Chandresh','Deepesh','Girija','Hari','Jitendra','Kamal','Lokesh','Mayank','Narayan','Piyush','Raman','Shailesh','Trilok','Ujjwal','Vineet','Amar','Brijesh','Chetan','Devendra','Gagan','Himanshu','Jagdish','Keshav','Laxman'];
const femaleFirst = ['Priya','Ananya','Kavita','Meera','Sneha','Pooja','Divya','Nisha','Shruti','Pallavi','Isha','Aditi','Swati','Rekha','Tanvi','Geeta','Lakshmi','Neha','Sunita','Anjali','Deepa','Kavya','Megha','Ritu','Shweta','Tara','Usha','Varsha','Aarti','Bhavna','Chhaya','Durga','Ekta','Falguni','Gauri','Hema','Indira','Jyoti','Kamini','Lata','Mala','Namita','Padma','Rachna','Sarla','Tejaswini','Uma','Vidya','Yamini','Zoya','Aisha','Bhavika','Charulata','Disha','Esha','Garima','Hina','Ira','Juhi','Kirti','Lalita','Mansi','Nandini','Payal','Roshni','Sakshi','Tanu','Urvi','Vaishali','Ankita','Bina','Charu','Dipti','Ela','Fatima','Geetanjali','Hetal','Janvi','Komal','Leena','Madhu','Nandita','Preeti','Radha','Shalini','Trupti','Ujwala','Vanita','Archana','Bindu','Chandni','Devika','Gunjan','Heena','Jasmin','Kalpana','Laxmi','Mamta','Nidhi','Prachi','Ragini','Sapna','Trisha','Upasana','Vrinda','Aparna','Babita','Chitra','Damini','Gita','Harsha','Jaya','Kusum','Latika','Meenal','Neelam','Poonam','Rani','Seema','Tulsi','Urvashi','Vandana'];
const lastNames = ['Sharma','Mehta','Singh','Reddy','Patel','Nair','Kumar','Iyer','Desai','Gupta','Verma','Choudhary','Joshi','Tiwari','Mishra','Chauhan','Yadav','Rawat','Thakur','Bhatia','Menon','Jain','Sinha','Oberoi','Dubey','Pandey','Bansal','Saxena','Agarwal','Malhotra','Kapoor','Roy','Pillai','Bhatt','Khanna','Chopra','Bose','Das','Sen','Mukherjee','Chatterjee','Ghosh','Dutta','Lahiri','Sengupta','Chowdhury','Ganguly','Mitra','Sarkar','Bhattacharya','Rao','Naidu','Rajan','Krishnan','Subramanian','Venkatesh','Hegde','Shetty','Kamath','Kulkarni','Deshpande','Patil','Jog','Phanse','Gokhale','Sathe','Chitale','Wagh','Jadhav','More','Pawar','Shinde','Gaikwad','Chavan','Deshpande','Madhav','Thapar','Sethi','Ahuja','Anand','Bajaj','Dhawan','Garg','Grover','Gulati','Khurana','Luthra','Mangal','Mehra','Mittal','Nagpal','Sachdeva','Tandon','Wadhwa','Arora','Bakshi','Bedi','Chhabra','Dua','Gill','Grewal','Johar','Kalra','Kohli','Madan','Narula','Pahwa','Sahni','Suri','Uppal','Vohra','Walia','Bhalla','Chawla','Dhillon','Handa','Juneja','Kataria','Lamba','Mahajan','Narang','Rana','Sandhu','Trehan','Vij'];

const specialisations = ['Cardiologist','Gastroenterologist','Orthopedist','Dermatologist','Neurologist','Psychiatrist','ENT Specialist','Gynaecologist'];

const locations = ['Sonipat','Delhi NCR','Mumbai','Bangalore','Chennai','Hyderabad','Pune','Kolkata','Jaipur','Ahmedabad','Lucknow','Chandigarh','Kochi','Bhopal','Indore','Nagpur','Patna','Coimbatore','Visakhapatnam','Thiruvananthapuram'];

const areas = {
  'Sonipat': ['Model Town','Gohana Road','Subhash Chowk','Sector 14','Kakroi','Atlas Road','Railway Road','Geeta Colony','Madina Colony','Adarsh Nagar'],
  'Delhi NCR': ['Defence Colony','Rajouri Garden','Greater Kailash','Saket','Dwarka','Pitampura','Vasant Kunj','Lajpat Nagar','Karol Bagh','Rohini','Sector 18 Noida','Sector 62 Noida','DLF Phase 1 Gurugram','Sohna Road Gurugram','Sector 29 Gurugram','Indirapuram Ghaziabad'],
  'Mumbai': ['Andheri West','Bandra','Dadar','Malad','Goregaon','Powai','Thane','Navi Mumbai','Borivali','Juhu'],
  'Bangalore': ['Koramangala','Indiranagar','Whitefield','HSR Layout','Jayanagar','Malleshwaram','Rajajinagar','Electronic City','Yelahanka','Hebbal'],
  'Chennai': ['T. Nagar','Adyar','Anna Nagar','Velachery','Mylapore','Nungambakkam','Porur','Tambaram','OMR','Kilpauk'],
  'Hyderabad': ['Banjara Hills','Jubilee Hills','Madhapur','Kukatpally','Secunderabad','Ameerpet','Gachibowli','Begumpet','Himayatnagar','Mehdipatnam'],
  'Pune': ['Koregaon Park','Viman Nagar','Kothrud','Hinjewadi','Baner','Aundh','Shivajinagar','Hadapsar','Wakad','Kharadi'],
  'Kolkata': ['Salt Lake','Park Street','New Town','Ballygunge','Alipore','Dum Dum','Behala','Gariahat','Howrah','Tollygunge'],
  'Jaipur': ['C-Scheme','Vaishali Nagar','Malviya Nagar','Mansarovar','Tonk Road','Raja Park','Bani Park','Sodala','Jagatpura','Sitapura'],
  'Ahmedabad': ['Satellite','Prahlad Nagar','SG Highway','Navrangpura','Vastrapur','Maninagar','Bopal','Bodakdev','Thaltej','Chandkheda'],
  'Lucknow': ['Hazratganj','Gomti Nagar','Aliganj','Indira Nagar','Mahanagar','Alambagh','Chinhat','Rajajipuram','Vikas Nagar','Jankipuram'],
  'Chandigarh': ['Sector 17','Sector 22','Sector 35','Sector 44','Sector 8','Mohali Phase 5','Mohali Phase 7','Panchkula Sector 9','Zirakpur','Kharar'],
  'Kochi': ['Edappally','Kakkanad','Palarivattom','Kaloor','Panampilly Nagar','Vyttila','Fort Kochi','Aluva','Tripunithura','Kadavanthra'],
  'Bhopal': ['MP Nagar','Arera Colony','Kolar Road','Habibganj','Shahpura','BHEL','Bairagarh','Hoshangabad Road','Awadhpuri','Misrod'],
  'Indore': ['Vijay Nagar','Palasia','Sapna Sangeeta','AB Road','MG Road','Scheme 78','Bhawarkuan','Rau','Super Corridor','Nipania'],
  'Nagpur': ['Dharampeth','Sitabuldi','Sadar','Ramdaspeth','Civil Lines','Pratap Nagar','Manewada','Wardha Road','Hingna','Butibori'],
  'Patna': ['Boring Road','Kankarbagh','Patliputra Colony','Rajendra Nagar','Bailey Road','Ashiana','Anisabad','Danapur','Khajpura','Naubatpur'],
  'Coimbatore': ['RS Puram','Gandhipuram','Peelamedu','Saibaba Colony','Race Course','Singanallur','Ganapathy','Thudiyalur','Kuniyamuthur','Vadavalli'],
  'Visakhapatnam': ['Dwaraka Nagar','MVP Colony','Madhurawada','Seethammadhara','Gajuwaka','Rushikonda','Akkayyapalem','NAD Junction','Pendurthi','Simhachalam'],
  'Thiruvananthapuram': ['Kowdiar','Pattom','Vazhuthacaud','Kesavadasapuram','Ulloor','Kazhakkoottam','Sreekaryam','Vellayambalam','Thycaud','Palayam'],
};

const clinicPrefixes = {
  'Cardiologist': ['HeartCare','CardioPlus','PulsePoint','HeartLine','CardioVita','HeartBeat','VitalHeart','CardioWell','HeartFirst','PulseWell'],
  'Gastroenterologist': ['DigestWell','GastroPlus','GutHealth','LiverCare','GastroCare','DigestFirst','AbdoWell','GastroLine','StomachCare','EnteroCare'],
  'Orthopedist': ['BonePlus','JointFlex','OrthoFirst','SpineCare','BoneWell','JointCare','OrthoVita','FlexiJoint','BoneHealth','OrthoLine'],
  'Dermatologist': ['SkinFirst','DermaCare','SkinPlus','GlowDerm','SkinWell','DermaVita','SkinLine','ClearSkin','DermaPlus','SkinHealth'],
  'Neurologist': ['NeuroLife','BrainHealth','NeuroPlus','NeuroCare','MindFirst','NeuroWell','BrainCare','NeuroVita','NerveWell','NeuroLine'],
  'Psychiatrist': ['MindWell','PsychCare','MindFirst','CalmMind','MindPlus','PsychWell','TherapyFirst','MindLine','PsychVita','InnerWell'],
  'ENT Specialist': ['ClearENT','ENTCare','ENTPlus','HearWell','ENTFirst','SoundCare','ENTVita','HearFirst','ENTLine','VoiceCare'],
  'Gynaecologist': ['WomenFirst','GynoCare','MotherCare','FemWell','GynoPlus','WomenWell','FertiCare','GynoVita','WomenHealth','GynoLine'],
};
const clinicSuffixes = ['Clinic','Centre','Hospital','Polyclinic','Medical Centre','Specialty Clinic','Health Centre','Care Centre'];

const colleges = ['AIIMS Delhi','PGI Chandigarh','JIPMER Puducherry','CMC Vellore','KEM Mumbai','NIMHANS Bangalore','BHU Varanasi','Safdarjung Hospital','Lady Hardinge Medical College','Maulana Azad Medical College','Grant Medical College Mumbai','SMS Medical College Jaipur','KGMU Lucknow','Osmania Medical College','Madras Medical College','Seth GS Medical College','Stanley Medical College','BJMC Pune','GMCH Chandigarh','Armed Forces Medical College','Kasturba Medical College','St. Johns Medical College','JSS Medical College','Manipal Academy'];

const bioTemplates = [
  (n,s,y,c) => `${n} is a ${s.toLowerCase()} with ${y} years of clinical experience. Trained at ${c}, they are known for their thorough diagnostic approach and commitment to evidence-based practice.`,
  (n,s,y,c) => `${n} is a senior ${s.toLowerCase()} with ${y} years of practice. After completing advanced training at ${c}, they have treated thousands of patients and are recognised for their clinical expertise.`,
  (n,s,y,c) => `${n} specialises in ${s.toLowerCase().replace('ist','y').replace('ian','')} with ${y} years of experience. A graduate of ${c}, they focus on patient education and preventive care.`,
  (n,s,y,c) => `With ${y} years in ${s.toLowerCase().replace('ist','y').replace('ian','')}, ${n} is a trusted specialist. Trained at ${c}, they combine modern techniques with a compassionate bedside manner.`,
  (n,s,y,c) => `${n} has been practising as a ${s.toLowerCase()} for ${y} years. They completed their specialisation at ${c} and are dedicated to providing accessible, high-quality healthcare.`,
];

const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

// Lighter slot generator — only 5 days to reduce memory
const generateLightSlots = (seed) => {
  const rng = seededRandom(seed);
  const startOffset = Math.floor(rng() * 3) + 1;
  const slots = [];
  for (let i = startOffset; i < startOffset + 7; i++) {
    const d = addDays(today, i);
    if (d.getDay() === 0) continue;
    const times = d.getDay() === 6
      ? ['10:00','10:30','11:00']
      : ['09:00','10:00','11:00','14:00','15:00','16:00'].filter(() => rng() > 0.3);
    if (times.length > 0) slots.push({ date: fmt(d), times });
  }
  return slots;
};

export function generateDoctors(count = 1050) {
  const rng = seededRandom(42);
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];
  const roundTo1 = (n) => Math.round(n * 10) / 10;

  const generated = [];
  const usedNames = new Set();

  for (let i = 0; i < count; i++) {
    const isFemale = rng() > 0.5;
    let firstName, lastName, fullName;
    // Ensure unique names
    let attempts = 0;
    do {
      firstName = isFemale ? pick(femaleFirst) : pick(maleFirst);
      lastName = pick(lastNames);
      fullName = `Dr. ${firstName} ${lastName}`;
      attempts++;
    } while (usedNames.has(fullName) && attempts < 20);
    if (usedNames.has(fullName)) fullName = `Dr. ${firstName} ${lastName} ${pick(['I','II','Jr'])}`;
    usedNames.add(fullName);

    const spec = pick(specialisations);
    const loc = pick(locations);
    const area = pick(areas[loc] || ['Main Road']);
    const clinicPrefix = pick(clinicPrefixes[spec]);
    const clinicSuffix = pick(clinicSuffixes);
    const clinicName = `${clinicPrefix} ${clinicSuffix}`;

    const baseRating = 3.2 + rng() * 1.8;
    const spread = () => roundTo1(Math.max(2.5, Math.min(5.0, baseRating + (rng() - 0.5) * 0.8)));
    const ratings = { hygiene: spread(), qualification: spread(), communication: spread(), waitTime: spread(), outcomes: spread() };
    const overallRating = roundTo1((ratings.hygiene + ratings.qualification + ratings.communication + ratings.waitTime + ratings.outcomes) / 5);

    const years = Math.floor(rng() * 25) + 3;
    const college = pick(colleges);
    const bioFn = pick(bioTemplates);
    const bio = bioFn(fullName, spec, years, college);

    const phoneBase = 91000 + Math.floor(rng() * 9000);
    const phoneSuffix = 10000 + Math.floor(rng() * 90000);

    generated.push({
      id: `doc-${String(100 + i).padStart(4, '0')}`,
      name: fullName,
      specialisation: spec,
      clinicName,
      location: loc,
      address: `${Math.floor(rng() * 200) + 1}, ${area}, ${loc}`,
      phone: `+91 ${phoneBase} ${phoneSuffix}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@healthid.in`,
      acceptingPatients: rng() > 0.15,
      overallRating,
      ratings,
      evaluationCount: Math.floor(rng() * 20) + 3,
      verified: true,
      bio,
      availableSlots: generateLightSlots(42 + i),
    });
  }

  return generated;
}
