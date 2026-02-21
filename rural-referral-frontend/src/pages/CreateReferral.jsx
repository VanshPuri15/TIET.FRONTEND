import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Input, Label } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { createReferral } from '../api/referrals';
import { Activity, User, HeartPulse, Building2, MapPin, CheckCircle2, Navigation, Stethoscope } from 'lucide-react';

const CreateReferral = () => {
    const navigate = useNavigate();
    const [patientInfo, setPatientInfo] = useState({ age: '', symptoms: '', vitals: '', urgency: 'Medium' });
    const [referralResult, setReferralResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setPatientInfo({ ...patientInfo, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const data = await createReferral(patientInfo);
            setReferralResult(data);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Submission failed", error);
            setError("Failed to generate optimal route. Please verify patient data and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (referralResult) {
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

                        <div className="flex flex-col sm:flex-row gap-4 pt-6 mt-4 border-t border-surface-100/60 lg:justify-end">
                            <Button variant="outline" size="lg" onClick={() => setReferralResult(null)} className="font-semibold text-surface-700">
                                Initiate Another
                            </Button>
                            <Button onClick={() => navigate('/')} size="lg" className="font-semibold">
                                Return to Console
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Label htmlFor="vitals" className="text-surface-800 font-semibold">Latest Vitals</Label>
                                <Input
                                    id="vitals" name="vitals"
                                    placeholder="e.g. BP 120/80, HR 85, SpO2 98%"
                                    value={patientInfo.vitals} onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
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
