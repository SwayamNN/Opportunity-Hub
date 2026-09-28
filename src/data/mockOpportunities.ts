import { Opportunity } from '../types/opportunity';

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Global Autonomous AI Agents Hackathon 2026',
    organization: 'OpenAI Dev Collective & Stanford AI',
    orgInitials: 'OA',
    orgColor: 'from-emerald-500 to-teal-700',
    category: 'Hackathon',
    domain: 'AI / Machine Learning',
    tags: ['Autonomous Agents', 'LLM Architectures', 'Multimodal', 'PyTorch'],
    deadline: '2026-09-29', // 2 days left (Closing very soon!)
    mode: 'Remote',
    location: 'Global (Virtual)',
    stipendOrPrize: '$75,000 Prize Pool',
    hasFinancialReward: true,
    shortDescription: 'Build next-generation multi-agent collaborative systems using frontier reasoning models. Top 3 teams receive direct Y-Combinator interview fast-tracks.',
    fullDescription: 'The Global Autonomous AI Agents Hackathon invites student researchers and builders to design robust, self-directed agents capable of complex problem decomposition, tool use, and cross-agent consensus. Hosted jointly by university AI clubs and frontier labs, this 48-hour sprint emphasizes code correctness, sandboxed safety, and real-world deployment efficiency.',
    eligibility: [
      'Currently enrolled undergraduate, master\'s, or doctoral students',
      'Teams of 1 to 4 members permitted',
      'Prior experience with Python, API integration, and prompt/weights evaluation',
      'Open to students globally with verified university email (.edu, .ac, etc.)'
    ],
    tracks: [
      'Multi-Agent Coordination & Consensus Protocols',
      'Autonomous Code Generation & Self-Healing CI/CD',
      'Multimodal Sensor Reasoning in Robotics',
      'AI Safety & Sandboxed Alignment Verifiers'
    ],
    timeline: [
      { phase: 'Team Registration Deadline', date: 'Sept 29, 2026', description: 'Form submissions lock at 23:59 UTC.' },
      { phase: 'Opening Keynote & API Release', date: 'Oct 02, 2026', description: 'Compute grants and model credits dispatched.' },
      { phase: 'Final Demo Submissions', date: 'Oct 04, 2026', description: 'GitHub repo and 3-minute video pitch deadline.' },
      { phase: 'Winners Announced', date: 'Oct 08, 2026', description: 'Virtual awards gala with guest judges.' }
    ],
    perks: [
      '$75,000 total cash prize distribution across 5 tracks',
      '$2,500 in cloud compute credits per accepted team',
      'Fast-track interviews for summer 2027 AI research residencies',
      'Exclusive 1:1 mentorship from Stanford & industry researchers'
    ],
    applyUrl: 'https://autonomous-ai.hackerearth.com',
    featured: true,
    closingUrgent: true,
    postedDate: '2026-09-01',
    applicantsCount: 842,
    contactEmail: 'organizers@agentic-hack.org'
  },
  {
    id: 'opp-2',
    title: 'Cadence VLSI & ASIC Physical Design Fellowship',
    organization: 'Cadence Design Systems',
    orgInitials: 'CD',
    orgColor: 'from-amber-500 to-orange-700',
    category: 'Fellowship',
    domain: 'Electronics / VLSI',
    tags: ['Verilog/SystemVerilog', 'ASIC Flow', 'Timing Closure', 'Silicon 3nm'],
    deadline: '2026-10-02', // 5 days left (Closing soon)
    mode: 'Hybrid',
    location: 'San Jose, CA & Bengaluru, India',
    stipendOrPrize: '$8,500/mo + Housing Allowance',
    hasFinancialReward: true,
    shortDescription: '6-month intensive research fellowship focusing on next-generation EDA automation, 2nm gate-all-around layout synthesis, and physical verification.',
    fullDescription: 'Selected fellows work directly alongside principal silicon architects at Cadence. You will contribute to core timing analysis engines, AI-driven place-and-route heuristics, and custom cell library characterization for high-performance computing clusters.',
    eligibility: [
      'Junior/Senior Undergrads or Graduate students in EE, ECE, or Computer Engineering',
      'Strong coursework in Digital IC Design, Computer Architecture, and VLSI Physical Design',
      'Proficiency in Verilog/SystemVerilog and Python/Tcl scripting',
      'Demonstrated lab projects in RTL-to-GDSII flows or FPGA prototyping'
    ],
    tracks: [
      'AI/ML for Static Timing Analysis (STA)',
      'Sub-2nm Parasitic Extraction Heuristics',
      'Power Grid Synthesis and Thermal Integrity',
      '3D-IC and Chiplet Interconnect Verification'
    ],
    timeline: [
      { phase: 'Application & Portfolio Review', date: 'Oct 02, 2026', description: 'Submit resume, transcripts, and RTL GitHub samples.' },
      { phase: 'Technical Assessment', date: 'Oct 10, 2026', description: 'Silicon architecture and digital timing challenge.' },
      { phase: 'Panel Interview', date: 'Oct 20, 2026', description: 'Deep-dive discussion with CAD software managers.' },
      { phase: 'Fellowship Kickoff', date: 'Jan 11, 2027', description: 'Full-time funded spring/summer term.' }
    ],
    perks: [
      '$8,500/month stipend plus relocation/housing stipend',
      'Direct access to industry-standard Innovus and Tempus toolchains',
      'Opportunity to co-author papers for DAC and ICCAD 2027',
      'High conversion rate to full-time Principal IC Design Engineer offers'
    ],
    applyUrl: 'https://cadence.com/careers/university-fellowships',
    featured: true,
    closingUrgent: true,
    postedDate: '2026-08-20',
    applicantsCount: 412,
    contactEmail: 'university_relations@cadence.com'
  },
  {
    id: 'opp-3',
    title: 'Google Summer of Code (GSoC) Open Source Mentorship',
    organization: 'Open Source Initiative & Google',
    orgInitials: 'GS',
    orgColor: 'from-blue-500 to-indigo-600',
    category: 'Internship',
    domain: 'Open Source',
    tags: ['Open Source', 'Distributed Systems', 'Linux Kernel', 'Rust/C++'],
    deadline: '2026-10-05', // 8 days left
    mode: 'Remote',
    location: 'Worldwide (Fully Remote)',
    stipendOrPrize: '$3,000 - $6,600 Tiered Stipend',
    hasFinancialReward: true,
    shortDescription: 'Spend 12 to 22 weeks writing production code for world-changing open source organizations like Linux Foundation, Apache, Blender, and Chromium.',
    fullDescription: 'Google Summer of Code brings student contributors into open source software organizations. Contributors work on 175-hour or 350-hour programming projects under the guidance of experienced mentors. It is one of the most recognized engineering credentials worldwide for software and systems undergraduates.',
    eligibility: [
      'Must be 18 years or older at the time of registration',
      'Enrolled student or new contributor to open source projects',
      'Comfortable with Git workflows, issue trackers, and code reviews',
      'Able to commit 15-30 hours per week during the project window'
    ],
    tracks: [
      'Systems Programming & Operating System Kernels',
      'Web Standards, Browsers & Compiler Toolchains',
      'Scientific Computing & Data Visualization',
      'Decentralized Networking & Security Protocols'
    ],
    timeline: [
      { phase: 'Proposal Window Opens', date: 'Sept 15, 2026', description: 'Draft proposals submitted to host organizations.' },
      { phase: 'Proposal Deadline', date: 'Oct 05, 2026', description: 'Hard cutoff for finalized project plans.' },
      { phase: 'Accepted Contributors Announced', date: 'Oct 26, 2026', description: 'Official roster published.' },
      { phase: 'Coding Phase Kickoff', date: 'Nov 02, 2026', description: 'Community bonding and sprint development.' }
    ],
    perks: [
      'Competitive stipend adjusted to local purchasing power',
      'Globally verified Google OSS Contributor Certificate',
      'Lifelong network of senior maintainers and engineering leaders',
      'Direct pipeline to interviews at premier cloud and infrastructure companies'
    ],
    applyUrl: 'https://summerofcode.withgoogle.com',
    featured: true,
    closingUrgent: false,
    postedDate: '2026-08-15',
    applicantsCount: 3200,
    contactEmail: 'gsoc-support@google.com'
  },
  {
    id: 'opp-4',
    title: 'Texas Instruments Analog & Embedded Innovation Challenge',
    organization: 'Texas Instruments University Program',
    orgInitials: 'TI',
    orgColor: 'from-rose-500 to-red-700',
    category: 'Competition',
    domain: 'Hardware & Embedded',
    tags: ['MSP430', 'Analog Circuits', 'IoT Sensing', 'PCB Design'],
    deadline: '2026-10-12',
    mode: 'Hybrid',
    location: 'Dallas, TX & Regional Hubs',
    stipendOrPrize: '$30,000 Grand Prize + Hardware Kits',
    hasFinancialReward: true,
    shortDescription: 'National design challenge challenging student teams to invent smart embedded hardware solutions using TI MSPM0 and wireless microcontrollers.',
    fullDescription: 'The TI Innovation Challenge is a premier hardware engineering contest. Teams of up to 4 students receive complimentary hardware development boards and analog evaluation modules to prototype transformative solutions in smart healthcare, industrial automation, or renewable energy management.',
    eligibility: [
      'Undergraduate or graduate engineering students',
      'Projects must utilize at least two TI analog ICs or microcontrollers',
      'Complete hardware prototype required for final phase demonstration',
      'Faculty advisor endorsement required'
    ],
    tracks: [
      'Smart Agriculture & Remote Environmental Monitoring',
      'Wearable Bio-Medical Diagnostic Instruments',
      'High-Efficiency Power Inverters for Clean Energy',
      'Edge Robotics & Real-Time Motor Control'
    ],
    timeline: [
      { phase: 'Abstract & System Proposal', date: 'Oct 12, 2026', description: 'Submit schematic concepts and component lists.' },
      { phase: 'Hardware Kit Dispatch', date: 'Oct 25, 2026', description: 'Approved teams receive dev boards.' },
      { phase: 'Working Video & Report Due', date: 'Dec 05, 2026', description: 'Functional demo evaluation.' },
      { phase: 'Finals Demo Day in Dallas', date: 'Jan 22, 2027', description: 'Live presentation to TI technical fellows.' }
    ],
    perks: [
      'Over $50,000 in total prizes, travel grants, and hardware allowances',
      'Free LaunchPad evaluation kits and sample analog silicon',
      'Direct interview invitations for hardware applications engineering roles',
      'IEEE Student Branch recognition'
    ],
    applyUrl: 'https://ti.com/university/challenge',
    featured: false,
    closingUrgent: false,
    postedDate: '2026-09-10',
    applicantsCount: 520,
    contactEmail: 'ti_contest@ti.com'
  },
  {
    id: 'opp-5',
    title: 'Jane Street Capital Quantitative Trading & Software Fellowship',
    organization: 'Jane Street Capital',
    orgInitials: 'JS',
    orgColor: 'from-sky-500 to-cyan-700',
    category: 'Fellowship',
    domain: 'Software Engineering',
    tags: ['OCaml', 'Low-Latency Systems', 'Algorithms', 'High Frequency'],
    deadline: '2026-10-01', // 4 days left! (Urgent)
    mode: 'On-Site',
    location: 'New York, NY (All Expenses Paid)',
    stipendOrPrize: '$14,000/mo + Luxury Housing',
    hasFinancialReward: true,
    shortDescription: 'Immersive winter/spring fellowship exploring functional programming in OCaml, market microstructure, and high-throughput distributed systems.',
    fullDescription: 'Jane Street is a quantitative trading firm with a unique focus on technology and collaborative problem solving. Fellows spend their term working with production trading software, learning advanced functional programming patterns, and simulating complex risk strategies under real market dynamics.',
    eligibility: [
      'Current undergraduate or master\'s students graduating in 2027 or 2028',
      'Deep aptitude for algorithms, discrete mathematics, or functional languages',
      'No prior financial knowledge required; curious problem solvers strongly encouraged',
      'Strong analytical reasoning and collaborative mindset'
    ],
    tracks: [
      'Core Low-Latency Exchange Infrastructure',
      'Quantitative Strategy & Predictive Modeling',
      'Hardware Acceleration with FPGAs',
      'Compiler Optimizations for Functional Languages'
    ],
    timeline: [
      { phase: 'Resume & Problem Submission', date: 'Oct 01, 2026', description: 'Screening applications close.' },
      { phase: 'Online Estimations & Logic Quiz', date: 'Oct 08, 2026', description: 'Quantitative puzzle challenge.' },
      { phase: 'Virtual Technical Rounds', date: 'Oct 18, 2026', description: 'Interactive algorithm and systems interviews.' },
      { phase: 'Offers Finalized', date: 'Nov 05, 2026', description: 'Fellowship placements confirmed.' }
    ],
    perks: [
      'Industry-leading compensation of $14,000/month prorated',
      'Fully paid luxury housing in downtown Manhattan',
      'Roundtrip flights and full catered gourmet dining',
      '1:1 mentorship from senior OCaml core contributors'
    ],
    applyUrl: 'https://janestreet.com/join-jane-street/programs-and-fellowships',
    featured: true,
    closingUrgent: true,
    postedDate: '2026-08-25',
    applicantsCount: 1450,
    contactEmail: 'fellowships@janestreet.com'
  },
  {
    id: 'opp-6',
    title: 'Grace Hopper Celebration Student Research Scholarship',
    organization: 'AnitaB.org & Tech Partner Coalition',
    orgInitials: 'GH',
    orgColor: 'from-purple-500 to-indigo-700',
    category: 'Scholarship',
    domain: 'Research & Academics',
    tags: ['Diversity in Tech', 'Research Grants', 'Career Fair', 'Travel Stipend'],
    deadline: '2026-10-15',
    mode: 'Hybrid',
    location: 'Orlando, FL & Virtual Access',
    stipendOrPrize: '$2,500 Travel Grant + Registration ($1,200 val)',
    hasFinancialReward: true,
    shortDescription: 'Full sponsorship to attend the world\'s largest conference for women and non-binary technologists, including networking with 300+ Fortune 500 recruiters.',
    fullDescription: 'The GHC Student Scholarship supports aspiring women and gender-expansive technologists in completing their undergraduate and graduate degrees. Scholars receive full conference registration, roundtrip domestic travel accommodations, hotel stipends, and VIP admission to private company networking dinners.',
    eligibility: [
      'Undergraduate or graduate students identifying as women, non-binary, or gender fluid',
      'Enrolled in an accredited computer science, electrical engineering, or STEM degree',
      'Active involvement in campus community, hackathons, or research',
      'Minimum GPA of 3.0 / 4.0 or equivalent academic standing'
    ],
    tracks: [
      'Student Research Poster Session',
      'Career Fair Fast-Track Admissions',
      'Leadership & Entrepreneurship Track',
      'Open Source Day Hack Sprint'
    ],
    timeline: [
      { phase: 'Scholarship Applications Close', date: 'Oct 15, 2026', description: 'Essay and recommendation letters due.' },
      { phase: 'Selection Committee Deliberation', date: 'Nov 05, 2026', description: 'Review by panel of senior technologists.' },
      { phase: 'Recipients Notified', date: 'Nov 20, 2026', description: 'Travel arrangements scheduled.' },
      { phase: 'Conference Attendance', date: 'Feb 15, 2027', description: 'On-site experience in Orlando.' }
    ],
    perks: [
      'Full conference pass ($1,200 value) included',
      '$2,500 lump-sum travel and lodging grant',
      'Private 1:1 resume critique with tech executives',
      'Access to exclusive GHC scholar database shared with top tech recruiters'
    ],
    applyUrl: 'https://ghc.anitab.org/student-scholarships',
    featured: false,
    closingUrgent: false,
    postedDate: '2026-09-05',
    applicantsCount: 2100,
    contactEmail: 'ghcscholarships@anitab.org'
  },
  {
    id: 'opp-7',
    title: 'DEF CON Collegiate Cybersecurity & CTF Invitational',
    organization: 'DEF CON Security Foundation',
    orgInitials: 'DC',
    orgColor: 'from-zinc-600 to-slate-900',
    category: 'Competition',
    domain: 'Cybersecurity',
    tags: ['Reverse Engineering', 'Binary Exploitation', 'Cryptography', 'Pwn'],
    deadline: '2026-10-03', // 6 days left (Closing soon!)
    mode: 'Remote',
    location: 'Online Qualifier / Las Vegas Finals',
    stipendOrPrize: '$20,000 + Black Badge Entry',
    hasFinancialReward: true,
    shortDescription: 'Premier offensive and defensive cybersecurity CTF tournament. Top 8 collegiate squads earn funded travel to compete live in Las Vegas.',
    fullDescription: 'The DEF CON Collegiate Invitational tests collegiate security teams in binary vulnerability hunting, zero-day patching, web exploitation, and hardware reverse engineering. Qualifying rounds run continuously for 36 hours in a high-intensity Jeopardy format.',
    eligibility: [
      'Undergraduate or graduate university CTF clubs',
      'Teams composed strictly of 4 registered students',
      'No professional security auditors permitted on student roster',
      'Honorable adherence to fair play ethical hacking guidelines'
    ],
    tracks: [
      'Linux & Windows Kernel Exploitation',
      'Zero-Knowledge Cryptography & Side-Channel Attacks',
      'Firmware & Hardware Glitching (JTAG / SPI)',
      'Autonomous Attack-and-Defense Defense Scripting'
    ],
    timeline: [
      { phase: 'Team Registration Locks', date: 'Oct 03, 2026', description: 'Public team rosters lock.' },
      { phase: '36-Hour Online Qualifier', date: 'Oct 10, 2026', description: 'Global scoring scoreboard live.' },
      { phase: 'Top 8 Finalists Announced', date: 'Oct 15, 2026', description: 'Verification of writeups.' },
      { phase: 'Las Vegas Live Finals', date: 'Dec 04, 2026', description: 'Air-gapped on-site competition.' }
    ],
    perks: [
      'Legendary DEF CON Black Badges (lifetime free entry) for winning team',
      '$20,000 prize distribution sponsored by cloud security vendors',
      'Direct interview opportunities with leading red-teams and intelligence labs',
      'All travel and hotel expenses covered for Las Vegas finalists'
    ],
    applyUrl: 'https://defcon-collegiate.org/register',
    featured: false,
    closingUrgent: true,
    postedDate: '2026-09-12',
    applicantsCount: 680,
    contactEmail: 'ctf-leads@defcon-collegiate.org'
  },
  {
    id: 'opp-8',
    title: 'Qualcomm Snapdragon Edge AI & Robotics Internship (Summer 2027)',
    organization: 'Qualcomm Technologies',
    orgInitials: 'QC',
    orgColor: 'from-blue-600 to-blue-950',
    category: 'Internship',
    domain: 'Electronics / VLSI',
    tags: ['NPU Acceleration', 'C/C++', 'Edge AI', 'Computer Vision', 'ARM'],
    deadline: '2026-10-25',
    mode: 'Hybrid',
    location: 'San Diego, CA (On-campus & Hybrid)',
    stipendOrPrize: '$9,200/mo + Corporate Housing',
    hasFinancialReward: true,
    shortDescription: 'Optimize deep neural network inference on Qualcomm Hexagon NPU silicon. Work on real-time computer vision for drones, smart vehicles, and XR headsets.',
    fullDescription: 'As a Qualcomm Silicon & AI Systems Intern, you will bridge the gap between high-level machine learning models and dedicated mobile hardware accelerators. You will profile model execution, build custom operator kernels in C++, and minimize milliwatt power consumption for next-generation Snapdragon platforms.',
    eligibility: [
      'Enrolled in BS, MS, or PhD in Computer Engineering, Electrical Engineering, or CS',
      'Proficiency in C, C++, and hardware performance debugging',
      'Familiarity with neural network quantization (INT8, FP4) and tensor compilers',
      'Graduation date between December 2027 and June 2028'
    ],
    tracks: [
      'Hexagon NPU Compiler Optimizations',
      'Real-Time Spatial Computing & SLAM on Edge Devices',
      'Ultra Low-Power Audio & Keyword Spotting Hardware',
      'Transformer Architecture Acceleration on Mobile SoCs'
    ],
    timeline: [
      { phase: 'First Round Application Deadline', date: 'Oct 25, 2026', description: 'Early candidate priority review.' },
      { phase: 'Coding Assessment', date: 'Nov 05, 2026', description: 'C++ systems and algorithms challenge.' },
      { phase: 'Managerial Technical Loop', date: 'Nov 20, 2026', description: 'Architecture design and profiling review.' },
      { phase: 'Summer 2027 Term', date: 'May 24, 2027', description: '12-week internship in sunny San Diego.' }
    ],
    perks: [
      'Top-tier compensation of $9,200/month',
      'Fully furnished corporate apartment or generous housing stipend',
      'Relocation flights and daily transport shuttle pass',
      'High conversion to full-time return offers upon graduation'
    ],
    applyUrl: 'https://qualcomm.com/company/careers/students',
    featured: true,
    closingUrgent: false,
    postedDate: '2026-09-15',
    applicantsCount: 1100,
    contactEmail: 'internships@qualcomm.com'
  },
  {
    id: 'opp-9',
    title: 'Hugging Face Open Source AI Research Residency',
    organization: 'Hugging Face Labs',
    orgInitials: 'HF',
    orgColor: 'from-amber-400 to-yellow-600',
    category: 'Fellowship',
    domain: 'AI / Machine Learning',
    tags: ['Transformers', 'Open Models', 'Diffusers', 'Python', 'Evaluation'],
    deadline: '2026-10-18',
    mode: 'Remote',
    location: 'Remote (Anywhere in World)',
    stipendOrPrize: '$7,000/mo + H100 GPU Clusters',
    hasFinancialReward: true,
    shortDescription: 'Fully funded 6-month research residency contributing to state-of-the-art open source generative models, datasets, and benchmark evaluation suites.',
    fullDescription: 'Hugging Face believes in open, collaborative, and democratized AI. During this residency, you will collaborate with lead researchers behind Transformers, Diffusers, and TRL. You will have dedicated access to multi-node H100 compute to train, evaluate, and open-source models for the global developer ecosystem.',
    eligibility: [
      'Student or early-career researcher with a passion for open-access science',
      'Strong PyTorch coding skills and experience training vision or language models',
      'Demonstrated GitHub contributions or preprints on arXiv',
      'Commitment to open-sourcing all research artifacts, weights, and code'
    ],
    tracks: [
      'Efficient Post-Training & RL from Human Feedback (RLHF)',
      'Synthetic Data Generation & Filtering Quality Pipelines',
      'Small Language Models (SLMs) for On-Device Inference',
      'Multimodal Audio & Video Representation Learning'
    ],
    timeline: [
      { phase: 'Applications Close', date: 'Oct 18, 2026', description: 'Submit proposal and Hugging Face profile.' },
      { phase: 'Peer Code Review', date: 'Nov 02, 2026', description: 'Evaluation of public code and contributions.' },
      { phase: 'Interview with Research Leads', date: 'Nov 15, 2026', description: 'Discussion of project scope and goals.' },
      { phase: 'Residency Starts', date: 'Jan 04, 2027', description: 'Compute allocated and research commences.' }
    ],
    perks: [
      '$7,000 monthly living stipend',
      'Dedicated allocation of 8x H100 GPU nodes for your research project',
      'Full conference travel funding to present papers at NeurIPS / ICML',
      'Direct co-authorship with recognized AI pioneers'
    ],
    applyUrl: 'https://huggingface.co/fellowships',
    featured: true,
    closingUrgent: false,
    postedDate: '2026-09-08',
    applicantsCount: 950,
    contactEmail: 'fellows@huggingface.co'
  },
  {
    id: 'opp-10',
    title: 'MIT HackMIT 2026: Hardware & Software Hackathon',
    organization: 'Massachusetts Institute of Technology',
    orgInitials: 'MIT',
    orgColor: 'from-red-600 to-rose-900',
    category: 'Hackathon',
    domain: 'Software Engineering',
    tags: ['Web Development', 'Robotics', 'Climate Tech', 'FinTech', 'Hardware Lab'],
    deadline: '2026-09-30', // 3 days left (Closing very soon!)
    mode: 'On-Site',
    location: 'Cambridge, MA (Travel Reimbursements available)',
    stipendOrPrize: '$45,000 Prizes & Sponsor Bounties',
    hasFinancialReward: true,
    shortDescription: 'One of the most storied collegiate hackathons in the world. 1,000 top student engineers descend on MIT campus for 36 hours of relentless creation.',
    fullDescription: 'HackMIT is MIT\'s premier collegiate hackathon. Whether building cutting-edge full-stack web platforms, hacking embedded circuits in our dedicated hardware lab, or leveraging sponsor APIs from top tech giants, participants have access to laser cutters, soldering stations, VR headsets, and top tier mentors.',
    eligibility: [
      'Undergraduate students currently enrolled at any accredited university',
      'Beginners to hackathon veterans welcome (dedicated beginner track)',
      'Teams of 1 to 4 students',
      'Proof of enrollment required at check-in'
    ],
    tracks: [
      'Generative AI in Urban Infrastructure',
      'Hardware Prototyping & Assistive Tech',
      'Decentralized Identity & Security',
      'Biomedical Engineering & Health Informatics'
    ],
    timeline: [
      { phase: 'Travel Grant & Hacker Registration Closes', date: 'Sept 30, 2026', description: 'Late applications will not be accepted.' },
      { phase: 'Admissions Decisions', date: 'Oct 04, 2026', description: 'Invitations and travel stipends dispatched.' },
      { phase: 'HackMIT Weekend', date: 'Oct 16-18, 2026', description: '36 hours of hacking at the MIT Johnson Center.' },
      { phase: 'Judging & Project Fair', date: 'Oct 18, 2026', description: 'Keynote and trophy presentations.' }
    ],
    perks: [
      'Tiered travel reimbursements up to $400 for out-of-state students',
      'Free meals, swag bags, and access to hardware equipment lab',
      'Direct access to sponsors including Bloomberg, Google, Palantir, and Jane Street',
      '$45,000 in cash awards and specialized hardware giveaways'
    ],
    applyUrl: 'https://hackmit.org/apply',
    featured: true,
    closingUrgent: true,
    postedDate: '2026-09-02',
    applicantsCount: 2800,
    contactEmail: 'help@hackmit.org'
  },
  {
    id: 'opp-11',
    title: 'Generation Google STEM Scholarship (North America & APAC)',
    organization: 'Google Diversity Programs',
    orgInitials: 'GG',
    orgColor: 'from-emerald-600 to-green-800',
    category: 'Scholarship',
    domain: 'Software Engineering',
    tags: ['Scholarship', 'Tuition Grant', 'Mentorship', 'Community Leadership'],
    deadline: '2026-11-10',
    mode: 'Remote',
    location: 'North America / APAC Regions',
    stipendOrPrize: '$10,000 USD Academic Award',
    hasFinancialReward: true,
    shortDescription: '$10,000 merit and leadership scholarship for aspiring computer scientists committed to diversity, equity, and inclusion in tech.',
    fullDescription: 'The Generation Google Scholarship was established to help aspiring computer scientists excel in technology and become active leaders in the field. Selected scholars receive a $10,000 award for the 2027 academic year, along with access to Google\'s annual virtual student retreat and career coaching.',
    eligibility: [
      'Currently enrolled full-time undergraduate student in CS, Computer Engineering, or related field',
      'Strong academic record and demonstrated passion for technology',
      'Demonstrated leadership and commitment to addressing diversity barriers',
      'Continuing studies for the 2027-2028 academic year'
    ],
    tracks: [
      'General Computer Science Track',
      'Engineering for Social Good',
      'Underrepresented Minorities in Computing'
    ],
    timeline: [
      { phase: 'Application Deadline', date: 'Nov 10, 2026', description: 'Essay responses and resume upload cutoff.' },
      { phase: 'Applicant Coding Assessment', date: 'Dec 01, 2026', description: 'General software design exercise.' },
      { phase: 'Recipients Announced', date: 'Jan 25, 2027', description: 'Awards disbursed directly to universities.' }
    ],
    perks: [
      '$10,000 grant disbursed toward tuition, books, and living expenses',
      'Invitation to the private Google Scholar Virtual Summit',
      'Direct connect with Google recruiters for summer internship loops',
      'Ongoing alumni mentorship circle with Google senior software engineers'
    ],
    applyUrl: 'https://buildyourfuture.withgoogle.com/scholarships',
    featured: false,
    closingUrgent: false,
    postedDate: '2026-09-18',
    applicantsCount: 4200,
    contactEmail: 'generationgoogle@google.com'
  },
  {
    id: 'opp-12',
    title: 'Linux Foundation Kernel Mentorship Program',
    organization: 'The Linux Foundation',
    orgInitials: 'LF',
    orgColor: 'from-amber-600 to-stone-800',
    category: 'Internship',
    domain: 'Open Source',
    tags: ['Kernel', 'C Programming', 'Device Drivers', 'eBPF', 'Rust-for-Linux'],
    deadline: '2026-10-08',
    mode: 'Remote',
    location: 'Global (Remote)',
    stipendOrPrize: '$6,000 Stipend + Hardware Kit',
    hasFinancialReward: true,
    shortDescription: 'Pair 1-on-1 with an upstream Linux kernel maintainer. Write and merge actual patches into Linus Torvalds\' main tree.',
    fullDescription: 'The Linux Foundation Mentorship Program gives developers the opportunity to learn, inspect, and contribute directly to open source projects that power modern cloud computing, mobile devices, and supercomputers. Mentees learn patch etiquette, mailing list communication, and rigorous subsystem testing.',
    eligibility: [
      'At least 18 years of age and eligible to receive payment in your jurisdiction',
      'Demonstrated understanding of C programming, memory management, and pointers',
      'Basic familiarity with git, building the Linux kernel from source, and QEMU',
      'Available for 20 hours/week during the 12-week program'
    ],
    tracks: [
      'eBPF Tracing & Observability Infrastructure',
      'Rust in the Linux Kernel Drivers',
      'RISC-V Architecture Porting & Memory Barriers',
      'PCIe Subsystem Testing and Virtualization'
    ],
    timeline: [
      { phase: 'Mentee Application Cutoff', date: 'Oct 08, 2026', description: 'Submit patch task and statement of intent.' },
      { phase: 'Maintainer Interviews', date: 'Oct 20, 2026', description: 'Review of prerequisite patch submission.' },
      { phase: 'Mentorship Sprint Starts', date: 'Nov 02, 2026', description: 'Direct maintainer collaboration begins.' }
    ],
    perks: [
      '$6,000 USD stipend upon milestone completion',
      'Your name forever recorded in the Linux kernel git changelog',
      'Free Linux Foundation certification vouchers (CKA / LFCS, $800 value)',
      'Unmatched credibility when applying for cloud infrastructure and systems engineering positions'
    ],
    applyUrl: 'https://mentorship.lfx.linuxfoundation.org',
    featured: false,
    closingUrgent: false,
    postedDate: '2026-09-14',
    applicantsCount: 780,
    contactEmail: 'mentorship@linuxfoundation.org'
  },
  {
    id: 'opp-13',
    title: 'IEEE Microelectronics & Photonic IC Workshop Series',
    organization: 'IEEE Solid-State Circuits Society',
    orgInitials: 'IE',
    orgColor: 'from-cyan-600 to-blue-800',
    category: 'Workshop',
    domain: 'Electronics / VLSI',
    tags: ['Photonic ICs', 'Silicon Photonics', 'EDA Simulations', 'Hands-on Lab'],
    deadline: '2026-10-14',
    mode: 'Remote',
    location: 'Interactive Virtual Labs',
    stipendOrPrize: 'Free Registration + $500 Certificate Grant',
    hasFinancialReward: true,
    shortDescription: '4-week masterclass on silicon photonics and co-packaged optics for next-generation AI datacenter interconnects, with cloud EDA tool access.',
    fullDescription: 'Join IEEE distinguished lecturers and industry pioneers for an intensive hands-on workshop series. Learn how light is replacing electrical copper traces in ultra-high-speed datacenter backplanes. Participants receive access to cloud optical EDA software to design and simulate a functional optical ring resonator.',
    eligibility: [
      'Undergraduate or graduate engineering students worldwide',
      'Basic understanding of electromagnetic fields and semiconductor physics',
      'No registration fee; attendance is fully sponsored by IEEE SSCS',
      'Completion of all 4 lab exercises required for certificate and micro-grant eligibility'
    ],
    tracks: [
      'Fundamentals of Silicon Waveguides and Ring Resonators',
      'Co-Packaged Optics (CPO) for 800G and 1.6T Transceivers',
      'Optoelectronic Simulation in Lumerical & Synopsys Tools',
      'Packaging and Thermal Management in 3D Heterogeneous Silicon'
    ],
    timeline: [
      { phase: 'Seat Registration Closes', date: 'Oct 14, 2026', description: 'Limited to 250 verified student attendees.' },
      { phase: 'Session 1: Photonic Foundations', date: 'Oct 21, 2026', description: 'Live lecture and tool setup.' },
      { phase: 'Session 4 & Design Showcase', date: 'Nov 11, 2026', description: 'Student simulation presentations.' }
    ],
    perks: [
      'Official IEEE SSCS Certificate of Advanced Competency',
      'Top 10 design simulations receive $500 IEEE Student Grants',
      '30-day full commercial license to optical simulation suites',
      'Direct Q&A with silicon photonics founders and foundry managers'
    ],
    applyUrl: 'https://sscs.ieee.org/education/workshops',
    featured: false,
    closingUrgent: false,
    postedDate: '2026-09-20',
    applicantsCount: 390,
    contactEmail: 'workshops@ieee-sscs.org'
  },
  {
    id: 'opp-14',
    title: 'ACM ICPC Collegiate Programming Regional Championship',
    organization: 'International Collegiate Programming Contest',
    orgInitials: 'IC',
    orgColor: 'from-amber-600 to-red-800',
    category: 'Competition',
    domain: 'Software Engineering',
    tags: ['Competitive Programming', 'Graph Theory', 'Dynamic Programming', 'C++'],
    deadline: '2026-10-04', // 7 days left! (Urgent)
    mode: 'On-Site',
    location: 'Regional University Host Campuses',
    stipendOrPrize: '$15,000 Prizes + World Finals Qualification',
    hasFinancialReward: true,
    shortDescription: 'The oldest, largest, and most prestigious algorithmic programming competition in the world. 3 students, 1 computer, 5 hours, pure algorithmic brilliance.',
    fullDescription: 'The ICPC challenges teams of three students to solve complex, real-world algorithmic problems under grueling time constraints. Teams write ultra-efficient C++, Java, or Python solutions tested against stringent hidden time and memory limits. Regional winners advance to the world championship.',
    eligibility: [
      'Teams must consist of 3 students from the same accredited college/university',
      'Eligibility rules per ICPC criteria (undergraduate or first 2 years of graduate study)',
      'Official university faculty coach required to register the team'
    ],
    tracks: [
      'Advanced Graph Theory & Network Flow',
      'Combinatorial Number Theory & Modular Arithmetic',
      'Computational Geometry & Spatial Trees',
      'String Algorithms & Suffix Automata'
    ],
    timeline: [
      { phase: 'Regional Registration Cutoff', date: 'Oct 04, 2026', description: 'Coach must confirm university roster.' },
      { phase: 'Practice Contest Session', date: 'Oct 23, 2026', description: 'Familiarization with DOMjudge environment.' },
      { phase: '5-Hour Regional Contest', date: 'Oct 24, 2026', description: 'Live scoreboard with balloon delivery.' },
      { phase: 'World Finals Qualifiers Announced', date: 'Oct 26, 2026', description: 'Official certified score tables.' }
    ],
    perks: [
      'Direct ticket to the ICPC World Finals for regional champions',
      'Cash awards and trophies for top 10 university teams',
      'Pre-vetted interview loops with Hudson River Trading, Google, and Meta',
      'Ultimate badge of algorithmic mastery on your engineering resume'
    ],
    applyUrl: 'https://icpc.global/regionals',
    featured: false,
    closingUrgent: true,
    postedDate: '2026-09-06',
    applicantsCount: 1600,
    contactEmail: 'regionals-chair@icpc.global'
  },
  {
    id: 'opp-15',
    title: 'Atlassian Cloud Systems & Infrastructure Internship 2027',
    organization: 'Atlassian Engineering',
    orgInitials: 'AT',
    orgColor: 'from-blue-500 to-indigo-800',
    category: 'Internship',
    domain: 'Software Engineering',
    tags: ['Go / Golang', 'Kubernetes', 'AWS', 'Distributed DBs', 'CI/CD'],
    deadline: '2026-10-30',
    mode: 'Remote',
    location: 'Remote (United States, Canada, Australia, India)',
    stipendOrPrize: '$8,000/mo + Home Office Allowance',
    hasFinancialReward: true,
    shortDescription: 'Build multi-tenant cloud infrastructure powering Jira and Confluence for over 300,000 enterprise organizations worldwide.',
    fullDescription: 'Atlassian is pioneering high-reliability remote-first work. In this 12-week summer internship, you will join our core cloud platform team. You will write Go services, optimize Postgres database sharding, design auto-scaling Kubernetes controllers, and implement resilient zero-downtime deployment pipelines.',
    eligibility: [
      'Currently pursuing a Bachelor\'s or Master\'s degree in Computer Science or Software Engineering',
      'Graduating between December 2027 and July 2028',
      'Experience in Go, Java, Python, or TypeScript',
      'Interest in cloud-native computing, distributed architectures, and site reliability'
    ],
    tracks: [
      'Global Data Residency & Multi-Region Sharding',
      'Event-Driven Microservices with Apache Kafka',
      'Internal Developer Platform & Developer Productivity',
      'Cloud Security & Automated Compliance Guards'
    ],
    timeline: [
      { phase: 'Applications Close', date: 'Oct 30, 2026', description: 'Resume review window.' },
      { phase: 'HackerRank Systems Challenge', date: 'Nov 12, 2026', description: 'Concurrency and data structures.' },
      { phase: 'Values & Architecture Interview', date: 'Dec 02, 2026', description: 'Collaborative pairing session.' },
      { phase: 'Internship Commences', date: 'June 01, 2027', description: '12-week remote engineering program.' }
    ],
    perks: [
      'Competitive $8,000/month salary with superannuation/401k match',
      '$1,000 ergonomic home office equipment stipend',
      'Remote-first flexibility: work from anywhere in your country',
      'Over 85% full-time conversion rate for graduating interns'
    ],
    applyUrl: 'https://atlassian.com/company/careers/graduates',
    featured: false,
    closingUrgent: false,
    postedDate: '2026-09-16',
    applicantsCount: 1850,
    contactEmail: 'grad-recruiting@atlassian.com'
  },
  {
    id: 'opp-16',
    title: 'NeurIPS 2026 Student Research Travel Fellowship',
    organization: 'Neural Information Processing Systems Foundation',
    orgInitials: 'NP',
    orgColor: 'from-violet-600 to-purple-900',
    category: 'Fellowship',
    domain: 'Research & Academics',
    tags: ['Machine Learning', 'Deep Learning', 'Conference', 'Travel Grant', 'ArXiv'],
    deadline: '2026-10-10',
    mode: 'Hybrid',
    location: 'Vancouver, Canada & Virtual',
    stipendOrPrize: '$2,200 Travel Grant + Full Registration',
    hasFinancialReward: true,
    shortDescription: 'Full travel fellowship for student authors and researchers from developing regions to attend and present at NeurIPS 2026 in Vancouver.',
    fullDescription: 'The NeurIPS Foundation provides travel awards to student authors who are presenting papers, spotlight talks, or workshop presentations at the annual conference. Grants help cover international or domestic airfare, hotel accommodations, and conference passes.',
    eligibility: [
      'Undergraduate, master\'s, or PhD students who are authors/co-authors on accepted papers or workshops',
      'Students from under-resourced institutions given primary priority',
      'Active student status verified by department chair or faculty advisor'
    ],
    tracks: [
      'Foundation Models & Theoretical Deep Learning',
      'Reinforcement Learning & Decision Making',
      'Neuroscience & Cognitive Computing',
      'AI Ethics, Fairness, and Accountability'
    ],
    timeline: [
      { phase: 'Grant Application Deadline', date: 'Oct 10, 2026', description: 'Submit accepted paper ID and budget request.' },
      { phase: 'Award Notifications', date: 'Oct 28, 2026', description: 'Reimbursement codes and passes issued.' },
      { phase: 'NeurIPS Conference Week', date: 'Dec 07-13, 2026', description: 'Vancouver Convention Centre.' }
    ],
    perks: [
      'Reimbursement of up to $2,200 for flights and hotel',
      'Complimentary student conference registration ($500+ value)',
      'Access to private student-researcher mentoring receptions',
      'Meet researchers from FAIR, DeepMind, Anthropic, and MIT'
    ],
    applyUrl: 'https://neurips.cc/Conferences/2026/TravelGrants',
    featured: false,
    closingUrgent: false,
    postedDate: '2026-09-11',
    applicantsCount: 1400,
    contactEmail: 'fellowships@neurips.cc'
  }
];
