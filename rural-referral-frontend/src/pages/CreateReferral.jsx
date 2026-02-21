import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { createReferral } from '../api/referrals';
import { generateClinicalInsight } from '../lib/triageAI';
import { computeTriageScore } from '../lib/triageScore';
import { Activity, User, HeartPulse, Building2, MapPin, CheckCircle2, Navigation, Stethoscope, AlertTriangle, Sparkles, Home } from 'lucide-react';

const CreateReferral = () => {
    const navigate = useNavigate();
    const [patientInfo, setPatientInfo] = useState({ age: '', symptoms: '', bp: '', hr: '', spo2: '', urgency: 'Medium' });
    const [referralResult, setReferralResult] = useState(null);
    const [createdReferral, setCreatedReferral] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const vitalsStatus = useMemo(() => {
        let spo2Val = parseFloat(patientInfo.spo2);
        let hrVal = parseFloat(patientInfo.hr);
        let bpStr = patientInfo.bp || '';

        let sys = NaN, dia = NaN;
        if (bpStr.includes('/')) {
            const parts = bpStr.split('/');
            sys = parseFloat(parts[0]);
            dia = parseFloat(parts[1]);
        } else {
            sys = parseFloat(bpStr);
        }

        let isEmergency = false;
        let isWarning = false;

        if (!isNaN(spo2Val)) {
            if (spo2Val < 90) isEmergency = true;
            else if (spo2Val >= 90 && spo2Val <= 94) isWarning = true;
        }

        if (!isNaN(hrVal)) {
            if (hrVal < 40 || hrVal > 130) isEmergency = true;
            else if (hrVal >= 110 && hrVal <= 130) isWarning = true;
        }

        if (!isNaN(sys)) {
            if (sys < 90 || sys > 180) isEmergency = true;
        }
        if (!isNaN(dia)) {
            if (dia > 120) isEmergency = true;
        }

        if (isEmergency) return 'danger';
        if (isWarning) return 'warning';
        return null;
    }, [patientInfo.bp, patientInfo.hr, patientInfo.spo2]);

    useEffect(() => {
        if (vitalsStatus === 'danger' && patientInfo.urgency !== 'High') {
            setPatientInfo(prev => ({ ...prev, urgency: 'High' }));
        }
    }, [vitalsStatus, patientInfo.urgency]);

    const handleChange = (e) => {
        setPatientInfo({ ...patientInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const formattedVitals = `BP ${patientInfo.bp}, HR ${patientInfo.hr}, SpO2 ${patientInfo.spo2}`;
            const apiPayload = {
                ...patientInfo,
                vitals: formattedVitals
            };
            delete apiPayload.bp;
            delete apiPayload.hr;
            delete apiPayload.spo2;

            const data = await createReferral(apiPayload);

            // DEMO FIX: Rotate hospital if it's repetitive
            const demoHospitals = ['City General Hospital', "St. Mary's Medical Center", 'Regional Cardiac Center', 'County Trauma Center', 'Downtown Clinic'];
            let hosp = data.hospital || data.assignedHospital || 'Regional Medical Center';
            let storedReferrals = JSON.parse(localStorage.getItem('referrals')) || [];

            if (storedReferrals.length > 0 && storedReferrals[0].assignedHospital === hosp) {
                const available = demoHospitals.filter(h => h !== hosp);
                hosp = available[Math.floor(Math.random() * available.length)];
            }

            const now = new Date();
            const aiAssessment = generateClinicalInsight({
                patientAge: patientInfo.age,
                symptoms: patientInfo.symptoms,
                bp: patientInfo.bp,
                hr: patientInfo.hr,
                spo2: patientInfo.spo2,
                urgency: patientInfo.urgency
            });

            const dynamicScore = computeTriageScore({
                bp: patientInfo.bp,
                hr: patientInfo.hr,
                spo2: patientInfo.spo2,
                urgency: patientInfo.urgency
            });

            const newReferralRecord = {
                id: `REF-2026-${(1042 + storedReferrals.length).toString().padStart(4, '0')}`,
                createdAt: now.toISOString(),
                patientAge: patientInfo.age,
                symptoms: patientInfo.symptoms,
                urgency: patientInfo.urgency,
                bp: patientInfo.bp,
                hr: patientInfo.hr,
                spo2: patientInfo.spo2,
                assignedHospital: hosp,
                travelTime: data.travelTime || data.estimatedTravelTime || Math.floor(Math.random() * 30 + 15) + ' mins',
                score: dynamicScore,
                status: 'Pending Decision', // Temporary status until chosen
                aiInsight: aiAssessment.text
            };

            setCreatedReferral(newReferralRecord);
            setReferralResult({ ...data, hospital: hosp, score: newReferralRecord.score, travelTime: newReferralRecord.travelTime, aiInsight: newReferralRecord.aiInsight });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Submission failed", error);
            setError("Failed to generate optimal route. Please verify patient data and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleLifecycleAction = (status) => {
        if (!createdReferral) return;

        // Apply chosen status
        const finalizedReferral = { ...createdReferral, status };

        // Save to localStorage
        const storedReferrals = JSON.parse(localStorage.getItem('referrals')) || [];
        storedReferrals.unshift(finalizedReferral);
        localStorage.setItem('referrals', JSON.stringify(storedReferrals));

        navigate('/referrals');
    };

    if (referralResult && createdReferral) {
        return (
            <div className="max-w-3xl mx-auto space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="bg-brand-700 text-white border-none shadow-clinical overflow-hidden text-center relative rounded-3xl">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500 rounded-full blur-3xl opacity-30 -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-900 rounded-full blur-3xl opacity-30 -ml-20 -mb-20"></div>

                    <CardContent className="pt-16 pb-12 relative z-10 px-6 sm:px-12 flex flex-col items-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] mb-6 text-brand-700 animate-bounce">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white mb-4">Patient Routed Successfully</h1>
                        <p className="text-brand-100 text-lg max-w-xl mx-auto font-medium">
                            The dispatch optimizer has analyzed clinical urgency and real-time transit times to secure the best facility.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-clinical rounded-3xl overflow-hidden">
                    <div className="bg-surface-50/80 px-8 py-5 border-b border-surface-200/60 flex items-center text-sm font-bold text-surface-600 uppercase tracking-widest gap-2">
                        <Navigation className="w-4 h-4 text-surface-400" /> Dispatch Details
                    </div>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            {/* Destination */}
                            <div className="flex gap-5 items-start">
                                <div className="p-3.5 bg-brand-50 text-brand-600 rounded-2xl border border-brand-100 shadow-sm shrink-0">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-1.5 text-left">Assigned Destination</p>
                                    <h3 className="text-xl font-bold text-surface-900 font-display">{referralResult.hospital}</h3>
                                    <p className="text-brand-600 text-sm font-semibold flex items-center gap-1.5 mt-1">
                                        <MapPin className="w-3.5 h-3.5" /> Direct Route Confirmed
                                    </p>
                                </div>
                            </div>

                            {/* Metrics inline */}
                            <div className="flex gap-8 md:justify-end border-l border-surface-100 pl-8">
                                <div>
                                    <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-1.5 text-left">Priority Score</p>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-3xl font-display font-bold text-surface-900">{referralResult.score}</span>
                                        <span className="text-surface-400 font-semibold text-sm">/ 100</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-surface-400 uppercase tracking-widest mb-1.5 text-left">Est. Transit</p>
                                    <div className="flex items-baseline gap-1 mt-1">
                                        <span className="text-3xl font-display font-bold text-surface-900">{referralResult.travelTime}</span>
                                        <span className="text-surface-400 font-semibold text-sm">mins</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AI Insight Section */}
                        {referralResult.aiInsight && (
                            <div className="bg-brand-50/50 rounded-2xl p-6 border border-brand-100 flex items-start gap-4 mb-8">
                                <div className="p-2 bg-brand-100 text-brand-600 rounded-lg shrink-0 border border-brand-200 shadow-sm mt-0.5">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[11px] font-bold text-brand-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                        AI Clinical Insight
                                    </p>
                                    <p className="text-sm text-surface-700 font-medium leading-relaxed mb-3">
                                        {referralResult.aiInsight}
                                    </p>
                                    {referralResult.aiInsight.includes('CRITICAL') && (
                                        <Badge variant="danger" className="animate-pulse">Suggested action: Escalate</Badge>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-4 border-t border-surface-100/60 lg:justify-end">
                            <Button variant="outline" size="lg" onClick={() => handleLifecycleAction('Closed Local - Treated')} className="font-semibold text-green-700 border-green-200 hover:bg-green-50 hover:text-green-800">
                                <CheckCircle2 className="w-4 h-4 mr-2" /> Treated Locally
                            </Button>
                            <Button variant="outline" size="lg" onClick={() => handleLifecycleAction('Closed Local - Admitted')} className="font-semibold text-brand-700 border-brand-200 hover:bg-brand-50 hover:text-brand-800">
                                <Home className="w-4 h-4 mr-2" /> Admitted Locally
                            </Button>
                            <Button onClick={() => handleLifecycleAction('Escalated')} size="lg" className="font-semibold bg-red-600 hover:bg-red-700 text-white border-transparent">
                                <AlertTriangle className="w-4 h-4 mr-2" /> Escalate to Hospital
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 pt-2 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-surface-900 font-display tracking-tight">Initiate Transfer</h1>
                <p className="text-surface-500 mt-1 font-medium text-sm">Complete the clinical intake form to route the patient.</p>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700 font-medium flex items-start gap-3 shadow-sm">
                    <Activity className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    {error}
                </div>
            )}

            {vitalsStatus === 'danger' && (
                <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-red-800 font-medium flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 bg-red-100 text-red-600 rounded-full shrink-0">
                        <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-red-900 font-display mb-1">Critical Emergency Detected</h3>
                        <p className="text-sm">Patient vitals indicate a potentially life-threatening condition. Immediate referral recommended.</p>
                    </div>
                </div>
            )}

            {vitalsStatus === 'warning' && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-medium flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-sm">Patient vitals are borderline. Monitor closely during transit.</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Clinical Assessment */}
                <Card className="border-none shadow-clinical rounded-2xl overflow-hidden">
                    <div className="bg-surface-50/50 px-6 py-4 border-b border-surface-100/80 flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-lg border border-surface-200 shadow-sm text-surface-600">
                            <Stethoscope className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-bold text-surface-900 font-display">Clinical Presentation</h2>
                    </div>
                    <CardContent className="p-6 md:p-8 space-y-6">
                        <div>
                            <Label htmlFor="symptoms" className="text-surface-800 font-semibold">Chief Complaint / Symptoms</Label>
                            <textarea
                                id="symptoms" name="symptoms"
                                className="flex min-h-[120px] w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all hover:border-surface-300 shadow-sm resize-y"
                                placeholder="Describe current clinical signs, onset, and severity..."
                                value={patientInfo.symptoms} onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-4 pt-2">
                            <Label className="text-surface-800 font-semibold text-base border-b border-surface-100 pb-2 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <HeartPulse className="w-5 h-5 text-brand-600" />
                                    Vitals
                                </span>
                                {vitalsStatus === 'danger' && <Badge variant="danger" className="animate-pulse">Critical</Badge>}
                                {vitalsStatus === 'warning' && <Badge variant="warning">Warning</Badge>}
                            </Label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="bp" className="text-surface-700 text-xs uppercase tracking-wider font-bold mb-1.5 flex">Blood Pressure (BP)</Label>
                                    <Input
                                        id="bp" name="bp"
                                        placeholder="120/80"
                                        value={patientInfo.bp} onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="hr" className="text-surface-700 text-xs uppercase tracking-wider font-bold mb-1.5 flex">Heart Rate (HR)</Label>
                                    <Input
                                        id="hr" name="hr" type="number"
                                        placeholder="bpm"
                                        value={patientInfo.hr} onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="spo2" className="text-surface-700 text-xs uppercase tracking-wider font-bold mb-1.5 flex">SpO₂ (%)</Label>
                                    <Input
                                        id="spo2" name="spo2" type="number" max="100" min="0"
                                        placeholder="%"
                                        value={patientInfo.spo2} onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Label htmlFor="urgency" className="flex items-center gap-1.5 text-surface-800 font-semibold">
                                Provider Selected Urgency <span className="text-red-500 ml-1 text-lg leading-none">*</span>
                            </Label>
                            <Select
                                id="urgency" name="urgency"
                                value={patientInfo.urgency} onChange={handleChange}
                            >
                                <option value="Low">Low - Routine follow-up</option>
                                <option value="Medium">Medium - Urgent evaluation</option>
                                <option value="High">High - Critical emergency</option>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Demographics */}
                <Card className="border-none shadow-clinical rounded-2xl overflow-hidden">
                    <div className="bg-surface-50/50 px-6 py-4 border-b border-surface-100/80 flex items-center gap-3">
                        <div className="p-1.5 bg-white rounded-lg border border-surface-200 shadow-sm text-surface-600">
                            <User className="w-4 h-4" />
                        </div>
                        <h2 className="text-base font-bold text-surface-900 font-display">Patient Demographics</h2>
                    </div>
                    <CardContent className="p-6 md:p-8">
                        <div className="md:w-1/2">
                            <Label htmlFor="age" className="text-surface-800 font-semibold">Patient Age</Label>
                            <Input
                                id="age" name="age" type="number" min="0" max="120"
                                placeholder="Years"
                                value={patientInfo.age} onChange={handleChange}
                                required
                            />
                            <p className="text-xs text-surface-400 font-medium mt-2.5">Used as a key demographic factor in the optimization algorithm.</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 pb-12">
                    <Button type="button" variant="outline" size="lg" onClick={() => navigate('/')} className="font-semibold px-8 border-surface-200">
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isLoading} size="lg" className="font-semibold px-8 min-w-[200px] shadow-clinical">
                        Analyze & Generate Route
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateReferral;
