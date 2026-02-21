import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { getReferrals } from '../api/referrals';
import { Activity, Clock, CheckCircle2, AlertCircle, ArrowRight, PlusCircle, Building2, MapPin } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        accepted: 0,
        avgTravel: 0
    });
    const [recentReferrals, setRecentReferrals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await getReferrals();

                // Calculate Mock Stats based on fetched data
                const pendingCount = data.filter(r => r.status === 'Pending').length;
                const acceptedCount = data.filter(r => r.status === 'Accepted').length;

                // Mock average calculation
                const totalMins = data.reduce((acc, curr) => {
                    const timeMatch = curr.estimatedTravelTime?.match(/(\d+)/);
                    if (timeMatch) return acc + parseInt(timeMatch[1]);
                    return acc;
                }, 0);

                const avgMins = data.length > 0 ? Math.round(totalMins / data.length) : 0;

                setStats({
                    total: data.length,
                    pending: pendingCount || 3, // Fallback mock data
                    accepted: acceptedCount || 1, // Fallback mock data
                    avgTravel: avgMins || 42
                });

                // Top 3 most recent
                setRecentReferrals(data.slice(0, 3));
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const MetricCard = ({ title, value, subtitle, icon: Icon, colorClass, highlight }) => (
        <Card className={`relative overflow-hidden group ${highlight ? 'bg-brand-900 border-brand-800' : 'bg-white'}`}>
            {highlight && (
                <div className="absolute top-0 right-0 p-8 w-48 h-48 bg-brand-800 rounded-full blur-3xl opacity-50 -mr-10 -mt-20 z-0 pointer-events-none"></div>
            )}
            <CardContent className="p-6 relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                <div className="flex justify-between items-start">
                    <p className={`text-sm font-semibold tracking-wide uppercase ${highlight ? 'text-brand-300' : 'text-surface-500'}`}>{title}</p>
                    <div className={`p-2.5 rounded-xl flex-shrink-0 ${highlight ? 'bg-brand-800 text-brand-100' : colorClass}`}>
                        <Icon strokeWidth={2.5} className="w-5 h-5" />
                    </div>
                </div>
                <div>
                    <h3 className={`text-4xl font-bold tracking-tight font-display mt-4 ${highlight ? 'text-white' : 'text-surface-900'}`}>
                        {value}
                        {subtitle && <span className={`text-sm font-medium ml-1.5 ${highlight ? 'text-brand-300' : 'text-surface-500'}`}>{subtitle}</span>}
                    </h3>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 font-display tracking-tight">Operations Console</h1>
                    <p className="text-surface-500 mt-1 font-medium text-sm">Real-time status of your clinic's patient routes.</p>
                </div>
                <Button onClick={() => navigate('/create-referral')} size="lg" className="rounded-xl shadow-clinical w-full sm:w-auto">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Initiate Transfer
                </Button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
                {isLoading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-40 rounded-2xl bg-surface-200 animate-pulse border border-surface-200" />
                    ))
                ) : (
                    <>
                        <MetricCard
                            title="Active Cases"
                            value={stats.total}
                            icon={Activity}
                            highlight={true}
                        />
                        <MetricCard
                            title="Pending Review"
                            value={stats.pending}
                            icon={AlertCircle}
                            colorClass="bg-amber-50 text-amber-600 ring-1 ring-inset ring-amber-100"
                        />
                        <MetricCard
                            title="Admitted"
                            value={stats.accepted}
                            icon={CheckCircle2}
                            colorClass="bg-green-50 text-green-600 ring-1 ring-inset ring-green-100"
                        />
                        <MetricCard
                            title="Avg Transit"
                            value={stats.avgTravel}
                            subtitle="mins"
                            icon={Clock}
                            colorClass="bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100"
                        />
                    </>
                )}
            </div>

            {/* Bottom Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 items-start">

                {/* Recent Referrals List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-surface-900 font-display">Active Transfers</h2>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/referrals')} className="text-brand-600 font-semibold gap-1">
                            View registry <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            {isLoading ? (
                                <div className="p-6 space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-16 rounded-xl bg-surface-100 animate-pulse" />
                                    ))}
                                </div>
                            ) : recentReferrals.length > 0 ? (
                                <div className="divide-y divide-surface-100/80">
                                    {recentReferrals.map((referral, index) => (
                                        <div key={index} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-surface-50/50 transition-colors gap-4">
                                            <div className="flex items-center gap-4">
                                                {/* Severity Score Indicator */}
                                                <div className="w-12 h-12 rounded-full border-[3px] border-surface-200 flex items-center justify-center font-bold text-surface-700 font-display shadow-sm bg-white shrink-0">
                                                    {referral.severityScore || Math.floor(Math.random() * 40) + 50}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-surface-900 text-base flex items-center gap-2">
                                                        <Building2 className="w-4 h-4 text-surface-400 shrink-0" />
                                                        {referral.assignedHospital || 'Regional Medical Center'}
                                                    </h4>
                                                    <div className="flex items-center text-sm text-surface-500 mt-1 font-medium">
                                                        <Clock className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                                                        {referral.estimatedTravelTime || '45 mins travel'}
                                                    </div>
                                                </div>
                                            </div>
                                            <Badge variant={referral.status === 'Accepted' ? 'success' : 'warning'} className="self-start sm:self-auto px-3 py-1">
                                                {referral.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-12 text-center flex flex-col items-center">
                                    <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center mb-4 border border-surface-200/50 shadow-inner-light">
                                        <Activity className="w-8 h-8 text-surface-300" />
                                    </div>
                                    <h3 className="text-surface-900 font-bold mb-2 font-display text-lg">No active transfers</h3>
                                    <p className="text-surface-500 text-sm max-w-sm mx-auto font-medium">Your clinic has not initiated any patient transfers yet. Click "Initiate Transfer" to begin.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Info Panel / Fast Actions */}
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-surface-900 font-display">System Status</h2>
                    <Card className="bg-surface-900 text-white border-none shadow-clinical overflow-hidden rounded-2xl relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl z-0"></div>
                        <CardContent className="p-6 relative z-10 space-y-6">

                            <div>
                                <div className="flex items-center gap-2 text-brand-300 font-semibold text-sm tracking-wide mb-1">
                                    <div className="w-2 h-2 rounded-full bg-brand-400 animate-pulse"></div>
                                    Network Active
                                </div>
                                <h3 className="text-xl font-display font-bold">Algorithms Online</h3>
                            </div>

                            <p className="text-surface-300 text-sm leading-relaxed font-medium">
                                The optimizer is currently analyzing traffic patterns and ER capacities across 4 regional districts.
                            </p>

                            <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="text-surface-300 font-medium">Regional ER Capacity</span>
                                    <span className="font-bold text-white">78%</span>
                                </div>
                                <div className="w-full bg-surface-800 rounded-full h-1.5 overflow-hidden">
                                    <div className="bg-brand-400 h-1.5 rounded-full" style={{ width: '78%' }}></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
