import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Heart, Thermometer } from 'lucide-react';

const iconMap = {
    'Heart Rate': Heart,
    'Blood Oxygen': Activity,
    'Body Temperature': Thermometer
};

const LiveVitalCard = ({ label, value, unit, status }) => {
    const isAbnormal = status === 'Abnormal';
    const Icon = iconMap[label] || Activity;

    return (
        <Card className={`relative overflow-hidden transition-all duration-300 ${isAbnormal ? 'border-red-500 shadow-md shadow-red-100' : 'border-border hover:shadow-md'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {label}
                </CardTitle>
                <Icon className={`h-4 w-4 ${isAbnormal ? 'text-red-500' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline space-x-2">
                    <span className={`text-4xl font-bold tracking-tight ${isAbnormal ? 'text-red-600' : 'text-foreground'}`}>
                        {value}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                        {unit}
                    </span>
                </div>
                <div className="mt-3 flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${isAbnormal ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                    <span className={`text-xs font-semibold uppercase ${isAbnormal ? 'text-red-600' : 'text-green-600'}`}>
                        {status}
                    </span>
                </div>
            </CardContent>
            {/* Background decoration */}
            <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
                <Icon className="h-32 w-32" />
            </div>
        </Card>
    );
};



export default LiveVitalCard;
