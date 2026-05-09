"use client";

import { useState, useRef } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const SEX_OPTIONS     = ["Male", "Female"];
const CP_OPTIONS      = [
  { label: "Typical Angina",   value: "typical angina"   },
  { label: "Atypical Angina",  value: "atypical angina"  },
  { label: "Non-Anginal Pain", value: "non-anginal"      },
  { label: "Asymptomatic",     value: "asymptomatic"     },
];
const FBS_OPTIONS     = [
  { label: "False  (≤ 120 mg/dl)", value: 0 },
  { label: "True   (> 120 mg/dl)", value: 1  },
];
const RESTECG_OPTIONS = [
  { label: "Normal",                       value: "normal"           },
  { label: "ST-T Wave Abnormality",        value: "st-t abnormality" },
  { label: "Left Ventricular Hypertrophy", value: "lv hypertrophy"   },
];
const EXANG_OPTIONS   = [
  { label: "No",  value: 0 },
  { label: "Yes", value: 1  },
];
const SLOPE_OPTIONS   = [
  { label: "Upsloping",   value: "upsloping"   },
  { label: "Flat",        value: "flat"        },
  { label: "Downsloping", value: "downsloping" },
];
const THAL_OPTIONS    = [
  { label: "Normal",            value: "normal"           },
  { label: "Fixed Defect",      value: "fixed defect"     },
  { label: "Reversible Defect", value: "reversable defect"},
];

const FIELD_GLOSSARY = [
  {
    icon: "person",
    title: "Age",
    range: "28 – 77 years",
    desc: "The patient's age in years. Cardiovascular risk increases significantly after age 45 in men and 55 in women due to hormonal and arterial changes.",
  },
  {
    icon: "wc",
    title: "Sex",
    range: "Male / Female",
    desc: "Biological sex of the patient. Men generally have a higher risk of heart disease earlier in life; post-menopausal women face elevated risk due to declining oestrogen.",
  },
  {
    icon: "ecg_heart",
    title: "Chest Pain Type (cp)",
    range: "4 categories",
    desc: "Typical Angina: classic cardiac chest pain triggered by exertion. Atypical Angina: chest pain with fewer classic features. Non-Anginal: pain unlikely to be cardiac. Asymptomatic: no chest pain at all — yet can still indicate disease.",
  },
  {
    icon: "speed",
    title: "Resting Blood Pressure (trestbps)",
    range: "0 – 200 mm Hg",
    desc: "Blood pressure recorded at rest in millimetres of mercury. Hypertension above 140 mm Hg is a primary cardiac risk factor, straining the heart walls over time.",
  },
  {
    icon: "water_drop",
    title: "Serum Cholesterol (chol)",
    range: "0 – 603 mg/dl",
    desc: "Total cholesterol in the blood. Values above 200 mg/dl are borderline high; above 240 mg/dl is high risk. High LDL causes plaque build-up in arteries.",
  },
  {
    icon: "glucose",
    title: "Fasting Blood Sugar (fbs)",
    range: "True / False",
    desc: "Whether fasting blood sugar exceeds 120 mg/dl. Elevated fasting glucose indicates diabetes, which doubles or triples the risk of developing heart disease.",
  },
  {
    icon: "monitor_heart",
    title: "Resting ECG (restecg)",
    range: "3 categories",
    desc: "Normal: standard electrical activity. ST-T Abnormality: signs of possible myocardial ischemia or injury. Left Ventricular Hypertrophy: enlarged heart muscle, commonly caused by chronic hypertension.",
  },
  {
    icon: "cardiology",
    title: "Maximum Heart Rate (thalch)",
    range: "60 – 202 bpm",
    desc: "Highest heart rate achieved during a stress test. A lower-than-expected maximum rate can indicate poor cardiac reserve and underlying coronary artery disease.",
  },
  {
    icon: "directions_run",
    title: "Exercise Induced Angina (exang)",
    range: "Yes / No",
    desc: "Whether chest pain is triggered by physical exertion. Exercise-induced angina is a strong indicator of obstructive coronary artery disease limiting blood flow during activity.",
  },
  {
    icon: "show_chart",
    title: "Oldpeak (ST Depression)",
    range: "-2.6 – 6.2 mm",
    desc: "Depression in the ST segment of an ECG induced by exercise, relative to rest. Greater ST depression is associated with significant myocardial ischemia and poor prognosis.",
  },
  {
    icon: "trending_up",
    title: "Slope of Peak Exercise ST",
    range: "Upsloping / Flat / Downsloping",
    desc: "Shape of the peak exercise ST segment. Downsloping and flat ST segments are significantly more concerning for coronary artery disease than an upsloping pattern.",
  },
  {
    icon: "hub",
    title: "Number of Major Vessels (ca)",
    range: "0 – 3",
    desc: "Count of major coronary vessels coloured by fluoroscopy imaging. Each additional blocked vessel directly increases the risk and severity of a cardiac event.",
  },
  {
    icon: "bloodtype",
    title: "Thalassemia (thal)",
    range: "Normal / Fixed / Reversible",
    desc: "A nuclear stress test result. Normal: healthy blood flow. Fixed Defect: permanent damage to heart muscle. Reversible Defect: reduced flow under stress that improves at rest — indicating viable but at-risk tissue.",
  },
];

// ─── GLOBAL CSS ──────────────────────────────────────────────────────────────

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { scroll-behavior: auto; }

  body {
    background: #f7f9fb;
    color: #191c1e;
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    font-size: 22px;
    line-height: 1;
    display: inline-block;
    vertical-align: middle;
  }

  /* ── Professional Input ── */
  .field-input {
    width: 100%;
    display: block;
    padding: 13px 16px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: #191c1e;
    background: #fff;
    border: 1.5px solid #dde1e7;
    border-radius: 10px;
    outline: none;
    transition: border-color 0.16s, box-shadow 0.16s, background 0.16s;
    line-height: 1.5;
    caret-color: #b61722;
    pointer-events: auto;
    position: relative;
    z-index: 1;
  }
  .field-input::placeholder { color: #aab0b8; font-size: 14px; }
  .field-input:focus {
    border-color: #b61722;
    box-shadow: 0 0 0 3.5px rgba(182,23,34,0.09);
    background: #fffafa;
  }
  .field-input:hover:not(:focus) { border-color: #b0b5bc; }

  /* ── Professional Select ── */
  .select-wrap { position: relative; }
  .select-wrap::after {
    content: '';
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    width: 0; height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 6px solid #76777d;
    pointer-events: none;
  }
  .field-select {
    width: 100%;
    display: block;
    padding: 13px 40px 13px 16px;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: #191c1e;
    background: #fff;
    border: 1.5px solid #dde1e7;
    border-radius: 10px;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    transition: border-color 0.16s, box-shadow 0.16s, background 0.16s;
    line-height: 1.5;
  }
  .field-select:focus {
    border-color: #b61722;
    box-shadow: 0 0 0 3.5px rgba(182,23,34,0.09);
    background: #fffafa;
  }
  .field-select:hover:not(:focus) { border-color: #b0b5bc; }

  /* ── Field label ── */
  .field-label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.045em;
    color: #45464d;
    margin-bottom: 7px;
    text-transform: uppercase;
  }
  .range-badge {
    display: inline-block;
    margin-left: 7px;
    padding: 1px 8px;
    background: #f2f4f6;
    border: 1px solid #e0e3e5;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
    color: #76777d;
    letter-spacing: 0;
    text-transform: none;
    vertical-align: middle;
  }

  /* ── Glass card ── */
  .glass-card {
    background: rgba(255,255,255,0.84);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(255,255,255,0.55);
    box-shadow: 0 8px 48px rgba(0,0,0,0.07);
  }

  /* ── Buttons ── */
  .btn-primary { transition: opacity 0.15s, transform 0.15s !important; }
  .btn-primary:hover { opacity: 0.91 !important; transform: translateY(-1px) !important; }
  .btn-primary:active { opacity: 1 !important; transform: translateY(0) !important; }
  .btn-outline:hover { background: #f2f4f6 !important; }

  /* ── Nav link ── */
  .nav-link:hover { color: #b61722 !important; }

  /* ── Glossary card ── */
  .glossary-card {
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }
  .glossary-card:hover {
    border-color: rgba(182,23,34,0.22) !important;
    box-shadow: 0 4px 24px rgba(182,23,34,0.09) !important;
    transform: translateY(-2px);
  }

  /* ── Model card ── */
  .model-card { transition: background 0.2s; }
  .model-card:hover { background: rgba(255,255,255,0.10) !important; }

  /* ── Animations ── */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.38s ease forwards; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 0.9s linear infinite; }

  @keyframes growBar { from { width: 0; } }
  .grow-bar { animation: growBar 1.1s cubic-bezier(0.22,1,0.36,1) forwards; }

  /* ── Responsive ── */
  @media(max-width: 768px) {
    .nav-inner    { padding: 0 16px !important; }
    .nav-links    { display: none !important; }
    .hero-section { padding: 48px 16px 60px !important; }
    .hero-grid    { grid-template-columns: 1fr !important; }
    .hero-img     { display: none !important; }
    .hero-h1      { font-size: 32px !important; line-height: 40px !important; }
    .form-section { padding: 56px 16px !important; }
    .form-grid    { grid-template-columns: 1fr !important; }
    .result-section { padding: 56px 16px !important; }
    .result-grid  { grid-template-columns: 1fr !important; }
    .about-section { padding: 56px 16px !important; }
    .model-cards-grid { grid-template-columns: 1fr !important; }
    .glossary-section { padding: 56px 16px !important; }
    .glossary-grid { grid-template-columns: 1fr !important; }
    .footer-inner { padding: 36px 16px !important; flex-direction: column !important; align-items: flex-start !important; }
    .glass-card-inner { padding: 28px 20px !important; }
    .slope-thal-grid { grid-template-columns: 1fr !important; }
  }
  @media(min-width: 769px) and (max-width: 1024px) {
    .model-cards-grid { grid-template-columns: 1fr 1fr !important; }
    .glossary-grid    { grid-template-columns: 1fr 1fr !important; }
  }
`;

// ─── FIELD HELPERS ────────────────────────────────────────────────────────────
// IMPORTANT: These are defined OUTSIDE CardioAIPage so their identity is stable
// across renders. If defined inside the component, React treats them as new
// component types on every render, unmounting/remounting the <input> and causing
// it to lose focus after every keystroke.

const Field = ({ label, range, children }) => (
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label className="field-label">
      {label}
      {range && <span className="range-badge">{range}</span>}
    </label>
    {children}
  </div>
);

const NumInput = ({ name, placeholder, min, max, step = 1, value, onChange }) => (
  <input
    className="field-input"
    type="number"
    name={name}
    placeholder={placeholder}
    min={min}
    max={max}
    step={step}
    value={value}
    onChange={onChange}
    required
  />
);

const Sel = ({ name, options, value, onChange }) => (
  <div className="select-wrap">
    <select
      className="field-select"
      name={name}
      value={value}
      onChange={onChange}
    >
      {options.map((o) => (
        <option
          key={typeof o === "string" ? o : o.value}
          value={typeof o === "string" ? o : o.value}
        >
          {typeof o === "string" ? o : o.label}
        </option>
      ))}
    </select>
  </div>
);

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function CardioAIPage() {
  const predictRef = useRef(null);
  const resultRef  = useRef(null);

  const [form, setForm] = useState({
    age: "", trestbps: "", chol: "", thalch: "", oldpeak: "", ca: "",
    sex: "Male", cp: "typical angina", fbs: 0,
    restecg: "normal", exang: 0, slope: "upsloping", thal: "normal",
  });

  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const smoothTo = (ref) => {
    if (!ref?.current) return;
    const top = ref.current.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const payload = {
        age:      Number(form.age),
        trestbps: Number(form.trestbps),
        chol:     Number(form.chol),
        thalch:   Number(form.thalch),
        oldpeak:  Number(form.oldpeak),
        ca:       Number(form.ca),
        sex:      form.sex,
        cp:       form.cp,
       fbs: Number(form.fbs),
        restecg:  form.restecg,
        exang: Number(form.exang),
        slope:    form.slope, 
        thal:     form.thal,
      };
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Server responded with status ${res.status}`);
      const data       = await res.json();
      const prediction = data.PredictedPrice;
      setResult({ probability: prediction, isHighRisk: prediction >= 0.5 });
      setTimeout(() => smoothTo(resultRef), 60);
    } catch (err) {
      setError(err.message || "Could not connect to the prediction server.");
      setTimeout(() => smoothTo(resultRef), 60);
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* ══ NAV ═════════════════════════════════════════════════════════════ */}
      <header style={{
        position:"sticky", top:0, zIndex:50,
        background:"rgba(247,249,251,0.9)",
        backdropFilter:"blur(16px)",
        borderBottom:"1px solid rgba(198,198,205,0.28)",
        boxShadow:"0 1px 8px rgba(0,0,0,0.05)",
      }}>
        <nav className="nav-inner" style={{
          display:"flex", justifyContent:"space-between", alignItems:"center",
          height:64, padding:"0 48px", maxWidth:1280, margin:"0 auto",
        }}>
          <div style={{ fontFamily:"Manrope", fontWeight:800, fontSize:22, color:"#b61722", letterSpacing:"-0.01em" }}>
            CardioAI
          </div>

          <div className="nav-links" style={{ display:"flex", gap:32 }}>
            {[
              { label:"Home",        href:"#"        },
              { label:"About Model", href:"#about"   },
              { label:"Prediction",  href:"#predict" },
              { label:"About Fields",     href:"#contact" },
            ].map((l) => (
              <a key={l.label} href={l.href} className="nav-link" style={{
                fontFamily:"Manrope", fontWeight: l.label==="Home" ? 700 : 500,
                fontSize:15, color: l.label==="Home" ? "#b61722" : "#45464d",
                textDecoration:"none",
                borderBottom: l.label==="Home" ? "2px solid #b61722" : "none",
                paddingBottom: l.label==="Home" ? 4 : 0,
                transition:"color 0.15s",
              }}>{l.label}</a>
            ))}
          </div>

          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <a href="https://github.com/hashambangyal?tab=repositories"
               target="_blank" rel="noopener noreferrer" className="nav-link"
               style={{ color:"#45464d", textDecoration:"none", fontSize:14, fontWeight:500, transition:"color 0.15s" }}>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/hashambangyal?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
               target="_blank" rel="noopener noreferrer" className="btn-primary"
               style={{
                 padding:"8px 22px", background:"#b61722", color:"#fff",
                 borderRadius:9999, fontWeight:600, textDecoration:"none", fontSize:14,
               }}>
              LinkedIn
            </a>
          </div>
        </nav>
      </header>

      <main>

        {/* ══ HERO ════════════════════════════════════════════════════════════ */}
        <section className="hero-section" style={{ padding:"80px 48px", overflow:"hidden" }}>
          <div className="hero-grid" style={{
            display:"grid", gridTemplateColumns:"1fr 1fr",
            gap:40, alignItems:"center",
            maxWidth:1280, margin:"0 auto",
          }}>
            <div style={{ position:"relative", zIndex:1 }}>
              <span style={{
                display:"inline-flex", alignItems:"center", gap:8,
                padding:"5px 14px", borderRadius:9999,
                background:"#ffdad7", color:"#410004",
                fontSize:12, fontWeight:700, letterSpacing:"0.06em", marginBottom:24,
              }}>
                <span className="material-symbols-outlined" style={{fontSize:15}}>verified_user</span>
                CLINICALLY VALIDATED AI
              </span>

              <h1 className="hero-h1" style={{
                fontFamily:"Manrope", fontSize:50, lineHeight:"58px",
                fontWeight:800, letterSpacing:"-0.025em", color:"#131b2e", marginBottom:20,
              }}>
                AI Powered Heart Disease Prediction
              </h1>

              <p style={{ fontSize:17, lineHeight:"28px", color:"#45464d", marginBottom:36, maxWidth:520 }}>
                Predict potential heart disease risks using Machine Learning models trained on real
                healthcare data. Secure, private, and precise cardiac telemetry analysis.
              </p>

              <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                <button className="btn-primary" onClick={() => smoothTo(predictRef)} style={{
                  padding:"14px 32px", background:"#b61722", color:"#fff",
                  borderRadius:9999, fontFamily:"Manrope", fontWeight:700, fontSize:16,
                  border:"none", cursor:"pointer",
                  boxShadow:"0 6px 28px rgba(182,23,34,0.30)",
                }}>
                  Start Prediction
                </button>
                
              </div>
            </div>

            <div className="hero-img" style={{ position:"relative", display:"flex", justifyContent:"center" }}>
              <div style={{
                position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
                width:"120%", height:"120%",
                background:"rgba(182,23,34,0.05)", borderRadius:"50%", filter:"blur(48px)", zIndex:0,
              }} />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTXjmD3vupAwTSSCzRvrP6nFP74Z0921eM8b4wMfKIAm-_kLe6k_1zFCNWTVtkYIMKerGa2aKF9F7caV2IUFnPRIQjbvS0ygrKCeh12IsVTij00OUQPD3WkfHkQ3tDXME0-06Y3PxlRx_crigFSB8tfSOh2ySN8HZWnK5JBDvfiQZbPK5ATnpyIFcs22K82EvUB_krR6IOctA_Jk9SXpT56fdnm0d5a3TpYZwyZ86TRYs1P-uMnEj86CCsZVh9vglsY7z107w6AF_s"
                alt="AI Cardiac Visualization"
                style={{
                  width:"100%", height:"auto", position:"relative", zIndex:1,
                  filter:"drop-shadow(0 20px 44px rgba(0,0,0,0.12))",
                }}
              />
            </div>
          </div>
        </section>

        {/* ══ PREDICTION FORM ═════════════════════════════════════════════════ */}
        <section id="predict" ref={predictRef} className="form-section"
          style={{ padding:"80px 48px", background:"#f2f4f6" }}>
          <div style={{ maxWidth:940, margin:"0 auto" }}>

            <div style={{ textAlign:"center", marginBottom:48 }}>
              <h2 style={{ fontFamily:"Manrope", fontSize:32, fontWeight:800, color:"#131b2e", marginBottom:10 }}>
                Risk Assessment Engine
              </h2>
              <p style={{ color:"#45464d", fontSize:16 }}>
                Input clinical metrics below for a real-time diagnostic evaluation.
              </p>
            </div>

            <div className="glass-card glass-card-inner" style={{ borderRadius:28, padding:"48px 52px" }}>
              <form onSubmit={handleSubmit}>
                <div className="form-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"28px 48px" }}>

                  {/* LEFT ── Vital Statistics */}
                  <div>
                    <p style={{
                      color:"#b61722", fontWeight:700, fontSize:11,
                      letterSpacing:"0.12em", textTransform:"uppercase",
                      marginBottom:22, display:"flex", alignItems:"center", gap:7,
                    }}>
                      <span className="material-symbols-outlined" style={{fontSize:15}}>monitor_heart</span>
                      Vital Statistics
                    </p>
                    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

                      <Field label="Age" >
                        <NumInput name="age" placeholder="e.g. 54" 
                          value={form.age} onChange={handleChange} />
                      </Field>

                      <Field label="Resting Blood Pressure" range="0 – 200 mm Hg">
                        <NumInput name="trestbps" placeholder="e.g. 130" min={0} max={200}
                          value={form.trestbps} onChange={handleChange} />
                      </Field>

                      <Field label="Serum Cholesterol" range="0 – 603 mg/dl">
                        <NumInput name="chol" placeholder="e.g. 245" min={0} max={603}
                          value={form.chol} onChange={handleChange} />
                      </Field>

                      <Field label="Maximum Heart Rate" range="60 – 202 bpm">
                        <NumInput name="thalch" placeholder="e.g. 150" min={60} max={202}
                          value={form.thalch} onChange={handleChange} />
                      </Field>

                      <Field label="Oldpeak — ST Depression" range="-2.6 – 6.2 mm">
                        <NumInput name="oldpeak" placeholder="e.g. 1.5" min={-2.6} max={6.2} step={0.1}
                          value={form.oldpeak} onChange={handleChange} />
                      </Field>

                      <Field label="Number of Major Vessels" range="0 – 3">
                        <NumInput name="ca" placeholder="e.g. 1" min={0} max={3}
                          value={form.ca} onChange={handleChange} />
                      </Field>

                    </div>
                  </div>

                  {/* RIGHT ── Clinical Markers */}
                  <div>
                    <p style={{
                      color:"#b61722", fontWeight:700, fontSize:11,
                      letterSpacing:"0.12em", textTransform:"uppercase",
                      marginBottom:22, display:"flex", alignItems:"center", gap:7,
                    }}>
                      <span className="material-symbols-outlined" style={{fontSize:15}}>biotech</span>
                      Clinical Markers
                    </p>
                    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

                      <Field label="Sex">
                        <Sel name="sex" options={SEX_OPTIONS} value={form.sex} onChange={handleChange} />
                      </Field>

                      <Field label="Chest Pain Type">
                        <Sel name="cp" options={CP_OPTIONS} value={form.cp} onChange={handleChange} />
                      </Field>

                      <Field label="Fasting Blood Sugar > 120 mg/dl">
                        <Sel name="fbs" options={FBS_OPTIONS} value={form.fbs} onChange={handleChange} />
                      </Field>

                      <Field label="Resting ECG Results">
                        <Sel name="restecg" options={RESTECG_OPTIONS} value={form.restecg} onChange={handleChange} />
                      </Field>

                      <Field label="Exercise Induced Angina">
                        <Sel name="exang" options={EXANG_OPTIONS} value={form.exang} onChange={handleChange} />
                      </Field>

                      <div className="slope-thal-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                        <Field label="Slope">
                          <Sel name="slope" options={SLOPE_OPTIONS} value={form.slope} onChange={handleChange} />
                        </Field>
                        <Field label="Thalassemia">
                          <Sel name="thal" options={THAL_OPTIONS} value={form.thal} onChange={handleChange} />
                        </Field>
                      </div>

                    </div>
                  </div>

                  {/* SUBMIT */}
                  <div style={{ gridColumn:"1 / -1", paddingTop:10 }}>
                    <button type="submit" disabled={loading} className="btn-primary" style={{
                      width:"100%", padding:"16px 0",
                      background: loading ? "#c6c6cd" : "#b61722",
                      color:"#fff", border:"none", borderRadius:12,
                      fontFamily:"Manrope", fontWeight:700, fontSize:17,
                      cursor: loading ? "not-allowed" : "pointer",
                      display:"flex", justifyContent:"center", alignItems:"center", gap:10,
                      boxShadow: loading ? "none" : "0 5px 24px rgba(182,23,34,0.22)",
                      letterSpacing:"-0.01em",
                    }}>
                      {loading ? (
                        <>
                          <span className="material-symbols-outlined spin" style={{fontSize:20}}>progress_activity</span>
                          Analyzing Cardiac Risk…
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined" style={{fontSize:20}}>analytics</span>
                          Analyze Cardiac Risk
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </form>
            </div>

          </div>
        </section>

        {/* ══ RESULT ══════════════════════════════════════════════════════════ */}
        <section ref={resultRef} className="result-section"
          style={{ padding:"80px 48px", background:"#fff" }}>
          <div style={{ maxWidth:1000, margin:"0 auto" }}>

            {error && (
              <div className="fade-up" style={{
                background:"#fff5f5", border:"1.5px solid rgba(186,26,26,0.28)",
                borderRadius:14, padding:"22px 28px", color:"#93000a",
                display:"flex", alignItems:"flex-start", gap:14, marginBottom:24,
              }}>
                <span className="material-symbols-outlined" style={{marginTop:1}}>error</span>
                <div>
                  <p style={{fontWeight:600, marginBottom:4, fontSize:15}}>Connection Error</p>
                  <p style={{fontSize:14, opacity:0.85}}>{error}</p>
                </div>
              </div>
            )}

            {result !== null && !error && (
              <div className="fade-up" style={{
                background: result.isHighRisk
                  ? "linear-gradient(135deg,#fff5f5 0%,#fff 60%)"
                  : "linear-gradient(135deg,#f0f6ff 0%,#fff 60%)",
                border:`1.5px solid ${result.isHighRisk ? "rgba(186,26,26,0.22)" : "rgba(57,128,244,0.22)"}`,
                borderRadius:24, padding:"40px 40px", position:"relative",
              }}>
                <span style={{
                  position:"absolute", top:22, right:22,
                  padding:"5px 14px", borderRadius:9999, fontSize:12, fontWeight:700,
                  background: result.isHighRisk ? "#ffdad6" : "#d8e2ff",
                  color: result.isHighRisk ? "#93000a" : "#001a42",
                }}>
                  {result.isHighRisk ? "⚠ RISK OF HEART DISEASE" : "✓ NO RISK OF HEART DISEASE"}
                </span>

                <div style={{ display:"flex", alignItems:"center", gap:28, marginBottom:28 }}>
                  <div style={{
                    width:96, height:96, borderRadius:"50%", flexShrink:0,
                    border:`6px solid ${result.isHighRisk ? "#ba1a1a" : "#3980f4"}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    <span className="material-symbols-outlined" style={{
                      fontSize:46, color: result.isHighRisk ? "#ba1a1a" : "#3980f4",
                    }}>
                      {result.isHighRisk ? "heart_broken" : "favorite"}
                    </span>
                  </div>
                  <div>
                    <h3 style={{
                      fontFamily:"Manrope", fontSize:24, fontWeight:800,
                      color: result.isHighRisk ? "#93000a" : "#001a42", marginBottom:6,
                    }}>
                      {result.isHighRisk ? "Risk of Heart Disease Detected" : "No Risk of Heart Disease Detected"}
                    </h3>
                    <p style={{ fontSize:13, color:"#45464d" }}>
                      Raw model output: <strong>{result.probability}</strong>
                    </p>
                  </div>
                </div>

                <div style={{
                  padding:"18px 22px", borderRadius:12,
                  background: result.isHighRisk ? "rgba(186,26,26,0.06)" : "rgba(57,128,244,0.06)",
                }}>
                  <p style={{ color: result.isHighRisk ? "#93000a" : "#001a42", fontSize:15, lineHeight:"26px" }}>
                    {result.isHighRisk
                      ? "The model has detected significant clinical markers indicating a potential risk of heart disease. This is not a medical diagnosis — please consult a qualified cardiologist or healthcare professional immediately for proper evaluation and treatment."
                      : "The model has not detected significant risk markers for heart disease based on the provided data. Continue maintaining a healthy lifestyle with regular exercise and a balanced diet, and schedule periodic medical check-ups with your physician."}
                  </p>
                </div>
              </div>
            )}

            {result === null && !error && (
              <>
                <div style={{ textAlign:"center", marginBottom:40 }}>
                  <h2 style={{ fontFamily:"Manrope", fontSize:28, fontWeight:800, color:"#131b2e", marginBottom:10 }}>
                    Sample Prediction Results
                  </h2>
                  <p style={{ color:"#45464d", fontSize:15 }}>
                    Fill out the form above and click Analyze — your result will appear here instantly.
                  </p>
                </div>

                <div className="result-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>

                  <div style={{
                    background:"#fff", border:"1.5px solid rgba(186,26,26,0.16)",
                    borderRadius:22, padding:"32px", position:"relative",
                  }}>
                    <span style={{
                      position:"absolute", top:18, right:18,
                      padding:"4px 12px", background:"#ffdad6", color:"#93000a",
                      borderRadius:9999, fontSize:12, fontWeight:700,
                    }}>⚠ RISK OF HEART DISEASE</span>
                    <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:22 }}>
                      <div style={{
                        width:84, height:84, borderRadius:"50%", flexShrink:0,
                        border:"5px solid #ba1a1a",
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>
                        <span style={{ fontFamily:"Manrope", fontSize:24, fontWeight:800, color:"#ba1a1a" }}>84%</span>
                      </div>
                      <div>
                        <h4 style={{ fontFamily:"Manrope", fontWeight:700, fontSize:17, color:"#131b2e", marginBottom:4 }}>
                          Risk of Heart Disease
                        </h4>
                        <p style={{ fontSize:13, color:"#45464d" }}>Confidence Level: High</p>
                      </div>
                    </div>
                    <div style={{ padding:"14px 16px", background:"rgba(186,26,26,0.06)", borderRadius:10 }}>
                      <p style={{ color:"#93000a", fontSize:14, lineHeight:"22px" }}>
                        Significant clinical markers detected. Please consult a cardiologist.
                      </p>
                    </div>
                  </div>

                  <div style={{
                    background:"#fff", border:"1.5px solid rgba(57,128,244,0.16)",
                    borderRadius:22, padding:"32px", position:"relative",
                  }}>
                    <span style={{
                      position:"absolute", top:18, right:18,
                      padding:"4px 12px", background:"#d8e2ff", color:"#001a42",
                      borderRadius:9999, fontSize:12, fontWeight:700,
                    }}>✓ NO RISK OF HEART DISEASE</span>
                    <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:22 }}>
                      <div style={{
                        width:84, height:84, borderRadius:"50%", flexShrink:0,
                        border:"5px solid #3980f4",
                        display:"flex", alignItems:"center", justifyContent:"center",
                      }}>
                        <span style={{ fontFamily:"Manrope", fontSize:24, fontWeight:800, color:"#3980f4" }}>12%</span>
                      </div>
                      <div>
                        <h4 style={{ fontFamily:"Manrope", fontWeight:700, fontSize:17, color:"#131b2e", marginBottom:4 }}>
                          No Risk of Heart Disease
                        </h4>
                        <p style={{ fontSize:13, color:"#45464d" }}>Confidence Level: Excellent</p>
                      </div>
                    </div>
                    <div style={{ padding:"14px 16px", background:"rgba(57,128,244,0.06)", borderRadius:10 }}>
                      <p style={{ color:"#001a42", fontSize:14, lineHeight:"22px" }}>
                        Cardiac markers are within optimal ranges. Maintain your health regimen.
                      </p>
                    </div>
                  </div>

                </div>
              </>
            )}

          </div>
        </section>

        {/* ══ ABOUT MODEL ═════════════════════════════════════════════════════ */}
        <section id="about" className="about-section"
          style={{ padding:"80px 48px", background:"#131b2e" }}>
          <div style={{ maxWidth:1280, margin:"0 auto" }}>

            <div style={{
              display:"flex", justifyContent:"space-between", alignItems:"flex-end",
              marginBottom:52, gap:24, flexWrap:"wrap",
            }}>
              <div style={{ maxWidth:640 }}>
                <h2 style={{ fontFamily:"Manrope", fontSize:32, fontWeight:800, color:"#ffb3ad", marginBottom:14 }}>
                  Machine Learning Models Used
                </h2>
                <p style={{ fontSize:16, lineHeight:"26px", color:"#7c839b" }}>
                  Trained on a{" "}
                  <strong style={{color:"#ffb3ad"}}>1,000-row clinical dataset</strong>,
                  Logistic Regression emerged as the best-performing model.
                  Its simple linear decision boundary proved ideal for this dataset size —
                  whereas Random Forest and Gradient Boosting, despite being more powerful in theory,
                  overfit to the limited training data and generalised poorly to unseen cases.
                </p>
              </div>
              <div style={{ display:"flex", gap:28, alignItems:"center" }}>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"Manrope", fontSize:30, fontWeight:800, color:"#fff" }}>0.84</div>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", color:"#7c839b" }}>PRECISION</div>
                </div>
                <div style={{ width:2, height:44, background:"rgba(198,198,205,0.15)" }} />
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"Manrope", fontSize:30, fontWeight:800, color:"#fff" }}>0.81</div>
                  <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", color:"#7c839b" }}>RECALL</div>
                </div>
              </div>
            </div>

            <div className="model-cards-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:22 }}>
              {[
                {
                  icon:"schema", title:"Logistic Regression",
                  tag:"★ BEST MODEL", tagBg:"rgba(182,23,34,0.35)", tagClr:"#ffb3ad",
                  desc:"With a 1,000-row dataset, Logistic Regression's linear simplicity outperformed all others. Its interpretable coefficients map directly to clinical risk factors, giving reliable, explainable predictions.",
                  label:"Best Accuracy", bar:"89%",
                },
                {
                  icon:"account_tree", title:"Random Forest",
                  tag:"OVERFIT", tagBg:"rgba(255,255,255,0.07)", tagClr:"#7c839b",
                  desc:"The ensemble of decision trees struggled to generalise on the limited dataset. With too few rows to train hundreds of trees effectively, it overfit to training patterns.",
                  label:"Moderate", bar:"63%",
                },
                {
                  icon:"trending_up", title:"Gradient Boosting",
                  tag:"OVERFIT", tagBg:"rgba(255,255,255,0.07)", tagClr:"#7c839b",
                  desc:"Iterative boosting requires larger datasets to fully leverage its power. On 1,000 rows it over-specialised to training noise, reducing performance on real-world unseen data.",
                  label:"Moderate", bar:"59%",
                },
              ].map((m) => (
                <div key={m.title} className="model-card" style={{
                  background:"rgba(255,255,255,0.05)",
                  border:"1px solid rgba(255,255,255,0.09)",
                  borderRadius:20, padding:28, position:"relative",
                }}>
                  <span style={{
                    position:"absolute", top:16, right:16,
                    padding:"3px 10px", borderRadius:9999,
                    fontSize:10, fontWeight:700, letterSpacing:"0.06em",
                    background:m.tagBg, color:m.tagClr,
                  }}>{m.tag}</span>

                  <div style={{
                    width:44, height:44, background:"#da3437", borderRadius:11,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    marginBottom:16, color:"#fff",
                  }}>
                    <span className="material-symbols-outlined">{m.icon}</span>
                  </div>

                  <h3 style={{ fontFamily:"Manrope", fontWeight:700, fontSize:17, color:"#fff", marginBottom:9 }}>
                    {m.title}
                  </h3>
                  <p style={{ fontSize:14, lineHeight:"22px", color:"#7c839b", marginBottom:20 }}>{m.desc}</p>

                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
                    <span style={{ fontSize:12, color:"#7c839b" }}>{m.label}</span>
                    <span style={{ fontSize:12, color:"#ffb3ad", fontWeight:600 }}>{m.bar}</span>
                  </div>
                  <div style={{ height:4, background:"rgba(255,255,255,0.08)", borderRadius:9999, overflow:"hidden" }}>
                    <div className="grow-bar" style={{ height:"100%", width:m.bar, background:"#da3437", borderRadius:9999 }} />
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ══ FIELD GLOSSARY ══════════════════════════════════════════════════ */}
        <section id="contact" className="glossary-section"
          style={{ padding:"80px 48px", background:"#f7f9fb" }}>
          <div style={{ maxWidth:1280, margin:"0 auto" }}>

            <div style={{ textAlign:"center", marginBottom:56 }}>
              <span style={{
                display:"inline-flex", alignItems:"center", gap:8,
                padding:"5px 14px", borderRadius:9999,
                background:"#ffdad7", color:"#410004",
                fontSize:12, fontWeight:700, letterSpacing:"0.06em", marginBottom:18,
              }}>
                <span className="material-symbols-outlined" style={{fontSize:15}}>menu_book</span>
                FIELD REFERENCE GUIDE
              </span>
              <h2 style={{ fontFamily:"Manrope", fontSize:32, fontWeight:800, color:"#131b2e", marginBottom:12 }}>
                Understanding the Input Fields
              </h2>
              <p style={{ color:"#45464d", fontSize:16, maxWidth:580, margin:"0 auto" }}>
                Not sure what a clinical field means? Every metric is explained below so you can
                enter accurate data and understand how each factor relates to cardiac risk.
              </p>
            </div>

            <div className="glossary-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>
              {FIELD_GLOSSARY.map((g) => (
                <div key={g.title} className="glossary-card" style={{
                  background:"#fff",
                  border:"1.5px solid #e8eaed",
                  borderRadius:18, padding:"24px 24px",
                }}>
                  <div style={{ display:"flex", alignItems:"flex-start", gap:14, marginBottom:12 }}>
                    <div style={{
                      width:42, height:42, borderRadius:10, flexShrink:0,
                      background:"#fff0f0",
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize:20, color:"#b61722" }}>{g.icon}</span>
                    </div>
                    <div>
                      <h4 style={{ fontFamily:"Manrope", fontWeight:700, fontSize:15, color:"#131b2e", marginBottom:4 }}>
                        {g.title}
                      </h4>
                      <span style={{
                        fontSize:11, fontWeight:600, color:"#b61722",
                        background:"#fff0f0", padding:"2px 9px", borderRadius:20,
                        display:"inline-block",
                      }}>
                        {g.range}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize:14, lineHeight:"22px", color:"#45464d" }}>{g.desc}</p>
                </div>
              ))}
            </div>

          </div>
        </section>

      </main>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════ */}
      <footer className="footer-inner" style={{ background:"#131b2e", padding:"48px" }}>
        <div style={{
          maxWidth:1280, margin:"0 auto",
          display:"flex", justifyContent:"space-between", alignItems:"center",
          flexWrap:"wrap", gap:20,
        }}>
          <div>
            <div style={{ fontFamily:"Manrope", fontWeight:800, fontSize:20, color:"#ffb3ad", marginBottom:8 }}>
              CardioAI Systems
            </div>
            <p style={{ fontSize:12, color:"#7c839b" }}>
              © 2024 CardioAI Systems. All rights reserved. Powered by Medical-Grade Artificial Intelligence.
            </p>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <a href="https://github.com/hashambangyal?tab=repositories"
               target="_blank" rel="noopener noreferrer" className="nav-link"
               style={{
                 padding:"9px 20px", background:"rgba(255,255,255,0.07)",
                 color:"#ffb3ad", borderRadius:9999, fontSize:13, fontWeight:600,
                 textDecoration:"none", border:"1px solid rgba(255,255,255,0.12)",
                 transition:"color 0.15s",
               }}>
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/hashambangyal?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
               target="_blank" rel="noopener noreferrer" className="btn-primary"
               style={{
                 padding:"9px 20px", background:"#b61722",
                 color:"#fff", borderRadius:9999, fontSize:13, fontWeight:600,
                 textDecoration:"none",
               }}>
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
