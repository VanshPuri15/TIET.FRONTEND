export const generateClinicalInsight = ({ patientAge, symptoms, bp, hr, spo2, urgency }) => {
    let severity = 'normal';
    let concerns = [];

    // Parse values
    const ageVal = parseInt(patientAge, 10);
    const spo2Val = parseFloat(spo2);
    const hrVal = parseFloat(hr);

    let sys = NaN, dia = NaN;
    if (bp) {
        if (bp.includes('/')) {
            const parts = bp.split('/');
            sys = parseFloat(parts[0]);
            dia = parseFloat(parts[1]);
        } else {
            sys = parseFloat(bp);
        }
    }

    // 1. Analyze SpO2
    if (!isNaN(spo2Val)) {
        if (spo2Val < 90) {
            severity = 'critical';
            concerns.push(`Severe hypoxia (SpO₂ ${spo2Val}%) requires immediate supplemental oxygen and continuous monitoring.`);
        } else if (spo2Val >= 90 && spo2Val <= 94) {
            if (severity !== 'critical') severity = 'warning';
            concerns.push(`Borderline oxygen saturation (SpO₂ ${spo2Val}%). Monitor respiratory status closely.`);
        }
    }

    // 2. Analyze BP
    if (!isNaN(sys)) {
        if (sys < 90) {
            severity = 'critical';
            concerns.push(`Significant hypotension (Systolic ${sys} mmHg) indicating potential hemodynamic instability or shock.`);
        } else if (sys > 180) {
            severity = 'critical';
            concerns.push(`Hypertensive crisis (Systolic ${sys} mmHg). Risk of acute end-organ damage.`);
        }
    }
    if (!isNaN(dia)) {
        if (dia > 120) {
            severity = 'critical';
            concerns.push(`Severe diastolic hypertension (${dia} mmHg) elevating risk of cardiovascular event.`);
        }
    }

    // 3. Analyze HR
    if (!isNaN(hrVal)) {
        if (hrVal < 40) {
            severity = 'critical';
            concerns.push(`Profound bradycardia (HR ${hrVal} bpm) suggesting severe conduction block or impending arrest.`);
        } else if (hrVal > 130) {
            severity = 'critical';
            concerns.push(`Marked tachycardia (HR ${hrVal} bpm), warranting immediate ECG to rule out unstable arrhythmias.`);
        } else if (hrVal >= 110 && hrVal <= 130) {
            if (severity !== 'critical') severity = 'warning';
            concerns.push(`Moderate tachycardia (HR ${hrVal} bpm). Consider underlying causes such as pain, fever, or fluid deficit.`);
        }
    }

    // 4. Synthesize Reasoning
    let reasoning = "";

    if (severity === 'critical') {
        reasoning = `CRITICAL TRIAGE ALERT: Patient presents with life-threatening vital sign derangements. ${concerns.join(' ')} Symptoms reported as "${symptoms}". Escalated to High Urgency. Immediate transfer to a higher echelon of care with advanced life support capabilities is medically necessary.`;
    } else if (severity === 'warning') {
        reasoning = `CLINICAL WARNING: Patient exhibits concerning physiological parameters. ${concerns.join(' ')} Presenting complaint: "${symptoms}". Provider indicated ${urgency} urgency. Continuous en-route monitoring is recommended to intercept potential clinical deterioration.`;
    } else {
        reasoning = `CLINICAL ASSESSMENT: Vital signs are within acceptable operational limits. Presenting complaint: "${symptoms}". Provider assigned ${urgency} urgency. Proceed with standard transfer protocols to appropriate specialist facility.`;
    }

    return {
        severity,
        text: reasoning
    };
};
