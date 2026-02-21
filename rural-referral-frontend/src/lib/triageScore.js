export const computeTriageScore = ({ bp, hr, spo2, urgency }) => {
    let score = 50;

    // Parse SpO2
    const spo2Val = parseFloat(spo2);
    if (!isNaN(spo2Val)) {
        if (spo2Val < 90) score += 25;
        else if (spo2Val >= 90 && spo2Val <= 94) score += 10;
    }

    // Parse BP
    let sys = NaN, dia = NaN;
    if (typeof bp === 'string' && bp.includes('/')) {
        const parts = bp.split('/');
        sys = parseFloat(parts[0]);
        dia = parseFloat(parts[1]);
    } else if (bp) {
        sys = parseFloat(bp);
    }

    if (!isNaN(sys)) {
        if (sys >= 180 || sys < 90) score += 20;
        else if (sys >= 150 && sys < 180) score += 8;
    }

    if (!isNaN(dia)) {
        if (dia >= 120) score += 10;
    }

    // Parse HR
    const hrVal = parseFloat(hr);
    if (!isNaN(hrVal)) {
        if (hrVal >= 130 || hrVal < 40) score += 15;
        else if (hrVal >= 110 && hrVal < 130) score += 6;
    }

    // Parse Urgency
    if (urgency === 'High') score += 10;
    else if (urgency === 'Medium') score += 5;

    // Clamp between 40 and 98 and round
    score = Math.max(40, Math.min(98, Math.round(score)));

    return score;
};
